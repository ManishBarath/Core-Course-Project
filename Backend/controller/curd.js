// ADMIN OR RESEARCHER CAN ACCESS THIS FILE

const express = require("express");
const { supabase } = require("../database");
const router = express.Router();

const multer = require("multer");
const xlsx = require("xlsx");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/hello", (req, res) => {
    res.send("HELLO");
});

router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log("✅ File received:", req.file.originalname);

        // Parse Excel file
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        console.log("📊 Parsed Data:", data);

        // Format and filter data
        const occurrenceData = [];
        const abundanceData = [];

        for (let row of data) {
            const formattedRow = {
                catch_date: row.Date,
                species: row.Species,
                latitude: row.Latitude,
                longitude: row.Longitude,
                depth: row.Depth
            };

            occurrenceData.push(formattedRow);

            // Only add to abundance if "Catch Weight" exists
            if (row["Catch Weight"] !== null && row["Catch Weight"] !== undefined) {
                abundanceData.push({
                    ...formattedRow,
                    catch_weight: row["Catch Weight"]
                });
            }
        }

        console.log("🔹 OccurrenceData:", occurrenceData.length, "records");
        console.log("🔹 AbundanceData:", abundanceData.length, "records");

        // Insert into OccurrenceData table
        if (occurrenceData.length > 0) {
           
            const { error: occurrenceError } = await supabase.from("OccurrenceData").insert(occurrenceData);
            
            if (occurrenceError) {
                
                return res.status(500).json({ error: occurrenceError.message });
            }
        }

        // Insert into AbundanceData table
        if (abundanceData.length > 0) {
            const { error: abundanceError } = await supabase.from("AbundanceData").insert(abundanceData);
            if (abundanceError) {
                return res.status(500).json({ error: abundanceError.message });
            }
        }

        res.json({ message: "Data uploaded successfully", recordsInserted: occurrenceData.length + abundanceData.length });
    } catch (error) {
        console.error("❌ Internal Server Error:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

module.exports = router;
