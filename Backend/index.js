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

async function createUser() {
    const { data, error } = await supabase.from("users").insert([
        {
          username: "john_doe",
          email: "johndoe@example.com",
          password_hash: "hashedpassword123"
        }
      ]);
    if (error) {
        console.error("Error inserting user:", JSON.stringify(error, null, 2));
    } else {
        console.log("User created successfully:", data);
    }
}

// createUser();


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


 console.log(supabase)

 