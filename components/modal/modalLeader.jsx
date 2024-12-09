'use client';
import { useState, useEffect } from 'react';
import { useLeaderData } from '@/hooks';

export default function ModalLeader({ setShowPopupLeader, setLeaderData }) {
    const { addLeaderData, leaderData = [] } = useLeaderData(); // Ambil fungsi addLeaderData dari hook
    const [leadersPosition, setDirectorsPosition] = useState([]); // State to store director positions
    const [isOtherSelected, setIsOtherSelected] = useState(false);
    const [formData, setFormData] = useState({
        leaders: [
            { title: "", name: "", position: "", otherPosition: "" }
        ]
    });

    useEffect(() => {
        // Fetch asset data from the API
        const fetchDirectorsPosition = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/select/director-position`);
                const data = await response.json();

                console.log("Fetched asset data:", data); // Log the fetched data to the console

                if (data.message === "success get data") {
                    setDirectorsPosition(data.data); // Set the fetched assets into state
                } else {
                    console.error('Failed to fetch assets data');
                }
            } catch (error) {
                console.error('Error fetching assets:', error);
            }
        };

        fetchDirectorsPosition(); // Call the function to fetch data on component mount
    }, []);

    const addLeader = () => {
        setFormData((prev) => ({
            ...prev,
            leaders: [
                ...prev.leaders,
                { title: "", name: "", position: "", otherPosition: ""  },
            ],
        }));
    };

    const removeLeader = (indexToRemove) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            leaders: prevFormData.leaders.filter(
                (_, index) => index !== indexToRemove // Hapus leader berdasarkan index
            ),
        }));
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        const [arrayName, index, field] = name.split('-'); // Pecah name menjadi bagian-bagian
        const updatedDirectors = [...formData.leaders];
        updatedDirectors[parseInt(index)][field] = value; // Pastikan index adalah angka
        setFormData({
            ...formData,
            leaders: updatedDirectors,
        });
    };
    const handleSelectChange = (e) => {
        const { name, value } = e.target;

        // Update pilihan dalam dropdown
        handleChange(e);

        // Tampilkan input tambahan jika "Others" dipilih
        if (value === "others") {
            setIsOtherSelected(true);
        } else {
            setIsOtherSelected(false);
        }
    };
    const handleSubmit = async () => {
        // // Cek dan ganti posisi jika 'others' dipilih
        const updatedFormData = formData.leaders.map((director) => {
            if (director.position === "others" && director.otherPosition) {
                // Ganti nilai position dengan value dari otherPosition
                director.position = director.otherPosition;
            }
            return director;
        });

        // Perbarui formData dengan nilai yang sudah diperbarui
        const updatedData = { ...formData, leaders: updatedFormData };
        try {
            console.log(formData.leaders);
            const {data} = await addLeaderData(formData.leaders);
            setShowPopupLeader(false); // Tutup popup setelah submit berhasil
            console.log(data, 'data test');
            setLeaderData(data); // Update data leader di parent component
            alert("leader data has been successfully added.");
        } catch (error) {
            console.error("Failed to add leader data:", error);
            alert("Failed to add leader data. Please try again.");
        }
    };

    return (
        <div className="modal_wrapper leader">
            <div className="overlay" onClick={() => setShowPopupLeader(false)}></div>
            <div className="modal_box">
                <div className="leaders_wrapper">
                    {formData.leaders.map((leader, index) => (
                        <div key={index} className="leaders_box">
                            <h5>Leader {index + 1 + (leaderData?.length ?? 0)}</h5>
                            <div className="form_box">
                                <span className="title">
                                    Title<i>*</i>
                                </span>
                                <div className="radio_box">
                                    <div className="radio_ctr">
                                        <input
                                            type="radio"
                                            name={`leaders-${index}-title`}
                                            value="Mr"
                                            checked={leader.title === "Mr"}
                                            onChange={handleChange}
                                        />
                                        <span>Mr</span>
                                    </div>
                                    <div className="radio_ctr">
                                        <input
                                            type="radio"
                                            name={`leaders-${index}-title`}
                                            value="Mrs"
                                            checked={leader.title === "Mrs"}
                                            onChange={handleChange}
                                        />
                                        <span>Mrs</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form_box">
                                <span className="title">Full Name<i>*</i></span>
                                <input
                                    type="text"
                                    name={`leaders-${index}-name`}
                                    value={leader.name}
                                    onChange={handleChange}
                                    placeholder="Leader's Name"
                                />
                            </div>
                            <div className="form_box">
                                <span className="title">Position<i>*</i></span>
                                <select
                                    name={`leaders-${index}-position`}
                                    value={leader.position}
                                    onChange={handleSelectChange}
                                    required
                                >
                                    <option value="" disabled>
                                        Select Leader Position
                                    </option>
                                    {leadersPosition.map((directorpos) => (
                                        <option key={directorpos.id} value={directorpos.id}>
                                            {directorpos.name}
                                        </option>
                                    ))}
                                    <option value="others">Others</option>
                                </select>
                                {isOtherSelected && (
                                    <input
                                        type="text"
                                        name={`leaders-${index}-otherPosition`}
                                        value={leader.otherPosition}
                                        onChange={handleChange}
                                        placeholder="Specify Other Position"
                                    />
                                )}
                            </div>
                            {formData.leaders.length > 1 && (
                                <button
                                    className="remove_leader_btn"
                                    onClick={() => removeLeader(index)}
                                >
                                    Remove Leader
                                </button>
                            )}
                        </div>
                    ))}
                    <div className="add_leader_btn" onClick={addLeader}>
                        Add Leader
                    </div>
                </div>
                <div className="button_wrapper">
                    <button className='grey_btn' onClick={() => setShowPopupLeader(false)}>Back</button>
                    <button className='green_btn' onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
}
