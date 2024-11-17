const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const authRouter = require("./routes/auth");
const axios = require("axios");
const router = express.Router();
const app = express();
const homeRouter = require('./routes/home'); 
const Photo = require("./models/Photo");
const adminRoutes = require("./routes/admin");
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://xxxonee:1nl5ZN7lGtLKdKSE@cluster0.einr1.mongodb.net/your-db-name', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', homeRouter); 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Use express-session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));
const financialRoutes = require('./routes/financial'); // Import the financial route
app.use(financialRoutes); // Use the route
const newsRoutes = require('./routes/news'); // Adjust the path as needed
app.use(newsRoutes);
const financialRoutesAdmin = require('./routes/financialAdmin'); // Import the financial route
app.use(financialRoutesAdmin); // Use the route
const newsRoutesAdmin = require('./routes/newsAdmin'); // Adjust the path as needed
app.use(newsRoutesAdmin);

// Static file serving for public assets like CSS, JavaScript, and HTML files
app.use(express.static(path.join(__dirname, "public")));
app.use("/photos", adminRoutes);
// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Serve the registration page
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html")); // Serve the login page
});
app.get('/admin', async (req, res) => {
    // Check if the user is logged in and has admin privileges
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/login'); // Redirect to login if not authorized
    }

    try {
        const photos = await Photo.find(); // Get photos from the database
        res.render("admin", { photos: photos }); // Render the admin.ejs page
    } catch (err) {
        console.error("Error fetching photos:", err);
        res.status(500).send("Server error");
    }
});
// Home route should only be accessible after login
// Home route should only be accessible after login
app.get("/home", async (req, res) => {
   

    const photos = await Photo.find(); // Get photos from the database
    res.render("home", { photos: photos }); // Send to the view
});

const uploadRouter = require("./routes/upload");  // Adjust the path accordingly
app.use(uploadRouter);  // Register the route

// Authentication Routes (Login and Registration)
app.use("/api", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
