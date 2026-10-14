
import express from "express";
import cors from "cors";
import { packages } from "./src/data.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3330;

app.use(cors());
app.use(express.json());
// Remove /api prefix for Vercel requests
app.use((req, res, next) => {
  if (req.url === "/api") {
    req.url = "/";
  } else if (req.url.startsWith("/api/")) {
    req.url = req.url.slice(4);
  }

  next();
});

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

    const existingUser = await pool.query(
      `SELECT id
       FROM users
       WHERE LOWER(username) = LOWER($1)
          OR LOWER(email) = LOWER($2)
       LIMIT 1`,
      [cleanUsername, cleanEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Username or email is already registered."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)`,
      [cleanUsername, cleanEmail, hashedPassword]
    );

    console.log("[CREATE] Traveler registered:", cleanUsername);
    console.log("[DATABASE] New user saved to Neon PostgreSQL.");

    return res.status(201).json({
      message: "Registration successful."
    });
  } catch (error) {
    console.error("[ERROR] Signup:", error.message);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Username or email is already registered."
      });
    }

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

    if (
      typeof identifier !== "string" ||
      !identifier.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Enter your username/email and password."
      });
    }

    const value = identifier.trim().toLowerCase();

    const result = await pool.query(
      `SELECT id, username, email, password
       FROM users
       WHERE LOWER(email) = $1
          OR LOWER(username) = $1
       LIMIT 1`,
      [value]
    );

    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log("[AUTH] Traveler login failed.");

      return res.status(401).json({
        message: "Invalid username/email or password."
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
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

    return res.json({
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

    return res.status(500).json({
      message: "Unable to log in."
    });
  }
});

// =====================================
// ADMIN LOGIN
// =====================================
app.post("/auth/admin-login", (req, res) => {
  try {
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
      return res.status(401).json({
        message: "Invalid admin username or password."
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const token = jwt.sign(
      {
        username,
        role: "admin"
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Admin login successful.",
      token,
      user: {
        username,
        role: "admin"
      }
    });
  } catch (error) {
    console.error("[ERROR] Admin login:", error.message);

    return res.status(500).json({
      message: "Unable to log in as admin."
    });
  }
});

// =====================================
// GET ALL TRAVEL PACKAGES
// =====================================
app.get("/packages", (req, res) => {
  try {
    return res.json(packages);
  } catch (error) {
    console.error("[ERROR] Fetch packages:", error.message);

    return res.status(500).json({
      message: "Unable to fetch travel packages."
    });
  }
});

// =====================================
// GET PACKAGE BY ID
// =====================================
app.get("/packages/:id", (req, res) => {
  try {
    const packageId = Number(req.params.id);

    const travelPackage = packages.find(
      (item) => Number(item.id) === packageId
    );

    if (!travelPackage) {
      return res.status(404).json({
        message: "Travel package not found."
      });
    }

    return res.json(travelPackage);
  } catch (error) {
    console.error("[ERROR] Fetch package:", error.message);

    return res.status(500).json({
      message: "Unable to fetch travel package."
    });
  }
});

// =====================================
// CHECK PACKAGE AVAILABILITY
// =====================================
app.get("/availability/:packageId", (req, res) => {
  try {
    const packageId = Number(req.params.packageId);

    const travelPackage = packages.find(
      (item) => Number(item.id) === packageId
    );

    if (!travelPackage) {
      return res.status(404).json({
        message: "Travel package not found."
      });
    }

    return res.json({
      packageId: travelPackage.id,
      available: true,
      message: "Package is available."
    });
  } catch (error) {
    console.error("[ERROR] Check availability:", error.message);

    return res.status(500).json({
      message: "Unable to check package availability."
    });
  }
});

// =====================================
// ADMIN: ADD TRAVEL PACKAGE
// =====================================
app.post(
  "/packages",
  authenticateToken,
  requireAdmin,
  (req, res) => {
    try {
      const newPackage = {
        ...req.body,
        id: Math.max(
          0,
          ...packages.map((item) => Number(item.id) || 0)
        ) + 1
      };

      packages.push(newPackage);

      return res.status(201).json({
        message: "Package added successfully.",
        package: newPackage
      });
    } catch (error) {
      console.error("[ERROR] Add package:", error.message);

      return res.status(500).json({
        message: "Unable to add package."
      });
    }
  }
);

// =====================================
// ADMIN: UPDATE TRAVEL PACKAGE
// =====================================
app.put(
  "/packages/:id",
  authenticateToken,
  requireAdmin,
  (req, res) => {
    try {
      const packageId = Number(req.params.id);

      const index = packages.findIndex(
        (item) => Number(item.id) === packageId
      );

      if (index === -1) {
        return res.status(404).json({
          message: "Travel package not found."
        });
      }

      packages[index] = {
        ...packages[index],
        ...req.body,
        id: packages[index].id
      };

      return res.json({
        message: "Package updated successfully.",
        package: packages[index]
      });
    } catch (error) {
      console.error("[ERROR] Update package:", error.message);

      return res.status(500).json({
        message: "Unable to update package."
      });
    }
  }
);

// =====================================
// ADMIN: DELETE TRAVEL PACKAGE
// =====================================
app.delete(
  "/packages/:id",
  authenticateToken,
  requireAdmin,
  (req, res) => {
    try {
      const packageId = Number(req.params.id);

      const index = packages.findIndex(
        (item) => Number(item.id) === packageId
      );

      if (index === -1) {
        return res.status(404).json({
          message: "Travel package not found."
        });
      }

      const removedPackage = packages.splice(index, 1)[0];

      return res.json({
        message: "Package deleted successfully.",
        package: removedPackage
      });
    } catch (error) {
      console.error("[ERROR] Delete package:", error.message);

      return res.status(500).json({
        message: "Unable to delete package."
      });
    }
  }
);

// =====================================
// BOOKING HELPER FUNCTIONS
// =====================================
function formatBooking(row) {
  return {
    id: row.id,
    userId: row.user_id,
    ...(
      row.details && typeof row.details === "object"
        ? row.details
        : {}
    ),
    status: row.status,
    createdAt: row.created_at,
    cancelledAt: row.cancelled_at
  };
}

function cleanBookingDetails(body) {
  const details = { ...body };

  // These values are managed by the server/database.
  delete details.id;
  delete details.userId;
  delete details.user_id;
  delete details.status;
  delete details.createdAt;
  delete details.created_at;
  delete details.cancelledAt;
  delete details.cancelled_at;

  return details;
}

// Require authentication for all booking routes.
app.use("/bookings", authenticateToken);

// =====================================
// GET BOOKINGS FOR LOGGED-IN USER
// =====================================
app.get("/bookings", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, details, status, created_at, cancelled_at
       FROM bookings
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    return res.json(result.rows.map(formatBooking));
  } catch (error) {
    console.error("[ERROR] Fetch bookings:", error.message);

    return res.status(500).json({
      message: "Unable to fetch bookings."
    });
  }
});

// =====================================
// GET ONE BOOKING
// =====================================
app.get("/bookings/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, details, status, created_at, cancelled_at
       FROM bookings
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Booking not found."
      });
    }

    return res.json(formatBooking(result.rows[0]));
  } catch (error) {
    console.error("[ERROR] Fetch booking:", error.message);

    return res.status(500).json({
      message: "Unable to fetch booking."
    });
  }
});

