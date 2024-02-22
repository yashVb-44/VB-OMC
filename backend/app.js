const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path')
require('dotenv').config();



const apiRoutes = require('./api_routes');

const axios = require('axios');


const app = express();
app.use(cors());
app.use(express.json());
express.urlencoded({ extended: true })
app.use(bodyParser.json())
app.use(express.static('static'))

mongoose
    .connect(process.env.DATABASE_URL, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB: ', error);
    });

// app.use(express.static(path.join(__dirname, '../admin/build')));

// const port = process.env.PORT;
const port = process.env.PORT;
const ipAddress = process.env.IP_ADDRESS;

app.use("/imageUploads", express.static("imageUploads"));

app.use("/api", apiRoutes);

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../admin/build/index.html'));
// });

app.listen(port, () => {
    console.log(`Server listening on ${ipAddress}:${port}`);
});


