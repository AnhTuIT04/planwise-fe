@echo off
REM Quick start script for LiveKit server (Windows)
echo.
echo 🚀 Starting LiveKit server...
echo.
echo This will run LiveKit server on:
echo   - WebSocket: ws://localhost:7880
echo   - HTTP: http://localhost:7881
echo   - UDP: 7882
echo.
echo Press Ctrl+C to stop the server
echo.

docker run --rm -p 7880:7880 -p 7881:7881 -p 7882:7882/udp -e LIVEKIT_KEYS="devkey: secret" livekit/livekit-server
