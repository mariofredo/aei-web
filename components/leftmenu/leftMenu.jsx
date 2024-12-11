'use client';
import Image from "next/image";
import { useState } from "react";
import Cookies from "js-cookie";
import "../../styles/leftMenu.scss";

export default function LeftMenu({hqAdress, officeAdress, logo }) {
    const [previewLogo, setPreviewLogo] = useState(logo);
    const [uploading, setUploading] = useState(false); // Untuk menunjukkan status upload

    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (file) {
            const fileURL = URL.createObjectURL(file); // Buat previewLogo gambar
            setPreviewLogo(fileURL);

            // Mulai upload ke API
            const formData = new FormData();
            formData.append('file', file); // Pastikan sesuai dengan nama field di backend

            try {
                setUploading(true); // Tampilkan status upload
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company/update-logo`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`, // Ambil token dari cookies
                    },
                    body: formData,
                });

                if (response.ok) {
                    alert('Banner berhasil diupdate!');
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Gagal mengupload banner.');
                }
            } catch (error) {
                console.error('Error uploading banner:', error);
                alert('Terjadi kesalahan saat mengupload banner. Coba lagi.');
            } finally {
                setUploading(false); // Sembunyikan status upload
            }
        }
    };

    return(
        <div className="section_left_menu">
            <div className="company_logo_box">
                {previewLogo ? (
                    <Image src={previewLogo} alt="Company Logo" width={215} height={215} />
                ) : (
                    <div className="upload_logo_btn">
                        <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading} // Matikan input saat sedang upload
                    />
                    <span>{uploading ? 'Uploading...' : 'Upload image background'}</span>
                    </div>
                )}
            </div>
            <div className="company_address_box">
                <h5>Address</h5>
                <div className="cab_ctr">
                    <h4>Headquarter</h4>
                    <p>{hqAdress}</p>
                </div>
                <div className="cab_ctr">
                    <h4>Management Office</h4>
                    <p>{officeAdress}</p>
                </div>
            </div>
        </div>
    )
}