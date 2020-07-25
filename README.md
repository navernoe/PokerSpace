# PokerSpace

запустить проект:

node version 13.12.0 (node -v)
http-server dist
package.json --> убрать "type": "module",
npm run start
вернуть "type": "module", в package.json
node --experimental-json-modules src/app/mainApp.js (или через launch.json)

----
launch.json для vscode:
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "cwd": "${workspaceFolder}",
            "program": "${workspaceFolder}/src/app/mainApp.js",
            "runtimeArgs": ["--experimental-json-modules"]
        }
    ]
}
----