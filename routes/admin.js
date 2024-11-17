const express = require("express");
const router = express.Router();
const Photo = require("../models/Photo");

router.get("/", async (req, res) => {
    try {
        const photos = await Photo.find();
        res.json(photos);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/", async (req, res) => {
    const { url, title, description } = req.body;
    try {
        const newPhoto = new Photo({ url, title, description });
        await newPhoto.save();
        res.json({ message: "Photo added successfully", photo: newPhoto });
    } catch (err) {
        res.status(500).json({ message: "Error saving photo" });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const photo = await Photo.findByIdAndDelete(id);
        if (photo) {
            res.json({ message: "Photo deleted successfully" });
        } else {
            res.status(404).json({ message: "Photo not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error deleting photo" });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const updatedPhoto = await Photo.findByIdAndUpdate(id, { title, description }, { new: true });
        if (updatedPhoto) {
            res.json({ message: "Photo updated successfully", photo: updatedPhoto });
        } else {
            res.status(404).json({ message: "Photo not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating photo" });
    }
});

module.exports = router;
