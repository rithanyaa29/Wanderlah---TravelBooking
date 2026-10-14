import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import { packages } from "./src/data.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3330;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDirectory = path.join(__dirname, "data");
const databaseFile = path.join(dataDirectory, "db.json");

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

if (!fs.existsSync(databaseFile)) {
  fs.writeFileSync(
    databaseFile,
    JSON.stringify({
      users: [],
      bookings: [],
      nextUserId: 1,
      nextBookingId: 1
    }, null, 2)
  );
}

function loadDatabase() {
  const data = JSON.parse(fs.readFileSync(databaseFile, "utf8"));

  return {
    users: Array.isArray(data.users) ? data.users : [],
    bookings: Array.isArray(data.bookings) ? data.bookings : [],
    nextUserId: Number(data.nextUserId) || 1,
    nextBookingId: Number(data.nextBookingId) || 1
  };
}

function saveDatabase() {
  const temporaryFile = `${databaseFile}.tmp`;

  fs.writeFileSync(
    temporaryFile,
    JSON.stringify({
      users,
      bookings,
      nextUserId,
      nextBookingId
    }, null, 2),
    { mode: 0o600 }
  );

  fs.renameSync(temporaryFile, databaseFile);
}

const savedData = loadDatabase();

let users = savedData.users;
let bookings = savedData.bookings;
let nextUserId = savedData.nextUserId;
let nextBookingId = savedData.nextBookingId;
// =====================================
// AUTHENTICATION MIDDLEWARE
// =====================================
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication token required."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({
      message: "Invalid or expired token."
    });
  }
}

// =====================================
// ADMIN AUTHORIZATION MIDDLEWARE
// =====================================
function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required."
    });
  }

  next();
}

// =====================================
// TRAVELER SIGNUP
// =====================================
app.post("/auth/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Please fill all fields."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters."
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    const existingUser = users.find(
      (user) =>
        user.email === cleanEmail ||
        user.username.toLowerCase() === cleanUsername.toLowerCase()
    );

    if (existingUser) {
      return res.status(409).json({
        message: "Username or email is already registered."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: nextUserId,
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword
    };

    users.push(user);
    nextUserId++;

    try {
      saveDatabase();
    } catch (saveError) {
      // Roll back the in-memory change if saving fails.
      users.pop();
      nextUserId--;

      throw saveError;
    }

    console.log("[CREATE] Traveler registered:", cleanUsername);
    console.log("[DATABASE] File:", databaseFile);
    console.log("[DATABASE] Users saved:", users.length);

    return res.status(201).json({
      message: "Registration successful."
    });
  } catch (error) {
    console.error("[ERROR] Signup:", error.message);
    console.error("[DATABASE] Path:", databaseFile);

    return res.status(500).json({
      message: "Unable to register user."
    });
  }
});
// =====================================
// TRAVELER LOGIN
// =====================================
app.post("/auth/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier?.trim() || !password) {
      return res.status(400).json({
        message: "Enter your username/email and password."
      });
    }

    const value = identifier.trim().toLowerCase();

    const user = users.find(
      (item) =>
        item.email === value ||
        item.username.toLowerCase() === value
    );

    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log("[AUTH] Traveler login failed.");

      return res.status(401).json({
        message: "Invalid username/email or password."
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: "traveler"
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log(`[AUTH] Traveler logged in: ${user.username}`);

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("[ERROR] Traveler login:", error.message);

    res.status(500).json({
      message: "Unable to log in."
    });
  }
});

