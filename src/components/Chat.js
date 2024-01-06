// src/components/Chat.js
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import RoomList from './RoomList';
import { useUser } from '../UserContext';

const Chat = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [room, setRoom] = useState('');
  const { user, setUser } = useUser();

  const firestore = firebase.firestore();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roomParam = queryParams.get('room');
    const userParam = queryParams.get('user') || user;

    setRoom(roomParam);
    setUser(userParam);

    const roomRef = firestore.collection('rooms').doc(roomParam);

    const unsubscribe = roomRef.onSnapshot((snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.data();
        setMessages(data.messages || []);
      }
    });

    return () => unsubscribe();
  }, [location.search, firestore, user, setUser]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      const roomRef = firestore.collection('rooms').doc(room);
  
      // Obtén el timestamp actual del servidor
      const serverTimestamp = firebase.firestore.Timestamp.now();
  
      // Crea el objeto del mensaje con el timestamp
      const newMessageObj = {
        message: newMessage,
        user,
        timestamp: serverTimestamp,
      };
  
      // Agrega el mensaje al array usando arrayUnion
      await roomRef.update({
        messages: firebase.firestore.FieldValue.arrayUnion(newMessageObj),
      });
  
      setNewMessage('');
    }
  };
  

  const handleChangeUsername = () => {
    const newUsername = prompt('Ingresa tu nuevo nombre de usuario:');
    if (newUsername) {
      setUser(newUsername);
      // Actualiza la URL con el nuevo nombre de usuario
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('user', newUsername);
      window.history.replaceState({}, '', `${location.pathname}?${searchParams}`);
    }
  };

  const handleCreateRoom = () => {
    const newRoomName = prompt('Ingresa el nombre de la nueva sala:');
    if (newRoomName) {
      // Crea la nueva sala en Firestore
      const newRoomRef = firestore.collection('rooms').doc(newRoomName);
      newRoomRef.set({ messages: [] });

      // Redirige a la nueva sala con el nombre de usuario actual
      window.location.href = `/chat?room=${newRoomName}&user=${user}`;
    }
  };

  return (
    <div className="chat-container">
      <div className="header">
        <h1>
          Bienvenido a la sala de chat {room && `(${room})`} - Usuario: {user}{' '}
          <button onClick={handleChangeUsername}>Cambiar Usuario</button>
        </h1>
        <div>
          <Link to="/chat?room=sala1">Sala 1</Link>
          <span> | </span>
          <Link to="/chat?room=sala2">Sala 2</Link>
        </div>
      </div>
      <div className="chat-content">
        <RoomList />
        <div className="message-container">
          {messages.map((message, index) => (
            <div key={index} className="message">
              {`${message.user || 'Anónimo'} (${new Date(message.timestamp?.seconds * 1000).toLocaleTimeString()}): ${message.message}`}
            </div>
          ))}
        </div>
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
      <button onClick={handleCreateRoom}>Crear Nueva Sala</button>
    </div>
  );
};

export default Chat;







