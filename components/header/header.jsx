'use client';
<<<<<<< HEAD
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
=======
import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import {Logo} from '@/public';
// import '@/styles/header.scss';
export default function Header() {
  const {t, i18n} = useTranslation();
  const selectLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  return (
    <header>
      <div className='container'>
        <h1>
          <Image
            className='logo'
            src={Logo}
            alt='Asosiasi Emiten Indonesia'
            width={135}
            height={50}
          ></Image>
        </h1>
        <h2>{t('login your account')}</h2>
        <div className='lang_wrapper'>
          <div className='lang_box'>
            <span
              className={`lang ${i18n.language === 'id' ? 'active' : ''}`}
              onClick={() => selectLanguage('id')}
            >
              Ind
            </span>
            <span
              className={`lang ${i18n.language === 'en' ? 'active' : ''}`}
              onClick={() => selectLanguage('en')}
            >
              Eng
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
>>>>>>> da8271c32c15f977ab9aa2324f94aa8a0fad1564