// =====================================
// ADMIN LOGIN
// =====================================
app.post("/auth/admin-login", (req, res) => {
  const { username, password } = req.body;

  if (
    !process.env.ADMIN_USERNAME ||
    !process.env.ADMIN_PASSWORD
  ) {
    return res.status(500).json({
      message: "Admin credentials are not configured."
    });
  }

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    console.log("[ADMIN] Admin login failed.");

    return res.status(401).json({
      message: "Invalid admin username or password."
    });
  }

  const token = jwt.sign(
    {
      username,
      role: "admin"
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  console.log(`[ADMIN] Admin logged in: ${username}`);

  res.json({
    message: "Admin login successful.",
    token,
    user: {
      username,
      role: "admin"
    }
  });
});

// =====================================
// GET ALL PACKAGES
// =====================================
app.get("/packages", (req, res) => {
  console.log(`[READ] Retrieved ${packages.length} packages.`);

  res.json(packages);
});

// =====================================
// GET ONE PACKAGE
// =====================================
app.get("/packages/:id", (req, res) => {
  const id = Number(req.params.id);

  const packageData = packages.find(
    (pkg) => pkg.id === id
  );

  if (!packageData) {
    return res.status(404).json({
      message: "Package not found."
    });
  }

  console.log(`[READ] Retrieved package ${id}.`);

  res.json(packageData);
});

// =====================================
// CHECK PACKAGE AVAILABILITY
// =====================================
app.get("/availability/:packageId", (req, res) => {
  const packageId = Number(req.params.packageId);

  const packageData = packages.find(
    (pkg) => pkg.id === packageId
  );

  if (!packageData) {
    return res.status(404).json({
      message: "Package not found."
    });
  }

  res.json({
    packageId: packageData.id,
    packageTitle: packageData.title,
    destination: packageData.destination,
    available: true,
    availableSeats: 20,
    message: "Package is available."
  });
});

// =====================================
// ADD PACKAGE - ADMIN ONLY
// =====================================
app.post(
  "/packages",
  authenticateToken,
  requireAdmin,
  (req, res) => {
    const newPackage = {
      ...req.body,
      id: packages.length
        ? Math.max(...packages.map((pkg) => Number(pkg.id) || 0)) + 1
        : 1
    };

    packages.push(newPackage);

    console.log(
      `[CREATE] Package ${newPackage.id}: ${newPackage.title || "Untitled"}`
    );

    res.status(201).json({
      message: "Package added successfully.",
      package: newPackage
    });
  }
);

// =====================================
// UPDATE PACKAGE - ADMIN ONLY
// =====================================
app.put(
  "/packages/:id",
  authenticateToken,
  requireAdmin,
  (req, res) => {
    const id = Number(req.params.id);

    const index = packages.findIndex(
      (pkg) => pkg.id === id
    );

    if (index === -1) {
      return res.status(404).json({
        message: "Package not found."
      });
    }

    packages[index] = {
      ...packages[index],
      ...req.body,
      id
    };

    console.log(`[UPDATE] Package ${id} updated.`);

    res.json({
      message: "Package updated successfully.",
      package: packages[index]
    });
  }
);

// =====================================
// DELETE PACKAGE - ADMIN ONLY
// =====================================
app.delete(
  "/packages/:id",
  authenticateToken,
  requireAdmin,
  (req, res) => {
    const id = Number(req.params.id);

    const index = packages.findIndex(
      (pkg) => pkg.id === id
    );

    if (index === -1) {
      return res.status(404).json({
        message: "Package not found."
      });
    }

    const deletedPackage = packages.splice(index, 1)[0];

    console.log(
      `[DELETE] Package ${id}: ${deletedPackage.title || "Untitled"}`
    );

    res.json({
      message: "Package deleted successfully.",
      package: deletedPackage
    });
  }
);

// =====================================
// PROTECT BOOKING ROUTES
// =====================================
app.use("/bookings", authenticateToken);

// =====================================
// GET BOOKING HISTORY
// =====================================
app.get("/bookings", (req, res) => {
  console.log(`[READ] Booking history requested by ${req.user.username}.`);

  const userBookings = bookings.filter(
    (booking) => booking.userId === req.user.id
  );

  res.json(userBookings);
});
// =====================================
// GET ONE BOOKING
// =====================================
app.get("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);

  const booking = bookings.find(
    (item) => item.id === id
  );

  if (!booking) {
    return res.status(404).json({
      message: "Booking not found."
    });
  }

  console.log(`[READ] Booking ${id} retrieved.`);

  res.json(booking);
});

// =====================================
// CREATE BOOKING
// =====================================
app.post("/bookings", (req, res) => {
 const newBooking = {
  ...req.body,
  id: nextBookingId++,
  userId: req.user.id,
  status: "Confirmed"
};
  bookings.push(newBooking);

  console.log(`[CREATE] Booking ${newBooking.id} created.`);

  res.status(201).json({
    message: "Booking created successfully.",
    booking: newBooking
  });
});

// =====================================
// UPDATE BOOKING
// =====================================
app.put("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = bookings.findIndex(
    (item) => item.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Booking not found."
    });
  }

  bookings[index] = {
    ...bookings[index],
    ...req.body,
    id,
    status: bookings[index].status
  };

  console.log(`[UPDATE] Booking ${id} updated.`);

  res.json({
    message: "Booking updated successfully.",
    booking: bookings[index]
  });
});

// =====================================
// PATCH BOOKING DETAILS
// =====================================
app.patch("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);

  const booking = bookings.find(
    (item) => item.id === id
  );

  if (!booking) {
    return res.status(404).json({
      message: "Booking not found."
    });
  }

  Object.assign(booking, req.body, { id });

  console.log(`[UPDATE] Booking ${id} partially updated.`);

  res.json({
    message: "Booking updated successfully.",
    booking
  });
});

// =====================================
// CANCEL BOOKING
// Keep the record for admin review.
// =====================================
app.delete("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);

  const booking = bookings.find(
    (item) => item.id === id
  );

  if (!booking) {
    return res.status(404).json({
      message: "Booking not found."
    });
  }

  if (booking.status === "Cancelled") {
    return res.status(400).json({
      message: "Booking is already cancelled."
    });
  }

  booking.status = "Cancelled";
  booking.cancelledAt = new Date().toISOString();
saveDatabase();
  console.log(`[CANCEL] Booking ${id} cancelled.`);

  res.json({
    message: "Booking cancelled successfully.",
    booking
  });
});

// =====================================
// ADMIN: VIEW ALL BOOKINGS
// Includes cancelled bookings.
// =====================================
app.get(
  "/admin/bookings",
  authenticateToken,
  requireAdmin,
  (req, res) => {
    console.log(
      `[ADMIN READ] ${req.user.username} retrieved ${bookings.length} bookings.`
    );

    res.json(bookings);
  }
);

// =====================================
// START SERVER
// =====================================
if (!process.env.JWT_SECRET) {
  console.error("Missing JWT_SECRET in .env.");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`REST API running on http://localhost:${PORT}`);
});
