'use client';
import { useState } from "react";
import Image from "next/image";
import '../../styles/payment.scss';
import { BCA, Mandiri } from "@/public";

export default function Payment({companyName, stockName, children}) {
    const [selectedBank, setSelectedBank] = useState("");
    const [confirmedBank, setConfirmedBank] = useState("");

    const additionalContent = () => {
        switch (confirmedBank) {
            case "BCA":
                return(
                    <>
                        <div className="section_info_payment">
                            <div className="sip_box">
                                <h5>Total Payment</h5>
                                <span>Rp. 1.400.000,00-</span>
                                <div className="copy_btn"></div>
                            </div>
                            <div className="sip_box">
                                <h5>Bank and Account number</h5>
                                <span>1412314123</span>
                                <div className="copy_btn"></div>
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
                                <input type="number" />
                            </div>
                            <div className="form_box">
                                <span>Account Name<i>*</i></span>
                                <input type="text" />
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
                                <span>Rp. 1.400.000,00-</span>
                                <div className="copy_btn"></div>
                            </div>
                            <div className="sip_box">
                                <h5>Bank and Account number</h5>
                                <span>1412314123</span>
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
                                <input type="file" />
                                <span>Choose pdf file JPG, PNG, or PDF</span>
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
                    <h3>{companyName}</h3>
                    <span className="stock_name">STOCK CODE: <span className="blue_text">{stockName}</span></span>
                    <div className="section_benefit">
                        <ul>
                            <li>Get access to all feature</li>
                            <li>Get history of company seminar</li>
                            <li>Get sertificate from the best seminar</li>
                            <li>Get access to all feature</li>
                        </ul>
                    </div>
                    <div className="section_price">
                        <strong>Rp. 1.400.000,00-</strong>
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
                    <h3>{companyName}</h3>
                    <span className="stock_name">STOCK CODE: <span className="blue_text">{stockName}</span></span>
                    {additionalContent()}
                    <div className="button_wrapper">
                        <button className="grey_btn" onClick={() => setConfirmedBank("")}>Back</button>
                        <button className="green_btn">Submit</button>
                    </div>
                </>
                )}
            </div>
        </div>
    )
}