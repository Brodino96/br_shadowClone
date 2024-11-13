-------------------------------- # -------------------------------- # --------------------------------

local automatic = false
local playerPed

-------------------------------- # -------------------------------- # --------------------------------

local function drawText()
    SetTextFont(4)
    SetTextScale(0.0, 0.5)
    SetTextColour(255, 255, 255, 255)
    SetTextDropshadow(0, 0, 0, 0, 255)
    SetTextDropShadow()
    SetTextOutline()
    SetTextCentre(true)
    BeginTextCommandDisplayText('STRING')
    AddTextComponentSubstringPlayerName(string.format(Config.reviveMessage, Config.keybind))
    EndTextCommandDisplayText(0.5, 0.9)
end

local function revive()
    local client = Config.clientEvent or "br_shadowClone:playerRevived" ---@type string
    local server = Config.serverEvent or "br_shadowClone:playerRevived" ---@type string
    TriggerEvent(client)
    TriggerServerEvent(server)
end

---@param ped integer Ped handle of the player
---@param clone integer Ped handle of the clone
local function transfer(ped, clone)

    local pCoords = GetEntityCoords(ped)
    SetEntityCoords(clone, pCoords.x, pCoords.y, pCoords.z, true, false, false, false)

    NetworkRequestControlOfEntity(clone)
    SetEntityAsMissionEntity(clone, true, true)
    while not NetworkHasControlOfEntity(clone) do
        Wait(0)
    end
    ChangePlayerPed(PlayerId(), clone, true, false)
    SetEntityAsMissionEntity(ped, true, true)

    if GetEntityAlpha(playerPed) == 255 then
        SetControlNormal(0, Keys[Config.noclipBind].index, 1.0)
    end

    revive()
end

local function respawn()
    local ped = playerPed
    local model = GetEntityModel(ped)
    local clone = ClonePed(ped, true, true, true)

    if model == "mp_f_freemode_01" or model == "mp_m_freemode_01" then
        return TriggerEvent("br_shadowClone:setCustomizations", clone)
    end

    transfer(ped, clone)
end

local function init()
    CreateThread(function ()
        while true do
            Wait(0)

            playerPed = PlayerPedId() ---@type integer

            if GetEntityHealth(playerPed) <= Config.healthTreshold then

                if automatic then respawn(); Wait(1000); goto skip end

                drawText()

                if IsDisabledControlJustPressed(0, Keys[Config.keybind].index) or IsControlJustPressed(0, Keys[Config.keybind].index) then
                    respawn()
                    Wait(1000)
                end

                ::skip::
            end
         end
    end)
end

-------------------------------- # -------------------------------- # --------------------------------

RegisterNetEvent("br_shadowClone:init")
AddEventHandler("br_shadowClone:init", init)

RegisterNetEvent("br_shadowClone:customizationsLoaded")
AddEventHandler("br_shadowClone:customizationsLoaded", transfer)

RegisterNetEvent("br_shadowClone:setAutomaticMode")
AddEventHandler("br_shadowClone:setAutomaticMode", function (newMode)
    automatic = newMode
    TriggerEvent("ox_lib:notify", { type = "info", title = "Mode is now ["..tostring(newMode).."]" })
end)

-------------------------------- # -------------------------------- # --------------------------------

TriggerServerEvent("br_shadowClone:init")

-------------------------------- # -------------------------------- # --------------------------------