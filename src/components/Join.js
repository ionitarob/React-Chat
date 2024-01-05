import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Join = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const navigate = useNavigate();

  const handleJoinChat = () => {
    if (username.trim() !== '' && room.trim() !== '') {
      navigate(`/chat?room=${room}&user=${username}`);
    }
  };

  return (
    <div className="join-container">
      <h1>Ingresa a la sala de chat</h1>
      <div>
        <input
          type="text"
          placeholder="Nombre de usuario"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <select onChange={(e) => setRoom(e.target.value)}>
          <option value="">Selecciona una sala</option>
          <option value="sala1">Sala 1</option>
          <option value="sala2">Sala 2</option>
        </select>
      </div>
      <button onClick={handleJoinChat}>Unirse al chat</button>
    </div>
  );
}

export default Join;

