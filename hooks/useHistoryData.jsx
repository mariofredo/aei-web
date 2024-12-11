'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function useHistoryData() {
    const [historyData, setHistoryData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const isProfileCompleted = Cookies.get('is_profile_completed');

        if (isProfileCompleted === 'true') {
            fetchHistoryData();
        } else {
            console.log("Profile not completed, redirecting...");
            setLoading(false);
        }
    }, []);

    const fetchHistoryData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/event/history`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch Pic data");
            }
            const data = await response.json();
            setHistoryData(data.data.data);
            console.log("Pic data fetched:", data);
        } catch (error) {
            console.error("Error fetching Pic data:", error);
        } finally {
            setLoading(false);
        }
    };

    return { historyData, loading };
}
