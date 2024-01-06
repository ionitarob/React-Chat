import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const CreateRoom = () => {
  const [newRoom, setNewRoom] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (newRoom.trim() !== '') {
      const roomRef = firebase.firestore().collection('rooms').doc(newRoom);

      // Verificar si la sala ya existe
      const roomSnapshot = await roomRef.get();
      if (!roomSnapshot.exists) {
        await roomRef.set({ messages: [] });
        navigate(`/chat?room=${newRoom}`);
      } else {
        alert('La sala ya existe. Por favor, elige otro nombre.');
      }
    }
  };

  return (
    <div className="create-room-container">
      <h2>Crear Nueva Sala</h2>
      <div>
        <input
          type="text"
          placeholder="Nombre de la nueva sala"
          onChange={(e) => setNewRoom(e.target.value)}
        />
      </div>
      <button onClick={handleCreateRoom}>Crear Sala</button>
    </div>
  );
}

export default CreateRoom;
