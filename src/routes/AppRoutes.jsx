
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import BuyerDashboard from '../features/dashboard/BuyerDashboard'
import CreateOrder from '../features/orders/CreateOrder'
import RequireAuth from '../features/auth/RequireAuth';
import SellerDashboard from '../features/dashboard/SellerDashboard';
import TruckLoadingForm from '../features/truck-loading/TruckLoadingForm';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />

      {/* Authenticated route for any logged-in user */}
      <Route
        path="/buyer-dashboard"
        element={
          <RequireAuth allowedUserTypes={["buyer"]}>
            <BuyerDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/seller-dashboard"
        element={
          <RequireAuth allowedUserTypes={["seller"]}>
            <SellerDashboard />
          </RequireAuth>
        }
      />

      {/* Authenticated route only for buyers */}
      <Route
        path="/create-order"
        element={
          <RequireAuth allowedUserTypes={["buyer"]}>
            <CreateOrder />
          </RequireAuth>
        }
      />

      {/* Authenticated route only for buyers */}
      <Route
        path="/truck-load"
        element={
          <RequireAuth allowedUserTypes={["buyer"]}>
            <TruckLoadingForm />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;