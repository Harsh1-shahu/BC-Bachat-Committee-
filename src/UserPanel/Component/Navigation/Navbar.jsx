import { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaTachometerAlt,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaSignOutAlt,
  FaClipboardList,
} from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdOutlineSecurity } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useProject } from "../../../Context/ProjectContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { logoutUser, menuOpen, toggleMenu, closeMenu, toggleChangePasswModal } = useProject();
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [menuOpen]);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-dropdown-wrapper")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


  // Menu items with icons + optional submenus
  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },

    {
      label: "Income Report",
      icon: <FaMoneyBillWave />,
      submenu: [
        { label: "Commando Income Report", path: "/commando", icon: <FaClipboardList /> },
        { label: "Cut-off Income Report", path: "/cut-off", icon: <FaClipboardList /> },
        { label: "Incentive Income Report", path: "/incentive", icon: <FaClipboardList /> },
      ],
    },

    { label: "BC wise Payment Report", path: "/bcwisepayment", icon: <HiOutlineDocumentReport /> },
    { label: "Wallet Transaction Report", path: "/transaction", icon: <FaExchangeAlt /> },

    // Logout item
    { label: "Logout", path: "/", icon: <FaSignOutAlt /> },
  ];

  return (
    <>
      {/* Navbar Top Section */}
      <nav className="max-w-lg mx-auto fixed top-0 w-full z-40 bg-[#1c2838] text-white shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={toggleMenu}
            className="text-2xl hover:text-gray-300 transition"
          >
            <FaBars />
          </button>

          <div onClick={() => navigate("/dashboard")}>
            <img src="/Bhisi/logo-white.png" className="w-9" alt="Logo" />
          </div>

          {/* Profile Image + Dropdown */}
          <div className="relative profile-dropdown-wrapper">
            <div
              onClick={() => setShowDropdown((prev) => !prev)}
              className="cursor-pointer"
            >
              <img
                src="https://bhisi.aaroveex.com/Content/ADMIN/dist/img/dummy.jpg"
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-gray-400"
              />
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <ul className="absolute right-0 mt-5 w-44 bg-white border-2 border-gray-400 text-gray-700 shadow-lg rounded-lg z-50 animate-fadeIn overflow-hidden">
                <li>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/profile");
                    }}
                    className="w-full text-left px-4 py-3 font-semibold active:bg-gray-200"
                  >
                    <h1 className="flex items-center gap-2 text-sm">
                      <CgProfile />
                      Profile
                    </h1>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      toggleChangePasswModal();
                    }}
                    className="w-full text-left px-4 py-3 font-semibold active:bg-gray-200"
                  >
                    <h1 className="flex items-center gap-2 text-sm">
                      <MdOutlineSecurity />
                      Change Password
                    </h1>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logoutUser();
                      navigate("/");
                    }}
                    className="w-full text-left px-4 py-3 font-semibold active:bg-gray-200"
                  >
                    <h1 className="flex items-center gap-2 text-sm">
                      <FaSignOutAlt />
                      Logout
                    </h1>
                  </button>
                </li>

              </ul>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-50" onClick={closeMenu}></div>
      )}

      {/* SIDEBAR MENU */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#5c6d81] text-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out 
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={closeMenu} className="text-2xl hover:text-gray-300 transition">
            <FaTimes />
          </button>
        </div>

        <ul className="flex flex-col space-y-2 px-6 py-6 text-sm">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.submenu ? (
                <>
                  {/* MAIN MENU ITEM */}
                  <button
                    onClick={() => setIncomeOpen((prev) => !prev)}
                    className="flex items-center justify-between w-full bg-gray-200 p-2 rounded-md hover:bg-gray-300 text-gray-700 font-bold transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </div>
                    {incomeOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </button>

                  {/* SUB MENU */}
                  <ul
                    className={`overflow-hidden transition-all duration-300 font-semibold ${incomeOpen ? "max-h-40" : "max-h-0"
                      }`}
                  >
                    {item.submenu.map((sub, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          to={sub.path}
                          onClick={closeMenu}
                          className="flex items-center gap-2 mt-0.5 bg-gray-100 text-gray-700 py-2 px-1.5 rounded-md hover:bg-gray-200 transition"
                        >
                          {sub.icon}
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : item.label === "Logout" ? (
                //  LOGOUT BUTTON
                <button
                  onClick={() => {
                    logoutUser();
                    closeMenu();
                    navigate("/");
                  }}
                  className="flex items-center gap-2 w-full text-left bg-gray-200 p-2 rounded-md hover:text-gray-900 hover:bg-gray-300 text-gray-700 font-bold transition-all duration-200"
                >
                  {item.icon}
                  {item.label}
                </button>
              ) : (
                <Link
                  to={item.path}
                  onClick={closeMenu}
                  className="flex items-center gap-2 bg-gray-200 p-2 rounded-md hover:text-gray-900 hover:bg-gray-300 text-gray-700 font-bold transition-all duration-200 whitespace-nowrap"
                >
                  {item.icon}
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        {/* Logo Section at Bottom */}
        <div className="absolute bottom-0 left-0 w-full bg-gray-800 py-4 px-5 shadow-inner">

          <div className="flex items-center justify-between">

            {/* BC Info */}
            <div className="text-center pr-4 border-r border-gray-700 flex flex-col">
              <h1 className="text-lg font-bold tracking-wider text-white">BC</h1>
              <p className="text-xs text-gray-300">(Bachat Committee)</p>
            </div>

            {/* Logo */}
            <div className="flex-1 flex justify-center">
              <img
                src="/Bhisi/logo-white.png"
                className="w-20 opacity-90 hover:opacity-100 transition-all duration-300 drop-shadow-md"
                alt="Logo"
              />
            </div>

          </div>

        </div>


      </div>
    </>
  );
};

export default Navbar;
