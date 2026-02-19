import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// POST /api/bookings — Book a ride (protected)
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { rideId, seats } = req.body;

    if (!rideId || !seats) {
      res.status(400).json({ error: "rideId and seats are required" });
      return;
    }

    const seatCount = parseInt(seats);

    // Find the ride
    const ride = await prisma.ride.findUnique({
      where: { id: rideId },
      include: {
        driver: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    if (!ride) {
      res.status(404).json({ error: "Ride not found" });
      return;
    }

    if (ride.status !== "active") {
      res.status(400).json({ error: "Ride is no longer active" });
      return;
    }

    if (ride.driverId === req.userId) {
      res.status(400).json({ error: "You cannot book your own ride" });
      return;
    }

    if (seatCount > ride.seatsAvailable) {
      res.status(400).json({
        error: `Only ${ride.seatsAvailable} seat(s) available`,
      });
      return;
    }

    // Check if user already booked this ride
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: req.userId,
        rideId,
        status: "confirmed",
      },
    });

    if (existingBooking) {
      res.status(409).json({ error: "You have already booked this ride" });
      return;
    }

    const totalPrice = ride.pricePerSeat * seatCount;

    // Create booking and update available seats in a transaction
    const [booking] = await prisma.$transaction([
      prisma.booking.create({
        data: {
          seats: seatCount,
          totalPrice,
          userId: req.userId!,
          rideId,
        },
        include: {
          ride: {
            include: {
              driver: {
                select: { id: true, name: true, avatar: true },
              },
            },
          },
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
      }),
      prisma.ride.update({
        where: { id: rideId },
        data: {
          seatsAvailable: { decrement: seatCount },
        },
      }),
    ]);

    res.status(201).json({
      message: "Ride booked successfully",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/bookings — Get current user's bookings (protected)
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.userId },
      include: {
        ride: {
          include: {
            driver: {
              select: { id: true, name: true, avatar: true, phone: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ bookings });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/bookings/:id — Get a specific booking (protected)
router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        ride: {
          include: {
            driver: {
              select: { id: true, name: true, avatar: true, phone: true },
            },
          },
        },
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    if (booking.userId !== req.userId) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    res.json({ booking });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/bookings/:id/cancel — Cancel a booking (protected)
router.patch("/:id/cancel", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
    });

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    if (booking.userId !== req.userId) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    if (booking.status !== "confirmed") {
      res.status(400).json({ error: "Booking is not in a cancelable state" });
      return;
    }

    // Cancel booking and restore seats in a transaction
    const [updatedBooking] = await prisma.$transaction([
      prisma.booking.update({
        where: { id: req.params.id },
        data: { status: "cancelled" },
      }),
      prisma.ride.update({
        where: { id: booking.rideId },
        data: {
          seatsAvailable: { increment: booking.seats },
        },
      }),
    ]);

    res.json({ message: "Booking cancelled", booking: updatedBooking });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
