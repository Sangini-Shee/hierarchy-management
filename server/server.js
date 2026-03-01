const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ======================
   CORS CONFIG (PRODUCTION SAFE)
====================== */

const allowedOrigins = [
  "https://hierarchy-management-one.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// Handle preflight
app.options("*", cors());

app.use(express.json());

/* ======================
   MONGODB CONNECTION
====================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

/* ======================
   ROOT ROUTE
====================== */

app.get("/", (req, res) => {
  res.send("API Running");
});

/* ======================
   SCHEMA
====================== */

const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Person",
    default: null
  }
});

const Person = mongoose.model("Person", PersonSchema);

/* ======================
   CREATE PERSON
====================== */

app.post("/api/people", async (req, res) => {
  try {
    const person = await Person.create(req.body);
    res.json(person);
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ error: "Failed to create person" });
  }
});

/* ======================
   GET CHILDREN
====================== */

app.get("/api/people/children/:parentId", async (req, res) => {
  try {
    const { parentId } = req.params;

    let filter = {};

    if (!parentId || parentId === "null") {
      filter.parentId = null;
    } else {
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return res.status(400).json({ error: "Invalid parentId" });
      }

      filter.parentId = new mongoose.Types.ObjectId(parentId);
    }

    const children = await Person.find(filter);
    return res.json(children);

  } catch (err) {
    console.error("Children route crash:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* ======================
   SEARCH PEOPLE
====================== */

app.get("/api/people/search/:name", async (req, res) => {
  try {
    const people = await Person.find({
      name: { $regex: req.params.name, $options: "i" }
    });

    res.json(people);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

/* ======================
   START SERVER
====================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});