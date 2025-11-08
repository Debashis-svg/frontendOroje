// src/components/common/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom"; // <-- Import useNavigate
import { Link as ScrollLink, scroller } from "react-scroll"; // <-- Import react-scroll
import { useAuth } from "../../hooks/useAuth";
import {
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  GiftIcon,
  InformationCircleIcon,
  MapIcon, // <-- ADDED
  CodeBracketIcon, // <-- ADDED
} from "@heroicons/react/24/solid";
import ConfirmationModal from "./ConfirmationModal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const navigate = useNavigate(); // <-- Hook for navigation

  const handleLogout = () => {
    logout();
    setIsModalOpen(false);
    setMenuOpen(false);
  };

  const closeModal = () => setIsModalOpen(false);

  const closeMobileMenu = () => {
    setMenuClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setMenuClosing(false);
    }, 250);
  };

  // --- NEW: Scroll Handler ---
  // This will navigate to home if we're not on it, then scroll
  const handleScrollLink = (target) => {
    closeMobileMenu();
    if (window.location.pathname !== '/') {
      navigate('/');
      // Wait for navigation, then scroll
      setTimeout(() => {
        scroller.scrollTo(target, {
          smooth: true,
          duration: 500,
          offset: -80, // Adjust offset for your sticky navbar
        });
      }, 100);
    } else {
      // If already on homepage, just scroll
      scroller.scrollTo(target, {
        smooth: true,
        duration: 500,
        offset: -80,
      });
    }
  };

  // --- UPDATED menuItems ARRAY ---
  const menuItems = [
    { name: "Home", href: "/", type: "route", icon: <HomeIcon className="h-5 w-5 text-blue-500" /> },
    { name: "Rounds", href: "rounds", type: "scroll", icon: <CodeBracketIcon className="h-5 w-5 text-teal-500" /> },
    { name: "Prizes", href: "prizes", type: "scroll", icon: <GiftIcon className="h-5 w-5 text-yellow-500" /> },
    { name: "About", href: "/about", type: "route", icon: <InformationCircleIcon className="h-5 w-5 text-purple-500" /> },
    { name: "Map", href: "https://www.google.com/maps/place/National+Institute+of+Technology+Silchar/@24.7555,92.7977,17z", type: "external", icon: <MapIcon className="h-5 w-5 text-green-500" /> },
  ];

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-700 via-blue-600 to-teal-500 text-white shadow-lg sticky top-0 z-50 backdrop-blur-md border-b border-blue-400/20">
        <div className="max-w-7xl mx-auto px-8 md:px-12 py-3 flex justify-between items-center">
          <Link
            to="/"
            className="text-xl md:text-2xl font-extrabold tracking-wide text-white drop-shadow-sm hover:scale-[1.02] transition-transform duration-300"
          >
            NIT Silchar <span className="text-teal-200">Hackathon 2026</span>
          </Link>

          {/* --- UPDATED Desktop Links --- */}
          <div className="hidden md:flex items-center space-x-7">
            {menuItems.map((item) => {
              if (item.type === 'route') {
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `font-medium transition-all duration-200 relative ${
                        isActive
                          ? "text-white after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-white"
                          : "text-blue-50 hover:text-white"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                );
              }
              if (item.type === 'scroll') {
                return (
                  <button
                    key={item.name}
                    onClick={() => handleScrollLink(item.href)}
                    className="font-medium text-blue-50 hover:text-white transition-all duration-200"
                  >
                    {item.name}
                  </button>
                );
              }
              if (item.type === 'external') {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-50 hover:text-white transition-all duration-200"
                  >
                    {item.name}
                  </a>
                );
              }
              return null;
            })}

            {user ? (
              <>
                {user.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => `flex items-center ... ${isActive ? "text-yellow-300 scale-[1.05]" : "text-yellow-300 hover:text-yellow-200"}`}
                  >
                    <ShieldCheckIcon className="h-5 w-5 mr-1" />
                    Admin
                  </NavLink>
                )}
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => `flex items-center ... ${isActive ? "text-white underline underline-offset-4" : "text-blue-50 hover:text-blue-100"}`}
                >
                  <UserCircleIcon className="h-5 w-5 mr-1" />
                  Dashboard
                </NavLink>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center font-semibold text-red-500 hover:text-red-400 transition-all duration-200"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1 text-red-500" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="font-medium text-white hover:text-blue-100">
                  Login
                </NavLink>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 font-semibold py-2 px-5 rounded-lg shadow-sm hover:shadow-md hover:bg-blue-50 transition duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          {/* --- END UPDATED Desktop Links --- */}


          <button
            type="button"
            className="md:hidden focus:outline-none p-2 rounded-md hover:bg-blue-700/60 transition-all"
            onClick={() => setMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6 text-white" />
          </button>
        </div>
      </nav>

      {/* --- UPDATED Mobile Drawer --- */}
      {menuOpen && (
        <>
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[99] ${
              menuClosing ? "opacity-0 transition-opacity duration-300" : "animate-fadeIn"
            }`}
            onClick={closeMobileMenu}
          />

          <div
            className={`fixed right-0 top-0 h-auto mt-16 mr-4 w-[250px] bg-white border border-gray-200 shadow-2xl rounded-xl z-[100]
                        transform ${menuClosing ? "animate-slideOutToRight" : "animate-slideInFromRight"}`}
          >
            <div className="flex justify-between items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-t-xl shadow-sm">
              <h2 className="text-lg font-semibold text-white">Menu</h2>
              <button
                onClick={closeMobileMenu}
                className="p-1 hover:bg-blue-700/40 rounded-md transition"
              >
                <XMarkIcon className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="flex flex-col px-4 py-4 space-y-1 text-gray-800">
              {menuItems.map((item) => {
                const itemClass = ({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                      : "hover:bg-blue-50 text-gray-700"
                  }`;
                
                if (item.type === 'route') {
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={closeMobileMenu}
                      className={itemClass}
                    >
                      {item.icon}
                      {item.name}
                    </NavLink>
                  );
                }
                if (item.type === 'scroll') {
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleScrollLink(item.href)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 hover:bg-blue-50 text-gray-700 w-full"
                    >
                      {item.icon}
                      {item.name}
                    </button>
                  );
                }
                if (item.type === 'external') {
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 hover:bg-blue-50 text-gray-700 w-full"
                    >
                      {item.icon}
                      {item.name}
                    </a>
                  );
                }
                return null;
              })}

              <div className="border-t border-gray-200 my-2"></div>

              {user && (
                <>
                  <NavLink
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `flex items-center gap-3 ... ${isActive ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md" : "hover:bg-blue-50 text-gray-700"}`}
                  >
                    <UserCircleIcon className="h-5 w-5 text-blue-500" />
                    Dashboard
                  </NavLink>
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      closeMobileMenu();
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all duration-300"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        confirmVariant="danger"
      />
    </>
  );
}