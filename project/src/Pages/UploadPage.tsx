import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UploadPage.css';

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

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

    try {
      const response = await axios.post('http://localhost:3000/curd/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success("File uploaded successfully!");
      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      toast.error("Error occurred. Can't upload the file.");
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h2>Upload Your Excel File</h2>
        <div className="upload-form">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="file-input"
          />
          <button onClick={handleUpload} className="btn upload-btn">
            Upload
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UploadPage;