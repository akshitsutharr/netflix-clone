import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.PROD ? "" : "http://localhost:5000";
axios.defaults.withCredentials = true;
axios.defaults.timeout = 15000; // 15 seconds timeout

// Add request interceptor for debugging
axios.interceptors.request.use(
	(config) => {
		console.log(`Request to ${config.url}`, config);
		return config;
	},
	(error) => {
		console.error('Request error:', error);
		return Promise.reject(error);
	}
);

// Add response interceptor for debugging
axios.interceptors.response.use(
	(response) => {
		console.log(`Response from ${response.config.url}:`, response.data);
		return response;
	},
	(error) => {
		if (error.response) {
			console.error('Response error:', error.response.status, error.response.data);
		} else if (error.request) {
			console.error('No response received:', error.request);
		} else {
			console.error('Error setting up request:', error.message);
		}
		return Promise.reject(error);
	}
);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
			<Toaster position="top-center" />
		</BrowserRouter>
	</React.StrictMode>
);
