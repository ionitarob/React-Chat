// src/components/Join.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useUser } from '../UserContext';

const Join = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const { setUser } = useUser(); // Cambiado de setUserContext a setUser

  const navigate = useNavigate();

  useEffect(() => {
    const firestore = firebase.firestore();
    const roomsRef = firestore.collection('rooms');

    const unsubscribe = roomsRef.onSnapshot((snapshot) => {
      const rooms = snapshot.docs.map((doc) => doc.id);
      setAvailableRooms(rooms);
    });

    return () => unsubscribe();
  }, []);

  const handleJoin = () => {
    if (username.trim() !== '' && room.trim() !== '') {
      setUser(username);  // Usa setUser directamente
      navigate(`/chat?room=${room}`);
    } else {
      alert('Por favor, ingresa un nombre de usuario y una sala válidos.');
    }
  };

  return (
    <div className="join-container">
      <h1>Únete a una sala de chat</h1>
      <div>
        <input
          type="text"
          placeholder="Ingresa tu nombre de usuario"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <select onChange={(e) => setRoom(e.target.value)}>
          <option value="" disabled selected>
            Selecciona una sala
          </option>
          {availableRooms.map((availableRoom) => (
            <option key={availableRoom} value={availableRoom}>
              {availableRoom}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button onClick={handleJoin}>Unirse al chat</button>
      </div>
    </div>
  );
};

export default Join;


