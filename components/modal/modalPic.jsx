'use client';
import { useState, useEffect } from 'react';
import { usePicData } from '@/hooks';

export default function ModalPic({ setShowPopupPic, setPicData }) {
    const { addPicData, picData = [] } = usePicData(); // Ambil fungsi addPicData dari hook
    const [picPosition, setPicPosition] = useState([]); // State to store pic position
    const [formData, setFormData] = useState({
        pics: [{ name: "", email: "", position: "", phone: "" }]
    });

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

    const addPic = () => {
        if (formData.pics.length < 2) {
            setFormData((prev) => ({
                ...prev,
                pics: [
                    ...prev.pics,
                    { name: "", position: "", phone: "", email: "" },
                ],
            }));
        } else {
            console.error("Maximum number of PICs reached.");
        }
    };
    const handleChange = (e) => {
        const [_, index, key] = e.target.name.split("-");
        const value = e.target.value;
        setFormData((prev) => {
            const updatedPics = [...prev.pics];
            updatedPics[index][key] = value;
            return { ...prev, pics: updatedPics };
        });
    };

    const removePic = (index) => {
        setFormData((prev) => {
            const updatedPics = prev.pics.filter((_, i) => i !== index);
            return { ...prev, pics: updatedPics };
        });
    };
    
    const handleSubmit = async () => {
        try {
            console.log(formData.pics);
            const {data} = await addPicData(formData.pics);
            setShowPopupPic(false); // Tutup popup setelah submit berhasil
            setPicData(data); // Update data PIC di parent component
            alert("PIC data has been successfully added.");
        } catch (error) {
            console.error("Failed to add PIC data:", error);
            alert("Failed to add PIC data. Please try again.");
        }
    };

    return (
        <div className="modal_wrapper pic">
            <div className="overlay" onClick={() => setShowPopupPic(false)}></div>
            <div className="modal_box">
                <div className="leaders_wrapper">
                    {formData.pics.map((pic, index) => (
                        <div key={index} className="leaders_box">
                            <h5>Person in charge {index + 1 + (picData?.length ?? 0)}</h5>
                            <div className="form_box">
                                <span className="title">PIC Name<i>*</i></span>
                                <input
                                    type="text"
                                    name={`pics-${index}-name`}
                                    value={pic.name}
                                    onChange={handleChange}
                                    placeholder="PIC's Name"
                                />
                            </div>
                            <div className="form_box">
                                <span className="title">Position<i>*</i></span>
                                <select
                                    name={`pics-${index}-position`}
                                    value={pic.position}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>
                                        Select PIC Position
                                    </option>
                                    {picPosition.map((picpos) => (
                                        <option key={picpos.id} value={picpos.id}>
                                            {picpos.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form_box">
                                <span className="title">PIC Mobile Number or Whatsapp<i>*</i></span>
                                <input
                                    type="tel"
                                    name={`pics-${index}-phone`}
                                    value={pic.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form_box">
                                <span className="title">PIC Email<i>*</i></span>
                                <input
                                    type="email"
                                    name={`pics-${index}-email`}
                                    value={pic.email}
                                    onChange={handleChange}
                                />
                            </div>
                            {formData.pics.length > 1 && (
                                <button
                                    className="remove_leader_btn"
                                    onClick={() => removePic(index)}
                                >
                                    Remove Pic
                                </button>
                            )}
                        </div>
                    ))}
                    {(picData?.length ?? 0) === 1 && formData.pics.length < 2 && (
                        <div className="add_leader_btn" onClick={addPic}>
                            Add Pic
                        </div>
                    )}
                    {(picData?.length ?? 0) === 2 && (
                        <></>
                    )}
                </div>
                <div className="button_wrapper">
                    <button className='grey_btn' onClick={() => setShowPopupPic(false)}>Back</button>
                    <button className='green_btn' onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
}
