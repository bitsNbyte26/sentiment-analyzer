const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://Saiyam:SAIYAMcluster@cluster0.e08jnvv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Create a connection to MongoDB
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: 'uploads'
        };
    }
});

const upload = multer({ storage });

// Upload endpoint
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Unauthorized');
    }
    res.status(201).send('File uploaded successfully');
});

// Get files
router.get('/files', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Unauthorized');
    }
    gfs.files.find().toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }
        return res.json(files);
    });
});

module.exports = router;
