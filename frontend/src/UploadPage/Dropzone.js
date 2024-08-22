import React from "react";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import './Dropzone.css'

function Dropzone({ onFileSelected }) {
    const [fileList, setFileList] = useState([]);
    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                onFileSelected(acceptedFiles[0]);
            }
        },
        accept: 'video/*',
        multiple: false,
        noClick: true,
    });
    return (
        <div className="container">
            <div {...getRootProps ({ className: "dropzone" })}>
                <input className="input-zone" {...getInputProps()} />
                <p className ="dropzone-content">Drag’n’drop some files here, or click to select files</p>
                <button type="button" onClick={open} className="btn">
                    Click to select files
                </button>
            </div>
        </div>
    )
}

export default Dropzone;