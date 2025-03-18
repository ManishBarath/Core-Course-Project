const dotenv = require("dotenv").config();
const { supabase } = require("./database");

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// Mount your routers once
const curdRouter = require('./controller/curd');
app.use('/curd', curdRouter);

const searchRouter = require('./controller/search');
app.use('/search', searchRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

console.log("Supabase client:", supabase);
