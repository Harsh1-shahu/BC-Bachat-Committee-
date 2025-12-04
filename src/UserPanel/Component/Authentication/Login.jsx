import { useState } from "react";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useProject } from "../../../Context/ProjectContext";

const Login = () => {
  const { loginUser, showNotification } = useProject();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Prevent spaces and clear error instantly
  const handleUsernameChange = (e) => {
    const val = e.target.value.replace(/\s+/g, ""); // remove spaces
    setUsername(val);
    setErrors((prev) => ({ ...prev, username: "" }));
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value.replace(/\s+/g, ""); // remove spaces
    setPassword(val);
    setErrors((prev) => ({ ...prev, password: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = { username: "", password: "" };
    let valid = true;

    if (!username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    //  Call API now
    const res = await loginUser(username, password);

    if (res.ResponseStatus === "success") {
      showNotification("✅ Login Successfully!", "success");
      navigate("/dashboard");
    } else {
      // show message from API
      showNotification("❌ Invalid User Details", "error");

    }
  };


  return (
    <div className="flex justify-center items-center h-screen bg-linear-to-br from-blue-300 to-purple-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-[92vw] md:w-[25vw] border border-purple-300"
      >
        <div className="flex flex-col items-center gap-2 mb-6">
          <img src="/Bhisi/logo-white.png" className="w-12" />
          <h2 className="text-3xl font-bold text-purple-700 tracking-wide">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-sm font-semibold">Login to continue</p>
        </div>

        {/* Username */}
        <div className="mb-5 relative">
          <label className="block text-gray-700 mb-1 font-semibold">
            Username
          </label>

          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-600" />
            <input
              type="text"
              className="w-full border rounded-lg pl-10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>

          {errors.username && (
            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-5 relative">
          <label className="block text-gray-700 mb-1 font-semibold">
            Password
          </label>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-600" />

            <input
              type={showPassword ? "text" : "password"}
              className="w-full border rounded-lg pl-10 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
            />

            <div
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition duration-200 shadow-md"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
