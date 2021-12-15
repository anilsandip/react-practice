require('./bootstrap');
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import '@shopify/polaris/build/esm/styles.css';
import '../css/app.css'

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('app')
);
