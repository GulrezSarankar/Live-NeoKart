import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  "/assets/slider1.jpeg",
  "/assets/slide2.jpeg"
    "/assets/slide2.jpeg"

  
];

export default function SliderBanner() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className="w-full max-h-[400px] overflow-hidden">
      <Slider {...settings}>
        {images.map((img, index) => (
          <img key={index} src={img} alt={`Slide ${index}`} className="w-full h-[400px] object-cover" />
        ))}
      </Slider>
    </div>
  );
}
