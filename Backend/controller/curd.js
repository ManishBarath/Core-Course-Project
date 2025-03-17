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

        // Parse Excel file
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        let occurrenceData = [];
        let abundanceData = [];

        // Loop through each row from the Excel file
        for (let row of data) {
            const speciesName = row.Species;
            let speciesId;

            // Attempt to retrieve the species_id from the Species table
            let { data: speciesData, error: speciesError } = await supabase
                .from("species")
                .select("species_id")
                .eq("species_name", speciesName)
                .single();

            if (speciesError || !speciesData) {
                // If species not found, insert it
                let { data: newSpecies, error: newSpeciesError } = await supabase
                    .from("species")
                    .insert([{ species_name: speciesName }])
                    .select();
                if (newSpeciesError || !newSpecies || newSpecies.length === 0) {
                    return res.status(500).json({ error: "Error inserting species: " + newSpeciesError.message });
                }
                speciesId = newSpecies[0].species_id;
            } else {
                speciesId = speciesData.species_id;
            }

            // Prepare data for OccurrenceData
            occurrenceData.push({
                species_id: speciesId,
                catch_date: row.Date,
                latitude: row.Latitude,
                longitude: row.Longitude,
                depth: row.Depth,
                data_source: "app"  // or row.Data_Source if available
            });

            // Prepare data for AbundanceData if catch weight exists
            if (row["Catch Weight"] !== null && row["Catch Weight"] !== undefined) {
                abundanceData.push({
                    species_id: speciesId,
                    catch_date: row.Date,
                    latitude: row.Latitude,
                    longitude: row.Longitude,
                    depth: row.Depth,
                    catch_weight: row["Catch Weight"],
                    data_source: "app"
                });
            }
        }

        // Insert data into OccurrenceData table
        if (occurrenceData.length > 0) {
            const { error: occurrenceError } = await supabase.from("occurrencedata").insert(occurrenceData);
            if (occurrenceError) {
                return res.status(500).json({ error: occurrenceError.message });
            }
        }

        // Insert data into AbundanceData table
        if (abundanceData.length > 0) {
            const { error: abundanceError } = await supabase.from("abundancedata").insert(abundanceData);
            if (abundanceError) {
                return res.status(500).json({ error: abundanceError.message });
            }
        }

        res.json({
            message: "Data uploaded successfully",
            recordsInserted: occurrenceData.length + abundanceData.length,
            temp:data
        });
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});
module.exports = router;