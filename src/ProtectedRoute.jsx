import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const user = localStorage.getItem("bhisiUser");

    // If no user → redirect to login
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Else load the protected page
    return children;
};

export default ProtectedRoute;
