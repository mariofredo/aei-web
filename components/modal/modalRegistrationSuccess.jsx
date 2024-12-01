'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ModalRegistrationSuccess({company}) {
    const [showModal, setShowModal] = useState(true);
    const closeModal = () => {
        setShowModal(false);
    }

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
                    <Link href="/" className="download_pdf_btn"><span>{company} Registration Form.PDF</span></Link>
                    <div className='green_btn' onClick={closeModal}>Okay</div>
                </div>
            </div>
        )}
        </>
    );
}