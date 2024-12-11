'use client';
import { useDownloadFile } from '@/hooks';
import { useState } from 'react';

export default function ModalRegistrationSuccess({company}) {
    const [showModal, setShowModal] = useState(true);
    const { downloadFile } = useDownloadFile();

    const closeModal = () => {
        setShowModal(false);
    }

    const handleDownload = () => {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/company/download-registration-form`;
        const filename = `${company}_Registration_Form.pdf`;
        downloadFile(url, filename);
    };

    return (
        <>
        {showModal && (
            <div className="modal_wrapper registration_success">
                <div className="overlay"></div>
                <div className="modal_box">
                    <h2>Registration Success</h2>
                    <p>Welcome to the Indonesian Public Listed Companies Association</p>
                    <h3>{company}</h3>
                    <p>Please download and sign the form bellow. Then <span className='red_text'>upload and send</span> the signed file to <span className='black_text'>AEI office</span> address to complete the registration</p>
                    <div className="download_pdf_btn" onClick={handleDownload}><span>{company} Registration Form.PDF</span></div>
                    <div className='green_btn' onClick={closeModal}>Okay</div>
                </div>
            </div>
        )}
        </>
    );
}