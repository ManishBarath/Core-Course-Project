const dotenv = require("dotenv").config()
const express = require("express")
const app = express();
const { supabase } = require("./database");



 console.log(supabase)

 app.listen(3000);

 