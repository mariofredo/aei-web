'use client';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import '../../../styles/completeProfile.scss';

export default function CompleteProfile(){
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: "",
        officePhone: "",
        companyName: "",
        stockCode: "",
        ipoAdmissionDate: "",
        asset: "",
        headquarterAddress: "",
        managementOfficeAddress: "",
        about: "",
        website: "",
        subSector: "",
        industryClassification: 1,
        directors: [
            { title: "", name: "", position: 1 }
        ],
        pics: [{ name: "", email: "", position: 1, phone: "" }]
    });
    const [assets, setAssets] = useState([]); // State to store company assets
    const [directorsPosition, setDirectorsPosition] = useState([]); // State to store director positions
    const [industryClassification, setIndustryClassification] = useState([]); // State to store industry classification
    const [picPosition, setPicPosition] = useState([]); // State to store pic position
    const router = useRouter(); // For navigation after login

    const handleNext = () => {
        // const errors = validateStep(step);
        // if (errors.length > 0) {
        //     alert(`Please fill in the following fields:\n- ${errors.join("\n- ")}`);
        //     return;
        // }
        if (step < 4) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('directors')) {
            const [arrayName, index, field] = name.split('-'); // Pecah name menjadi bagian-bagian
            const updatedDirectors = [...formData.directors];
            updatedDirectors[parseInt(index)][field] = value; // Pastikan index adalah angka
            setFormData({
                ...formData,
                directors: updatedDirectors,
            });
        } else if (name.startsWith('pics')) {
            const [arrayName, index, field] = name.split('-'); // Pecah name menjadi bagian-bagian
            const updatedPics = [...formData.pics];
            updatedPics[parseInt(index)][field] = value; // Pastikan index adalah angka
            setFormData({
                ...formData,
                pics: updatedPics,
            });
        }
        else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };
    

    useEffect(() => {
        // Fetch asset data from the API
        const fetchAssets = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/select/company-asset`);
                const data = await response.json();

                console.log("Fetched asset data:", data); // Log the fetched data to the console

                if (data.message === "success get data") {
                    setAssets(data.data); // Set the fetched assets into state
                } else {
                    console.error('Failed to fetch assets data');
                }
            } catch (error) {
                console.error('Error fetching assets:', error);
            }
        };

        fetchAssets(); // Call the function to fetch data on component mount
    }, []);

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

    useEffect(() => {
        // Fetch asset data from the API
        const fetchIndustryClassification = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/select/industry-classification`);
                const data = await response.json();

                console.log("Fetched asset data:", data); // Log the fetched data to the console

                if (data.message === "success get data") {
                    setIndustryClassification(data.data); // Set the fetched assets into state
                } else {
                    console.error('Failed to fetch assets data');
                }
            } catch (error) {
                console.error('Error fetching assets:', error);
            }
        };

        fetchIndustryClassification(); // Call the function to fetch data on component mount
    }, []);

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

    // const validateStep = (currentStep) => {
    //     const errors = [];
    //     switch (currentStep) {
    //         case 1:
    //             if (!formData.email) errors.push("Company Email");
    //             if (!formData.officePhone) errors.push("Company Phone");
    //             if (!formData.companyName) errors.push("Company Name");
    //             if (!formData.website) errors.push("Company Website");
    //             if (!formData.stockCode) errors.push("Stock Code");
    //             if (!formData.ipoAdmissionDate) errors.push("Listing Date");
    //             if (!formData.asset) errors.push("Total Asset");
    //             break;
    //         case 2:
    //             formData.directors.forEach((leader, index) => {
    //                 if (!leader.title) errors.push(`Leader ${index + 1} Title`);
    //                 if (!leader.name) errors.push(`Leader ${index + 1} Name`);
    //                 if (!leader.position) errors.push(`Leader ${index + 1} Position`);
    //             });
    //             break;
    //         case 3:
    //             if (!formData.headquarterAddress) errors.push("Headquarter Address");
    //             if (!formData.managementOfficeAddress) errors.push("Management Office Address");
    //             if (!formData.about) errors.push("About Company");
    //             if (!formData.industryClassification) errors.push("Industry Classification");
    //             if (!formData.subSector) errors.push("Sub Sector");
    //             break;
    //         case 4:
    //             formData.pics.forEach((pic, index) => {
    //                 if (!pic.name) errors.push(`PIC ${index + 1} Name`);
    //                 if (!pic.position) errors.push(`PIC ${index + 1} Position`);
    //                 if (!pic.phone) errors.push(`PIC ${index + 1} Phone`);
    //                 if (!pic.email) errors.push(`PIC ${index + 1} Email`);
    //             });
    //             break;
    //         default:
    //             break;
    //     }
    //     return errors;
    // };
    
    const handleSubmit = async () => {
        // Ambil access_token dari cookies
        const accessToken = Cookies.get('token'); // Ganti dengan nama cookie yang sesuai

        if (!accessToken) {
            alert('Access token not found. Please login first.');
            return;
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register-step-2`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

                if (response.ok) {
                    alert('Form submitted successfully!');
                    if (typeof window !== 'undefined'){
                        Cookies.set('is_profile_completed', 'true', { expires: 7, path: '/' }); // Simpan status profil ke cookies
                    }
                    router.push("/"); // Redirect ke halaman home setelah submit
                } else {
                alert(data.message || 'Failed to submit data');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form. Please try again later.');
        }
    };

    const addLeader = () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            directors: [
                ...prevFormData.directors,
                { title: "", name: "", position: "" }, // Tambahkan leader baru
            ],
        }));
    };

    const removeLeader = (indexToRemove) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            directors: prevFormData.directors.filter(
                (_, index) => index !== indexToRemove // Hapus leader berdasarkan index
            ),
        }));
    };

    const addPic = () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            pics: [
                ...prevFormData.pics,
                { name: "", email: "", position: "", phone: "" }, // Tambahkan leader baru
            ],
        }));
    }

    const removePic = (indexToRemove) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            pics: prevFormData.pics.filter(
                (_, index) => index !== indexToRemove // Hapus leader berdasarkan index
            ),
        }));
    }
    
    return(
        <div className="section_complete_profile">
            <div className="container">
                <div className="scp_box">
                    <h2>Complete Form Below</h2>
                    <div className="steps">
                        <div className="steps_box">
                            <div className={`step_number ${step >= 1 ? "active" : ""}`}>Company Data</div>
                            <div className={`step_number ${step >= 2 ? "active" : ""}`}>Leaders</div>
                            <div className={`step_number ${step >= 3 ? "active" : ""}`}>About Company</div>
                            <div className={`step_number ${step >= 4 ? "active" : ""}`}>PIC</div>
                        </div>
                        {step === 1 && (
                            <div className="step">
                                <div className="form_box">
                                    <span className="title">Company Email<i>*</i></span>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder='example@mail.com'
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form_box">
                                    <span className="title">Company Phone<i>*</i></span>
                                    <input
                                        type="tel"
                                        name="officePhone"
                                        placeholder='0211234567'
                                        value={formData.officePhone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form_box">
                                    <span className="title">Company Name<i>*</i></span>
                                    <input
                                        type="text"
                                        name="companyName"
                                        placeholder='Your Company Name'
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form_box">
                                    <span className="title">Company Website<i>*</i></span>
                                    <input
                                        type="text"
                                        name="website"
                                        placeholder='www.company.com'
                                        value={formData.website}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form_box">
                                    <span className="title">Stock Code<i>*</i></span>
                                    <input
                                        type="text"
                                        name="stockCode"
                                        placeholder='Your Stock Code'
                                        value={formData.stockCode}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form_box">
                                    <span className="title">Listing Date<i>*</i></span>
                                    <input
                                        type="date"
                                        name="ipoAdmissionDate"
                                        value={formData.ipoAdmissionDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form_box">
                                    <span className="title">Total Asset<i>*</i></span>
                                    <select
                                        name="asset"
                                        value={formData.asset}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>Select Asset</option>
                                        {assets.map((asset) => (
                                            <option key={asset.id} value={asset.id}>
                                                {asset.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="step">
                                <div className="leaders_wrapper">
                                    {formData.directors.map((leader, index) => (
                                        <div key={index} className="leaders_box">
                                            <h5>Leader {index + 1}</h5>
                                            <div className="form_box">
                                                <span className="title">
                                                    Title<i>*</i>
                                                </span>
                                                <div className="radio_box">
                                                    <div className="radio_ctr">
                                                        <input
                                                            type="radio"
                                                            name={`directors-${index}-title`}
                                                            value="Mr"
                                                            checked={leader.title === "Mr"}
                                                            onChange={handleChange}
                                                        />
                                                        <span>Mr</span>
                                                    </div>
                                                    <div className="radio_ctr">
                                                        <input
                                                            type="radio"
                                                            name={`directors-${index}-title`}
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
                                                    name={`directors-${index}-name`}
                                                    value={leader.name}
                                                    onChange={handleChange}
                                                    placeholder="Leader's Name"
                                                />
                                            </div>
                                            <div className="form_box">
                                                <span className="title">Position<i>*</i></span>
                                                <select
                                                    name={`directors-${index}-position`}
                                                    value={leader.position}
                                                    onChange={handleChange}
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
                                                </select>
                                            </div>
                                            {formData.directors.length > 1 && (
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
                            </div>
                        )}
                        {step === 3 && (
                            <div className="step">
                                <div className="form_box">
                                    <span className="title">Headquarter Address<i>*</i></span>
                                    <input
                                        type="text"
                                        name="headquarterAddress"
                                        placeholder='Your Headquarter Address'
                                        value={formData.headquarterAddress}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form_box">
                                    <span className="title">Management Office Address<i>*</i></span>
                                    <input
                                        type="text"
                                        name="managementOfficeAddress"
                                        placeholder='Your Management Office Address'
                                        value={formData.managementOfficeAddress}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form_box">
                                    <span className="title">About Company<i>*</i></span>
                                    <textarea
                                        type="text"
                                        name="about"
                                        placeholder='Your Company Description'
                                        value={formData.about}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form_box">
                                    <span className="title">Industry Classification<i>*</i></span>
                                    <select
                                        name="industryClassification"
                                        value={formData.industryClassification}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>Select Industry</option>
                                        {industryClassification.map((industryClass) => (
                                            <option key={industryClass.id} value={industryClass.id}>
                                                {industryClass.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form_box">
                                    <span className="title">Sub Sector<i>*</i></span>
                                    <input
                                        type="text"
                                        name="subSector"
                                        placeholder='Your Sub Sector'
                                        value={formData.subSector}
                                        onChange={handleChange}
                                    />
                                </div>
                                
                            </div>
                        )}
                        {step === 4 && (
                            <div className="step">
                                <div className="leaders_wrapper">
                                    {formData.pics.map((pic, index) => (
                                        <div key={index} className="leaders_box">
                                            <h5>Person in charge {index + 1}</h5>
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
                                                    placeholder='Your PIC number'
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form_box">
                                                <span className="title">PIC Email<i>*</i></span>
                                                <input
                                                    type="email"
                                                    name={`pics-${index}-email`}
                                                    value={pic.email}
                                                    placeholder='Your PIC Email'
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
                                    <div className="add_leader_btn" onClick={addPic}>
                                        Add Pic
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="button_wrapper">
                        {step > 1 && <button className='grey_btn' onClick={handleBack}>Back</button>}
                        {step < 4 && <button className='green_btn' onClick={handleNext}>Next</button>}
                        {step === 4 && <button className='green_btn' onClick={handleSubmit}>Submit</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}