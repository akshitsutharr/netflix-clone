import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";

import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import { protectRoute } from "./middleware/protectRoute.js";
import { testTMDBConnection } from "./services/tmdb.service.js";

const app = express();

// If port 5000 is in use, try using a different port
const PORT = process.env.PORT || ENV_VARS.PORT || 5001;
const __dirname = path.resolve();

// Middleware
app.use(express.json()); // will allow us to parse req.body
app.use(cookieParser());
app.use(cors({
	origin: ENV_VARS.NODE_ENV === 'production' ? false : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
	credentials: true
}));

// Error handler middleware
app.use((err, req, res, next) => {
	console.error("Server error:", err.stack);
	res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);

// Health check route
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok', environment: ENV_VARS.NODE_ENV });
});

// TMDB test endpoint
app.get('/api/v1/tmdb-test', async (req, res) => {
	try {
		const testResult = await testTMDBConnection();
		res.json({ success: testResult });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

if (ENV_VARS.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

const server = app.listen(PORT, () => {
	console.log(`Server started at http://localhost:${PORT} in ${ENV_VARS.NODE_ENV} mode`);
	connectDB();
	
	// Test TMDB API connection
	setTimeout(() => {
		testTMDBConnection();
	}, 2000);
});

// Handle server errors
server.on('error', (error) => {
	if (error.code === 'EADDRINUSE') {
		console.error(`Port ${PORT} is already in use. Please close other applications using this port or use a different port.`);
		process.exit(1);
	} else {
		console.error('Server error:', error);
	}
});
