import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.booking.deleteMany();
  await prisma.ride.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  // Create users
  const rahul = await prisma.user.create({
    data: {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      password,
      phone: "+91 98765 43210",
      avatar: "R",
    },
  });

  const priya = await prisma.user.create({
    data: {
      name: "Priya Patel",
      email: "priya@example.com",
      password,
      phone: "+91 98765 43211",
      avatar: "P",
    },
  });

  const arjun = await prisma.user.create({
    data: {
      name: "Arjun Kumar",
      email: "arjun@example.com",
      password,
      phone: "+91 98765 43212",
      avatar: "A",
    },
  });

  const sneha = await prisma.user.create({
    data: {
      name: "Sneha Reddy",
      email: "sneha@example.com",
      password,
      phone: "+91 98765 43213",
      avatar: "S",
    },
  });

  // Create rides
  await prisma.ride.create({
    data: {
      source: "Downtown Metro Station",
      destination: "Tech Park Campus",
      departureTime: "08:30 AM",
      seats: 3,
      seatsAvailable: 2,
      pricePerSeat: 60,
      driverId: rahul.id,
    },
  });

  await prisma.ride.create({
    data: {
      source: "Central Bus Terminal",
      destination: "Tech Park Campus",
      departureTime: "08:45 AM",
      seats: 2,
      seatsAvailable: 1,
      pricePerSeat: 50,
      driverId: priya.id,
    },
  });

  await prisma.ride.create({
    data: {
      source: "Downtown Metro Station",
      destination: "Tech Park Campus",
      departureTime: "09:00 AM",
      seats: 4,
      seatsAvailable: 3,
      pricePerSeat: 70,
      driverId: arjun.id,
    },
  });

  await prisma.ride.create({
    data: {
      source: "Airport Road",
      destination: "Tech Park Campus",
      departureTime: "08:15 AM",
      seats: 2,
      seatsAvailable: 1,
      pricePerSeat: 120,
      driverId: sneha.id,
    },
  });

  console.log("✅ Seed complete!");
  console.log("   Users: rahul@example.com, priya@example.com, arjun@example.com, sneha@example.com");
  console.log("   Password for all: password123");
}

seed()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
