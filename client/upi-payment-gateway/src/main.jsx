import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios"
import authHeader from "./helper/auth-header"
import { baseUrl } from '../config';

axios.defaults.baseURL = baseUrl;
axios.defaults.headers = authHeader();

axios.interceptors.response.use((response) => {
	return response;
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
