'use client';
import { useState } from 'react';
import Cookies from 'js-cookie';

export default function useDownloadFile() {
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadFile = async (url, filename) => {
        setIsDownloading(true);
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to download the file');
            }

            const blob = await response.blob();
            const fileUrl = window.URL.createObjectURL(blob);

            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(fileUrl);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download the file. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    return { isDownloading, downloadFile };
}
