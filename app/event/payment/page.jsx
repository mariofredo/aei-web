'use client';
import React, {useCallback, useEffect, useState} from 'react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import {FiPlusCircle} from 'react-icons/fi';
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
  const slug = searchParams.get('slug');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [confirmedBank, setConfirmedBank] = useState('');
  const [companyDetails, setCompanyDetails] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofName, setPaymentProofName] = useState('');

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

  const handleGetDetail = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/event/${slug}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        // setInvoiceDetails(data.data);
        // setCompanyDetails(data.data.company);
      } else {
        alert(data.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('An error occurred:', err);
    }
  }, [slug]);

  useEffect(() => {
    slug && handleGetDetail();
  }, [slug]);

  const handleJoinEvent = useCallback(async()=>{

  },[])

  const handlePaymentConfirmation = async () => {
    let formError = {};

    if (confirmedBank === 'BCA') {
      if (!accountNumber)
        formError.accountNumber = 'Account number is required';
      if (!accountName) formError.accountName = 'Account name is required';
    } else if (confirmedBank === 'Mandiri') {
      if (!paymentProof) formError.paymentProof = 'Payment proof is required';
    }

    if (Object.keys(formError).length > 0) {
      setError(formError);
      return;
    }

    const formData = new FormData();
    formData.append('paymentMethod', confirmedBank);
    formData.append('file', paymentProof);
    formData.append('accountNumber', accountNumber);
    formData.append('accountName', accountName);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/company-invoice/${slug}/payment`,
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

  const formatCurrencyCopy = (value) => {
    // Format angka tanpa simbol "Rp" dan tanpa pemisah ribuan
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace(/[^\d]/g, ''); // Menghapus karakter non-numerik
  };

  const handleCopy = (e) => {
    // Mengambil elemen <span> sebelumnya terkait tombol yang diklik
    const value = e.target.previousElementSibling.dataset.value;
    // Menghapus simbol "Rp" dan tanda pemisah ribuan (titik)
    const numericValue = value.replace(/[^\d]/g, ''); // Menghapus segala karakter non-numerik selain angka

    navigator.clipboard
      .writeText(numericValue)
      .then(() => {
        alert('Berhasil menyalin: ' + numericValue);
      })
      .catch((err) => {
        alert('Gagal menyalin teks.');
        console.error(err);
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Mendapatkan file pertama yang dipilih
    setPaymentProof(file);
    setPaymentProofName(file ? file.name : 'No file selected'); // Menyimpan nama file
  };

  const additionalContent = () => {
    switch (confirmedBank) {
      case 'BCA':
        return (
          <>
            <div className="section_info_payment">
              <div className="sip_box">
                <h5>Total Payment</h5>
                <span
                  data-value={formatCurrencyCopy(
                    parseFloat(invoiceDetails?.totalAmount)
                  )}
                >
                  {formatCurrency(parseFloat(invoiceDetails?.totalAmount))}
                </span>
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
            <div className="upload_box">
              <h5>
                Please upload your proof of payment in the form below to confirm
                the payment
              </h5>
              <div className="upload_btn">
                <input
                  type="file"
                  onChange={handleFileChange} // Panggil handleFileChange ketika file dipilih
                />
                <span>
                  {paymentProofName || 'Choose pdf file JPG, PNG, or PDF'}
                </span>{' '}
              </div>
              <span className="info">File size max 5Mb</span>
            </div>
          </>
        );
      case 'Mandiri':
        return (
          <>
            <div className="section_info_payment">
              <div className="sip_box">
                <h5>Total Payment</h5>
                <span
                  data-value={formatCurrencyCopy(
                    parseFloat(invoiceDetails?.totalAmount)
                  )}
                >
                  {formatCurrency(parseFloat(invoiceDetails?.totalAmount))}
                </span>
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
                <Image
                  src={Mandiri}
                  alt="Bank Mandiri"
                  width={100}
                  height={27}
                />
              </div>
              <div className="sip_box">
                <h5>Account Name</h5>
                <span>Asosiasi Emiten Indonesia</span>
              </div>
            </div>
            <div className="upload_box">
              <h5>
                Please upload your proof of payment in the form below to confirm
                the payment
              </h5>
              <div className="upload_btn">
                <input
                  type="file"
                  onChange={handleFileChange} // Panggil handleFileChange ketika file dipilih
                />
                <span>
                  {paymentProofName || 'Choose pdf file JPG, PNG, or PDF'}
                </span>{' '}
                {/* Menampilkan nama file atau pesan default */}
              </div>
              <span className="info">File size max 5Mb</span>
            </div>
          </>
        );
      default:
        return null;
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
                  setStep(2);
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
                <div className="section_info">
                  Seminar penyusunan sustainability report berbasis GRI standard
                  & IFRS
                </div>
                <div className="section_price">
                  <span style={{color: '#332C2B'}}>4 Participant</span>
                </div>
                <div className="section_price">
                  <strong>
                    {formatCurrency(parseFloat(invoiceDetails?.totalAmount))}
                  </strong>
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
    if (!slug) return; // Wait until slug is available

    const fetchInvoiceDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/company-invoice/${slug}`,
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
  }, [slug]);

  return (
    <div className="ep_ctr">
      <div className="ep_content">{handleRenderStep()}</div>
    </div>
  );
}
