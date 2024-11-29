'use client';
import Image from "next/image";
import { Logo } from "@/public";
import "../../styles/header.scss";
export default function Header(){
    return (
        <header>
            <div className="container">
                <h1><Image className="logo" src={Logo} alt="Asosiasi Emiten Indonesia" width={135} height={50}></Image></h1>
                <div className="lang_box">
                    <span className="lang active">Eng</span>
                    <span className="lang">Ind</span>
                </div>
            </div>
        </header>
    );
}
