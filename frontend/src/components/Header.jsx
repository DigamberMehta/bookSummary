import React from "react";

const Header = () => {
  return (
    <div>
      <header className="bg-white shadow-md min-h-[80px]">
        <nav className="flex items-center justify-between px-4 py-4 md:px-8">
          <div className="text-2xl font-bold text-gray-800">Book Summaries</div>
          <div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200">
              Sign In
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
