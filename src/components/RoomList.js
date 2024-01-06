// src/components/RoomList.js
import React from 'react';
import { Link } from 'react-router-dom';

const RoomList = ({ rooms }) => {
  return (
    <div className="room-list">
      <h2>Salas Disponibles</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <Link to={`/chat?room=${room.name}`}>{room.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoomList;

