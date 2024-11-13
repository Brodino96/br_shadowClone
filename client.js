function setCustomizations(ped) {
    const clone = ped
    const playerPed = PlayerPedId()

    if (!DoesEntityExist(clone)) {
        return emit("br_shadowClone:failure", "Clone does not exists")
    }
    
    if (!DoesEntityExist(playerPed)) {
        return emit("br_shadowClone:failure", "PlayerPed does not exists")
    }

    try {

        let buffer = new ArrayBuffer(128)
        const view = new DataView(buffer)
    
        const success = Citizen.invokeNative(
            "0x2746BD9D88C5C5D0", 
            playerPed, 
            view, 
            Citizen.returnResultAnyway()
        )
        if (success) {
            const shapeMotherID = view.getInt32(0, true)
            const shapeFatherID = view.getInt32(8, true)
            const shapeExtraID = view.getInt32(16, true)
            const skinMotherID = view.getInt32(24, true)
            const skinFatherID = view.getInt32(32, true)
            const skinExtraID = view.getInt32(40, true)
            const shapeMix = view.getFloat32(48, true)
            const skinMix = view.getFloat32(56, true)
            const thirdMix = view.getFloat32(64, true)

            SetPedHeadBlendData(
                clonePed, shapeMotherID, shapeFatherID, shapeExtraID, skinMotherID, skinFatherID, skinExtraID,
                shapeMix, skinMix, thirdMix, false
            )
    
            buffer = null
        } else {
            console.error("Failed to get head blend data from playerPed.")
        }
    } catch (error) {
        console.error("Error getting or applying head blend data:", error)
    }

    
    try {
        for (let featureId = 0; featureId < 21; featureId++) {
            const featureValue = GetPedFaceFeature(playerPed, featureId)
            SetPedFaceFeature(clonePed, featureId, featureValue)
        }
    } catch (error) {
        console.error("Error getting or applying face features:", error)
    }

    for (let overlayId = 0; overlayId < 13; overlayId++) {
        try {
            const overlayData = GetPedHeadOverlayData(playerPed, overlayId)
            if (overlayData) {
                const [overlayIndex, overlayValue, colorType, firstColor, secondColor, overlayOpacity] = overlayData
                SetPedHeadOverlay(clonePed, overlayId, overlayValue, overlayOpacity)
                SetPedHeadOverlayColor(clonePed, overlayId, colorType, firstColor, secondColor)
            } else {
                SetPedHeadOverlay(clonePed, overlayId, 0, 0)
            }
        } catch (error) {
            console.error(`Error getting or applying head overlay ${overlayId}:`, error)
        }
    }

    try {
        const hairColor = GetPedHairColor(playerPed)
        const hairHighlightColor = GetPedHairHighlightColor(playerPed)
        const eyeColor = GetPedEyeColor(playerPed)

        SetPedHairColor(clonePed, hairColor, hairHighlightColor)
        SetPedEyeColor(clonePed, eyeColor)
    } catch (error) {
        console.error("Error getting or applying hair/eye color:", error)
    }

    for (let componentId = 0; componentId < 12; componentId++) {
        try {
            const drawableId = GetPedDrawableVariation(playerPed, componentId)
            const textureId = GetPedTextureVariation(playerPed, componentId)
            const paletteId = GetPedPaletteVariation(playerPed, componentId)
            SetPedComponentVariation(clonePed, componentId, drawableId, textureId, paletteId)
        } catch (error) {
            console.error(`Error getting or applying component variation ${componentId}:`, error)
        }
    }

    for (let propId = 0; propId < 8; propId++) {
        try {
            const propIndex = GetPedPropIndex(playerPed, propId)
            if (propIndex !== -1) {
                const propTexture = GetPedPropTextureIndex(playerPed, propId)
                SetPedPropIndex(clonePed, propId, propIndex, propTexture, true)
            } else {
                ClearPedProp(clonePed, propId)
            }
        } catch (error) {
            console.error(`Error getting or applying prop ${propId}:`, error)
        }
    }

    emit("br_shadowClone:customizationsLoaded", playerPed, clone)

}

on("br_shadowClone:setCustomizations", setCustomizations)