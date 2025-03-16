const express = require("express");

const dotenv = require("dotenv").config()
const { supabase } = require("./database");



const cors = require('cors')

const app = express();
const port = 3000;

// Set up Multer for file uploads

app.use(express.json())
// Endpoint to handle file uploads
const router1 = require('./controller/curd')
const router2 = require('./controller/search')
app.use('/curd',router1)
app.use('/api',router2)


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


 console.log(supabase)

 