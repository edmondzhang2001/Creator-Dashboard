import React, {useState} from "react";
import Navbar from "../Navbar";
import Dropzone from "./Dropzone";

const Upload = () => {
    const [selectedFile, setSelectedFile] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('');

    // Default coverUrl and description
    const defaultCoverUrl = "https://example.com/default-cover.jpg";
    const defaultDescription = "This is the default description for the video.";

    const handleFileChange = (file) => {
        setSelectedFile(file);
        setUploadProgress(0);
        setUploadStatus('');
    }

    //handle file upload
    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus('Please select a file before uploading.');
            return
        }


        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('coverUrl', defaultCoverUrl); //set default cover url
            formData.append('description', defaultDescription); // set default description

            const xhr = new XMLHttpRequest();

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded * 100) / event.total);
                    setUploadProgress(progress);
                }
            };

            xhr.open('POST', 'http://localhost:8000/upload/');

            xhr.onload = () => {
                if (xhr.status == 200) {
                    setUploadStatus('Upload Successful');
                }
                else {
                    setUploadStatus('Upload Failed');
                }
            }

            xhr.onerror = () => {
                setUploadStatus('Error Occurred');
            }

            xhr.send(formData);

        } catch (error) {
            setUploadStatus("Error Occured while Uploading");
            console.log("Upload Error:", error);
        }
    }
    return (
        <div>
            <Navbar/>
            <div className="dropZoneContainer">
                <h1 className="text-center">Upload Video</h1>
                <Dropzone onFileSelected={handleFileChange}/>
                {selectedFile && (
                    <div>
                        <p><strong>{selectedFile.name}</strong> - {selectedFile.size} bytes</p>
                        <progress value={uploadProgress} max="100">{uploadProgress}</progress>
                        <div>Status: {uploadStatus}</div>
                    </div>
                )}
                <button onClick={handleUpload} disabled={!selectedFile}>Upload to S3</button>
            </div>
        </div>
    )
}

export default Upload