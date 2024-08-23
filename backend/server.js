const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const path = require('path');
const uuid = require('uuid').v4;

dotenv.config();

const app = express();
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
        res.status(200).json({ url: data.Location });
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})