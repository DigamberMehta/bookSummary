import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CarouselSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Featured Books
        </h2>
        <Slider {...settings}>
          {[
            {
              img: 'https://marketplace.canva.com/EAFf0E5urqk/1/0/1003w/canva-blue-and-green-surreal-fiction-book-cover-53S3IzrNxvY.jpg',
              title: 'Book Title One',
              desc: 'A quick description of this book. Discover its main themes and highlights.',
            },
            {
              img: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/art-book-cover-design-template-34323b0f0734dccded21e0e3bebf004c_screen.jpg?ts=1637015198',
              title: 'Book Title Two',
              desc: 'Another exciting book – get quick insights and summaries with ease.',
            },
            {
              img: 'https://miblart.com/wp-content/uploads/2020/08/ZXAfJR0M-663x1024-1.jpg',
              title: 'Book Title Three',
              desc: 'Dive into the essential lessons from this popular read in just a few minutes.',
            },
            {
              img: 'https://marketplace.canva.com/EAFfSnGl7II/2/0/1003w/canva-elegant-dark-woods-fantasy-photo-book-cover-vAt8PH1CmqQ.jpg',
              title: 'Book Title Four',
              desc: 'Gain a fresh perspective with an overview of key takeaways.',
            },
          ].map((book, index) => (
            <div key={index} className="p-4">
              <div className="bg-white rounded shadow-md h-full flex flex-col items-center p-4">
                <img src={book.img} alt={book.title} className="mb-4 w-32 h-48 object-cover" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{book.title}</h3>
                <p className="text-gray-600 text-sm">{book.desc}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default CarouselSection;
