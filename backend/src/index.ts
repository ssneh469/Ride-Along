import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth";
import rideRoutes from "./routes/rides";
import bookingRoutes from "./routes/bookings";
import prisma from "./lib/prisma";

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/bookings", bookingRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Public stats
app.get("/api/stats", async (_req, res) => {
  try {
    const [users, ridesCompleted] = await Promise.all([
      prisma.user.count(),
      prisma.ride.count({ where: { status: "active" } }),
    ]);
    res.json({ users, ridesCompleted });
  } catch {
    res.json({ users: 0, ridesCompleted: 0 });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 RideAlong API server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
