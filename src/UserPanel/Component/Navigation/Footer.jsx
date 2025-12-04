import { FaHome, FaServer, FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useProject } from "../../../Context/ProjectContext";

const Footer = () => {
  const navigate = useNavigate();
  const { toggleMenu, toggleWithdrawModal } = useProject();
  return (
    <footer className="max-w-lg fixed bottom-0 w-full bg-[#1c2838] text-white z-40 shadow-inner">
      <div className="flex justify-around items-center py-3">
        {/* Home */}
        <div
          onClick={() => navigate("/dashboard")}
          className="flex flex-col items-center cursor-pointer hover:text-gray-300 transition">
          <FaHome className="text-xl mb-1" />
          <span className="text-sm font-medium">Home</span>
        </div>

        {/* Menu */}
        <div
          onClick={toggleMenu}
          className="flex flex-col items-center cursor-pointer hover:text-gray-300 transition">
          <FaServer className="text-xl mb-1" />
          <span className="text-sm font-medium">Menu</span>
        </div>

        {/* Withdrawal */}
        <div
          onClick={toggleWithdrawModal}
          className="flex flex-col items-center cursor-pointer hover:text-gray-300 transition">
          <FaWallet className="text-xl mb-1" />
          <span className="text-sm font-medium">Withdrawal</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
