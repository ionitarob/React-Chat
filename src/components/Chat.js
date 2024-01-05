import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const Chat = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [room, setRoom] = useState('');
  const [user, setUser] = useState('');

  const firestore = firebase.firestore();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roomParam = queryParams.get('room');
    const userParam = queryParams.get('user');

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
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <span className="username">{message.user || 'Anónimo'}:</span> {message.message}
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









