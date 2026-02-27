import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import AdminLayout from "./AdminLayout";
import AdminLogin from "./AdminLogin";

import ProductsAdmin from "./pages/ProductsAdmin";
import MenuAdmin from "./pages/MenuAdmin";
import TestimonialsAdmin from "./pages/TestimonialsAdmin";

// Protected Route Component
function ProtectedRoute({ children, isLoading, user }) {
  if (isLoading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
}

function AdminApp() {
  const { user, loading } = useAuth();

  return (
    <Routes>
      {/* LOGIN */}
      <Route
        path="/"
        element={
          loading ? (
            <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
          ) : user ? (
            <Navigate to="products" replace />
          ) : (
            <AdminLogin />
          )
        }
      />

      {/* ADMIN PANEL */}
      <Route
        element={
          <ProtectedRoute isLoading={loading} user={user}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="products"
          element={<ProductsAdmin />}
        />

        <Route
          path="menu"
          element={<MenuAdmin />}
        />

        <Route
          path="testimonials"
          element={<TestimonialsAdmin />}
        />
      </Route>
    </Routes>
  );
}

export default AdminApp;