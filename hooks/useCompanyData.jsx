'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function useCompanyData() {
    const [companyData, setCompanyData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const isProfileCompleted = Cookies.get('is_profile_completed');

        if (isProfileCompleted === 'true') {
            fetchCompanyData();
        } else {
            console.log("Profile not completed, redirecting...");
            setLoading(false);
        }
    }, []);

    const fetchCompanyData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch company data");
            }
            const data = await response.json();
            // Format the listingDate
            if (data.data.ipoAdmissionDate) {
                data.data.ipoAdmissionDate = formatDate(data.data.ipoAdmissionDate);
            }
            setCompanyData(data.data);
            console.log("Company data fetched:", data);
        } catch (error) {
            console.error("Error fetching company data:", error);
        } finally {
            setLoading(false);
        }
    };
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const month = monthNames[date.getMonth()]; // Get month name
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    return { companyData, loading };
}
