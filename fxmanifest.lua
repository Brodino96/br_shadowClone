fx_version "cerulean"
game "gta5"
lua54 "yes"

author "Brodino"
description "Spawn a clone of yourself whenever you die"
version "1.0"

shared_script "config.lua"
server_script "server.lua"
client_scripts {
    "client.lua",
    "client.js",
}

