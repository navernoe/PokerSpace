# PokerSpace

##### запустить проект:

1. node version 13.12.0 (node -v)
2. `http-server dist`
3. package.json --> убрать `"type": "module",`
4. `npm run start`
5. вернуть `"type": "module",` в package.json
6. `node --experimental-json-modules src/app/mainApp.js` (или через launch.json)

*launch.json для vscode:*

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
