import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const appContainer = document.getElementById('root');
const app = createRoot(appContainer);
app.render(
    // <React.StrictMode><App /></React.StrictMode>
    <App/>
);
