import { useState, useEffect } from "react";
import { FaGavel } from "react-icons/fa";
import { useProject } from "../../../Context/ProjectContext";
import { useProject2 } from "../../../Context/ProjectContext2";

const OwnBC = () => {
  const { showNotification, loading, dashboardBhisi, user, walletBalance } = useProject();
  const { bidForBhisi, getReports, reportsPerPage, bhisiMultiplier, getBidAmount, confirmAction } = useProject2();

  const [selectedBC, setSelectedBC] = useState(null);
  const [isPayModal, setIsPayModal] = useState(false);
  const [isBidModal, setIsBidModal] = useState(false);

  // NEW STATES — auto-filled bid amount
  const [autoBidAmount, setAutoBidAmount] = useState("");
  const [bidAmountLoading, setBidAmountLoading] = useState(false);

  const [bidHistory, setBidHistory] = useState([]);
  const [bidHistoryLoading, setBidHistoryLoading] = useState(false);
  const [bidHistoryError, setBidHistoryError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  // -----------------------------------------
  // PREPARE OWN BC DATA + SORT LATEST FIRST
  // -----------------------------------------
  const ownBCData = dashboardBhisi?.own
    ? dashboardBhisi.own
      .map((item) => {
        const rawDate = item.EXP_DATE?.split("T")[0];
        let formattedDate = "Not Provided";

        if (rawDate) {
          const [year, month, day] = rawDate.split("-");
          formattedDate = `${day}/${month}/${year}`;
        }

        return {
          srNo: item.SRNO,
          name: item.NAME,
          id: item.BHISINO,
          amount: `₹${item.AMOUNT}`,
          totalAmount: `₹${Number(item.AMOUNT) * bhisiMultiplier}`,
          status: item.FLAG === "Y" ? "Pending" : "Paid",
          expiry: formattedDate,
          bidFlag: item.BID_FLAG,
        };
      })
      // ⭐ SORT HERE — SHOW LATEST (HIGHEST SRNO) FIRST
      .sort((a, b) => {
        const srCompare = Number(b.srNo) - Number(a.srNo);
        if (srCompare !== 0) return srCompare;

        return Number(b.id) - Number(a.id);
      })

    : [];

  // -----------------------------------------
  // PAGINATION
  // -----------------------------------------
  const indexOfLast = currentPage * reportsPerPage;
  const indexOfFirst = indexOfLast - reportsPerPage;
  const currentItems = ownBCData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(ownBCData.length / reportsPerPage);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when fresh data loads
  }, [dashboardBhisi]);

  // -----------------------------------------
  // LOAD BID HISTORY
  // -----------------------------------------
  const loadBidHistory = async (bhisiId) => {
    if (!bhisiId) return;

    setBidHistoryLoading(true);
    setBidHistoryError(null);

    try {
      const res = await getReports("BidDetails", bhisiId);

      let rows = [];
      if (typeof res?.Data === "string") {
        try {
          rows = JSON.parse(res.Data);
        } catch {
          rows = [];
        }
      } else if (Array.isArray(res?.Data)) {
        rows = res.Data;
      }

      const parsed = rows.map((r) => ({
        bidder: r.MEMB_NAME || "Unknown User",
        amount: r.AMOUNT || 0,
      }));

      setBidHistory(parsed);
    } catch {
      setBidHistoryError("Failed to load bid history");
      setBidHistory([]);
    }

    setBidHistoryLoading(false);
  };

  useEffect(() => {
    if (isBidModal && selectedBC) {
      loadBidHistory(selectedBC.id);
    } else if (!isBidModal) {
      setBidHistory([]);
      setBidHistoryError(null);
    }
  }, [isBidModal, selectedBC]);

  // -----------------------------------------
  // BODY LOCKING FOR MODALS
  // -----------------------------------------
  useEffect(() => {
    if (isPayModal || isBidModal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    return () => (document.body.style.overflow = "auto");
  }, [isPayModal, isBidModal]);

  // -----------------------------------------
  // GET BID AMOUNT ON CLICK
  // -----------------------------------------
  const handleBidClick = async (bc) => {
    if (bc.bidFlag === "N") {
      showNotification("Bid not started yet!", "info");
      return;
    }

    setSelectedBC(bc);
    setIsBidModal(true);
    setAutoBidAmount("");
    setBidAmountLoading(true);

    try {
      const res = await getBidAmount(bc.id);

      if (res?.ResponseStatus === "success") {
        let amount = 0;

        if (typeof res.Data === "string") {
          const parsed = JSON.parse(res.Data);
          amount = parsed[0]?.AMOUNT ?? 0;
        }

        setAutoBidAmount(String(amount));
      } else {
        showNotification(res.ResponseMessage || "Failed to load bid amount", "error");
      }
    } catch {
      showNotification("Error fetching bid amount", "error");
    }

    setBidAmountLoading(false);
  };

  // -----------------------------------------
  // SUBMIT BID
  // -----------------------------------------
  const handleConfirmBid = async () => {
    if (!autoBidAmount) {
      showNotification("Bid amount not loaded.", "info");
      return;
    }

    try {
      const res = await bidForBhisi(selectedBC.id, autoBidAmount);

      if (res?.ResponseStatus === "success") {
        showNotification(res.ResponseMessage || "Bid placed successfully!", "success");

        if (user?.MEMB_CODE) walletBalance(user.MEMB_CODE);

        await loadBidHistory(selectedBC.id);
      } else {
        showNotification(res?.ResponseMessage || "Bid failed", "error");
      }
    } catch {
      showNotification("Something went wrong while placing bid.", "error");
    }
  };

  const handleBidSubmitWithConfirm = async () => {
    if (!autoBidAmount) return;

    const message = `Are you sure you want to place a bid of ₹${autoBidAmount}?`;

    const ok = await confirmAction(message);

    if (!ok) {
      showNotification("Bid cancelled", "info");
      return;
    }

    // User confirmed → Proceed with bid
    handleConfirmBid();
  };


  const handleCloseModal = () => {
    setSelectedBC(null);
    setIsPayModal(false);
    setIsBidModal(false);
    setAutoBidAmount("");
    setBidHistory([]);
    setBidHistoryError(null);
  };

  return (
    <div>
      <div className="bg-white rounded-md p-2">
        <h2 className="text-xl font-semibold mb-3 bg-green-800 p-2 rounded-md text-center text-white">
          Own Bhisi
        </h2>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
            <thead className="bg-gray-400 text-gray-700">
              <tr className="whitespace-nowrap text-xs md:text-sm font-semibold">
                <th className="p-2 text-left">Sr. No</th>
                <th className="p-2 text-left">Bhisi No</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5">
                    <div className="flex flex-col items-center py-6">
                      <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-center mt-3 text-gray-600">
                        Loading Own Bhisi...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : currentItems.length ? (
                currentItems.map((item, index) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 text-center">{indexOfFirst + index + 1}</td>
                    {/* <td className="p-2 font-medium">
                    <div className="w-24 overflow-x-auto whitespace-nowrap">
                    {item.id}
                    </div>
                    </td> */}
                    <td className="p-2 font-medium">{item.id}</td>

                    <td className="p-2 font-semibold text-green-600">{item.amount}</td>
                    <td className="p-2">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleBidClick(item)}
                          className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs text-white transition 
                              ${item.bidFlag === "N"
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
                            }
                      `}
                        >
                          <FaGavel className="text-white text-sm" />
                          Bid
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-gray-500">
                    No Bhisi found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ---------------------------------------------------- */}
        {/* PAGINATION */}
        {/* ---------------------------------------------------- */}
        {ownBCData.length > reportsPerPage && (
          <div className="flex justify-center gap-2 mt-4">

            {/* Prev */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`px-3 py-1 rounded-md border ${currentPage === 1
                ? "bg-gray-200 text-gray-400"
                : "bg-white text-black"
                }`}
            >
              Prev
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md border ${currentPage === i + 1
                  ? "bg-green-800 text-white"
                  : "bg-white text-black"
                  }`}
              >
                {i + 1}
              </button>
            ))}

            {/* Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`px-3 py-1 rounded-md border ${currentPage === totalPages
                ? "bg-gray-200 text-gray-400"
                : "bg-white text-black"
                }`}
            >
              Next
            </button>

          </div>
        )}


        {/* BID MODAL */}
        {isBidModal && selectedBC && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-[450px] p-6 relative max-h-[85vh] overflow-auto">

              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-4 text-gray-500 text-3xl"
              >
                ×
              </button>

              <h3 className="text-lg font-semibold mb-4">Bid Details</h3>

              <div className="grid grid-cols-2 gap-3 bg-gray-100 p-3 rounded-md text-sm mb-4">
                <p><strong>Bhisi No:</strong> {selectedBC.id}</p>
                <p><strong>Amount:</strong> {selectedBC.totalAmount}</p>
                <p><strong>Expiry:</strong> {selectedBC.expiry}</p>
              </div>

              {/* ------------------------------------------------------ */}
              {/* BUTTON REPLACING AUTO-FILLED AMOUNT INPUT */}
              {/* ------------------------------------------------------ */}
              <button
                onClick={handleBidSubmitWithConfirm}
                disabled={!autoBidAmount || bidAmountLoading}
                className={`w-full py-3 rounded-lg font-semibold text-white text-lg mb-4 active:bg-green-800 shadow-md transition
                ${autoBidAmount && !bidAmountLoading ? "bg-green-700 hover:bg-green-800" : "bg-gray-400 cursor-not-allowed"}
               `}
              >
                Submit Bid of ₹
                {bidAmountLoading ? (
                  <span className="inline-flex items-center ml-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  </span>
                ) : (
                  autoBidAmount || "..."
                )}
              </button>


              {/* BID HISTORY */}
              <div>
                <p className="font-semibold mb-2">Bid History</p>

                {bidHistoryLoading ? (
                  <div>
                    <div className="w-6 h-6 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
                    <span>Loading bid history...</span>
                  </div>
                ) : bidHistoryError ? (
                  <div className="text-sm text-red-600">{bidHistoryError}</div>
                ) : bidHistory.length ? (
                  <div className="bg-gray-50 border rounded-md p-2 text-sm">
                    {bidHistory.map((b, idx) => (
                      <div key={idx} className="flex justify-between border-b pb-1 last:border-b-0">
                        <span>{b.bidder}</span>
                        <span className="font-medium">₹{b.amount}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No bids yet.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnBC;
