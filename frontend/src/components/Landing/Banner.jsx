import React from "react";
import banner from "../../assets/banner1.jpeg";

const Banner = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Background Image */}
      <img
        src={banner}
        alt="Book Banner"
        className="w-full h-full object-cover object-bottom"
      />

 
    </div>
  );
};

export default Banner;
