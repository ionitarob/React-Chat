// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { UserProvider } from './UserContext';

// Configura tu proyecto de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBr734SL7tX-JHIfw16_Yi8kKgsTt8qVu4",
  authDomain: "chat-room-ef581.firebaseapp.com",
  projectId: "chat-room-ef581",
  storageBucket: "chat-room-ef581.appspot.com",
  messagingSenderId: "253415620064",
  appId: "1:253415620064:web:d00460aa138fcceef2bf85"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();

