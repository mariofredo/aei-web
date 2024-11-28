'use client';
import Slider from 'react-slick';

// Import slick-carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from 'next/image';
import { BannerImage } from '@/public';

const SlickSlider = () => {
  const settings = {
    dots: true,  // Show navigation dots
    infinite: true,  // Loop the slides
    speed: 500,  // Slide transition speed
    slidesToShow: 1,  // Number of slides to show at once
    slidesToScroll: 1,  // Number of slides to scroll
    autoplay: true,  // Enable autoplay
    autoplaySpeed: 2000,  // Autoplay speed in milliseconds
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div>
          <Image src={BannerImage} width={1080} height={1074} alt='' />
        </div>
        <div>
          <Image src={BannerImage} width={1080} height={1074} alt='' />
        </div>
        <div>
          <Image src={BannerImage} width={1080} height={1074} alt='' />
        </div>
        {/* Add more slides as needed */}
      </Slider>
    </div>
  );
};

export default SlickSlider;
