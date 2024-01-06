// src/components/Chat.js
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import RoomList from './RoomList';

const Chat = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState('');
  const [user, setUser] = useState(null);

  const firestore = firebase.firestore();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roomParam = queryParams.get('room');
    const userId = 'Anónimo';

    setRoom(roomParam);
    setUser(userId);

    const roomRef = firestore.collection('rooms').doc(roomParam);

    const unsubscribeMessages = roomRef.onSnapshot((snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.data();
        setMessages(data.messages || []);
      }
    });

    const unsubscribeRooms = firestore.collection('rooms').onSnapshot((snapshot) => {
      const allRooms = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRooms(allRooms);
    });

    return () => {
      unsubscribeMessages();
      unsubscribeRooms();
    };
  }, [location.search, firestore]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      const roomRef = firestore.collection('rooms').doc(room);

      await roomRef.update({
        messages: [...messages, { message: newMessage, user }],
      });

      setNewMessage('');
    }
  };

  const handleCreateRoom = async () => {
    const newRoomName = prompt('Introduce el nombre de la nueva sala:');
    if (newRoomName) {
      await firestore.collection('rooms').doc(newRoomName).set({
        messages: [],
      });
    }
  };

  return (
    <div className="chat-container">
      <div className="header">
        <h1>Bienvenido a la sala de chat {room && `(${room})`}</h1>
        <div>
          <Link to="/chat?room=sala1">Sala 1</Link>
          <span> | </span>
          <Link to="/chat?room=sala2">Sala 2</Link>
        </div>
      </div>
      <div className="room-list-container">
        <RoomList rooms={rooms} />
        <button onClick={handleCreateRoom}>Crear Nueva Sala</button>
      </div>
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {`${message.user || 'Anónimo'}: ${message.message}`}
          </div>
        ))}
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
    </div>
  );
}

export default Chat;








