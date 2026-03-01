const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("API Running");
});

const PersonSchema = new mongoose.Schema({
  name: String,
  role: String,
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Person",
    default: null
  }
});

const Person = mongoose.model("Person", PersonSchema);

app.post("/api/people", async (req, res) => {
  const person = await Person.create(req.body);
  res.json(person);
});

app.get("/api/people/children/:parentId", async (req, res) => {
  const parentId = req.params.parentId === "null" ? null : req.params.parentId;
  const children = await Person.find({ parentId });
  res.json(children);
});

app.get("/api/people/search/:name", async (req, res) => {
  const people = await Person.find({
    name: { $regex: req.params.name, $options: "i" }
  });
  res.json(people);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));