import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./UserPanel/Component/Authentication/Login";
import Dashboard from "./UserPanel/Component/Dashboard/Dashboard";
import CommandoIncome from "./UserPanel/Component/MenuLists/Income Reports/CommandoIncome";
import CutOffReport from "./UserPanel/Component/MenuLists/Income Reports/CutOffReport";
import TransactionReport from "./UserPanel/Component/MenuLists/TransactionReport";
import IncentiveIcome from "./UserPanel/Component/MenuLists/Income Reports/IncentiveIcome";
import ProfilePage from "./UserPanel/Component/ProfilePage";
import BcWisePaymentReport from "./UserPanel/Component/MenuLists/BcWisePaymentReport";
import WithdrawalModal from "./UserPanel/Component/WithdrawalModal";
import ChangePassword from "./UserPanel/Component/Authentication/ChangePassword";
import Notification from "./UserPanel/Component/Notification";
import ProtectedRoute from "./ProtectedRoute";
import RegisterModel from "./UserPanel/Component/Authentication/RegisterModel";
import WellcomeLetter from "./UserPanel/Component/WellcomeLetter";
import { useProject } from "./Context/ProjectContext";
import NoInternet from "./NoInternet";

function App() {
  const { welcomeData } = useProject();

  // ----------------------
  // INTERNET STATUS HANDLER
  // ----------------------
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // If offline → show No Internet Page
  if (!isOnline) {
    return <NoInternet />;
  }

  // ----------------------
  // RENDER APP WHEN ONLINE
  // ----------------------
  return (
    <div className="bg-gray-200">
      <Notification />
      <WithdrawalModal />
      <RegisterModel />
      <ChangePassword />

      <WellcomeLetter
        memberName={welcomeData?.memberName}
        username={welcomeData?.username}
        password={welcomeData?.password}
        sponsorId={welcomeData?.sponsor}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/commando"
          element={
            <ProtectedRoute>
              <CommandoIncome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cut-off"
          element={
            <ProtectedRoute>
              <CutOffReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/incentive"
          element={
            <ProtectedRoute>
              <IncentiveIcome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transaction"
          element={
            <ProtectedRoute>
              <TransactionReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bcwisepayment"
          element={
            <ProtectedRoute>
              <BcWisePaymentReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
