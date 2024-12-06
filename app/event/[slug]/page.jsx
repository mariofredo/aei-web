'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Untuk navigasi
import Image from "next/image";
import Cookies from "js-cookie";

export default function EventDetail({ params }) {
    const { slug } = params;
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const fetchEventData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/event/${slug}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch event data");
            }
            const data = await response.json();
            setEvent(data.data); // Asumsi event ada di `data.data`
        } catch (err) {
            console.error("Error fetching event data:", err);
            setError("Failed to fetch event details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventData();
    }, [slug]);

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    if (loading) {
        return <p>Loading event details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!event) {
        return <p>Event not found.</p>;
    }

    return (
        <div className="event_detail">
            <h1>{event.title}</h1>
            <Image
                src={event.imageCover || '/default-image.jpg'}
                alt={event.title || 'Event Image'}
                width={800}
                height={400}
            />
            <p>{event.description}</p>
            <p>
                Date:{" "}
                {event.date ? formatDate(event.date) : "Date not available"}
            </p>
            <p>Location: {event.location || "Location not available"}</p>
        </div>
    );
}
