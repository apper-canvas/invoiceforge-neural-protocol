import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Component to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();

  // If not authenticated, redirect to login with the current path as redirect param
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;