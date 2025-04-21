import axios from "axios";
import { ENV_VARS } from "../config/envVars.js";

export const fetchFromTMDB = async (url) => {
	try {
		// Using the token directly from ENV_VARS
		const token = ENV_VARS.TMDB_ACCESS_TOKEN;
		
		console.log(`TMDB Request to: ${url}`);
		
		// Use native fetch instead of axios
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		
		if (!response.ok) {
			throw new Error(`Failed to fetch data from TMDB: ${response.status} ${response.statusText}`);
		}
		
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("TMDB API Error:", error.message);
		throw error;
	}
};

// Test function to validate TMDB API connection
export const testTMDBConnection = async () => {
	try {
		console.log("Testing TMDB API connection...");
		console.log("Using token:", ENV_VARS.TMDB_ACCESS_TOKEN.substring(0, 20) + "...");
		
		const configData = await fetchFromTMDB("https://api.themoviedb.org/3/configuration");
		console.log("✅ TMDB API connection successful!");
		console.log("Base URL:", configData.images.base_url);
		
		return true;
	} catch (error) {
		console.error("❌ TMDB API connection failed:", error.message);
		return false;
	}
};
