'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            try {
                // Panggil API logout
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                });

                if (response.ok) {
                    // Hapus token dari Cookies
                    Cookies.remove("token", { path: "/" });
                    Cookies.remove("is_profile_completed", { path: "/" });
                    Cookies.remove("type", { path: "/" });
                    Cookies.remove("email", { path: "/" });

                    // Redirect ke halaman login
                    router.push("/login");
                } else {
                    alert("Failed to logout. Please try again.");
                }
            } catch (error) {
                console.error("Error during logout:", error);
                alert("An error occurred. Please try again.");
            }
        };

        logout();
    }, [router]);

    return (
        <div className="loader center"></div>
    );
}
