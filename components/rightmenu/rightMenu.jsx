import Link from 'next/link';
import '../../styles/rightMenu.scss';
export default function RightMenu({companyName, stockCode, listingDate, admissionDate, companyWeb, companyEmail, children, status, onTabClick, activeTab}) {
    return(
        <div className="section_right_menu">
            <div className="section_top_menu">
                <div className="section_company_name">
                    <h2>{companyName}</h2>
                    <span className="edit_profile_btn">Edit Profile</span>
                </div>
                <div className="section_company_stock_code">
                    <h5>Stock Code:</h5>
                    <span>{stockCode}</span>
                </div>
                <div className="section_company_date">
                    <div className="listing_date">Listing Date <span>{listingDate}</span></div>
                    <div className="admission_date">AEI Admission Date <span>{admissionDate}</span></div>
                </div>
                <div className="section_company_web">
                    <div className="company_website"><Link href={companyWeb} target='_blank' >{companyWeb}</Link></div>
                    <div className="company_email">{companyEmail}</div>
                    {status === 'data_submitted' ? (
                        <div className="data_submitted">Upload Registration Form</div>
                    ) : status === 'in_review' ? (
                        <div className="in_review">Waiting for confirmation</div>
                    ) : null
                    }
                </div>
                <div className="section_company_menu">
                <ul>
                        <li
                            className={activeTab === "Profile" ? "active" : ""}
                            onClick={() => onTabClick("Profile")}
                        >
                            Profile
                        </li>
                        <li
                            className={activeTab === "Membership" ? "active" : ""}
                            onClick={() => onTabClick("Membership")}
                        >
                            Membership
                        </li>
                        <li
                            className={activeTab === "Activity" ? "active" : ""}
                            onClick={() => onTabClick("Activity")}
                        >
                            Activity
                        </li>
                        <li
                            className={activeTab === "Leaders and PIC" ? "active" : ""}
                            onClick={() => onTabClick("Leaders and PIC")}
                        >
                            Leaders and PIC
                        </li>
                    </ul>
                </div>
            </div>
            <div className="section_bottom_ctr">
                {children}
            </div>
        </div>
    )
}