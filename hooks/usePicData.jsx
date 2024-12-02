'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function usePicData() {
    const [picData, setPicData] = useState(null);
    const [loading, setLoading] = useState(true);

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
        } catch (error) {
            console.error("Error fetching Pic data:", error);
        } finally {
            setLoading(false);
        }
    };

    return { picData, loading };
}
