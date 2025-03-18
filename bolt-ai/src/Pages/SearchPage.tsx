import React, { useState, useRef, useEffect } from 'react';
import './SearchPage.css';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as d3 from 'd3';

// Define SpeciesChartProps interface
interface SpeciesChartProps {
  data: any[];
}

// Species Chart Component using D3
const SpeciesChart: React.FC<SpeciesChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) return;
    
    // Clear any previous chart
    d3.select(chartRef.current).selectAll("*").remove();
    
    // Count species occurrences
    const speciesCounts: {[key: string]: number} = {};
    
    data.forEach(item => {
      // Try different possible property names for species data
      const species = item.species_name || item.Species || item.species_id || 
                     (typeof item.species_id === 'number' ? `Species ${item.species_id}` : "Unknown");
      speciesCounts[species] = (speciesCounts[species] || 0) + 1;
    });
    
    // Convert to array for D3
    const speciesData = Object.keys(speciesCounts).map(species => ({
      name: species,
      count: speciesCounts[species]
    }));
    
    // Set up dimensions
    const width = chartRef.current.clientWidth;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 80, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");
    
    // Create chart group
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Set up scales
    const xScale = d3.scaleBand()
      .domain(speciesData.map(d => d.name))
      .range([0, innerWidth])
      .padding(0.3);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(speciesData, d => d.count) || 0])
      .nice()
      .range([innerHeight, 0]);
    
    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "white")
      .text("Species Distribution");
    
    // Add X axis with rotated labels if needed
    const xAxis = g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));
    
    xAxis.selectAll("text")
      .style("fill", "white")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function() {
        // Only rotate text if we have many species
        return speciesData.length > 5 ? "rotate(-45)" : "rotate(0)";
      });
    
    // Add Y axis
    g.append("g")
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll("text")
      .style("fill", "white");
    
    // Add grid lines
    g.append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(yScale.ticks(5))
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", d => yScale(d))
      .attr("y2", d => yScale(d))
      .attr("stroke", "rgba(255, 255, 255, 0.1)");
    
    // Add bars with transition
    g.selectAll(".bar")
      .data(speciesData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.name) || 0)
      .attr("y", innerHeight)  // Start from bottom for animation
      .attr("width", xScale.bandwidth())
      .attr("height", 0)  // Start with height 0 for animation
      .attr("fill", "rgba(66, 153, 225, 0.8)")
      .attr("stroke", "rgba(66, 153, 225, 1)")
      .attr("stroke-width", 1)
      .transition()
      .duration(800)
      .attr("y", d => yScale(d.count))
      .attr("height", d => innerHeight - yScale(d.count));
    
    // Add bar value labels
    g.selectAll(".bar-label")
      .data(speciesData)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", d => (xScale(d.name) || 0) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.count) - 5)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "12px")
      .style("opacity", 0)  // Start invisible for animation
      .text(d => d.count)
      .transition()
      .duration(800)
      .style("opacity", 1);
    
  }, [data]);
  
  return (
    <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
  );
};

const SearchPage: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [showChart, setShowChart] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearchResults, setHasSearchResults] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!prompt.trim()) {
      toast.warn("Please type some prompt for search");
      return;
    }
    
    setIsSearching(true);
    setShowChart(false); // Hide any previous chart
    
    try {
      const response = await axios.post('http://localhost:3000/search/search', 
        { message: prompt },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setResults(response.data);
        setHasSearchResults(true);
        toast.success("Search completed successfully");
        console.log("Search results:", response.data);
      } else {
        setResults([]);
        setHasSearchResults(false);
        toast.info("No results found for your search");
      }
    } catch (error) {
      setResults([]);
      setHasSearchResults(false);
      toast.error("Error occurred in search.");
      console.error("Error in search:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDownload = () => {
    if (results.length === 0) {
      toast.warn("No results to download.");
      return;
    }
    
    try {
      const worksheet = XLSX.utils.json_to_sheet(results);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Search Results");
      XLSX.writeFile(workbook, "search_results.xlsx");
      toast.success("File downloaded successfully");
    } catch (error) {
      toast.error("Error downloading file");
      console.error("Download error:", error);
    }
  };

  const handleVisualize = () => {
    if (results.length === 0) {
      toast.warn("No results to visualize.");
      return;
    }
    
    try {
      setShowChart(true);
      toast.success("Data visualized!");
    } catch (error) {
      toast.error("Error visualizing data");
      console.error("Visualization error:", error);
    }
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <h2>Search & Explore</h2>
        <div className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your search query..."
              className="search-input"
              disabled={isSearching}
            />
          </div>
          
          <button 
            onClick={handleSearch} 
            className="btn" 
            disabled={isSearching || !prompt.trim()}
          >
            {isSearching ? (
              <>Searching<span className="loading"></span></>
            ) : 'Search'}
          </button>
          
          <div className={`action-buttons ${hasSearchResults ? 'visible' : ''}`}>
            <button 
              onClick={handleDownload} 
              className="btn" 
              disabled={!hasSearchResults}
            >
              Download
            </button>
            <button 
              onClick={handleVisualize} 
              className="btn" 
              disabled={!hasSearchResults}
            >
              Visualize
            </button>
          </div>
        </div>
        
        {showChart && results.length > 0 && (
          <div style={{ marginTop: '40px', padding: '10px', backgroundColor: '#333', borderRadius: '8px' }}>
            <SpeciesChart data={results} />
          </div>
        )}
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
};

export default SearchPage;
