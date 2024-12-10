'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function ModalEditProfile({ showEditProfilePopup, setShowEditProfilePopup, data }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: data.email,
        officePhone: data.officePhone,
        companyName: data.companyName,
        website: data.website,
        stockCode: data.stockCode,
        ipoAdmissionDate: data.ipoAdmissionDate,
        asset: data.asset,
        headquarterAddress: data.headquarterAddress,
        managementOfficeAddress: data.managementOfficeAddress,
        about: data.about,
        industryClassification: data.industryClassification,
        subSector: data.subSector,
    });
    console.log('formData', formData.ipoAdmissionDate);
    const [assets, setAssets] = useState([]); // State to store company assets
    const [industryClassification, setIndustryClassification] = useState([]); // State to store industry classification
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
    
    const handleNext = () => {
        if (step < 2) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        // Ambil access_token dari cookies
        const accessToken = Cookies.get('token'); // Ganti dengan nama cookie yang sesuai
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company/update-company`, {
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

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan ditambahkan 1 karena indeks dimulai dari 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };


    if (!showEditProfilePopup) return null;

    return (
        <div className="modal_wrapper pic">
            <div className="overlay" onClick={() => setShowEditProfilePopup(false)}></div>
            <div className="modal_box">
                <div className="steps_box">
                    <div className={`step_number ${step >= 1 ? "active" : ""}`}>Company Data</div>
                    <div className={`step_number ${step >= 2 ? "active" : ""}`}>About Company</div>
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
                                value={formatDate(formData.ipoAdmissionDate)}
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
                <div className="button_wrapper">
                    {step > 1 && <button className='grey_btn' onClick={handleBack}>Back</button>}
                    {step < 2 && <button className='green_btn' onClick={handleNext}>Next</button>}
                    {step === 2 && <button className='green_btn' onClick={handleSubmit}>Submit</button>}
                </div>
            </div>
        </div>
    );
}