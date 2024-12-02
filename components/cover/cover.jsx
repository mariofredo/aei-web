'use client';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useState } from 'react';
import '../../styles/cover.scss';

export default function CoverImage({ cover }) {
    const [preview, setPreview] = useState(cover);
    const [uploading, setUploading] = useState(false); // Untuk menunjukkan status upload

        const handleFileChange = async (e) => {
            const file = e.target.files[0];

            if (file) {
                const fileURL = URL.createObjectURL(file); // Buat preview gambar
                setPreview(fileURL);

                // Mulai upload ke API
                const formData = new FormData();
                formData.append('file', file); // Pastikan sesuai dengan nama field di backend

                try {
                    setUploading(true); // Tampilkan status upload
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company/update-banner`, {
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

    return (
        <div className="section_cover_image">
            {preview ? (
                <Image src={preview} alt="Cover Image" width={1280} height={420} />
            ) : (
            <div className="upload_cover_btn">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading} // Matikan input saat sedang upload
                />
                <span>Upload image background</span>
            </div>
            )}
        </div>
    );
}