// =====================================
// CREATE BOOKING
// =====================================
app.post("/bookings", async (req, res) => {
  try {
    const details = cleanBookingDetails(req.body);

    const result = await pool.query(
      `INSERT INTO bookings (user_id, details)
       VALUES ($1, $2::jsonb)
       RETURNING id, user_id, details, status, created_at, cancelled_at`,
      [req.user.id, JSON.stringify(details)]
    );

    console.log("[CREATE] Booking saved to Neon PostgreSQL.");

    return res.status(201).json({
      message: "Booking created successfully.",
      booking: formatBooking(result.rows[0])
    });
  } catch (error) {
    console.error("[ERROR] Create booking:", error.message);

    return res.status(500).json({
      message: "Unable to create booking."
    });
  }
});

// =====================================
// UPDATE BOOKING
// =====================================
app.put("/bookings/:id", async (req, res) => {
  try {
    const details = cleanBookingDetails(req.body);

    const result = await pool.query(
      `UPDATE bookings
       SET details = details || $1::jsonb
       WHERE id = $2
         AND user_id = $3
         AND status <> 'Cancelled'
       RETURNING id, user_id, details, status, created_at, cancelled_at`,
      [
        JSON.stringify(details),
        req.params.id,
        req.user.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Booking not found or cannot be updated."
      });
    }

    return res.json({
      message: "Booking updated successfully.",
      booking: formatBooking(result.rows[0])
    });
  } catch (error) {
    console.error("[ERROR] Update booking:", error.message);

    return res.status(500).json({
      message: "Unable to update booking."
    });
  }
});

// Support PATCH as well as PUT.
app.patch("/bookings/:id", async (req, res) => {
  try {
    const details = cleanBookingDetails(req.body);

    const result = await pool.query(
      `UPDATE bookings
       SET details = details || $1::jsonb
       WHERE id = $2
         AND user_id = $3
         AND status <> 'Cancelled'
       RETURNING id, user_id, details, status, created_at, cancelled_at`,
      [
        JSON.stringify(details),
        req.params.id,
        req.user.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Booking not found or cannot be updated."
      });
    }

    return res.json({
      message: "Booking updated successfully.",
      booking: formatBooking(result.rows[0])
    });
  } catch (error) {
    console.error("[ERROR] Patch booking:", error.message);

    return res.status(500).json({
      message: "Unable to update booking."
    });
  }
});

// =====================================
// CANCEL BOOKING
// =====================================
app.delete("/bookings/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE bookings
       SET status = 'Cancelled',
           cancelled_at = NOW()
       WHERE id = $1
         AND user_id = $2
         AND status <> 'Cancelled'
       RETURNING id, user_id, details, status, created_at, cancelled_at`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Booking not found or already cancelled."
      });
    }

    return res.json({
      message: "Booking cancelled successfully.",
      booking: formatBooking(result.rows[0])
    });
  } catch (error) {
    console.error("[ERROR] Cancel booking:", error.message);

    return res.status(500).json({
      message: "Unable to cancel booking."
    });
  }
});

// =====================================
// ADMIN: VIEW ALL BOOKINGS
// =====================================
app.get(
  "/admin/bookings",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, user_id, details, status, created_at, cancelled_at
         FROM bookings
         ORDER BY created_at DESC`
      );

      return res.json(result.rows.map(formatBooking));
    } catch (error) {
      console.error("[ERROR] Fetch all bookings:", error.message);

      return res.status(500).json({
        message: "Unable to fetch all bookings."
      });
    }
  }
);

// =====================================
// ROOT / API HEALTH CHECK
// =====================================
app.get("/", (req, res) => {
  return res.json({
    message: "TourBooking API is running."
  });
});

// =====================================
// SERVER STARTUP AND VERCEL EXPORT
// =====================================
if (!process.env.JWT_SECRET) {
  throw new Error(
    "Missing JWT_SECRET. Please configure it in your .env file."
  );
}

// Start the server locally.
// Vercel imports the Express app instead.
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(
      `REST API running on http://localhost:${PORT}`
    );
  });
}

export default app;
