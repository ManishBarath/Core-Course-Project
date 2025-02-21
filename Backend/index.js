const dotenv = require("dotenv").config()
const { supabase } = require("./database");
console.log("HELLO????????????????????????????????????????????????????")

const express = require("express");

const cors = require('cors')

const app = express();
const port = 3000;

// Set up Multer for file uploads


// Endpoint to handle file uploads
const router1 = require('./controller/curd')

app.use('/curd',router1)



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


console.log(supabase)