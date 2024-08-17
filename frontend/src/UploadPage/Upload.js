import React, {useState} from "react";
import Navbar from "../Navbar";
import Dropzone from "./Dropzone";

const Upload = () => {
    const [selectedFile, setSelectedFile] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    }

    //handle file upload
    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus('Please select a file before uploading.');
            return
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://localhost:8000/upload/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('Upload Successful')
            }
            else {
                setUploadStatus('Upload Failed')
            }
        } catch (error) {
            setUploadStatus("Error Occured while Uploading");
            console.log("Upload Error:", error);
        }
    }
    return (
        <div>
            <Navbar/>
            <div className="dropZoneContainer">
                <h1 className="text-center">Drage and Drop Test</h1>
                <Dropzone />
            </div>
        </div>
    )
}

export default Upload