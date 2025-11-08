import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  ChartBarIcon,
  UsersIcon,
  QuestionMarkCircleIcon,
  ClipboardDocumentCheckIcon,
  TrophyIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "../../hooks/useAuth";
import ConfirmationModal from "../common/ConfirmationModal";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: <ChartBarIcon className="h-5 w-5 text-blue-500" />,
  },
  {
    name: "Manage Teams",
    href: "/admin/teams",
    icon: <UsersIcon className="h-5 w-5 text-emerald-500" />,
  },
  {
    name: "Manage Questions",
    href: "/admin/questions",
    icon: <QuestionMarkCircleIcon className="h-5 w-5 text-purple-500" />,
  },
  {
    name: "Evaluate Submissions",
    href: "/admin/evaluate",
    icon: <ClipboardDocumentCheckIcon className="h-5 w-5 text-orange-500" />,
  },
  {
    name: "Publish Results",
    href: "/admin/results",
    icon: <TrophyIcon className="h-5 w-5 text-yellow-500" />,
  },
  {
    name: "Generate Certificates",
    href: "/admin/certificates",
    icon: <DocumentTextIcon className="h-5 w-5 text-teal-500" />,
  },
];

function NavItem({ item, closeMenu }) {
  return (
    <NavLink
      to={item.href}
      end={item.href === "/admin"}
      onClick={() => closeMenu()} // ✅ Close menu on click
      className={({ isActive }) =>
        `
        flex items-center px-4 py-2.5 rounded-lg font-medium transition-all duration-300 relative group
        ${
          isActive
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-[0_0_10px_2px_rgba(59,130,246,0.4)]"
            : "text-gray-700 hover:bg-blue-50 hover:shadow-[0_0_10px_2px_rgba(59,130,246,0.15)]"
        }
      `
      }
    >
      <span
        className={`mr-3 transform transition-transform duration-300 group-hover:scale-110 ${
          window.location.pathname === item.href ? "scale-110" : ""
        }`}
      >
        {item.icon}
      </span>
      <span>{item.name}</span>

      {/* Active Accent Bar */}
      <span
        className={`absolute right-0 top-0 h-full w-[4px] rounded-l-full transition-all duration-300 ${
          window.location.pathname === item.href
            ? "bg-blue-600 opacity-100"
            : "opacity-0 group-hover:opacity-50 bg-blue-400"
        }`}
      ></span>
    </NavLink>
  );
}

export default function AdminLayout() {
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsModalOpen(false);
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-[#f9fbff] via-[#eef4ff] to-[#dbeafe] text-gray-800 relative">
        {/* --- Overlay for mobile sidebar --- */}
        {menuOpen && (
          <div
            onClick={closeMenu}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          ></div>
        )}

        {/* --- Sidebar (Slides from right on mobile) --- */}
        <aside
          className={`fixed md:static right-0 md:right-auto z-50 w-64 bg-white border-l md:border-r border-gray-200 shadow-lg flex flex-col transform transition-transform duration-300 
          ${menuOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}
        >
          {/* --- Header --- */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-blue-500 shadow-md flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white tracking-wide">
              Admin Panel
            </h2>
            <button
              className="md:hidden text-white hover:text-blue-100 transition"
              onClick={closeMenu}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* --- Navigation --- */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} closeMenu={closeMenu} />
            ))}
          </nav>

          {/* --- Logout Button --- */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center gap-3 text-red-600 font-medium px-4 py-2.5 rounded-lg 
                         hover:bg-red-50 hover:shadow-[0_0_10px_2px_rgba(255,0,0,0.25)] transition-all duration-200"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500" />
              Logout
            </button>
          </div>
        </aside>

        {/* --- Mobile Topbar --- */}
        <div className="md:hidden bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex justify-between items-center shadow-md z-30">
          <h2 className="text-white text-lg font-semibold">Admin Panel</h2>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white hover:text-blue-100 transition"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* --- Main Content --- */}
        <main className="relative flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto bg-gradient-to-br from-[#ffffff] via-[#f0f4ff] to-[#e5edff] backdrop-blur-md z-10">
          <div className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent" />
          <Outlet />
        </main>
      </div>

      {/* --- Logout Confirmation Modal --- */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        confirmVariant="danger"
      />
    </>
  );
}
