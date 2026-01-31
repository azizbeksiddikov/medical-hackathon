import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import smallLogo from "../public/images/small_logo.svg";

import homeIcon from "../public/images/shopping_cart.svg";
import homeIconActive from "../public/images/shopping_cart_active.svg";
import hospitalIcon from "../public/images/calendar.svg";
import hospitalIconActive from "../public/images/calendar_active.svg";
import reportIcon from "../public/images/notification_no_alert.svg";
import reportIconActive from "../public/images/notification_no_alert_active.svg";
import reportIconAlert from "../public/images/notification.svg";
import reportIconAlertActive from "../public/images/notification_active.svg";
import myIcon from "../public/images/user_profile.svg";
import myIconActive from "../public/images/user_profile_active.svg";

const baseNavItems = [
  { path: "/app", label: "Home", icon: homeIcon, iconActive: homeIconActive },
  {
    path: "/app/hospitals",
    label: "Hospital",
    icon: hospitalIcon,
    iconActive: hospitalIconActive,
  },
  {
    path: "/app/reports",
    label: "Report",
    icon: reportIcon,
    iconActive: reportIconActive,
    iconAlert: reportIconAlert,
    iconAlertActive: reportIconAlertActive,
  },
];

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  // TODO: Connect this to actual notification state
  const hasNotifications = true;

  const navItems = [
    ...baseNavItems,
    isAuthenticated
      ? {
          path: "/app/profile",
          label: "My",
          icon: myIcon,
          iconActive: myIconActive,
        }
      : {
          path: "/login",
          label: "Login",
          icon: myIcon,
          iconActive: myIconActive,
        },
  ];

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 relative z-50">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <img src={smallLogo} alt="Logo" className="w-9 h-9" />
          <span className="text-xl font-bold text-primary">MediPort</span>
        </div>

        {/* Desktop Navigation - hidden on mobile, flex on md+ */}
        <ul className="hidden md:flex gap-2 list-none m-0 p-0">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/app"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-gray font-medium hover:bg-gray-100"
                  }`
                }
              >
                {({ isActive }) => {
                  let iconSrc = isActive ? item.iconActive : item.icon;
                  if (
                    item.label === "Report" &&
                    hasNotifications &&
                    item.iconAlert
                  ) {
                    iconSrc = isActive
                      ? item.iconAlertActive || item.iconActive
                      : item.iconAlert;
                  }
                  return (
                    <>
                      <img src={iconSrc} alt={item.label} className="w-5 h-5" />
                      {item.label}
                    </>
                  );
                }}
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
                end={item.path === "/"}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all ${
                    isActive
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-gray-800 font-medium bg-gray-100"
                  }`
                }
              >
                {({ isActive }) => {
                  let iconSrc = isActive ? item.iconActive : item.icon;
                  if (
                    item.label === "Report" &&
                    hasNotifications &&
                    item.iconAlert
                  ) {
                    iconSrc = isActive
                      ? item.iconAlertActive || item.iconActive
                      : item.iconAlert;
                  }
                  return (
                    <>
                      <img src={iconSrc} alt={item.label} className="w-5 h-5" />
                      {item.label}
                    </>
                  );
                }}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Navigation;
