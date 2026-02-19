import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// POST /api/rides — Create a new ride (protected)
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { source, destination, departureTime, seats, pricePerSeat } = req.body;

    if (!source || !destination || !departureTime || !seats || !pricePerSeat) {
      res.status(400).json({ error: "All fields are required: source, destination, departureTime, seats, pricePerSeat" });
      return;
    }

    const ride = await prisma.ride.create({
      data: {
        source,
        destination,
        departureTime,
        seats: parseInt(seats),
        seatsAvailable: parseInt(seats),
        pricePerSeat: parseFloat(pricePerSeat),
        driverId: req.userId!,
      },
      include: {
        driver: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    res.status(201).json({
      message: "Ride created successfully",
      ride,
    });
  } catch (error) {
    console.error("Create ride error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/rides — Get all available rides (public)
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { destination, date, source } = req.query;

    const where: Record<string, unknown> = {
      status: "active",
      seatsAvailable: { gt: 0 },
    };

    if (destination) {
      where.destination = { contains: destination as string };
    }

    if (source) {
      where.source = { contains: source as string };
    }

    const rides = await prisma.ride.findMany({
      where,
      include: {
        driver: {
          select: { id: true, name: true, avatar: true },
        },
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ rides });
  } catch (error) {
    console.error("Get rides error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/rides/:id — Get a single ride (public)
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const ride = await prisma.ride.findUnique({
      where: { id: req.params.id },
      include: {
        driver: {
          select: { id: true, name: true, avatar: true, phone: true },
        },
        bookings: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
      },
    });

    if (!ride) {
      res.status(404).json({ error: "Ride not found" });
      return;
    }

    res.json({ ride });
  } catch (error) {
    console.error("Get ride error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/rides/my/offered — Get rides offered by current user (protected)
router.get("/my/offered", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const rides = await prisma.ride.findMany({
      where: { driverId: req.userId },
      include: {
        bookings: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ rides });
  } catch (error) {
    console.error("Get my rides error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/rides/:id/cancel — Cancel a ride (protected, driver only)
router.patch("/:id/cancel", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const ride = await prisma.ride.findUnique({
      where: { id: req.params.id },
    });

    if (!ride) {
      res.status(404).json({ error: "Ride not found" });
      return;
    }

    if (ride.driverId !== req.userId) {
      res.status(403).json({ error: "Only the driver can cancel this ride" });
      return;
    }

    const updatedRide = await prisma.ride.update({
      where: { id: req.params.id },
      data: { status: "cancelled" },
    });

    // Cancel all bookings for this ride
    await prisma.booking.updateMany({
      where: { rideId: req.params.id, status: "confirmed" },
      data: { status: "cancelled" },
    });

    res.json({ message: "Ride cancelled", ride: updatedRide });
  } catch (error) {
    console.error("Cancel ride error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
