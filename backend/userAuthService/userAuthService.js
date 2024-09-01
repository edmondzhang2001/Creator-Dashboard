const express = require('express');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();


const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 8002;
app.listen(PORT, () => {
    console.log(`User Authentication Service is running on port ${PORT}`)
})


