'use client';
import { useCompanyData, usePicData, useLeaderData, useUpcomingData, useHistoryData, useInvoicesData } from "@/hooks";
import { CoverImage, ModalRegistrationSuccess, LeftMenu, RightMenu, TradingViewWidget, CardEvent, ModalChangePassword } from "@/components";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const { companyData, setCompanyData, loading } = useCompanyData();
    const { picData, type, email } = usePicData();
    const { leaderData } = useLeaderData();
    const { upcomingData } = useUpcomingData();
    const { historyData } = useHistoryData();
    const { invoices } = useInvoicesData();
    const [activeTab, setActiveTab] = useState("Profile"); // Default tab aktif adalah Profile
    const [activityTab, setActivityTab] = useState("upcoming"); // State untuk tab aktif
    useEffect(() => {console.log(companyData, 'companyData')}, [companyData])
    

    if (loading) {
        return <div className="loader center"></div>;
    }
    const handleTabClick = (tab) => {
        setActivityTab(tab); // Mengubah tab aktif berdasarkan klik
    };

    const renderContent = () => {
        switch (activeTab) {
            case "Profile":
                return (
                    <>
                        <div className="section_profile_left">
                            <div className="section_about_company">
                                <h4>About The Company</h4>
                                <p>{companyData.about}</p>
                            </div>
                            <div className="section_industry_company">
                                <h4>Industry Classification</h4>
                                <div className="sic_box">
                                    <h5>Industrial Sector</h5>
                                    <p>{companyData.industryClassificationName}</p>
                                </div>
                                <div className="sic_box">
                                    <h5>Sub Sector</h5>
                                    <p>{companyData.subSector}</p>
                                </div>
                            </div>
                        </div>
                        <div className="section_profile_right">
                            <TradingViewWidget />
                        </div>
                    </>

                )
            case "Membership":
                return (
                    <>
                        {companyData.status === 'data_submitted' ? (
                            <div className="section_membership_none">
                                <h3>Complete your registration</h3>
                                <p>Please download and sign the form bellow.</p>
                                <p>Then <span className="red_text">upload and send</span> the signed file to <span className="black_text">AEI office</span> address to complete the registration</p>
                                <Link href='' className="download_pdf_btn"><span>{companyData.companyName} Registration Form.PDF</span></Link>
                            </div>
                        ) : companyData.status === 'in_review' ? (
                            <div className="section_membership_none in_review">
                                <h3>Waiting for Confirmation</h3>
                                <p>Your registration will be approved after we receive your <br/>registration hard file that already sended to our office.</p>
                            </div>
                        ) :
                            <div className="section_membership">
                                <div className="sm_left">
                                    <div className="membership_box">
                                        <h3>Membership</h3>
                                        <div className="mb_ctr">
                                            <h5>Membership Number</h5>
                                            <span>{companyData.membershipNumber}</span>
                                        </div>
                                        <div className="mb_ctr">
                                            <h5>Member Category</h5>
                                            <span className="green_text">{companyData.companyCategoryName}</span>
                                        </div>
                                    </div>
                                    {companyData.memberStatus === 'inactive' ? (
                                        <div className="member_status inactive">status: <span>Inactive</span></div>
                                    ) : companyData.memberStatus === 'paid' ? (
                                        <div className="member_status paid">status: <span>Active</span></div>
                                    ) : (
                                        <div className="member_status expired">status: <span>Expired</span></div>
                                    )}

                                </div>
                                <div className="sm_right">
                                    <div className="section_payment_home">
                                        <h3>Payment History</h3>
                                        <div className="sp_wrap">
                                            {invoices.map((invoice) => (
                                            <div className="sp_box">
                                                <h5>{invoice.code}</h5>
                                                {invoice.note && <span className="info">{invoice.note}</span>}
                                                <span className="date">{invoice.invoiceDate}</span>
                                                {invoice.status === 'in_review' ? (
                                                    <span className="orange_btn">waiting confirmation</span>
                                                ) : invoice.status === 'paid' ? (
                                                    <span className="blue_btn"><span></span></span>
                                                ) : (
                                                    <Link href={`/payment?invoiceCode=${invoice.id}`} className="green_btn">Pay</Link>
                                                )}
                                            </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </>
                )
            case "Activity":
                return (
                    <div className="section_activity">
                        <div className="sa_top">
                            <h3>Seminar</h3>
                            <div className="sa_menu">
                                <div
                                    className={`upcoming_btn ${activityTab === "upcoming" ? "active" : ""}`}
                                    onClick={() => handleTabClick("upcoming")}
                                >
                                    Upcoming
                                </div>
                                {historyData.length > 0 ? (
                                    <div
                                        className={`history_btn ${activityTab === "history" ? "active" : ""}`}
                                        onClick={() => handleTabClick("history")}
                                    >
                                        History
                                    </div>
                                ) : (
                                    <div className="history_btn"><span>History</span></div>
                                )}
                            </div>
                        </div>
                        <div className="card_flex">
                            {activityTab === "upcoming" && <CardEvent events={upcomingData} />}
                            {activityTab === "history" && <CardEvent events={historyData} />}
                        </div>
                    </div>
                )
            case "Leaders and PIC":
                return (
                    <>
                        <div className="section_table_box">
                            <div className="stb_ctr">
                                <h3>Leader</h3>
                                <div className="add_more_btn">Add More</div>
                            </div>
                            <table>
                                {leaderData.map((leaderData) => (
                                    <tr>
                                        <td>
                                            <span>Name</span>
                                            {leaderData.title} {leaderData.name}
                                        </td>
                                        <td>
                                            <span>Position</span>
                                            {leaderData.positionName}
                                        </td>
                                        <td>
                                            <div className="action_btn">
                                                <div className="delete_btn">Delete</div>
                                                <div className="edit_btn">Edit</div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </table>
                        </div>
                        <div className="section_table_box">
                            <div className="stb_ctr">
                                <h3>PIC</h3>
                                <div className="add_more_btn">Add More</div>
                            </div>
                            <table>
                                {picData.map((picData) => (
                                    <tr>
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
                                            <div className="action_btn">
                                                {type === "pic" && email === picData.email || type === "master" ? (
                                                    <>
                                                        <div className="delete_btn">Delete</div>
                                                        <div className="edit_btn">Edit</div>
                                                        <div 
                                                            className="change_password" 
                                                            onClick={() => {
                                                                setSelectedId(picData.id);  // Set ID saat tombol Change Password diklik
                                                                setShowPopup(true);  // Tampilkan popup
                                                            }}
                                                        >
                                                            Change Password
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="delete_btn disabled">Delete</div>
                                                        <div className="edit_btn disabled">Edit</div>
                                                        <div className="change_password disabled">Change Password</div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </table>
                        </div>
                    </>
                )
            default:
                return null;
        }
    };  
    return (
        <>
        <div className="section_homepage">
            <CoverImage cover={companyData?.banner || null} />
            <div className="container">
                <LeftMenu hqAdress={companyData.headquarterAddress} officeAdress={companyData.managementOfficeAddress} logo={companyData.logo || null}></LeftMenu>
                <RightMenu
                    companyName={companyData.companyName}
                    companyEmail={companyData.email}
                    stockCode={companyData.stockCode}
                    listingDate={companyData.ipoAdmissionDate}
                    companyWeb={companyData.website}
                    status={companyData.status}
                    onTabClick={setActiveTab}
                    activeTab={activeTab}
                    setCompanyData={setCompanyData}
                >
                {renderContent()}
                </RightMenu>
            </div>
             {status === 'data_submitted' && <ModalRegistrationSuccess company={companyData.companyName} /> }
        </div>
        {showPopup && (
            <ModalChangePassword
                showPopup={showPopup}
                setShowPopup={setShowPopup}
                id={selectedId}  // Pass ID yang dipilih ke Modal
            />
        )}
        </>
    );
}
