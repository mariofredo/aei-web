'use client';
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import '../../styles/payment.scss';
import { BCA, Mandiri } from "@/public";

export default function Payment() {
    const [selectedBank, setSelectedBank] = useState("");
    const [confirmedBank, setConfirmedBank] = useState("");
    const searchParams = useSearchParams(); // Untuk membaca query parameters
    const invoiceCode = searchParams.get("invoiceCode"); // Ambil invoiceCode dari query parameter
    const [invoiceDetails, setInvoiceDetails] = useState(null);
    const [companyDetails, setCompanyDetails] = useState(null);
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentProof, setPaymentProof] = useState(null);
    const [paymentProofName, setPaymentProofName] = useState("");
    const spanRef = useRef();
    const router = useRouter();

    useEffect(() => {
        if (!invoiceCode) return; // Wait until invoiceCode is available

        const fetchInvoiceDetails = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company-invoice/${invoiceCode}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                if (data.code === 200) {
                    setInvoiceDetails(data.data.invoice); // Store invoice details
                    setCompanyDetails(data.data.company); // Store company details
                } else {
                    throw new Error(data.message || "Failed to fetch invoice details");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoiceDetails();
    }, [invoiceCode]);

    const handlePaymentConfirmation = async () => {
        let formError = {};
    
        // Validasi untuk bank BCA
        if (confirmedBank === "BCA") {
            if (!accountNumber) formError.accountNumber = "Account number is required";
            if (!accountName) formError.accountName = "Account name is required";
        }
        
        // Validasi untuk bank Mandiri
        else if (confirmedBank === "Mandiri") {
            if (!paymentProof) formError.paymentProof = "Payment proof is required";
        }
    
        // Jika ada error pada form
        if (Object.keys(formError).length > 0) {
            setError(formError);
            return;
        }
    
        // Menyiapkan FormData
        const formData = new FormData();
        formData.append("paymentMethod", confirmedBank);
        formData.append("file", paymentProof); // Menambahkan file ke formData
        formData.append("accountNumber", accountNumber);
        formData.append("accountName", accountName);
    
        try {
            // Mengirim data menggunakan fetch
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company-invoice/${invoiceCode}/payment`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
                body: formData, // Mengirimkan FormData
            });
    
            const data = await response.json();
    
            if (data.code === 200) {
                setConfirmedBank(confirmedBank);
                router.push("/");
            } else {
                alert(data.message || 'Failed to confirm payment');
            }
        } catch (err) {
            console.error(err);
            alert('Error confirming payment');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Mendapatkan file pertama yang dipilih
        setPaymentProof(file);
        setPaymentProofName(file ? file.name : "No file selected"); // Menyimpan nama file
    };

    const handleCopy = (e) => {
        // Mengambil elemen <span> sebelumnya terkait tombol yang diklik
    const value = e.target.previousElementSibling.dataset.value;
    // Menghapus simbol "Rp" dan tanda pemisah ribuan (titik)
    const numericValue = value.replace(/[^\d]/g, ''); // Menghapus segala karakter non-numerik selain angka

    navigator.clipboard.writeText(numericValue).then(() => {
            alert("Berhasil menyalin: " + numericValue);
        }).catch((err) => {
            alert("Gagal menyalin teks.");
            console.error(err);
        });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatCurrencyCopy = (value) => {
        // Format angka tanpa simbol "Rp" dan tanpa pemisah ribuan
        return new Intl.NumberFormat("id-ID", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value).replace(/[^\d]/g, '');  // Menghapus karakter non-numerik
    };
    if (!invoiceCode) return <p>Loading...</p>; // Show a placeholder until query params are available
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    
    const additionalContent = () => {
        switch (confirmedBank) {
            case "BCA":
                return(
                    <>
                        <div className="section_info_payment">
                            <div className="sip_box">
                                <h5>Total Payment</h5>
                                <span data-value={formatCurrencyCopy(parseFloat(invoiceDetails.totalAmount))}>{formatCurrency(parseFloat(invoiceDetails.totalAmount))}</span>
                                <div className="copy_btn" onClick={handleCopy}></div>
                            </div>
                            <div className="sip_box">
                                <h5>Bank and Account number</h5>
                                <span data-value={1412314123}>1412314123</span>
                                <div className="copy_btn" onClick={handleCopy}></div>
                            </div>
                            <div className="sip_box">
                                <h5>Bank</h5>
                                <span>Bank Central Asia</span>
                                <Image src={BCA} alt="Bank Mandiri" width={75} height={27} />
                            </div>
                            <div className="sip_box">
                                <h5>Account Name</h5>
                                <span>Asosiasi Emiten Indonesia</span>
                            </div>
                        </div>
                        <div className="confirm_payment">
                            <h5>Please fill the form below to confirm the payment</h5>
                            <div className="form_box">
                                <span>Account Number<i>*</i></span>
                                <input
                                    type="number"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                />
                            </div>
                            <div className="form_box">
                                <span>Account Name<i>*</i></span>
                                <input
                                    type="text"
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                />
                            </div>
                        </div>
                    </>
                )
            case "Mandiri":
                return (
                    <>
                        <div className="section_info_payment">
                            <div className="sip_box">
                                <h5>Total Payment</h5>
                                <span data-value={formatCurrencyCopy(parseFloat(invoiceDetails.totalAmount))}>{formatCurrency(parseFloat(invoiceDetails.totalAmount))}</span>
                                <div className="copy_btn"></div>
                            </div>
                            <div className="sip_box">
                                <h5>Bank and Account number</h5>
                                <span data-value={1412314123}>1412314123</span>
                                <div className="copy_btn"></div>
                            </div>
                            <div className="sip_box">
                                <h5>Bank</h5>
                                <span>Bank Mandiri</span>
                                <Image src={Mandiri} alt="Bank Mandiri" width={100} height={27} />
                            </div>
                            <div className="sip_box">
                                <h5>Account Name</h5>
                                <span>Asosiasi Emiten Indonesia</span>
                            </div>
                        </div>
                        <div className="upload_box">
                            <h5>Please upload your proof of payment in the form below to confirm the payment</h5>
                            <div className="upload_btn">
                            <input
                                type="file"
                                onChange={handleFileChange} // Panggil handleFileChange ketika file dipilih
                            />
                            <span>{paymentProofName || "Choose pdf file JPG, PNG, or PDF"}</span> {/* Menampilkan nama file atau pesan default */}

                            </div>
                            <span className="info">File size max 5Mb</span>
                        </div>
                    </>
                )
            default:
                return null;
        }
    };
    return(
        <div className="section_payment">
            <div className="payment_step_one">
                {!confirmedBank ? (
                    <>
                    <h4>Payment form</h4>
                    <h3>{companyDetails.companyName}</h3>
                    <span className="stock_name">STOCK CODE: <span className="blue_text">{companyDetails.stockCode}</span></span>
                    <div className="section_benefit">
                        <ul>
                            <li>Get access to all feature</li>
                            <li>Get history of company seminar</li>
                            <li>Get sertificate from the best seminar</li>
                            <li>Get access to all feature</li>
                        </ul>
                    </div>
                    <div className="section_price">
                        <strong>{formatCurrency(parseFloat(invoiceDetails.totalAmount))}</strong>
                        <span>for 1 year membership</span>
                    </div>
                    <div className="bank_payment">
                        <h5>Choose Payment</h5>
                        <div className="radio_box">
                                <input
                                    type="radio"
                                    name="bank"
                                    value="BCA"
                                    onChange={() => setSelectedBank("BCA")}
                                />
                            <span>Bank Central Asia</span>
                            <Image src={BCA} alt="Bank Central Asia" width={50} height={18} />
                        </div>
                        <div className="radio_box">
                                <input
                                    type="radio"
                                    name="bank"
                                    value="Mandiri"
                                    onChange={() => setSelectedBank("Mandiri")}
                                />
                            <span>Bank Mandiri</span>
                            <Image src={Mandiri} alt="Bank Central Asia" width={67} height={18} />
                        </div>
                    </div>
                    <div className="button_wrapper">
                        <button className="green_btn"
                            onClick={() => {
                                if (selectedBank) {
                                    setConfirmedBank(selectedBank);
                                } else {
                                    alert("Please select a payment method first!");
                                }
                            }}>
                            Pay
                        </button>
                    </div>
                </>
                ): (
                <>
                    <h4>Waiting for Payment</h4>
                    <h3>{companyDetails.companyName}</h3>
                    <span className="stock_name">STOCK CODE: <span className="blue_text">{companyDetails.stockCode}</span></span>
                    {additionalContent()}
                    <div className="button_wrapper">
                        <button className="grey_btn" onClick={() => setConfirmedBank("")}>Back</button>
                        <button className="green_btn" onClick={handlePaymentConfirmation}>Submit</button>
                    </div>
                </>
                )}
            </div>
        </div>
    )
}