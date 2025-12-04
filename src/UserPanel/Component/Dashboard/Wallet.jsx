import { FaWallet, FaArrowCircleRight, FaCrown } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { useProject } from "../../../Context/ProjectContext";

const Wallet = () => {
  const { toggleWithdrawModal, walletAmount, toggleRigesterModal, loading, user, showNotification } = useProject();

  const userRank = "Gold Member";

  return (
    <>
      {/* Wallet Card */}
      <div className="bg-linear-to-r from-[#b67b1a] to-[#d8ae4a] text-white rounded-2xl px-3 py-5 flex flex-col shadow-md w-full">
        <div className="flex items-center justify-between">

          {/* Left Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <FaWallet className="text-xl" />
              <span className="font-semibold text-lg">Wallet</span>
            </div>

            <div className="mt-2">
              {/* ⭐ WALLET AMOUNT WITH INLINE LOADING */}
              {loading ? (
                <div className="w-16 h-6 bg-white/40 rounded animate-pulse"></div>
              ) : (
                <p className="sm:text-xl md:text-3xl font-bold">
                  ₹ {walletAmount}
                </p>
              )}

              <p className="text-xs mt-1 md:text-sm opacity-90">
                Available Wallet Balance
              </p>
            </div>
          </div>

          {/* Right Buttons */}
          <div className="flex flex-col gap-8">

            {/* Withdraw/Wallet - always visible */}
            <button
              onClick={toggleWithdrawModal}
              className="flex items-center justify-between bg-white/30 px-3 py-2 rounded-full"
            >
              <span className="font-semibold text-sm text-white pr-1">Withdraw/Wallet</span>
              <FaArrowCircleRight className="text-white text-lg" />
            </button>

            {/* Add Member - Visible ONLY for Commando */}
            {user?.MPOSITION === "Commando" && (
              <button
                onClick={toggleRigesterModal}
                className="flex items-center gap-2 bg-white/30 px-3 py-2 rounded-full"
              >
                <span className="font-semibold text-xs whitespace-nowrap md:text-sm text-white">
                  Add new Member
                </span>
                <IoMdAddCircle className="text-white text-xl" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Rank Section */}
      <div className="bg-linear-to-r from-[#facc15] to-[#fde68a] text-gray-800 rounded-2xl mt-3 p-3 flex items-center justify-between shadow-sm w-full">
        <div className="flex items-center gap-1 sm:gap-2">
          <FaCrown className="text-yellow-600 text-sm md:text-xl" />
          <span className="font-semibold text-xs md:text-base">{userRank}</span>
        </div>
        <span className="text-xs md:text-sm font-medium bg-yellow-200 px-3 py-1 rounded-full">
          Active BC Rank
        </span>
      </div>
    </>
  );
};

export default Wallet;
