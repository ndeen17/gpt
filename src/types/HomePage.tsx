import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleTranslateNameClick = () => {
    navigate("/chat");
  };

  const handleContactUsClick = () => {
    window.location.href = "https://www.instagram.com/oruko.mi/";
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-[#e4ded0] text-black px-4">
      {/* Header */}
      <header className="w-full py-4 flex flex-col md:flex-row justify-center md:justify-between items-center">
        <div className="text-xl font-bold tracking-wide text-center md:text-left mb-2 md:mb-0">
          Orúkọ
        </div>
        <div className="flex items-center gap-4">
          {isSearchOpen ? (
            <input
              ref={searchRef}
              type="text"
              placeholder="Search..."
              className="py-2 px-4 rounded-lg text-black transition-all duration-300 w-full md:w-auto"
            />
          ) : (
            <Search
              size={24}
              className="cursor-pointer"
              onClick={toggleSearch}
            />
          )}
          <span
            onClick={handleTranslateNameClick}
            className="text-black text-sm font-medium cursor-pointer transition-all hover:underline"
          >
            Get Closer to Your Heritage
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-light mb-6 mt-16 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
          Introducing Orúkọ.mi
        </h1>
        <div className="flex flex-col md:flex-row gap-4 mb-12 mt-8">
          <button
            onClick={handleTranslateNameClick}
            className="bg-[#5f554b] text-white py-3 px-6 rounded-full text-lg font-semibold shadow-md transition-all hover:bg-gray-700"
          >
            Translate Your Name
          </button>
          <button
            onClick={handleContactUsClick}
            className="bg-black text-white py-3 px-6 rounded-full text-lg font-semibold shadow-md transition-all hover:bg-gray-800"
          >
            Contact Us
          </button>
        </div>
        <div className="text-center max-w-2xl text-sm md:text-base leading-relaxed">
          <p className="mb-4">
            In Nigeria, names are more than just identifiers—they carry the essence of heritage, family, and identity. Each name tells a story, rooted in culture and history.
          </p>
          <p className="mb-4">
            Orúkọ.mi is here to help you reconnect with that story. This chatbot helps you translate Nigerian given names, revealing their meaning, pronunciation, and cultural significance. Whether it's Yoruba, Igbo, or Hausa, Orúkọ.mi brings your name's heritage to life, connecting you to the legacy of those who came before you.
          </p>
          <p>
            Uncover the story behind your name and strengthen your connection to your roots with Orúkọ.mi.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-sm" style={{ color: '#5f554b' }}>
        © 2025 Orúkọ. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;