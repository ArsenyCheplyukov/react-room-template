from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from uuid import uuid4
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
    # exposed_headers=False,
    # max_age=False,
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
    """
    Create a new room.

    This will create a new room with the provided name.

    Args:
        room (RoomCreate): The details of the room to be created.

    Returns:
        dict: The created room's ID.
    """
    room_id = str(uuid4())  # Generate a unique room ID
    print(room.name)
    rooms[room.name] = Room(name=room.name, messages=[])
    return {"room_id": room_id}

@app.get("/get_room/{room_id}")
def get_room(room_id: str):
    """
    Get information about a room.

    This will retrieve information about a room based on its ID.

    Args:
        room_id (str): The ID of the room to retrieve.

    Returns:
        dict: Information about the room.
    """
    room = rooms.get(room_id)
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    return room

@app.post("/messages/{room_id}")
def add_message(room_id: str, message: Message):
    """
    Add a message to a room.

    Args:
        room_id (str): The ID of the room.
        message (Message): The message to add.

    Returns:
        dict: Confirmation message.
    """
    room = rooms.get(room_id)
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    room.messages.append(message)
    return {"message": "Message added to the room."}

@app.get("/messages/{room_id}") 
def get_messages(room_id: str):
    """
    Get messages for a room.

    Args:
        room_id (str): The ID of the room.

    Returns:
        List[Message]: List of messages in the room.
    """
    room = rooms.get(room_id)
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    return {"messages": room.messages}
