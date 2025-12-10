import { useState, useEffect } from "react";
import Wallet from "./Wallet";
import Incomes from "./Incomes";
import Navbar from "../Navigation/Navbar";
import Footer from "../Navigation/Footer";
import RunningBC from "./RunningBC";
import OwnBC from "./OwnBC";
import { AiFillSchedule } from "react-icons/ai";
import { AiFillInteraction } from "react-icons/ai";
import { FaWallet } from "react-icons/fa";
import { useProject } from "../../../Context/ProjectContext";
import { useProject2 } from "../../../Context/ProjectContext2";

const Dashboard = () => {
  const {
    showNotification,
    bhisiPurchase,
    getSponsorDetails,
    GetBhisiAmount,
    user,
    walletAmount,
    dashboardDetails,
    setLoading,
    GetBhisiList,
    walletBalance,
  } = useProject();

  const { renewBhisi, confirmAction } = useProject2();

  const buttonLabel = import.meta.env.VITE_BUTTON_LABEL;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [actionType, setActionType] = useState(""); // purchase / renew
  const [username, setUsername] = useState("");
  const [bhisiNo, setBhisiNo] = useState("");
  const [bhisiAmount, setBhisiAmount] = useState("");

  const [sponsorCode, setSponsorCode] = useState(null);

  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingBhisi, setLoadingBhisi] = useState(false);

  const [loadingPurchase, setLoadingPurchase] = useState(false);

  const [bhisiList, setBhisiList] = useState([]);
  const [loadingBhisiList, setLoadingBhisiList] = useState(false);


  // --------------------------------
  // OPEN MODAL
  // --------------------------------
  const openModal = (type) => {
    setActionType(type);

    // BOTH purchase & renew behave SAME now
    setUsername("");
    setSponsorCode(null);
    setBhisiNo("");
    setBhisiAmount("");

    setIsModalOpen(true);
  };

  // --------------------------------
  // CHECK USER (API)
  // --------------------------------
  const checkUser = async () => {
    if (!username) {
      setSponsorCode(null);
      return;
    }

    try {
      setLoadingUser(true);
      const res = await getSponsorDetails(username);

      if (res.ResponseStatus === "success" && res.Data) {
        const parsed = JSON.parse(res.Data)[0];
        const code = Math.trunc(Number(parsed.MEMB_CODE));
        setSponsorCode(code);
      } else {
        setSponsorCode(null);
      }
    } catch {
      setSponsorCode(null);
    }

    setLoadingUser(false);
  };

  // Disable scroll while modal open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isModalOpen]);

  // Clear bhisi when username invalid
  useEffect(() => {
    if (!sponsorCode) {
      setBhisiNo("");
      setBhisiAmount("");
    }
  }, [sponsorCode]);

  // --------------------------------
  // CHECK BHISI AMOUNT API
  // --------------------------------
  const checkBhisi = async () => {
    if (!bhisiNo) {
      setBhisiAmount("");
      return;
    }

    try {
      setLoadingBhisi(true);
      const res = await GetBhisiAmount(bhisiNo);

      if (res.ResponseStatus === "success" && res.Data) {
        const parsed = JSON.parse(res.Data)[0];
        setBhisiAmount(parsed.AMOUNT);
      } else {
        setBhisiAmount("");
      }
    } catch {
      setBhisiAmount("");
    }

    setLoadingBhisi(false);
  };

  // Auto check username
  useEffect(() => {
    const delay = setTimeout(checkUser, 500);
    return () => clearTimeout(delay);
  }, [username]);

  // Auto check bhisi no
  useEffect(() => {
    const delay = setTimeout(() => {
      if (sponsorCode) checkBhisi();
    }, 500);
    return () => clearTimeout(delay);
  }, [bhisiNo, sponsorCode]);

  // --------------------------------
  // CONFIRM PURCHASE OR RENEW
  // --------------------------------
  const handleConfirm = async () => {

    // Validation
    if (!username || !bhisiNo) {
      showNotification("Please enter username & Bhisi No", "error");
      return;
    }

    if (!sponsorCode) {
      showNotification("Invalid Username", "error");
      return;
    }

    if (!bhisiAmount) {
      showNotification("Invalid Bhisi Number", "error");
      return;
    }

    // --------------------------------------------
    // 🔥 STEP 1 — SHOW CONFIRM POPUP (DYNAMIC)
    // --------------------------------------------
    let message =
      actionType === "renew"
        ? `Are you sure you want to renew Bhisi No ${bhisiNo} of ₹${bhisiAmount}? `
        : `Are you sure you want to purchase Bhisi No ${bhisiNo} of ₹${bhisiAmount}?`;

    const ok = await confirmAction(message);

    if (!ok) {
      showNotification("Action cancelled", "info");
      return;
    }

    // --------------------------------------------
    // 🔥 STEP 2 — PROCEED ONLY IF CONFIRMED
    // --------------------------------------------

    // -------------- RENEW --------------
    if (actionType === "renew") {
      try {
        setLoadingPurchase(true);

        const res = await renewBhisi(bhisiNo, username, sponsorCode);

        if (res.ResponseStatus === "success") {
          showNotification("Bhisi Renewed Successfully!", "success");

          // Refresh dashboard
          try {
            if (typeof dashboardDetails === "function") {
              setLoading(true);
              await dashboardDetails(sponsorCode);
            }
          } catch { }

          // Refresh wallet
          if (user?.MEMB_CODE) {
            await walletBalance(user.MEMB_CODE);
          }

          setIsModalOpen(false);
        } else {
          showNotification(res.ResponseMessage || "Renew failed", "error");
        }
      } catch {
        showNotification("Renew failed", "error");
      }

      setLoadingPurchase(false);
      return;
    }

    // -------------- PURCHASE --------------
    try {
      setLoadingPurchase(true);

      const res = await bhisiPurchase(bhisiNo, sponsorCode, username);

      if (res.ResponseStatus === "success") {
        showNotification("Purchase Successful!", "success");

        // Refresh dashboard
        try {
          if (typeof dashboardDetails === "function") {
            setLoading(true);
            await dashboardDetails(sponsorCode);
          }
        } catch { }

        // Refresh wallet
        if (user?.MEMB_CODE) {
          await walletBalance(user.MEMB_CODE);
        }

        setIsModalOpen(false);
      } else {
        showNotification(res.ResponseMessage || "Purchase failed", "error");
      }
    } catch {
      showNotification("Purchase failed", "error");
    }

    setLoadingPurchase(false);
  };



  const fetchBhisiList = async () => {
    // Don’t call API if we don’t have username or actionType
    if (!username || !actionType) return;

    try {
      setLoadingBhisiList(true);

      // 👇 Pass username + type ("purchase" / "renew")
      const res = await GetBhisiList(username, actionType);

      console.log("GetBhisiList raw response:", res);

      if (res.ResponseStatus === "success" && res.Data) {
        const parsed = JSON.parse(res.Data);   // 👈 convert string Data → array
        console.log("Parsed Bhisi List:", parsed);

        setBhisiList(parsed);                  // ✅ save in state
      } else {
        setBhisiList([]);                      // clear if no data / error
      }
    } catch (error) {
      console.log("GetBhisiList error:", error);
      setBhisiList([]);
    } finally {
      setLoadingBhisiList(false);
    }
  };

  useEffect(() => {
    if (isModalOpen && username && actionType) {
      fetchBhisiList();
    }
  }, [isModalOpen, username, actionType]);

  // Clear Bhisi dropdown when actionType changes (purchase / renew)
  useEffect(() => {
    setBhisiNo("");        // clear selected bhisi
    setBhisiAmount("");    // clear amount
    setBhisiList([]);      // clear old list
  }, [actionType]);

  // --------------------------------
  // UI
  // --------------------------------
  return (
    <div className="max-w-lg mx-auto min-h-screen">
      <Navbar />

      <div className="pt-18 mx-3 pb-24 space-y-4">
        <Wallet />
        <Incomes />

        {user?.MPOSITION === "Commando" && (
          <div className="flex gap-6 p-2 rounded-md bg-white text-white font-bold mt-4">
            <button
              className="bg-linear-to-r from-yellow-500 to-yellow-600 py-2 rounded-lg shadow-xl w-full"
              onClick={() => openModal("purchase")}
            >
              Purchase
            </button>

            <button
              className="bg-linear-to-r from-yellow-500 to-yellow-600 py-2 rounded-lg shadow-xl w-full"
              onClick={() => openModal("renew")}
            >
              {buttonLabel}
            </button>
          </div>
        )}

        <OwnBC />
        <RunningBC />

      </div>

      <Footer />

      {/* ---------------- MODAL ---------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 sm:w-[400px] p-6 rounded-xl relative">

            <button
              className="absolute top-2 right-3 text-3xl"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>

            <h2 className="flex items-center justify-center gap-2 text-xl font-bold text-center mb-4 
               bg-linear-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              {actionType === "purchase" ? (
                <AiFillSchedule className="text-indigo-500" />
              ) : (
                <AiFillInteraction className="text-purple-500" />
              )}

              {actionType === "purchase" ? "Bhisi Purchase" : "Bhisi Renew"}
            </h2>


            {/* Wallet balance */}
            <div className="bg-linear-to-r from-[#b67b1a] to-[#d8ae4a] text-white p-2 rounded-xl shadow-md mb-6 flex justify-between items-center">
              <span className="font-semibold text-lg">
                <FaWallet className="inline mr-2 mb-1" />Wallet Balance:
              </span>
              <span className="text-xl font-bold">₹ {walletAmount}</span>
            </div>

            {/* USERNAME */}
            <div className="flex items-center justify-between mb-4">
              <label className="font-semibold text-md w-28">Username:</label>

              <div className="relative flex-1">
                <input
                  type="text"
                  className="border p-1 w-full rounded pr-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />

                {/* Loader */}
                {loadingUser && (
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                  </div>
                )}

                {/* Tick */}
                {!loadingUser && sponsorCode && (
                  <div className="absolute inset-y-0 right-2 flex items-center text-green-600 text-xl">
                    ✅
                  </div>
                )}

                {/* Cross */}
                {!loadingUser && username && !sponsorCode && (
                  <div className="absolute inset-y-0 right-2 flex items-center text-red-600 text-xl">
                    ❌
                  </div>
                )}
              </div>
            </div>

            {/* BHISI NO */}
            <div className="flex items-center justify-between mb-4">
              <label className="font-semibold text-md w-28">Bhisi No:</label>

              <div className="relative flex-1">
                <select
                  className="border p-1 w-full rounded pr-10 bg-white"
                  value={bhisiNo}
                  disabled={!sponsorCode || loadingBhisiList || bhisiList.length === 0}  // 🔥 Disable conditions
                  onChange={(e) => {
                    const selected = e.target.value;
                    setBhisiNo(selected);

                    const selectedItem = bhisiList.find(
                      (item) => item.BHISINO === selected
                    );

                    if (selectedItem) {
                      setBhisiAmount(selectedItem.AMOUNT);
                    } else {
                      setBhisiAmount("");
                    }
                  }}
                >
                  {/* BEFORE VALID USERNAME → DROPDOWN LOCKED */}
                  {!sponsorCode && (
                    <option value="" disabled>
                      Enter username first
                    </option>
                  )}

                  {/* LOADING STATE */}
                  {sponsorCode && loadingBhisiList && (
                    <option value="" disabled>
                      Loading Bhisi List...
                    </option>
                  )}

                  {/* NO BHISI FOUND */}
                  {sponsorCode && !loadingBhisiList && bhisiList.length === 0 && (
                    <option value="" disabled>
                      No Bhisi Found
                    </option>
                  )}

                  {/* SELECT OPTION */}
                  {sponsorCode && !loadingBhisiList && bhisiList.length > 0 && (
                    <option className="hidden" value="">
                      Select Bhisi No
                    </option>
                  )}

                  {/* BHISI LIST OPTIONS */}
                  {sponsorCode &&
                    !loadingBhisiList &&
                    bhisiList.length > 0 &&
                    bhisiList.map((item) => (
                      <option key={item.BHISINO} value={item.BHISINO}>
                        {item.BHISINO}
                      </option>
                    ))}
                </select>

                {/* Loader icon */}
                {loadingBhisiList && (
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                  </div>
                )}

                {/* Tick */}
                {!loadingBhisiList && bhisiAmount && sponsorCode && (
                  <div className="absolute inset-y-0 right-2 flex items-center text-green-600 text-xl">
                    ✅
                  </div>
                )}

                {/* Cross */}
                {!loadingBhisiList && bhisiNo && !bhisiAmount && sponsorCode && (
                  <div className="absolute inset-y-0 right-2 flex items-center text-red-600 text-xl">
                    ❌
                  </div>
                )}
              </div>
            </div>


            {/* AMOUNT */}
            <div className="flex items-center justify-between mb-4">
              <label className="font-semibold text-md w-28">Amount:</label>

              <input
                type="number"
                className="border p-1 w-full rounded flex-1"
                placeholder="Bhisi Amount"
                value={bhisiAmount}
                readOnly
              />
            </div>

            {/* Confirm */}
            <button
              onClick={handleConfirm}
              disabled={loadingPurchase}
              className="w-full bg-purple-600 text-white py-2 rounded-lg"
            >
              {loadingPurchase ? "Processing..." : "Confirm"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
