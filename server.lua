RegisterNetEvent("br_shadowClone:init")
AddEventHandler("br_shadowClone:init", function ()
    if IsPlayerAceAllowed(source, "admin") then
        TriggerClientEvent("br_shadowClone:init", source)
    end
end)