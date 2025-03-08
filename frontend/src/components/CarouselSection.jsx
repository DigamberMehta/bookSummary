import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CarouselSection = () => {
  const CustomPrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 shadow-md z-10"
    >
      <ChevronLeft size={24} />
    </button>
  );

  const CustomNextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 shadow-md z-10"
    >
      <ChevronRight size={24} />
    </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 6 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const books = [
    { img: 'https://marketplace.canva.com/EAFf0E5urqk/1/0/1003w/canva-blue-and-green-surreal-fiction-book-cover-53S3IzrNxvY.jpg' },
    { img: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/art-book-cover-design-template-34323b0f0734dccded21e0e3bebf004c_screen.jpg?ts=1637015198' },
    { img: 'https://miblart.com/wp-content/uploads/2020/08/ZXAfJR0M-663x1024-1.jpg' },
    { img: 'https://marketplace.canva.com/EAFfSnGl7II/2/0/1003w/canva-elegant-dark-woods-fantasy-photo-book-cover-vAt8PH1CmqQ.jpg' },
    { img: 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg' },
    { img: 'https://m.media-amazon.com/images/I/51Zymoq7UnL.jpg' },
    { img: 'https://marketplace.canva.com/EAFf0E5urqk/1/0/1003w/canva-blue-and-green-surreal-fiction-book-cover-53S3IzrNxvY.jpg' },
    { img: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/art-book-cover-design-template-34323b0f0734dccded21e0e3bebf004c_screen.jpg?ts=1637015198' },
    { img: 'https://marketplace.canva.com/EAFf0E5urqk/1/0/1003w/canva-blue-and-green-surreal-fiction-book-cover-53S3IzrNxvY.jpg' },
    { img: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/art-book-cover-design-template-34323b0f0734dccded21e0e3bebf004c_screen.jpg?ts=1637015198' },
    { img: 'https://miblart.com/wp-content/uploads/2020/08/ZXAfJR0M-663x1024-1.jpg' },
    { img: 'https://marketplace.canva.com/EAFfSnGl7II/2/0/1003w/canva-elegant-dark-woods-fantasy-photo-book-cover-vAt8PH1CmqQ.jpg' },
    { img: 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg' },
    { img: 'https://m.media-amazon.com/images/I/51Zymoq7UnL.jpg' },
    { img: 'https://marketplace.canva.com/EAFf0E5urqk/1/0/1003w/canva-blue-and-green-surreal-fiction-book-cover-53S3IzrNxvY.jpg' },
    { img: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/art-book-cover-design-template-34323b0f0734dccded21e0e3bebf004c_screen.jpg?ts=1637015198' },
  ];

  return (
    <>
    <section className="bg-gray-50 py-16 px-4">
      <div className="w-[95%] mx-auto relative">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Featured Books
        </h2>
        <Slider {...settings}>
          {books.map((book, index) => (
            <div key={index} className="p-2">
              <div className="bg-white rounded shadow-md w-full aspect-[2/3] overflow-hidden">
                <img 
                  src={book.img} 
                  alt={`Book ${index + 1}`} 
                  className="w-full h-full object-cover cursor-pointer" 
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
    </>
  );
};

export default CarouselSection;
