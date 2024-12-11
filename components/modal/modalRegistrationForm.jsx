'use client';
import React, { useState } from 'react';
import { useCompanyData } from '@/hooks';
import Cookies from 'js-cookie';

export default function ModalRegistrationForm({showPopup, setShowPopup , setCompanyData}) {
    if (!showPopup) return null;
    
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile); // Simpan file yang dipilih
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploadStatus('uploading');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company/upload-registration-form`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('success');
                alert('File uploaded successfully!');
                setFile(null); // Reset file input
                setShowPopup(false);
                setCompanyData((prevData) => ({
                    ...prevData,
                    status: 'in_review',
                }));
            } else {
                setUploadStatus('error');
                const errorData = await response.json();
                alert(`Failed to upload file: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            setUploadStatus('error');
            alert(`Error occurred: ${error.message}`);
        }
    };

    return (
        <div className="modal_wrapper registration_form">
            <div className="overlay" onClick={() => setShowPopup(false)}></div>
            <div className="modal_box">
                <h2>Upload Registration Form</h2>
                <p>
                    Please upload your registration form that <span className="red_text">already signed</span>
                </p>
                <div className="upload_box">
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        accept=".pdf"
                    />
                    <span>{file ? file.name : 'Choose PDF file'}</span>
                </div>
                <div
                    className={`green_btn ${uploadStatus === 'uploading' ? 'disabled' : ''}`}
                    onClick={handleUpload}
                >
                    {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
                </div>
            </div>
        </div>
    );
}
