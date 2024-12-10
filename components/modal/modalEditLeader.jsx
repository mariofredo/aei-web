'use client';
import { useState, useEffect } from 'react';
import { useLeaderData } from '@/hooks';
import Cookies from 'js-cookie';

export default function ModalEditLeader({ showEditLeaderPopup, setShowEditLeaderPopup, data, setLeaderData }) {
    const [directorsPosition, setDirectorsPosition] = useState([]); // State to store director positions
    const {fetchLeaderData} = useLeaderData();
    const [isOtherSelected, setIsOtherSelected] = useState(false);
    const [name, setName] = useState('');
    const [positionId, setPositionId] = useState('');
    const [positionName, setPositionName] = useState('');
    const [title, setTitle] = useState('');
    const [otherPosition, setOtherPosition] = useState('');

    useEffect(() => {
        console.log("Data:", data);
        if (data) {
            setName(data.name);
            // setPositionId(data.positionId);
            // setPositionName(data.positionName);
            setTitle(data.title);
            // setOtherPosition(data.otherPosition);
            console.log("Data:", data);
        }
    }, [data]);
    

    useEffect(() => {
        // Fetch asset data from the API
        const fetchDirectorsPosition = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/select/director-position`);
                const responseData = await response.json();

                console.log("Fetched asset data:", responseData); // Log the fetched data to the console

                if (responseData.message === "success get data") {
                    setDirectorsPosition(responseData.data); // Set the fetched assets into state
                    
                    const findPosition = responseData.data.find((pos) => pos.id === data.positionId);
                    console.log("Find Position:", findPosition);
                    if (findPosition) {
                        setPositionId(findPosition.id);
                        setPositionName(findPosition.name);
                    }else{
                        setIsOtherSelected(true);
                        setPositionId("others");
                        setOtherPosition(data.positionName);
                    }
                } else {
                    console.error('Failed to fetch assets data');
                }
            } catch (error) {
                console.error('Error fetching assets:', error);
            }
        };

        fetchDirectorsPosition(); // Call the function to fetch data on component mount
    }, []);

    const handleSelectChange = (e) => {
        const { name, value } = e.target;

        // Tampilkan input tambahan jika "Others" dipilih
        if (value === "others") {
            setIsOtherSelected(true);
        } else {
            setIsOtherSelected(false);
        }
    };

    const handleSubmit = async () => {
        try {
            const token = Cookies.get('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leader/${data.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, name, position: positionId === "others" ? otherPosition : positionId }),
            });

            if (response.ok) {
                alert('Leader updated successfully');
                setShowEditLeaderPopup(false);
                fetchLeaderData().then((data) => setLeaderData(data.data));
            } else {
                console.error('Failed to update Leader');
            }
        } catch (err) {
            console.error('An error occurred:', err);
        }
    };

    if (!showEditLeaderPopup) return null;

    return (
        <div className="modal_wrapper pic">
            <div className="overlay" onClick={() => setShowEditLeaderPopup(false)}></div>
            <div className="modal_box">
                <h5>Edit Leader</h5>
                <div className="form_box">
                    <span className="title">Title<i>*</i></span>
                    <div className="radio_box">
                        <div className="radio_ctr">
                            <input
                                type="radio"
                                name={title}
                                value="Mr"
                                checked={title === "Mr"}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <span>Mr</span>
                        </div>
                        <div className="radio_ctr">
                            <input
                                type="radio"
                                name={title}
                                value="Mrs"
                                checked={title === "Mrs"}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <span>Mrs</span>
                        </div>
                    </div>
                </div>
                <div className="form_box">
                    <span className="title">Board of Executive Name<i>*</i></span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Leader's Name"
                    />
                </div>
                <div className="form_box">
                    <span className="title">Position<i>*</i></span>
                        <select
                            name="position"
                            value={positionId}
                            onChange={(e) => {
                                console.log("Selected Value:", e.target.value);
                                if(e.target.value === "others")
                                    setIsOtherSelected(true);
                                else
                                    setIsOtherSelected(false);                              
                                setPositionId(e.target.value);
                            }}
                            required
                        >
                            <option value="" disabled>
                                Select Leader Position
                            </option>
                            {directorsPosition.map((directorpos) => (
                                <option key={directorpos.id} value={directorpos.id}>
                                    {directorpos.name}
                                </option>
                            ))}
                            <option value="others">Others</option>
                        </select>
                        {isOtherSelected && (
                            <input
                                type="text"
                                name="other poisition"
                                value={otherPosition}
                                onChange={(e) => setOtherPosition(e.target.value)}
                                placeholder="Specify Other Position"
                            />
                        )}
                </div>
                <div className="button_wrapper">
                    <button className='grey_btn' onClick={() => setShowEditLeaderPopup(false)}>Back</button>
                    <button className='green_btn' onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
}