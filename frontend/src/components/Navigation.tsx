import { useState } from "react";
import { NavLink } from "react-router-dom";
import smallLogo from "../public/images/small_logo.svg";

const navItems = [
  { path: "/hospitals", label: "Hospitals" },
  { path: "/reports", label: "Reports" },
  { path: "/profile", label: "Profile" },
  { path: "/login", label: "Login" },
];

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 relative z-50">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <img src={smallLogo} alt="Logo" className="w-9 h-9" />
          <span className="text-xl font-bold text-[#22DE61]">MediPort</span>
        </div>

        {/* Desktop Navigation - hidden on mobile, flex on md+ */}
        <ul className="hidden md:flex gap-2 list-none m-0 p-0">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? "text-[#22DE61] font-semibold bg-[#E8FBE8]"
                      : "text-gray-500 font-medium hover:bg-gray-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Hamburger Button - visible on mobile, hidden on md+ */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex md:hidden flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer"
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-0.5 bg-gray-800 rounded transition-all ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-gray-800 rounded transition-all ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-gray-800 rounded transition-all ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Overlay - only on mobile */}
      <div
        className={`md:hidden fixed inset-0 top-[69px] bg-black/50 z-40 transition-opacity ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu - only on mobile */}
      <div
        className={`md:hidden fixed top-[69px] right-0 w-72 h-[calc(100vh-69px)] bg-white shadow-xl z-50 p-6 transition-transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="list-none m-0 p-0 flex flex-col gap-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-base transition-all ${
                    isActive
                      ? "text-[#22DE61] font-semibold bg-[#E8FBE8]"
                      : "text-gray-800 font-medium bg-gray-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Navigation;
