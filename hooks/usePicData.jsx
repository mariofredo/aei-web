'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function usePicData() {
    const [picData, setPicData] = useState(null);
    const [loading, setLoading] = useState(true);
    const type = Cookies.get("type"); // Ambil tipe user dari Cookies
    const email = Cookies.get("email"); // Ambil email user dari Cookies

    useEffect(() => {
        const isProfileCompleted = Cookies.get('is_profile_completed');

        if (isProfileCompleted === 'true') {
        fetchPicData();
        } else {
            console.log("Profile not completed, redirecting...");
            setLoading(false);
        }
    }, []);

    const fetchPicData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company-pic`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch Pic data");
            }
            const data = await response.json();
            setPicData(data.data);
            console.log("Pic data fetched:", data);
            return data;
        } catch (error) {
            console.error("Error fetching Pic data:", error);
        } finally {
            setLoading(false);
        }
    };

    const addPicData = async (newPic) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company-pic`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
                body: JSON.stringify({pics:newPic}),
            });

            if (!response.ok) {
                throw new Error("Failed to add Pic data");
            }

            const data = await response.json();
            const list = await fetchPicData();
            return list;
            console.log("Pic data added:", data);
        } catch (error) {
            console.error("Error adding Pic data:", error);
        }
    };

    const deletePicData = async (id) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company-pic/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
    
            if (!response.ok) {
                throw new Error("Failed to delete Pic data");
            }
    
            console.log(`Pic with ID ${id} deleted successfully`);
    
            // Optionally, refresh the data after deletion
            fetchPicData();
        } catch (error) {
            console.error(`Error deleting Pic data with ID ${id}:`, error);
        }
    };

    const editPicData = async (id, updatedPic) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company-pic`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
                body: JSON.stringify({ id, ...updatedPic }), // Kirim ID bersama data yang diperbarui
            });
    
            if (!response.ok) {
                throw new Error("Failed to edit Pic data");
            }
    
            const data = await response.json();
            console.log(`Pic data with ID ${id} updated successfully:`, data);
    
            // Optionally, refresh the data after editing
            await fetchPicData();
        } catch (error) {
            console.error(`Error editing Pic data with ID ${id}:`, error);
        }
    };
    

    return { picData, loading, type, email, fetchPicData, addPicData, deletePicData, setPicData, editPicData };
}
