'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function useLeadercData() {
    const [leaderData, setLeaderData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const isProfileCompleted = Cookies.get('is_profile_completed');

        if (isProfileCompleted === 'true') {
            fetchLeaderData();
        } else {
            console.log("Profile not completed, redirecting...");
            setLoading(false);
        }
    }, []);

    const fetchLeaderData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leader`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch Pic data");
            }
            const data = await response.json();
            setLeaderData(data.data.data);
            console.log("Pic data fetched:", data);
        } catch (error) {
            console.error("Error fetching Pic data:", error);
        } finally {
            setLoading(false);
        }
    };

    return { leaderData, loading };
}
