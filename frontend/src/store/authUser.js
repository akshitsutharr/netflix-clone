import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
	user: null,
	isSigningUp: false,
	isCheckingAuth: true,
	isLoggingOut: false,
	isLoggingIn: false,
	signup: async (credentials) => {
		set({ isSigningUp: true });
		try {
			console.log("Attempting signup with:", { ...credentials, password: "***" });
			const response = await axios.post("/api/v1/auth/signup", credentials, {
				withCredentials: true,
				timeout: 10000
			});
			console.log("Signup response:", response.data);
			set({ user: response.data.user, isSigningUp: false });
			toast.success("Account created successfully");
		} catch (error) {
			console.error("Signup error:", error);
			if (error.response) {
				// The request was made and the server responded with an error status
				toast.error(error.response.data?.message || "Signup failed");
				console.error("Response data:", error.response.data);
				console.error("Response status:", error.response.status);
			} else if (error.request) {
				// The request was made but no response was received
				console.error("No response received:", error.request);
				toast.error("Server connection error. Please try again later.");
			} else {
				// Something happened in setting up the request
				toast.error("An error occurred while signing up");
			}
			set({ isSigningUp: false, user: null });
		}
	},
	login: async (credentials) => {
		set({ isLoggingIn: true });
		try {
			console.log("Attempting login with:", { ...credentials, password: "***" });
			const response = await axios.post("/api/v1/auth/login", credentials, {
				withCredentials: true,
				timeout: 10000
			});
			console.log("Login response:", response.data);
			set({ user: response.data.user, isLoggingIn: false });
			toast.success("Logged in successfully");
		} catch (error) {
			console.error("Login error:", error);
			if (error.response) {
				toast.error(error.response.data?.message || "Login failed");
				console.error("Response data:", error.response.data);
				console.error("Response status:", error.response.status);
			} else if (error.request) {
				console.error("No response received:", error.request);
				toast.error("Server connection error. Please try again later.");
			} else {
				toast.error("An error occurred while logging in");
			}
			set({ isLoggingIn: false, user: null });
		}
	},
	logout: async () => {
		set({ isLoggingOut: true });
		try {
			await axios.post("/api/v1/auth/logout", {}, {
				withCredentials: true,
				timeout: 5000
			});
			set({ user: null, isLoggingOut: false });
			toast.success("Logged out successfully");
		} catch (error) {
			console.error("Logout error:", error);
			set({ isLoggingOut: false });
			toast.error(error.response?.data?.message || "Logout failed");
		}
	},
	authCheck: async () => {
		set({ isCheckingAuth: true });
		try {
			const response = await axios.get("/api/v1/auth/authCheck", {
				withCredentials: true,
				timeout: 5000
			});
			console.log("Auth check response:", response.data);
			set({ user: response.data.user, isCheckingAuth: false });
		} catch (error) {
			console.error("Auth check error:", error);
			set({ isCheckingAuth: false, user: null });
		}
	},
}));
