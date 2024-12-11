'use client';
import { useState, useEffect } from 'react';
import { usePicData } from '@/hooks';
import Cookies from 'js-cookie';

export default function ModalEditPic({ showEditPopup, setShowEditPopup, data, setPicData }) {
    const { fetchPicData } = usePicData();
    const [picPosition, setPicPosition] = useState([]); // State to store pic positions
    const [name, setName] = useState('');
    const [positionId, setPositionId] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (data) {
            setName(data.name);
            setPositionId(data.positionId);
            setPhone(data.phone);
            setEmail(data.email);
        }
    }, [data]);

    useEffect(() => {
        // Fetch asset data from the API
        const fetchPicPosition = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/select/pic-position`);
                const data = await response.json();

                console.log("Fetched asset data:", data); // Log the fetched data to the console

                if (data.message === "success get data") {
                    setPicPosition(data.data); // Set the fetched assets into state
                } else {
                    console.error('Failed to fetch assets data');
                }
            } catch (error) {
                console.error('Error fetching assets:', error);
            }
        };

        fetchPicPosition(); // Call the function to fetch data on component mount
    }, []);

    const handleSubmit = async () => {
        try {
            const token = Cookies.get('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company-pic/${data.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, position: positionId, phone, email }),
            });

            if (response.ok) {
                alert('PIC updated successfully');
                setShowEditPopup(false);
                fetchPicData().then((data) => setPicData(data.data));
            } else {
                console.error('Failed to update PIC');
            }
        } catch (err) {
            console.error('An error occurred:', err);
        }
    };

    if (!showEditPopup) return null;

    return (
        <div className="modal_wrapper pic">
            <div className="overlay" onClick={() => setShowEditPopup(false)}></div>
            <div className="modal_box">
                <h5>Edit Person in Charge</h5>
                <div className="form_box">
                    <span className="title">PIC Name<i>*</i></span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="PIC's Name"
                    />
                </div>
                <div className="form_box">
                <span className="title">Position<i>*</i></span>
                    <select
                        name="position"
                        value={positionId}
                        onChange={(e) => {
                            console.log("Selected Value:", e.target.value);
                            setPositionId(e.target.value);
                        }}
                        required
                    >
                        <option value="" disabled>
                            Select Executive Position
                        </option>
                        {picPosition.map((picpos) => (
                            <option key={picpos.id} value={picpos.id}>
                                {picpos.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form_box">
                    <span className="title">Phone<i>*</i></span>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="PIC's Phone"
                    />
                </div>
                <div className="form_box">
                    <span className="title">Email<i>*</i></span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="PIC's Email"
                    />
                </div>
                <div className="button_wrapper">
                    <button className='grey_btn' onClick={() => setShowEditPopup(false)}>Back</button>
                    <button className='green_btn' onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
}