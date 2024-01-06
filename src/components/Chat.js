import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import RoomList from './RoomList';
import { useUser } from '../UserContext';
import '../App.css'; // Asegúrate de importar el archivo CSS correspondiente

const Chat = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [room, setRoom] = useState('');
  const [quoteMessage, setQuoteMessage] = useState(null);
  const [showQuoteMenu, setShowQuoteMenu] = useState(false); // Nuevo estado para controlar la visibilidad del menú de citas
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
      const serverTimestamp = firebase.firestore.Timestamp.now();
      const newMessageObj = {
        message: newMessage,
        user,
        timestamp: serverTimestamp,
      };

      if (quoteMessage) {
        newMessageObj.quote = quoteMessage;
        setQuoteMessage(null);
      }

      await roomRef.update({
        messages: firebase.firestore.FieldValue.arrayUnion(newMessageObj),
      });

      setNewMessage('');
    }
  };

  const handleQuoteReply = (message) => {
    setQuoteMessage(message);
    setShowQuoteMenu(false); // Oculta el menú después de seleccionar una cita
  };

  const toggleQuoteMenu = () => {
    setShowQuoteMenu(!showQuoteMenu);
  };

  const handleChangeUsername = () => {
    const newUsername = prompt('Ingresa tu nuevo nombre de usuario:');
    if (newUsername) {
      setUser(newUsername);
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('user', newUsername);
      window.history.replaceState({}, '', `${location.pathname}?${searchParams}`);
    }
  };

  const handleCreateRoom = () => {
    const newRoomName = prompt('Ingresa el nombre de la nueva sala:');
    if (newRoomName) {
      const newRoomRef = firestore.collection('rooms').doc(newRoomName);
      newRoomRef.set({ messages: [] });
      window.location.href = `/chat?room=${newRoomName}&user=${user}`;
    }
  };

  return (
    <div className="chat-container">
      <div className="header">
        <h1>
          Bienvenido a la sala de chat {room && `(${room})`} - Usuario: {user}{' '}
          <button className="change-username" onClick={handleChangeUsername}>
            Cambiar Usuario
          </button>
        </h1>
      </div>
      <div className="chat-content">
        <RoomList />
        <div className="message-container">
          {messages.map((message, index) => (
            <div key={index} className="message">
              <div className="message-content">
                {`${message.user || 'Anónimo'} (${new Date(message.timestamp?.seconds * 1000).toLocaleTimeString()}): ${message.message}`}
              </div>
              <div className="message-actions" onClick={toggleQuoteMenu}>
                ...
                {showQuoteMenu && (
                  <div className="quote-menu" onClick={() => handleQuoteReply(message)}>
                    Quote & Reply
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="input-container">
        <input
          className="message-input"
          type="text"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="send-button" onClick={handleSendMessage}>
          Enviar
        </button>
      </div>
      <button className="create-room-button" onClick={handleCreateRoom}>
        Crear Nueva Sala
      </button>
    </div>
  );
};

export default Chat;








