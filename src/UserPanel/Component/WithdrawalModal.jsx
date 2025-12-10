import { useState, useEffect } from "react";
import { FaWallet } from "react-icons/fa";
import { useProject } from "../../Context/ProjectContext";
import { useProject2 } from "../../Context/ProjectContext2";

const WithdrawalModal = () => {
  const {
    withdrawModal,
    toggleWithdrawModal,
    walletAmount,
    getSponsorDetails,
    Deduction,
    user,
    showNotification,
    walletBalance
  } = useProject();

  const { walletTransfer, confirmAction } = useProject2();

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = withdrawModal ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [withdrawModal]);

  const [activeTab, setActiveTab] = useState("withdraw");

  // Inputs
  const [amount, setAmount] = useState("");
  const [username, setUsername] = useState("");

  // Username validation
  const [loadingUser, setLoadingUser] = useState(false);
  const [validUser, setValidUser] = useState(null);

  // Error
  const [error, setError] = useState("");

  // Fee %
  const [feePercent, setFeePercent] = useState(0);

  // Load dynamic fee %
  useEffect(() => {
    const loadFee = async () => {
      const type =
        activeTab === "withdraw"
          ? "WITHDRAWAL_FEES"
          : "WITHDRAWAL_TRANSFER_FEES";

      const res = await Deduction(type);

      setFeePercent(Number(res?.Data?.val || 0));
    };

    loadFee();
  }, [activeTab]);

  // Fee calculation
  const deduction = amount ? (amount * feePercent) / 100 : 0;
  const totalReceive = amount ? amount - deduction : 0;

  const resetForm = () => {
    setAmount("");
    setUsername("");
    setError("");
    setValidUser(null);
    setActiveTab("withdraw");
  };

  // Switch tabs & reset
  const switchTab = (tab) => {
    setActiveTab(tab);
    setAmount("");
    setUsername("");
    setValidUser(null);
    setError("");
  };

  // Amount handler
  const handleAmountChange = (value) => {
    if (value < 0) {
      setError("Amount cannot be negative.");
      setAmount("");
      return;
    }

    if (Number(value) > walletAmount) {
      setError("Cannot enter more than wallet balance.");
      setAmount(walletAmount);
      return;
    }

    setError("");
    setAmount(value);
  };

  // Username check
  const checkUsername = async () => {
    if (!username) {
      setValidUser(null);
      return;
    }

    try {
      setLoadingUser(true);
      const res = await getSponsorDetails(username);

      if (res.ResponseStatus === "success" && res.Data) {
        const parsed = JSON.parse(res.Data)[0];
        setValidUser(!!parsed?.MEMB_CODE);
      } else {
        setValidUser(false);
      }
    } catch {
      setValidUser(false);
    }

    setLoadingUser(false);
  };

  // Debounce check
  useEffect(() => {
    if (activeTab !== "transfer") return;
    const t = setTimeout(checkUsername, 500);
    return () => clearTimeout(t);
  }, [username]);

  // ============================================
  //  SUBMIT HANDLER
  // ============================================
  const handleSubmit = async () => {
    setError("");

    // --------------------------------------
    // 🔥 STEP 1 — SHOW CONFIRM POPUP
    // --------------------------------------
    let message = "";

    if (activeTab === "withdraw") {
      message = `Are you sure you want to withdraw ₹${amount}?`;
    } else {
      message = `Are you sure you want to transfer ₹${amount} to "${username}"?`;
    }

    const ok = await confirmAction(message);
    if (!ok) {
      showNotification("Action cancelled", "info");
      return;
    }

    // --------------------------------------
    // 🔥 STEP 2 — PROCEED IF CONFIRMED
    // --------------------------------------

    // WITHDRAW
    if (activeTab === "withdraw") {
      const res = await walletTransfer(amount, user.USERNAME, "Withdrawal");

      if (res.ResponseStatus === "success") {
        showNotification("Withdrawal Submitted Successfully", "success");
        if (user?.MEMB_CODE) walletBalance(user.MEMB_CODE);

        resetForm();
        toggleWithdrawModal();
      } else {
        showNotification(res.ResponseMessage || "Withdraw failed", "error");
      }
      return;
    }

    // TRANSFER
    const res = await walletTransfer(amount, username, "Transfer");

    if (res.ResponseStatus === "success") {
      showNotification("Wallet Transferred Successfully!", "success");
      if (user?.MEMB_CODE) walletBalance(user.MEMB_CODE);

      resetForm();
      toggleWithdrawModal();
    } else {
      showNotification(res.ResponseMessage || "Transfer failed", "error");
    }
  };


  if (!withdrawModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
      <div className="bg-white max-w-md p-6 rounded-2xl shadow-2xl relative border border-gray-300">

        {/* Close Button */}
        <button
          onClick={() => {
            resetForm();
            toggleWithdrawModal();
          }}
          className="absolute top-0 right-3 text-3xl font-bold text-gray-700"
        >
          ×
        </button>

        {/* Tabs */}
        <div className="flex justify-between gap-2 mt-3">
          <button
            onClick={() => switchTab("withdraw")}
            className={`font-bold text-xs p-3 w-1/2 rounded-md text-white mb-5
              ${activeTab === "withdraw"
                ? "bg-linear-to-r from-indigo-600 to-purple-600 scale-105 transition-all"
                : "bg-purple-900/40"}`}
          >
            Withdraw Request
          </button>

          <button
            onClick={() => switchTab("transfer")}
            className={`font-bold text-xs p-3 w-1/2 rounded-md text-white mb-5
              ${activeTab === "transfer"
                ? "bg-linear-to-r from-indigo-600 to-purple-600 scale-105 transition-all"
                : "bg-purple-900/40"}`}
          >
            Wallet Transfer
          </button>
        </div>

        {/* Wallet Balance */}
        <div className="bg-linear-to-r from-[#b67b1a] to-[#d8ae4a] text-white p-2 rounded-xl shadow-md mb-6 flex justify-between">
          <span className="font-semibold text-lg">
            <FaWallet className="inline mr-2 mb-1" /> Wallet Balance:
          </span>
          <span className="text-xl font-bold">₹ {walletAmount}</span>
        </div>

        {/* WITHDRAW TAB UI */}
        {activeTab === "withdraw" ? (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">

              <div>
                <label className="font-semibold text-gray-700 whitespace-nowrap">
                  Withdraw Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  {feePercent}% Deduction
                </label>
                <input
                  type="text"
                  value={`₹ ${deduction.toFixed(2)}`}
                  disabled
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100"
                />
              </div>

              <div className="col-span-2">
                <label className="font-semibold text-gray-700">
                  Total Receive Amount
                </label>
                <input
                  type="text"
                  value={`₹ ${totalReceive.toFixed(2)}`}
                  disabled
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100 font-semibold text-lg"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
            )}
          </>
        ) : (
          <>
            {/* TRANSFER TAB */}
            <div className="mb-4">
              <label className="font-semibold text-md">Username:</label>

              <div className="relative">
                <input
                  type="text"
                  className="border p-2 w-full rounded-md pr-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />

                {loadingUser && (
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                  </div>
                )}

                {!loadingUser && validUser === true && (
                  <span className="absolute right-2 inset-y-0 flex items-center text-green-600 text-xl">
                    ✅
                  </span>
                )}

                {!loadingUser && validUser === false && (
                  <span className="absolute right-2 inset-y-0 flex items-center text-red-600 text-xl">
                    ❌
                  </span>
                )}
              </div>
            </div>

            {/* Transfer Amount */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="font-semibold text-gray-700">
                  Transfer Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  disabled={!username || validUser !== true}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder={
                    !username
                      ? "Enter username first"
                      : validUser === false
                        ? "Invalid username"
                        : "Enter amount"
                  }
                  className={`w-full mt-1 px-3 py-2 border rounded-lg
                    ${!username || validUser !== true
                      ? "bg-gray-200 cursor-not-allowed"
                      : "focus:ring-2 focus:ring-indigo-400"
                    }`}
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  {feePercent}% Deduction
                </label>
                <input
                  type="text"
                  value={`₹ ${deduction.toFixed(2)}`}
                  disabled
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100"
                />
              </div>

              <div className="col-span-2">
                <label className="font-semibold text-gray-700">
                  Total Receive Amount
                </label>
                <input
                  type="text"
                  value={`₹ ${totalReceive.toFixed(2)}`}
                  disabled
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100 text-lg font-semibold"
                />
              </div>
            </div>
          </>
        )}

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={
            activeTab === "withdraw"
              ? !amount || error
              : !username || validUser !== true || !amount
          }
          className={`w-full py-3 rounded-xl font-semibold text-white text-lg transition-all
            ${activeTab === "withdraw"
              ? !amount || error
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600"
              : !username || validUser !== true || !amount
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600"
            }
          `}
        >
          {activeTab === "withdraw" ? "Withdraw Now" : "Transfer"}
        </button>
      </div>
    </div>
  );
};

export default WithdrawalModal;
