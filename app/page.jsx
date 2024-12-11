'use client';
import {
  useCompanyData,
  usePicData,
  useLeaderData,
  useUpcomingData,
  useHistoryData,
  useInvoicesData,
} from '@/hooks';
import {
  CoverImage,
  ModalRegistrationSuccess,
  LeftMenu,
  RightMenu,
  TradingViewWidget,
  CardEvent,
  ModalChangePassword,
  ModalPic,
  ModalLeader,
  ModalEditPic,
  ModalEditLeader,
  ModalEditProfile,
<<<<<<< HEAD
=======
  CoverSlider,
>>>>>>> f660d458c9060317992b7643a6b3dc6267ebe50d
} from '@/components';
import {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupPic, setShowPopupPic] = useState(false);
  const [showPopupLeader, setShowPopupLeader] = useState(false);
  const [editPopupData, setEditPopupData] = useState(null); // Data untuk form edit
  const [showEditPopup, setShowEditPopup] = useState(false); // Status popup
  const [editLeaderPopupData, setEditLeaderPopupData] = useState(null); // Data untuk form edit
  const [showEditLeaderPopup, setShowEditLeaderPopup] = useState(false); // Status popup
  // const [editProfilePopupData, setEditProfilePopupData] = useState(null); // Data untuk form edit
  const [showEditProfilePopup, setShowEditProfilePopup] = useState(false); // Status popup
  const [selectedId, setSelectedId] = useState(null);
  const {companyData, setCompanyData, loading} = useCompanyData();
  const {picData, type, email, deletePicData, setPicData, editPicData} =
    usePicData();
  const {leaderData, setLeaderData, deleteLeaderData} = useLeaderData();
  const {upcomingData} = useUpcomingData();
  const {historyData} = useHistoryData();
  const {invoices} = useInvoicesData();
  const [activeTab, setActiveTab] = useState('Profile'); // Default tab aktif adalah Profile
  const [activityTab, setActivityTab] = useState('upcoming'); // State untuk tab aktif
  //useEffect(() => {console.log(companyData, 'companyData')}, [companyData])
  const [formData, setFormData] = useState({
    leaders: [{title: '', name: '', position: '', otherPosition: ''}],
    pics: [{name: '', email: '', position: '', phone: ''}],
  });

  const handleAddMoreClick = () => {
    // Show the popup after adding a PIC or if a PIC already exists
    setShowPopupPic(true);
  };

  const handleAddMoreLeaderClick = () => {
    // Show the popup after adding a PIC or if a PIC already exists
    setShowPopupLeader(true);
  };

  const handleEditClick = async (data) => {
    setEditPopupData(data); // Set data untuk form edit
    setShowEditPopup(true); // Tampilkan popup
  };

  const handleEditLeaderClick = async (data) => {
    setEditLeaderPopupData(data); // Set data untuk form edit
    setShowEditLeaderPopup(true); // Tampilkan popup
  };

  const handleDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete this PIC?')) {
      deletePicData(id);
    }
  };
  const handleDeleteLeaderClick = (id) => {
    if (confirm('Are you sure you want to delete this PIC?')) {
      deleteLeaderData(id);
    }
  };

  useEffect(() => {
    console.log(showEditProfilePopup, 'showEditProfilePopup');
  }, [showEditProfilePopup]);

  if (loading) {
<<<<<<< HEAD
    return <div className='loader center'></div>;
=======
    return <div className="loader center"></div>;
>>>>>>> f660d458c9060317992b7643a6b3dc6267ebe50d
  }
  const handleTabClick = (tab) => {
    setActivityTab(tab); // Mengubah tab aktif berdasarkan klik
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Profile':
        return (
          <>
            <div className="section_profile_left">
              <div className="section_about_company">
                <h4>About The Company</h4>
                <p>{companyData?.about}</p>
              </div>
              <div className="section_industry_company">
                <h4>Industry Classification</h4>
                <div className="sic_box">
                  <h5>Industrial Sector</h5>
                  <p>{companyData?.industryClassificationName}</p>
                </div>
                <div className="sic_box">
                  <h5>Sub Sector</h5>
                  <p>{companyData?.subSector}</p>
                </div>
              </div>
            </div>
            <div className='section_profile_right'>
              {/* <TradingViewWidget stockCode={companyData?.stockCode} /> */}
            </div>
          </>
        );
      case 'Membership':
        return (
          <>
            {companyData?.status === 'data_submitted' ? (
<<<<<<< HEAD
              <div className='section_membership_none'>
                <h3>Complete your registration</h3>
                <p>Please download and sign the form bellow.</p>
                <p>
                  Then <span className='red_text'>upload and send</span> the
                  signed file to <span className='black_text'>AEI office</span>{' '}
                  address to complete the registration
                </p>
                <Link href='' className='download_pdf_btn'>
=======
              <div className="section_membership_none">
                <h3>Complete your registration</h3>
                <p>Please download and sign the form bellow.</p>
                <p>
                  Then <span className="red_text">upload and send</span> the
                  signed file to <span className="black_text">AEI office</span>{' '}
                  address to complete the registration
                </p>
                <Link href="" className="download_pdf_btn">
>>>>>>> f660d458c9060317992b7643a6b3dc6267ebe50d
                  <span>{companyData?.companyName} Registration Form.PDF</span>
                </Link>
              </div>
            ) : companyData?.status === 'in_review' ? (
<<<<<<< HEAD
              <div className='section_membership_none in_review'>
=======
              <div className="section_membership_none in_review">
>>>>>>> f660d458c9060317992b7643a6b3dc6267ebe50d
                <h3>Waiting for Confirmation</h3>
                <p>
                  Your registration will be approved after we receive your{' '}
                  <br />
                  registration hard file that already sended to our office.
                </p>
              </div>
            ) : (
<<<<<<< HEAD
              <div className='section_membership'>
                <div className='sm_left'>
                  <div className='membership_box'>
                    <h3>Membership</h3>
                    <div className='mb_ctr'>
                      <h5>Membership Number</h5>
                      <span>{companyData?.membershipNumber}</span>
                    </div>
                    <div className='mb_ctr'>
                      <h5>Member Category</h5>
                      <span className='green_text'>
=======
              <div className="section_membership">
                <div className="sm_left">
                  <div className="membership_box">
                    <h3>Membership</h3>
                    <div className="mb_ctr">
                      <h5>Membership Number</h5>
                      <span>{companyData?.membershipNumber}</span>
                    </div>
                    <div className="mb_ctr">
                      <h5>Member Category</h5>
                      <span className="green_text">
>>>>>>> f660d458c9060317992b7643a6b3dc6267ebe50d
                        {companyData?.companyCategoryName}
                      </span>
                    </div>
                  </div>
                  {companyData?.memberStatus === 'inactive' ? (
<<<<<<< HEAD
                    <div className='member_status inactive'>
                      status: <span>Inactive</span>
                    </div>
                  ) : companyData?.memberStatus === 'paid' ? (
                    <div className='member_status paid'>
                      status: <span>Active</span>
                    </div>
                  ) : (
                    <div className='member_status expired'>
=======
                    <div className="member_status inactive">
                      status: <span>Inactive</span>
                    </div>
                  ) : companyData?.memberStatus === 'paid' ? (
                    <div className="member_status paid">
                      status: <span>Active</span>
                    </div>
                  ) : (
                    <div className="member_status expired">
>>>>>>> f660d458c9060317992b7643a6b3dc6267ebe50d
                      status: <span>Expired</span>
                    </div>
                  )}
                </div>
<<<<<<< HEAD
                <div className='sm_right'>
                  <div className='section_payment_home'>
                    <h3>Payment History</h3>
                    <div className='sp_wrap'>
                      {invoices.map((invoice) => (
                        <div className='sp_box'>
                          <h5>{invoice.code}</h5>
                          {invoice.note && (
                            <span className='info'>{invoice.note}</span>
                          )}
                          <span className='date'>{invoice.invoiceDate}</span>
                          {invoice.status === 'in_review' ? (
                            <span className='orange_btn'>
                              waiting confirmation
                            </span>
                          ) : invoice.status === 'paid' ? (
                            <span className='blue_btn'>
=======
                <div className="sm_right">
                  <div className="section_payment_home">
                    <h3>Payment History</h3>
                    <div className="sp_wrap">
                      {invoices.map((invoice) => (
                        <div className="sp_box">
                          <h5>{invoice.code}</h5>
                          {invoice.note && (
                            <span className="info">{invoice.note}</span>
                          )}
                          <span className="date">{invoice.invoiceDate}</span>
                          {invoice.status === 'in_review' ? (
                            <span className="orange_btn">
                              waiting confirmation
                            </span>
                          ) : invoice.status === 'paid' ? (
                            <span className="blue_btn">
>>>>>>> f660d458c9060317992b7643a6b3dc6267ebe50d
                              <span></span>
                            </span>
                          ) : (
                            <Link
                              href={`/payment?invoiceCode=${invoice.id}`}
<<<<<<< HEAD
                              className='green_btn'
=======
                              className="green_btn"
>>>>>>> f660d458c9060317992b7643a6b3dc6267ebe50d
                            >
                              Pay
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        );
      case 'Activity':
        return (
<<<<<<< HEAD
          <div className='section_activity'>
            <div className='sa_top'>
              <h3>Seminar</h3>
              <div className='sa_menu'>
=======
          <div className="section_activity">
            <div className="sa_top">
              <h3>Seminar</h3>
              <div className="sa_menu">
>>>>>>> f660d458c9060317992b7643a6b3dc6267ebe50d
                <div
                  className={`upcoming_btn ${
                    activityTab === 'upcoming' ? 'active' : ''
                  }`}
                  onClick={() => handleTabClick('upcoming')}
                >
                  Upcoming
                </div>
                {historyData.length > 0 ? (
                  <div
                    className={`history_btn ${
                      activityTab === 'history' ? 'active' : ''
                    }`}
                    onClick={() => handleTabClick('history')}
                  >
                    History
                  </div>
                ) : (
<<<<<<< HEAD
                  <div className='history_btn'>
=======
                  <div className="history_btn">
>>>>>>> f660d458c9060317992b7643a6b3dc6267ebe50d
                    <span>History</span>
                  </div>
                )}
              </div>
            </div>
<<<<<<< HEAD
            <div className='card_flex'>
=======
            <div className="card_flex">
>>>>>>> f660d458c9060317992b7643a6b3dc6267ebe50d
              {activityTab === 'upcoming' && (
                <CardEvent events={upcomingData} />
              )}
              {activityTab === 'history' && <CardEvent events={historyData} />}
            </div>
          </div>
        );
      case 'Leaders and PIC':
        return (
          <>
<<<<<<< HEAD
            <div className='section_table_box'>
              <div className='stb_ctr'>
                <h3>Board of Executive</h3>
                <div
                  className='add_more_btn'
=======
            <div className="section_table_box">
              <div className="stb_ctr">
                <h3>Board of Executive</h3>
                <div
                  className="add_more_btn"
>>>>>>> f660d458c9060317992b7643a6b3dc6267ebe50d
                  onClick={handleAddMoreLeaderClick}
                >
                  Add More
                </div>
              </div>
              <table>
                <tbody>
                  {leaderData?.map((leaderData) => (
                    <tr key={leaderData.id}>
                      <td>
                        <span>Name</span>
                        {leaderData.title} {leaderData.name}
                      </td>
                      <td>
                        <span>Position</span>
                        {leaderData.positionName}
                      </td>
                      <td>
<<<<<<< HEAD
                        <div className='action_btn'>
                          <div
                            className='delete_btn'
=======
                        <div className="action_btn">
                          <div
                            className="delete_btn"
>>>>>>> f660d458c9060317992b7643a6b3dc6267ebe50d
                            onClick={() =>
                              handleDeleteLeaderClick(leaderData.id)
                            }
                          >
                            Delete
                          </div>
                          <div
<<<<<<< HEAD
                            className='edit_btn'
=======
                            className="edit_btn"
>>>>>>> f660d458c9060317992b7643a6b3dc6267ebe50d
                            onClick={() => handleEditLeaderClick(leaderData)}
                          >
                            Edit
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
<<<<<<< HEAD
            <div className='section_table_box'>
              <div className='stb_ctr'>
=======
            <div className="section_table_box">
              <div className="stb_ctr">
>>>>>>> f660d458c9060317992b7643a6b3dc6267ebe50d
                <h3>PIC</h3>
                <div
                  className={`add_more_btn ${
                    picData.length >= 3 ? 'disabled' : ''
                  }`}
                  onClick={picData.length < 3 ? handleAddMoreClick : null}
                >
                  Add More
                </div>
              </div>
              <table>
                <tbody>
                  {picData?.map((picData) => (
                    <tr key={picData.id}>
                      <td>
                        <span>Name</span>
                        {picData.name}
                      </td>
                      <td>
                        <span>Email</span>
                        {picData.email}
                      </td>
                      <td>
                        <span>Position</span>
                        {picData.positionName}
                      </td>
                      <td>
                        <span>Phone Number</span>
                        {picData.phone}
                      </td>
                      <td>
<<<<<<< HEAD
                        <div className='action_btn'>
                          <div
                            className='delete_btn'
=======
                        <div className="action_btn">
                          <div
                            className="delete_btn"
>>>>>>> f660d458c9060317992b7643a6b3dc6267ebe50d
                            onClick={() => handleDeleteClick(picData.id)}
                          >
                            Delete
                          </div>
                          <div
<<<<<<< HEAD
                            className='edit_btn'
=======
                            className="edit_btn"
>>>>>>> f660d458c9060317992b7643a6b3dc6267ebe50d
                            onClick={() => handleEditClick(picData)}
                          >
                            Edit
                          </div>
                          <div
<<<<<<< HEAD
                            className='change_password'
=======
                            className="change_password"
>>>>>>> f660d458c9060317992b7643a6b3dc6267ebe50d
                            onClick={() => {
                              setSelectedId(picData.id); // Set ID saat tombol Change Password diklik
                              setShowPopup(true); // Tampilkan popup
                            }}
                          >
                            Change Password
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
      default:
        return null;
    }
  };
  return (
    <>
<<<<<<< HEAD
      <div className='section_homepage'>
        <CoverImage cover={companyData?.banner || null} />
        <div className='container'>
=======
      <div className="section_homepage">
        <CoverSlider
          images={[
            {src: `${companyData?.banner}`},
            {src: `${companyData?.banner}`},
          ]}
        />
        <div className="container">
>>>>>>> f660d458c9060317992b7643a6b3dc6267ebe50d
          <LeftMenu
            hqAdress={companyData?.headquarterAddress}
            officeAdress={companyData?.managementOfficeAddress}
            logo={companyData?.logo || null}
          ></LeftMenu>
          <RightMenu
            companyName={companyData?.companyName}
            companyEmail={companyData?.email}
            stockCode={companyData?.stockCode}
            listingDate={companyData?.ipoAdmissionDate}
            companyWeb={companyData?.website}
            status={companyData?.status}
            onTabClick={setActiveTab}
            activeTab={activeTab}
            setCompanyData={setCompanyData}
            setShowEditProfilePopup={setShowEditProfilePopup}
          >
            {renderContent()}
          </RightMenu>
        </div>
        {companyData?.status === 'data_submitted' && (
          <ModalRegistrationSuccess company={companyData?.companyName} />
        )}
      </div>
      {showPopup && (
        <ModalChangePassword
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          id={selectedId} // Pass ID yang dipilih ke Modal
        />
      )}
      {showPopupPic && (
        <ModalPic setShowPopupPic={setShowPopupPic} setPicData={setPicData} />
      )}
      {showPopupLeader && (
        <ModalLeader
          setShowPopupLeader={setShowPopupLeader}
          setLeaderData={setLeaderData}
        />
      )}
      {showEditPopup && (
        <ModalEditPic
          showEditPopup={showEditPopup}
          setShowEditPopup={setShowEditPopup}
          setPicData={setPicData}
          data={editPopupData}
        />
      )}
      {showEditLeaderPopup && (
        <ModalEditLeader
          showEditLeaderPopup={showEditLeaderPopup}
          setShowEditLeaderPopup={setShowEditLeaderPopup}
          setLeaderData={setLeaderData}
          data={editLeaderPopupData}
        />
      )}
      {/* {showEditPsrofilePopup && ( */}
      <ModalEditProfile
        data={companyData}
<<<<<<< HEAD
        showEditProfilePopup={showEditProfilePopup}
        setShowEditProfilePopup={setShowEditProfilePopup}
        setCompanyData={setCompanyData}
=======
        setCompanyData={setCompanyData}
        showEditProfilePopup={showEditProfilePopup}
        setShowEditProfilePopup={setShowEditProfilePopup}
>>>>>>> f660d458c9060317992b7643a6b3dc6267ebe50d
      />
      {/* )} */}
    </>
  );
}
