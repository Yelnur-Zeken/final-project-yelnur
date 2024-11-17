const express = require("express");
const router = express.Router();
const Photo = require("../models/Photo"); // Assuming a Photo model

// Route to handle photo submission via URL
router.post("/", async (req, res) => {
    try {
        const { title, description, photoUrl } = req.body; // Get data from form submission

        // Create new photo entry in the database
        const newPhoto = new Photo({
            title,
            description,
            url: photoUrl // Save the URL of the photo
        });

        await newPhoto.save(); // Save the photo to the database

        // Redirect back to the homepage to display the updated photo gallery
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error uploading photo");
    }
});

module.exports = router;
