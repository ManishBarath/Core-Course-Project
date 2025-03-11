const express = require("express")
const router = express.router()

router.get('/search', async (req, res) => {
    // Extract query parameters (assuming they come from req.query)
    const {
      startDate,      // e.g., "2025-02-01"
      endDate,        // e.g., "2025-02-28"
      speciesName,    // e.g., "Spanish Mackerel"
      minLat,         // e.g., "10.0"
      maxLat,         // e.g., "20.0"
      minLon,         // e.g., "70.0"
      maxLon,         // e.g., "90.0"
      minCatchWeight, // e.g., "1.0"
      maxCatchWeight, // e.g., "15.0"
      minDepth,       // e.g., "5.0"
      maxDepth        // e.g., "50.0"
    } = req.query;
  
    // Validate that if one field of a pair is provided, the other must be too.
    if ((minLat && !maxLat) || (!minLat && maxLat)) {
      return res.status(400).json({ error: 'Both minimum and maximum latitude must be provided together.' });
    }
    if ((minLon && !maxLon) || (!minLon && maxLon)) {
      return res.status(400).json({ error: 'Both minimum and maximum longitude must be provided together.' });
    }
    if ((startDate && !endDate) || (!startDate && endDate)) {
      return res.status(400).json({ error: 'Both start date and end date must be provided together.' });
    }
    if ((minCatchWeight && !maxCatchWeight) || (!minCatchWeight && maxCatchWeight)) {
      return res.status(400).json({ error: 'Both minimum and maximum catch weight must be provided together.' });
    }
    if ((minDepth && !maxDepth) || (!minDepth && maxDepth)) {
      return res.status(400).json({ error: 'Both minimum and maximum depth must be provided together.' });
    }
  
    // Build the query for OccurrenceData with optional joins and filters.
    let query = supabase
      .from('OccurrenceData')
      // Assuming you want to join with Species to fetch the species name:
      .select(`*, Species(species_name)`);
  
    // Apply date range filter if provided.
    if (startDate && endDate) {
      query = query.gte('catch_date', startDate).lte('catch_date', endDate);
    }
  
    // Filter by species (if provided).
    // Note: You may need to resolve speciesName to species_id first. For simplicity, here we assume you can filter on the joined field.
    if (speciesName) {
      query = query.eq('Species.species_name', speciesName);
    }
  
    // Filter by latitude range.
    if (minLat && maxLat) {
      query = query.gte('latitude', parseFloat(minLat)).lte('latitude', parseFloat(maxLat));
    }
  
    // Filter by longitude range.
    if (minLon && maxLon) {
      query = query.gte('longitude', parseFloat(minLon)).lte('longitude', parseFloat(maxLon));
    }
  
    // Filter by catch weight range.
    if (minCatchWeight && maxCatchWeight) {
      query = query.gte('catch_weight', parseFloat(minCatchWeight)).lte('catch_weight', parseFloat(maxCatchWeight));
    }
  
    // Filter by depth range.
    if (minDepth && maxDepth) {
      query = query.gte('depth', parseFloat(minDepth)).lte('depth', parseFloat(maxDepth));
    }
  
    // Execute the query.
    const { data, error } = await query;
  
    if (error) {
      console.error("Supabase search error:", error);
      return res.status(500).json({ error: error.message });
    }
  
    res.json({ data });
  });
  