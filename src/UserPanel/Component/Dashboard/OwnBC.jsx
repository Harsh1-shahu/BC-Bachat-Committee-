import { useState, useEffect } from "react";
import { useProject } from "../../../Context/ProjectContext";
import { useProject2 } from "../../../Context/ProjectContext2";

const OwnBC = () => {
  const { showNotification, loading, dashboardBhisi, user, walletBalance } = useProject();
  const { bidForBhisi, getReports, reportsPerPage, bhisiMultiplier } = useProject2();

  const [selectedBC, setSelectedBC] = useState(null);
  const [isPayModal, setIsPayModal] = useState(false);
  const [isBidModal, setIsBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [payAmount, setPayAmount] = useState("");

  const [bidHistory, setBidHistory] = useState([]);
  const [bidHistoryLoading, setBidHistoryLoading] = useState(false);
  const [bidHistoryError, setBidHistoryError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  // Prepare displayed ownBCData from dashboardBhisi
  const ownBCData = dashboardBhisi?.own
    ? dashboardBhisi.own.map((item) => {
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
      };
    })
    : [];

  // PAGINATION slice
  const indexOfLast = currentPage * reportsPerPage;
  const indexOfFirst = indexOfLast - reportsPerPage;
  const currentItems = ownBCData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(ownBCData.length / reportsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [dashboardBhisi]);

  // Load bid history
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
        } catch (e) {
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
    } catch (err) {
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

  useEffect(() => {
    if (isPayModal || isBidModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [isPayModal, isBidModal]);


  // const handlePayClick = (bc) => {
  //   setSelectedBC(bc);
  //   setIsPayModal(true);
  // };

  const handleConfirmPay = () => {
    if (!payAmount) {
      showNotification("Please enter amount to pay.", "info");
      return;
    }

    showNotification(`₹${payAmount} paid successfully for ${selectedBC.id}!`, "success");
    setPayAmount("");
    setSelectedBC(null);
    setIsPayModal(false);
  };

  const handleBidClick = (bc) => {
    setSelectedBC(bc);
    setIsBidModal(true);
  };

  const handleConfirmBid = async () => {
    if (!bidAmount) {
      showNotification("Please enter your bid amount.", "info");
      return;
    }

    try {
      const res = await bidForBhisi(selectedBC.id, bidAmount);

      if (res?.ResponseStatus === "success") {
        showNotification(res.ResponseMessage || "Bid placed successfully!", "success");
        setBidAmount("");

        if (user?.MEMB_CODE) {
          walletBalance(user.MEMB_CODE);
        }
        await loadBidHistory(selectedBC.id);

      } else {
        showNotification(res?.ResponseMessage || "Bid failed", "error");
      }
    } catch (err) {
      showNotification("Something went wrong while placing bid.", "error");
    }
  };

  const handleCloseModal = () => {
    setSelectedBC(null);
    setIsPayModal(false);
    setIsBidModal(false);
    setBidAmount("");
    setPayAmount("");
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
                <th className="p-2 text-left">Status</th>
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
                currentItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 text-center">{item.srNo}</td>
                    <td className="p-2 font-medium">{item.id}</td>
                    <td
                      className={`p-2 font-medium ${item.status === "Paid" ? "text-green-600" : "text-yellow-600"
                        }`}
                    >
                      {item.status}
                    </td>
                    <td className="p-2 font-semibold text-green-600">{item.amount}</td>
                    <td className="p-2 flex justify-center gap-2">
                      {/* <button
                        onClick={() => handlePayClick(item)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-xs"
                      >
                        Pay
                      </button> */}
                      <button
                        onClick={() => handleBidClick(item)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-xs"
                      >
                        Bid
                      </button>
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

        {/* PAGINATION (Updated — Same Style as Your Other Pagination) */}
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
                  ? "bg-gray-700 text-white"
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

        {/* PAY MODAL */}
        {isPayModal && selectedBC && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-[400px] p-6 relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-4 text-gray-500 text-3xl"
              >
                ×
              </button>

              <h3 className="text-lg font-semibold mb-4">Make Payment</h3>

              <div className="space-y-2 text-sm mb-4">
                <p><strong>Bhisi Name:</strong> {selectedBC.name}</p>
                <p><strong>Bhisi No:</strong> {selectedBC.id}</p>
                <p><strong>Amount:</strong> {selectedBC.amount}</p>
                <p><strong>Expiry Date:</strong> {selectedBC.expiry}</p>
              </div>

              <input
                type="number"
                placeholder="Enter amount"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />

              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPay}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Confirm Pay
                </button>
              </div>
            </div>
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

              <input
                type="text"
                placeholder="Enter bid amount"
                value={bidAmount}

                className="w-full border rounded-md px-3 py-2"
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, ""); // ❌ remove non-numeric
                  setBidAmount(onlyDigits);
                }}
              />

              <div className="mt-4">
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
                    <div>
                      {bidHistory.map((b, idx) => (
                        <div key={idx} className="flex justify-between border-b pb-1 last:border-b-0">
                          <span>{b.bidder}</span>
                          <span className="font-medium">₹{b.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No bids yet.</div>
                )}
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBid}
                  className="px-4 py-2 bg-green-600 text-white rounded-md"
                >
                  Submit Bid
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OwnBC;
