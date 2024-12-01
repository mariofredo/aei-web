'use client';
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { CoverImage, ModalRegistrationSuccess } from "@/components";

export default function Home() {
    const [companyData, setCompanyData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const isProfileCompleted = Cookies.get('is_profile_completed');

        // Cek apakah profil sudah selesai
        if (isProfileCompleted === 'true') {
            // Fetch data perusahaan
            fetchCompanyData();
        } else {
            console.log("Profile not completed, redirecting...");
            setLoading(false); // Berhenti loading jika tidak memerlukan fetch
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
            setCompanyData(data);
        } catch (error) {
            console.error("Error fetching company data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>; // Tampilkan loading indikator
    }
    return (
        <>
            <CoverImage cover={companyData.banner || null} />
            <>
            {companyData ? (
                <div>
                    <h2>{companyData.companyName}</h2>
                    <p>{companyData.about}</p>
                    {/* Render data lainnya */}
                </div>
            ) : (
                <p>No company data available.</p>
            )}</>
            <ModalRegistrationSuccess company={companyData.companyName} />
        </>
    );
}
