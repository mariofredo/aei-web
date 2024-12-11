'use client';
import React, {useCallback, useEffect, useState} from 'react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import {FiPlusCircle} from 'react-icons/fi';
import {LuCircleMinus} from 'react-icons/lu';
import {useRouter, useSearchParams} from 'next/navigation';
import {Button} from '@/components';
import {BCA, Mandiri} from '@/public';
import {formatCurrency, formatCurrencyCopy} from '@/utils';
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
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [selectedBank, setSelectedBank] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofName, setPaymentProofName] = useState('');

  const [eventDetails, setEventDetails] = useState(null);
  const [picOptions, setPicOptions] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);
  const bankAccountNumber = 1412314123;
  const accountName = 'Asosiasi Emiten Indonesia';

  // Function for list
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
  // End of Function for list

  const handleGetPicOptions = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/select/my-pic`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setPicOptions(data.data);
      } else {
        alert(data.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('An error occurred:', err);
    }
  }, []);

  const handleGetPicPositionOptions = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/select/pic-position`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setPositionOptions(data.data);
      } else {
        alert(data.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('An error occurred:', err);
    }
  }, []);

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
        setEventDetails(data.data.event);
      } else {
        alert(data.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('An error occurred:', err);
    }
  }, [slug]);

  useEffect(() => {
    handleGetPicOptions();
    handleGetPicPositionOptions();
    slug && handleGetDetail();
  }, [slug]);

  const handleJoinEvent = useCallback(async () => {
    try {
      const formData = new FormData();

      // Add payment details
      formData.append('paymentMethod', selectedBank);
      formData.append('accountName', accountName || '');
      formData.append('accountNumber', bankAccountNumber || '');

      // Add participants data
      participants.forEach((participant, index) => {
        if (participant.type === 'PIC') {
          formData.append(
            `participants[${index}][companyPic]`,
            participant.pic
          );
        } else if (participant.type === 'Others') {
          formData.append(`participants[${index}][name]`, participant.name);
          formData.append(
            `participants[${index}][position]`,
            participant.position
          );
          formData.append(`participants[${index}][email]`, participant.email);
          formData.append(
            `participants[${index}][mobileNumber]`,
            participant.mobile
          );
        }
      });

      // Add payment proof if available
      if (paymentProof) {
        formData.append('file', paymentProof);
      }

      // Make API call
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/event/${slug}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
          body: formData, // Use FormData directly as the body
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message || 'Successfully submitted');
        router.back();
      } else {
        alert(data.message || 'Failed to submit');
      }
    } catch (err) {
      console.error('An error occurred:', err);
      alert('An error occurred during submission.');
    }
  }, [
    selectedBank,
    participants,
    paymentProof,
    slug,
    router,
    accountName,
    bankAccountNumber,
  ]);

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
                    parseFloat(eventDetails.price * participants.length || 0)
                  )}
                >
                  {formatCurrency(
                    parseFloat(eventDetails.price * participants.length || 0)
                  )}
                </span>
                <div className="copy_btn" onClick={handleCopy}></div>
              </div>
              <div className="sip_box">
                <h5>Bank and Account number</h5>
                <span data-value={bankAccountNumber}>{bankAccountNumber}</span>
                <div className="copy_btn" onClick={handleCopy}></div>
              </div>
              <div className="sip_box">
                <h5>Bank</h5>
                <span>Bank Central Asia</span>
                <Image src={BCA} alt="Bank Mandiri" width={75} height={27} />
              </div>
              <div className="sip_box">
                <h5>Account Name</h5>
                <span>{accountName}</span>
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
                    parseFloat(eventDetails.price * participants.length || 0)
                  )}
                >
                  {formatCurrency(
                    parseFloat(eventDetails.price * participants.length || 0)
                  )}
                </span>
                <div className="copy_btn"></div>
              </div>
              <div className="sip_box">
                <h5>Bank and Account number</h5>
                <span data-value={bankAccountNumber}>{bankAccountNumber}</span>
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
                <span>{accountName}</span>
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
                          <option key={idx} value={pic.id}>
                            {pic.name}
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
                            <option key={idx} value={position.id}>
                              {position.name}
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
                <div className="section_info">{eventDetails?.title}</div>
                <div className="section_price">
                  <span style={{color: '#332C2B'}}>
                    {`${participants.length} Participant`}{' '}
                  </span>
                </div>
                <div className="section_price">
                  <strong>
                    {formatCurrency(
                      parseFloat(eventDetails?.price * participants.length || 0)
                    )}
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
                {additionalContent()}
                <div className="button_wrapper">
                  <button
                    className="grey_btn"
                    onClick={() => setConfirmedBank('')}
                  >
                    Back
                  </button>
                  <button className="green_btn" onClick={handleJoinEvent}>
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        );
      case 3:
        return (
          <div className="ep_box">
            <div className="ep_box_outer">
              <p className='title'>Order Success</p>
              <p className='desc'>
                your order for <span>{eventDetails?.title}</span> is Success.
                please wait for admin to confirm your payment
              </p>
              <Button
                type="solid"
                text="Back to Event"
                bgColor="#009B4C"
                color="#fff"
                padding="8px 36px"
                borderRadius="8px"
                width="200px"
                onClick={() => {
                  router.push(`/event/${slug}`);
                }}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  }, [
    step,
    participants,
    picOptions,
    positionOptions,
    eventDetails,
    selectedBank,
    additionalContent,
    slug
  ]);

  return (
    <div className="ep_ctr">
      <div className="ep_content">{handleRenderStep()}</div>
    </div>
  );
}
