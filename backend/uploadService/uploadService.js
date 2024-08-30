const express = require('express');
const cors = require('cors');
const multer = require('multer');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const path = require('path');
const uuid = require('uuid').v4;
const axios = require('axios');

const GRAPH_API_VERSION = 'v20.0';

dotenv.config();

const app = express();

app.use(cors());

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})


const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    const fileExtension = path.extname(file.originalname);
    const uniqueFilename = `${uuid()}${fileExtension}`;
    

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: uniqueFilename,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    s3.upload(params, (err, data) => {
        if (err) {
            return res.status(500).send(err);
        }
        const { description, coverUrl } = req.body;

        try {
            const response = axios.post('http://localhost:8001/post-reel/', {
                videoUrl: data.Location,
                description,
                coverUrl,
            })
            res.status(200).json(response.data);
        }
        catch (err) {
            res.status(500).json({error: err.message})
        }

        
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})