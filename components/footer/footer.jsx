import { Logo, iconFacebook, iconInstagram, iconTiktok, iconWhatsapp, iconYoutube } from "@/public";
import Image from "next/image";
import Link from "next/link";
import '../../styles/footer.scss';

export default function Footer() {
    return(
        <footer>
            <div className="container">
                <Image className="logo" src={Logo} alt="Asosiasi Emiten Indonesia" width={135} height={50}></Image>
                <div className="social_media">
                    <span>Follow our social media</span>
                    <ul>
                        <li><Link href=''><Image src={iconFacebook} alt="" width={24} height={24} ></Image> </Link></li>
                        <li><Link href=''><Image src={iconInstagram} alt="" width={24} height={24} ></Image> </Link></li>
                        <li><Link href=''><Image src={iconTiktok} alt="" width={24} height={24} ></Image> </Link></li>
                        <li><Link href=''><Image src={iconYoutube} alt="" width={24} height={24} ></Image> </Link></li>
                        <li><Link href=''><Image src={iconWhatsapp} alt="" width={24} height={24} ></Image> </Link></li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}