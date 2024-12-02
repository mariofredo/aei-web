'use client';
import { useCompanyData, usePicData, useLeaderData } from "@/hooks";
import { CoverImage, ModalRegistrationSuccess, LeftMenu, RightMenu, TradingViewWidget } from "@/components";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
    const { companyData, setCompanyData, loading } = useCompanyData();
    const { picData } = usePicData();
    const { leaderData } = useLeaderData();
    const [activeTab, setActiveTab] = useState("Profile"); // Default tab aktif adalah Profile
    useEffect(() => {console.log(companyData, 'companyData')}, [companyData])

    if (loading) {
        return <div className="loader center"></div>;
    }

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
                        ) : <div></div>
                        }
                    </>
                )
            case "Activity":
                return <p>Ini adalah konten Activity</p>;
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
                                                <div className="delete_btn">Delete</div>
                                                <div className="edit_btn">Edit</div>
                                                <div className="change_password">Change Password</div>
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
            <ModalRegistrationSuccess company={companyData.companyName} />
        </div>
    );
}
