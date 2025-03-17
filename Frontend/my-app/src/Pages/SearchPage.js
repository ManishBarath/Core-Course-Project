import React, { useState } from 'react';
import './SearchPage.css';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import SheetJS for Excel export
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SearchPage = () => {
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState([]); // State to hold search results

  const handleSearch = async () => {
    if (!prompt.trim()) {
      toast.warn("Please type some prompt for search");
      return;
    }

    try {
      // Use axios.post and pass the prompt in the request body as JSON
      const response = await axios.post('http://localhost:3000/search/search', 
        { message: prompt },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      // Save the search results in state
      setResults(response.data);
      toast.success("Now, you can download");
      console.log("Search results:", response.data);
    } catch (error) {
      toast.error("Error occurred in search.");
      console.error("Error in search:", error);
    }
    console.log('Searching for:', prompt);
  };

  const handleDownload = () => {
    if (results.length === 0) {
      toast.warn("Please perform a search first to download results.");
      return;
    }
    
    // Convert the JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(results);
    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Search Results");
    // Generate an Excel file and trigger the download
    XLSX.writeFile(workbook, "search_results.xlsx");
  };

  const handleVisualize = () => {
    console.log('Visualize action');
    // Implement visualization logic as needed
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <h2>Search & Explore</h2>
        <div className="search-form">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your search query..."
            className="search-input"
          />
          <div className="search-buttons">
            <button onClick={handleSearch} className="btn">
              Search
            </button>
            <button onClick={handleDownload} className="btn">
              Download
            </button>
            <button onClick={handleVisualize} className="btn">
              Visualize
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SearchPage;
