from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# CORS settings
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rooms = {}  # In-memory database for rooms

class RoomCreate(BaseModel):
    name: str

class Message(BaseModel):
    user: str
    content: str

class Room(BaseModel):
    name: str
    messages: List[Message] = []

@app.post("/create_room/")
def create_room(room: RoomCreate):
    rooms[room.name] = Room(name=room.name, messages=[])
    return {"room_id": room.name}

@app.get("/get_room/{room_id}")
def get_room(room_id: str):
    room = rooms.get(room_id)
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    return room

@app.post("/message/{room_id}")
def add_message(room_id: str, message: Message):
    room = rooms.get(room_id)
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    # Append the new message
    room.messages.append(message)
    print(room)
    return {"message": "Message added to the room."}

@app.get("/messages/{room_id}") 
def get_messages(room_id: str):
    room = rooms.get(room_id)
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    print(room)
    return {"messages": room.messages}
