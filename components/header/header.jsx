'use client';
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Logo } from "@/public";
import Cookies from "js-cookie";
import "../../styles/header.scss";
import Link from "next/link";
export default function Header(){
    const pathname = usePathname(); // Dapatkan path aktif
    const isHomePage = pathname === "/" || pathname.startsWith("/event/"); // Cek apakah halaman home
    const router = useRouter();
    const handleLogout = async () => {
        try {
            // Panggil API logout
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
    
            if (response.ok) {
                // Hapus token dari Cookies
                Cookies.remove("token", { path: "/" });
                Cookies.remove("is_profile_completed", { path: "/" });
                Cookies.remove("type", { path: "/" });
                Cookies.remove("email", { path: "/" });
                router.push("/login"); // Redirect to the login page
            } else {
                alert("Failed to logout. Please try again.");
            }
        } catch (error) {
            console.error("Error during logout:", error);
            alert("An error occurred. Please try again.");
        }
    };
    
    return (
        <>
            <header className={isHomePage ? "login" : ""}>
                <div className="container">
                    <h1><Link href="/"><Image className="logo" src={Logo} alt="Asosiasi Emiten Indonesia" width={135} height={50}></Image></Link></h1>
                    {isHomePage && (
                        <div className="notif_box"></div>
                    )}
                    <div className="lang_box">
                        <span className="lang active">Eng</span>
                        <span className="lang">Ind</span>
                    </div>
                    {isHomePage && (
                        <div className="logout_btn" onClick={handleLogout}>Logout</div>
                    )}
                </div>
            </header>
        </>
    );
}
