const express = require("express")
const axios = require("axios")
const router = express.Router()
const {supabase} = require("../database")

router.post('/search', async (req, res) => {
  console.log(req.body.message)
  
  try {
    const response = await axios.post('http://localhost:5000/generate-sql', {
        query: req.body.message
    });
    console.log(response.data.ai_text)
    const query = response.data.ai_text.replace(';', "");
    console.log(query)
    const { data, error } = await supabase.rpc("run_raw_sql", { query: query });
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("Query results:", data);
    res.json(data)
    console.log('Query results:', res.rows);
} catch (error) {
    console.error("Error calling Flask API:", error.response ? error.response.data : error.message);
}
  });

  module.exports = router