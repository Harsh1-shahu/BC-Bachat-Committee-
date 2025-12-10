import { createContext, useContext, useState, useEffect } from "react";

const ProjectContext = createContext();

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {

  const apiUrl = import.meta.env.VITE_API_URL;
  const apiKey = import.meta.env.VITE_API_KEY;

  const [user, setUser] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const [withdrawModal, setWithdrawModal] = useState(false);
  const toggleWithdrawModal = () => {
    setWithdrawModal(!withdrawModal);
  };

  const [registerModal, setRegisterModal] = useState(false);
  const toggleRigesterModal = () => {
    setRegisterModal(!registerModal);
  };

  const [changePasswModal, setChangePasswModal] = useState(false);
  const toggleChangePasswModal = () => {
    setChangePasswModal(!changePasswModal);
  };

  const [wellcomeModal, setWellcomeModal] = useState(false);
  const toggleWellcomeModal = () => {
    setWellcomeModal(!wellcomeModal);
  };

  const [welcomeData, setWelcomeData] = useState(null);

  const showWelcomeLetter = (data) => {
    setWelcomeData(data);
    setWellcomeModal(true);
  }


  // GLOBAL NOTIFICATION ----------------------------------------------------------
  const [notification, setNotification] = useState({ message: "", type: "", visible: false });

  const showNotification = (message, type = "info") => {
    setNotification({ message, type, visible: true });


    // auto-hide after 3 seconds
    setTimeout(() => {
      setNotification({ message: "", type: "", visible: false });
    }, 3000);
  };


  // Ip Address Fetch Api-------------------------------------------------------------------
  const [ipaddress, setIpaddress] = useState("");

  useEffect(() => {
    const fetchIp = async () => {
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipResponse.json();
      setIpaddress(ipData.ip);
    };

    fetchIp();
  }, []);


  // User Login Api--------------------------------------------------------------------------
  const loginUser = async (username, password) => {
    try {
      // Create FormData
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("ipaddress", ipaddress);
      formData.append("apiKey", apiKey);

      console.log("User formdata data", formData);

      // API Call
      const response = await fetch(`${apiUrl}/Statistic/CheckLogin`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("UserLoginData", data);

      // If login is successful, save to localStorage
      if (data.ResponseStatus === "success") {
        const parsedUser = JSON.parse(data.Data)[0];  // convert string → object

        localStorage.setItem("bhisiUser", JSON.stringify(parsedUser));
        setUser(parsedUser);
      }

      return data;
    } catch (error) {
      console.log("Login error:", error);
      return { ResponseStatus: "error", ResponseMessage: error.message };
    }
  };


  // Saving User data to local storage
  useEffect(() => {
    const savedUser = localStorage.getItem("bhisiUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);


  // Clearing user data from local storage when logout
  const logoutUser = () => {
    localStorage.removeItem("bhisiUser");
    setUser(null);
  };


  // GET SPONSOR DETAILS API ----------------------------------------------------------------------
  const getSponsorDetails = async (username) => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("apiKey", apiKey);

      const response = await fetch(`${apiUrl}/Statistic/GetSponsor`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("SPONSOR DETAILS:", data);

      return data;
    } catch (error) {
      console.log("Sponsor API Error:", error);
      return { ResponseStatus: "error", ResponseMessage: error.message };
    }
  };


  // Registration api for new Member-----------------------------------------------------------
  const registerUser = async (
    mcode,
    name,
    mobileno,
    password,
    sponuser,
    aadharno,
    aadharFrontImg,
    cancleChequeImg
  ) => {
    try {
      const formData = new FormData();
      formData.append("mcode", mcode);
      formData.append("name", name);
      formData.append("mobileno", mobileno);
      formData.append("password", password);
      formData.append("sponuser", sponuser);
      formData.append("ipaddress", ipaddress);
      formData.append("aadharno", aadharno);

      formData.append("aadharFrontImg", aadharFrontImg);
      formData.append("cancleChequeImg", cancleChequeImg);
      formData.append("apiKey", apiKey);

      console.log('regdata', formData);


      const response = await fetch(`${apiUrl}/Statistic/Register`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("REGISTER RESPONSE:", data);

      if (data.ResponseStatus === "success") {
        //  Parse the JSON string inside Data
        const regData = JSON.parse(data.Data)[0];

        return {
          ResponseStatus: "success",
          regData,             // return parsed API data
          ResponseMessage: data.ResponseMessage
        };
      }

      return data;
    } catch (error) {
      return { ResponseStatus: "error", ResponseMessage: error.message };
    }
  };



  // DASHBOARD INCOME API --------------------------------------------------------------------------
  const [dashboardIncomeData, setDashboardIncomeData] = useState({
    Commando_Income: 0,
    Cut_off_Income: 0,
    Incentive_Income: 0,
    Total_Income: 0
  });
  const [dashboardBhisi, setDashboardBhisi] = useState({
    running: [],
    own: []
  });

  const [loading, setLoading] = useState(true);

  const dashboardDetails = async (mcode) => {
    try {
      const formData = new FormData();
      formData.append("mcode", Number(mcode));
      formData.append("apiKey", apiKey);

      const res = await fetch(`${apiUrl}/Statistic/dashboardDetails`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("DASHBOARD DETAILS:", data);

      if (data.ResponseStatus === "success") {
        const incomeObj = JSON.parse(data.Data.income)[0];
        const running = JSON.parse(data.Data.runningBhisi || "[]");
        const own = JSON.parse(data.Data.ownBhisi || "[]");

        setDashboardIncomeData({
          Commando_Income: incomeObj.Commando_Income || 0,
          Cut_off_Income: incomeObj.Cut_off_Income || 0,
          Incentive_Income: incomeObj.Incentive_Income || 0,
          Total_Income: incomeObj.Total_Income || 0,
        });

        // Store BOTH types of Bhisi
        setDashboardBhisi({
          running,
          own
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // WALLET BALANCE API ----------------------------------------------------------------------
  const [walletAmount, setWalletAmount] = useState(0);

  const walletBalance = async (mcode) => {
    try {
      const formData = new FormData();
      formData.append("type", "Wallet");
      formData.append("mcode", Number(mcode));
      formData.append("apiKey", apiKey);

      const res = await fetch(`${apiUrl}/Statistic/walletBalance`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("WALLET BALANCE:", data);

      if (data.ResponseStatus === "success") {
        setWalletAmount(Number(data.Data) || 0);
      }
    } catch (error) {
      console.log("Wallet Error:", error);
    }
  };


  // AUTO CALL APIs WHEN USER LOADS
  useEffect(() => {
    if (!user?.MEMB_CODE) return;

    dashboardDetails(user.MEMB_CODE);
    walletBalance(user.MEMB_CODE);
  }, [user]);


  // Bhisi Purchase API ------------------------------------------------------------------------------
  const bhisiPurchase = async (bhisino, membCode, username_purbhisi) => {
    try {
      const formData = new FormData();
      formData.append("mcode", membCode);
      formData.append("bhisino", bhisino);
      formData.append("username_purbhisi", username_purbhisi); // <-- FIXED
      formData.append("apiKey", apiKey);

      const response = await fetch(`${apiUrl}/Statistic/purchaseBhisi`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("BHISI PURCHASE RESPONSE:", data);
      return data;

    } catch (error) {
      console.log("Bhisi Purchase Error:", error);
      return {
        ResponseStatus: "error",
        ResponseMessage: error.message,
      };
    }
  };

  // Check Bhisi Amount by Bhishi No. ----------------------------------------------------------------------
  const GetBhisiAmount = async (bhisino) => {
    try {
      const formData = new FormData();
      formData.append("bhisino", bhisino);
      formData.append("apiKey", apiKey);

      const response = await fetch(`${apiUrl}/Statistic/checkBhisiNo`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return data;

    } catch (error) {
      console.log("Get Bhisi Amount Error:", error);
      return {
        ResponseStatus: "error",
        ResponseMessage: error.message,
      };
    }
  };

  // Withdrawal % ratio API ----------------------------------------------------------------------
  const Deduction = async (type) => {
    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("apiKey", apiKey);
      const response = await fetch(`${apiUrl}/Statistic/setting`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return data;

    } catch (error) {
      console.log("Deduction Error:", error);
      return {
        ResponseStatus: "error",
        ResponseMessage: error.message,
      };
    }
  };

  const GetBhisiList = async (username, type) => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("type", type);
      formData.append("apiKey", apiKey);

      const response = await fetch(`${apiUrl}/Statistic/bhisiNoListByUser`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return data;

    } catch (error) {
      console.log("Get Bhisi List Error:", error);
      return {
        ResponseStatus: "error",
        ResponseMessage: error.message,
      };
    }
  };

  return (
    <ProjectContext.Provider value={{
      menuOpen, toggleMenu, closeMenu,
      withdrawModal, toggleWithdrawModal,
      registerModal, toggleRigesterModal,
      toggleWellcomeModal, wellcomeModal, showWelcomeLetter,
      welcomeData, toggleChangePasswModal,
      changePasswModal, user, setUser,
      loginUser, logoutUser,
      registerUser, walletAmount, dashboardIncomeData,
      dashboardBhisi, dashboardDetails, setLoading,
      loading, getSponsorDetails,
      notification, showNotification, bhisiPurchase,
      GetBhisiAmount, Deduction, GetBhisiList, walletBalance
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
