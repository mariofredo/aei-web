'use client';
import React, {useCallback, useEffect, useState} from 'react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import {FiPlusCircle, FiTrash} from 'react-icons/fi';
import {LuCircleMinus} from 'react-icons/lu';
import {useRouter, useSearchParams} from 'next/navigation';
import {Button} from '@/components';
import {BCA, Mandiri} from '@/public';
import '@/styles/eventPayment.scss';

export default function Page() {
  const router = useRouter();
  const [participants, setParticipants] = useState([
    {type: '', name: '', position: '', mobile: '', email: '', pic: ''},
  ]);
  const searchParams = useSearchParams();
  const invoiceCode = searchParams.get('invoiceCode');
  const [step, setStep] = useState(2);
  const [confirmedBank, setConfirmedBank] = useState('');
  const [companyDetails, setCompanyDetails] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleAddParticipant = () => {
    setParticipants([
      ...participants,
      {type: '', name: '', position: '', mobile: '', email: '', pic: ''},
    ]);
  };

  const handleRemoveParticipant = (index) => {
    const updatedParticipants = participants.filter((_, idx) => idx !== index);
    setParticipants(updatedParticipants);
  };

  const handleParticipantChange = (index, field, value) => {
    const updatedParticipants = participants.map((participant, idx) =>
      idx === index ? {...participant, [field]: value} : participant
    );
    setParticipants(updatedParticipants);
  };

  const picOptions = ['John Doe', 'Jane Smith', 'Michael Johnson'];
  const positionOptions = ['Manager', 'Developer', 'Designer', 'Intern'];

  const handlePaymentConfirmation = async () => {
    let formError = {};

    // Validasi untuk bank BCA
    if (confirmedBank === 'BCA') {
      if (!accountNumber)
        formError.accountNumber = 'Account number is required';
      if (!accountName) formError.accountName = 'Account name is required';
    }

    // Validasi untuk bank Mandiri
    else if (confirmedBank === 'Mandiri') {
      if (!paymentProof) formError.paymentProof = 'Payment proof is required';
    }

    // Jika ada error pada form
    if (Object.keys(formError).length > 0) {
      setError(formError);
      return;
    }

    // Menyiapkan FormData
    const formData = new FormData();
    formData.append('paymentMethod', confirmedBank);
    formData.append('file', paymentProof); // Menambahkan file ke formData
    formData.append('accountNumber', accountNumber);
    formData.append('accountName', accountName);

    try {
      // Mengirim data menggunakan fetch
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/company-invoice/${invoiceCode}/payment`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
          body: formData, // Mengirimkan FormData
        }
      );

      const data = await response.json();

      if (response.ok) {
        setConfirmedBank(confirmedBank);
        router.push('/');
      } else {
        alert(data.message || 'Failed to confirm payment');
      }
    } catch (err) {
      console.error(err);
      alert('Error confirming payment');
    }
  };

  const handleRenderStep = useCallback(() => {
    switch (step) {
      case 1:
        return (
          <div className="ep_box">
            <p className="ep_title">Please Fill Participant</p>
            <div className="ep_participants">
              {participants.map((participant, index) => (
                <div key={index} className="participant">
                  <div className="participant_header_ctr">
                    <p className="participant_header">
                      Participant {index + 1}
                    </p>
                    {index > 0 && (
                      <div
                        className="remove_participant_btn"
                        onClick={() => handleRemoveParticipant(index)}
                      >
                        <LuCircleMinus color="#FF2F00" /> Remove
                      </div>
                    )}
                  </div>
                  <div className="participant_type">
                    <p className="participant_type_title">
                      Choose Participant:
                    </p>
                    <div className="participant_type_box">
                      <label>
                        <input
                          type="radio"
                          name={`type-${index}`}
                          value="PIC"
                          checked={participant.type === 'PIC'}
                          onChange={() =>
                            handleParticipantChange(index, 'type', 'PIC')
                          }
                        />
                        PIC
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`type-${index}`}
                          value="Others"
                          checked={participant.type === 'Others'}
                          onChange={() =>
                            handleParticipantChange(index, 'type', 'Others')
                          }
                        />
                        Others
                      </label>
                    </div>
                  </div>

                  {participant.type === 'PIC' && (
                    <div className="pic-select">
                      <label htmlFor={`pic-${index}`}>Select PIC:</label>
                      <select
                        id={`pic-${index}`}
                        value={participant.pic}
                        onChange={(e) =>
                          handleParticipantChange(index, 'pic', e.target.value)
                        }
                      >
                        <option value="" disabled>
                          Select PIC
                        </option>
                        {picOptions.map((pic, idx) => (
                          <option key={idx} value={pic}>
                            {pic}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {participant.type === 'Others' && (
                    <div className="others_details">
                      <div>
                        <label htmlFor={`name-${index}`}>Name:</label>
                        <input
                          type="text"
                          id={`name-${index}`}
                          value={participant.name}
                          onChange={(e) =>
                            handleParticipantChange(
                              index,
                              'name',
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor={`position-${index}`}>Position:</label>
                        <select
                          id={`position-${index}`}
                          value={participant.position}
                          onChange={(e) =>
                            handleParticipantChange(
                              index,
                              'position',
                              e.target.value
                            )
                          }
                        >
                          <option value="" disabled>
                            Select Position
                          </option>
                          {positionOptions.map((position, idx) => (
                            <option key={idx} value={position}>
                              {position}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor={`mobile-${index}`}>
                          Mobile Number:
                        </label>
                        <input
                          type="text"
                          id={`mobile-${index}`}
                          value={participant.mobile}
                          onChange={(e) =>
                            handleParticipantChange(
                              index,
                              'mobile',
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor={`email-${index}`}>Email:</label>
                        <input
                          type="email"
                          id={`email-${index}`}
                          value={participant.email}
                          onChange={(e) =>
                            handleParticipantChange(
                              index,
                              'email',
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div onClick={handleAddParticipant} className="add_participant_btn">
              Add Participant
              <FiPlusCircle color="#009B4C" />
            </div>
            <div className="ep_button_ctr">
              <Button
                type="solid"
                text="Back"
                bgColor="#E4E4E4"
                color="#332C2B"
                padding="8px 36px"
                borderRadius="8px"
                width="160px"
                onClick={() => {
                  router.back();
                }}
              />
              <Button
                type="solid"
                text="Submit"
                bgColor="#009B4C"
                color="#fff"
                padding="8px 36px"
                borderRadius="8px"
                width="160px"
                onClick={() => {
                  router.push('/dashboard/category/form');
                }}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="payment_step_one">
            {!confirmedBank ? (
              <>
                <h4>Payment form</h4>
                <h3>{companyDetails?.companyName || 'NUll'}</h3>
                <span className="stock_name">
                  STOCK CODE:{' '}
                  <span className="blue_text">
                    {companyDetails?.stockCode || 'BBCA'}
                  </span>
                </span>
                <div className="section_benefit">
                  <ul>
                    <li>Get access to all feature</li>
                    <li>Get history of company seminar</li>
                    <li>Get sertificate from the best seminar</li>
                    <li>Get access to all feature</li>
                  </ul>
                </div>
                <div className="section_price">
                  <strong>
                    {formatCurrency(parseFloat(invoiceDetails?.totalAmount))}
                  </strong>
                  <span>for 1 year membership</span>
                </div>
                <div className="bank_payment">
                  <h5>Choose Payment</h5>
                  <div className="radio_box">
                    <input
                      type="radio"
                      name="bank"
                      value="BCA"
                      onChange={() => setSelectedBank('BCA')}
                    />
                    <span>Bank Central Asia</span>
                    <Image
                      src={BCA}
                      alt="Bank Central Asia"
                      width={50}
                      height={18}
                    />
                  </div>
                  <div className="radio_box">
                    <input
                      type="radio"
                      name="bank"
                      value="Mandiri"
                      onChange={() => setSelectedBank('Mandiri')}
                    />
                    <span>Bank Mandiri</span>
                    <Image
                      src={Mandiri}
                      alt="Bank Central Asia"
                      width={67}
                      height={18}
                    />
                  </div>
                </div>
                <div className="button_wrapper">
                  <button
                    className="green_btn"
                    onClick={() => {
                      if (selectedBank) {
                        setConfirmedBank(selectedBank);
                      } else {
                        alert('Please select a payment method first!');
                      }
                    }}
                  >
                    Pay
                  </button>
                </div>
              </>
            ) : (
              <>
                <h4>Waiting for Payment</h4>
                <h3>{companyDetails?.companyName}</h3>
                <span className="stock_name">
                  STOCK CODE:{' '}
                  <span className="blue_text">{companyDetails?.stockCode}</span>
                </span>
                {additionalContent()}
                <div className="button_wrapper">
                  <button
                    className="grey_btn"
                    onClick={() => setConfirmedBank('')}
                  >
                    Back
                  </button>
                  <button
                    className="green_btn"
                    onClick={handlePaymentConfirmation}
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        );
      case 3:
        return <div className="ep_box">Step 3</div>;
      default:
        return null;
    }
  }, [step, participants, picOptions, positionOptions]);

  useEffect(() => {
    if (!invoiceCode) return; // Wait until invoiceCode is available

    const fetchInvoiceDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/company-invoice/${invoiceCode}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${Cookies.get('token')}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.code === 200) {
          setInvoiceDetails(data.data.invoice); // Store invoice details
          setCompanyDetails(data.data.company); // Store company details
        } else {
          throw new Error(data.message || 'Failed to fetch invoice details');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [invoiceCode]);

  return (
    <div className="ep_ctr">
      <div className="ep_content">{handleRenderStep()}</div>
    </div>
  );
}
