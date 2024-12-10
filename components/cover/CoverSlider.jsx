'use client';
import Slider from 'react-slick';
import Image from 'next/image';
import {useState} from 'react';
import '../../styles/cover-slider.scss';

const CoverSlider = ({images}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const [preview, setPreview] = useState(images || []);

  return (
    <div className="section_cover_slider">
      <Slider {...settings}>
        {preview?.map((image, index) => (
          <div key={index} className="slider_image">
            <Image
              src={image.src}
              alt={`Slide ${index + 1}`}
              width={1280}
              height={420}
              objectFit="cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CoverSlider;
