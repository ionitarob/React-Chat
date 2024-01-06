// src/components/RoomList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const firestore = firebase.firestore();
    const roomsRef = firestore.collection('rooms');

    const unsubscribe = roomsRef.onSnapshot((snapshot) => {
      const roomsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="room-list">
      <h2>Salas Disponibles</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <Link to={`/chat?room=${room.id}`}>{room.id}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoomList;
