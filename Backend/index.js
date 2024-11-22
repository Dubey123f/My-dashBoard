


// const express = require("express");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// const cors = require("cors");
// const app = express();
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// dotenv.config();  // To use environment variables (such as database credentials)

// app.use(cors());
// app.use(express.json());

// // Connect to the database (MongoDB)
// mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Connected to the database"))
//   .catch(err => console.error("Failed to connect to the database:", err));

// // Define User Schema
// const userSchema = new mongoose.Schema({
//   username: String,
//   email: { type: String, unique: true },
//   password: String,
//   role: { type: String, default: "user" }
// });

// const User = mongoose.model("User", userSchema);

// const SECRET_KEY = process.env.SECRET_KEY || "E@v7+BcF#8uL3k!eP9n$V6lQ5wZsN2rTj7YhFwUp@c6X"; // Use environment variable for the secret key

// // Register route
// app.post("/api/register", async (req, res) => {
//   const { username, email, password, role } = req.body;

//   // Check if the email already exists
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return res.status(400).json({ message: "Email already in use" });
//   }

//   // Hash the password
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // Store the new user in the database
//   const newUser = new User({ username, email, password: hashedPassword, role });
//   await newUser.save();

//   res.status(201).json({ message: "User registered successfully" });
// });

// // Login route
// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;

//   // Find the user by email
//   const user = await User.findOne({ email });

//   if (!user) {
//     return res.status(400).json({ message: "User not found" });
//   }

//   // Compare the password
//   const isPasswordValid = await bcrypt.compare(password, user.password);

//   if (!isPasswordValid) {
//     return res.status(400).json({ message: "Invalid password" });
//   }

//   // Create the JWT token
//   const token = jwt.sign(
//     { id: user.id, email: user.email, role: user.role },
//     SECRET_KEY,
//     { expiresIn: "1h" }
//   );

//   res.status(200).json({ token });
// });

// // Middleware to verify JWT token
// const authenticateToken = (req, res, next) => {
//   const token = req.headers["authorization"]?.split(" ")[1]; // Get token from the 'Authorization' header

//   if (!token) {
//     return res.status(403).json({ message: "Token required" });
//   }

//   // Verify token
//   jwt.verify(token, SECRET_KEY, (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: "Invalid token" });
//     }
//     req.user = user; // Store user data in request
//     next();
//   });
// };

// // Admin-only route to manage users
// app.get("/api/users", authenticateToken, async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ message: "Access denied" });
//   }

//   const users = await User.find();
//   res.status(200).json(users);
// });

// // Add user management routes
// app.post("/api/users", authenticateToken, async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ message: "Access denied" });
//   }

//   const { username, email, password, role } = req.body;

//   // Check if the email already exists
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return res.status(400).json({ message: "Email already in use" });
//   }

//   // Hash the password
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // Add the new user to the database
//   const newUser = new User({ username, email, password: hashedPassword, role });
//   await newUser.save();

//   res.status(201).json({ message: "User added successfully", user: newUser });
// });

// // Update user route
// app.put("/api/users/:id", authenticateToken, async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ message: "Access denied" });
//   }

//   const userId = req.params.id;
//   const { username, email, role } = req.body;

//   const user = await User.findById(userId);
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   user.username = username || user.username;
//   user.email = email || user.email;
//   user.role = role || user.role;

//   await user.save();

//   res.status(200).json({ message: "User updated successfully", user });
// });

// // Delete user route
// app.delete("/api/users/:id", authenticateToken, async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ message: "Access denied" });
//   }

//   const userId = req.params.id;
//   const user = await User.findByIdAndDelete(userId);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   res.status(200).json({ message: "User deleted successfully" });
// });

// // Protected route (only accessible if the user is authenticated)
// app.get("/api/dashboard", authenticateToken, (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ message: "Access denied" });
//   }

//   res.status(200).json({ message: "Welcome to the admin dashboard" });
// });

// // Start the server
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();  

app.use(cors());  
app.use(express.json());

// Connect to the database (MongoDB)
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to the database"))
  .catch(err => console.error("Failed to connect to the database:", err));

// Define User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" }
});

const User = mongoose.model("User", userSchema);

const SECRET_KEY = process.env.SECRET_KEY || "E@v7+BcF#8uL3k!eP9n$V6lQ5wZsN2rTj7YhFwUp@c6X"; // Use environment variable for the secret key

// Register route
app.post("/api/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  // Check if the email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Store the new user in the database
  const newUser = new User({ username, email, password: hashedPassword, role });
  await newUser.save();

  res.status(201).json({ message: "User registered successfully" });
});

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Compare the password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid password" });
  }

  // Create the JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  // Return token and role in response
  res.status(200).json({ token, role: user.role });
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from the 'Authorization' header

  if (!token) {
    return res.status(403).json({ message: "Token required" });
  }

  // Verify token
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user; // Store user data in request
    next();
  });
};

// Route to get all users (accessible by any authenticated user)
app.get("/api/users", authenticateToken, async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json(users); // Return the users in response
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Admin-only route to manage users (Add, Update, Delete)
app.post("/api/users", authenticateToken, async (req, res) => {
  // if (req.user.role !== "admin") {
  //   return res.status(403).json({ message: "Access denied" });
  // }

  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword, role });
  await newUser.save();
  
  res.status(201).json({ message: "User added successfully", user: newUser });
});

// Update user route (only admin can update)
app.put("/api/users/:id", authenticateToken, async (req, res) => {


  const userId = req.params.id;
  const { username, email, role } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.username = username || user.username;
  user.email = email || user.email;
  user.role = role || user.role;

  await user.save();

  res.status(200).json({ message: "User updated successfully", user });
});

// Delete user route (only admin can delete)
app.delete("/api/users/:id", authenticateToken, async (req, res) => {


  const userId = req.params.id;
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ message: "User deleted successfully" });
});

// Protected route (only accessible if the user is authenticated)
app.get("/api/dashboard", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  res.status(200).json({ message: "Welcome to the admin dashboard" });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
