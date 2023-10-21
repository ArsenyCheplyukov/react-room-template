# fastapi
from typing import Dict, List
from datetime import datetime
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
# from starlette.websockets import WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import json

app = FastAPI()

# CORS settings
origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Room(BaseModel):
    name: str = None
    creator: str = None
    connected: str = None

    class Config:
        arbitrary_types_allowed = True

class Message(BaseModel):
    author: str
    date: datetime
    message_text: str

RoomNames: Dict[str, Room] = {}

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[Dict] = []  # List of dictionaries to store more information

    async def connect(self, websocket: WebSocket, room_name: str, client_name: str):
        await websocket.accept()
        self.active_connections.append({
            'websocket': websocket,
            'room_name': room_name,
            'client_name': client_name,
        })

    def disconnect(self, websocket: WebSocket):
        connection_info = next(
            (conn for conn in self.active_connections if conn['websocket'] == websocket),
            None,
        )
        if connection_info:
            self.active_connections.remove(connection_info)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str, room_name: str):
        for connection_info in self.active_connections:
            if (
                connection_info['room_name'] == room_name
            ):
                await connection_info['websocket'].send_text(message)


manager = ConnectionManager()

class CreateRoomData(BaseModel):
    room_name: str
    creator: str

@app.post("/create_room/")
async def create_room(data: Room):
    if data.name in RoomNames:
        raise HTTPException(status_code=400, detail="Room with the same name already exists")
    
    RoomNames[data.name] = data
    return {"room_name": data.name, "creator": data.creator}

@app.post("/connect_room/")
async def connect_room(data: Room):
    if data.name not in RoomNames:
        raise HTTPException(status_code=404, detail="Room not found")

    room = RoomNames[data.name]
    if room.connected is not None:
        raise HTTPException(status_code=400, detail="Maximum players limit reached for this room")
    
    room.connected = data.connected
    return {"room_name": data.name, "connected": data.connected}

@app.websocket("/ws/{room_name}/{client_name}")
async def websocket_endpoint(websocket: WebSocket, room_name: str, client_name: str):
    if room_name not in RoomNames:
        await websocket.close()

    room = RoomNames[room_name]
    if client_name != room.creator and client_name != room.connected:
        await websocket.close()

    await manager.connect(websocket, room_name, client_name)
    now = datetime.now()
    current_time = now.strftime("%H:%M")
    try:
        while True:
            data = await websocket.receive_text()
            message = {"time": current_time, "client_name": client_name, "message": data}
            await manager.broadcast(json.dumps(message), room_name)

    except WebSocketDisconnect:
        manager.disconnect(websocket)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
