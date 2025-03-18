import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UploadPage.css';

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warn("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    setIsUploading(true);
    
    try {
      // Use the correct endpoint based on your server configuration
      const response = await axios.post('http://localhost:3000/curd/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success("File uploaded successfully!");
      
      // Show more detailed success message if available
      if (response.data.recordsInserted) {
        toast.info(`Processed ${response.data.recordsInserted.occurrence} occurrence records and ${response.data.recordsInserted.abundance} abundance records.`);
      }
      
      // Reset the file input
      setFile(null);
      if (document.querySelector<HTMLInputElement>('input[type="file"]')) {
        (document.querySelector('input[type="file"]') as HTMLInputElement).value = '';
      }
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(`Upload failed: ${error.response.data.error || "Unknown error"}`);
      } else {
        toast.error("Error occurred. Can't upload the file.");
      }
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h2>Upload Your Excel File</h2>
        <div className="upload-form">
        <label htmlFor="file-upload" className="file-input" style={{ opacity: isUploading ? 0.7 : 1 }}>
            <input
              id="file-upload"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              disabled={isUploading}
            />
            <div className="upload-prompt">
              {file ? file.name : "Click or drag to select an Excel file"}
            </div>
          </label>
          <button 
            onClick={handleUpload} 
            className="upload-btn"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default UploadPage;