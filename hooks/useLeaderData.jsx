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
                throw new Error("Failed to fetch Leader data");
            }
            const data = await response.json();
            setLeaderData(data.data.data);
            console.log("Leader data fetched:", data);
            return data.data;
        } catch (error) {
            console.error("Error fetching Leader data:", error);
        } finally {
            setLoading(false);
        }
    };

    const addLeaderData = async (newLeader) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leader`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
                body: JSON.stringify({leaders:newLeader}),
            });

            if (!response.ok) {
                throw new Error("Failed to add Leader data");
            }

            const data = await response.json();
            const list = await fetchLeaderData();
            return list;
            console.log("Leader data added:", data);
        } catch (error) {
            console.error("Error adding Leader data:", error);
        }
    };

    const deleteLeaderData = async (id) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leader/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
    
            if (!response.ok) {
                throw new Error("Failed to delete Leader data");
            }
    
            console.log(`Leader with ID ${id} deleted successfully`);
    
            // Optionally, refresh the data after deletion
            fetchLeaderData();
        } catch (error) {
            console.error(`Error deleting Pic data with ID ${id}:`, error);
        }
    };
    const editLeaderData = async (id, updatedLeader) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leader`, {
            method: "POST", // Menggunakan POST
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
            body: JSON.stringify({ id, ...updatedLeader }), // Menyertakan ID di payload
        });

        if (!response.ok) {
            throw new Error("Failed to edit Leader data");
        }

        const data = await response.json();
        console.log(`Leader with ID ${id} updated successfully:`, data);

        // Muat ulang data setelah berhasil
        fetchLeaderData();
        return data;
    } catch (error) {
        console.error(`Error editing Leader data with ID ${id}:`, error);
    }
};


    return { leaderData, loading, fetchLeaderData, addLeaderData, deleteLeaderData, setLeaderData};
}
