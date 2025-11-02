import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import Products from "./pages/Products/Products";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { useEffect } from "react";
import pingService from "./services/pingService";
import Categories from "./pages/Categories/Categories";
import Warehouses from "./pages/Warehouses/Warehouses";
import Customers from "./pages/Customers/Customers";
import Suppliers from "./pages/Suppliers/Suppliers";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Roles from "./pages/Roles/Roles";
import Accounts from "./pages/Accounts/Accounts";
import Orders from "./pages/SalesOrder/Orders";
import CreateOrder from "./pages/SalesOrder/CreateOrder";
import OrderDetail from "./pages/SalesOrder/OrderDetails";
import PurchaseOrders from "./pages/PurchaseOrder/PurchaseOrders";
import CreatePurchaseOrder from "./pages/PurchaseOrder/CreatePurchaseOrder";
import PurchaseOrderDetails from "./pages/PurchaseOrder/PurchaseOrderDetails";
import RoleDetail from "./components/role/RoleDetail";

export default function App() {
  // Test API
  useEffect(() => {
    const testApi = async () => {
      try {
        var response = await pingService.ping();
        console.log("API response:", response);
      } catch (error) {
        console.error("API call error:", error);
      }
    };
    testApi();
  }, []);

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route
              path="/accounts"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <Accounts />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/roles"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <Roles />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/roles"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <Roles />
                </ProtectedRoute>
              }
            />

            <Route
              path="/roles/:roleName"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <RoleDetail />
                </ProtectedRoute>
              }
            />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/products" element={<Products />} />

            {/* <Route
              path="/categories"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <Categories />
                </ProtectedRoute>
              }
            /> */}

            <Route
              path="/categories"
              element={
                <ProtectedRoute requiredPermissions={["Category_View"]}>
                  <Categories />
                </ProtectedRoute>
              }
            />

            <Route
              path="/warehouses"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <Warehouses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/suppliers"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <Suppliers />
                </ProtectedRoute>
              }
            />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />

            {/* Sale Orders */}
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/create" element={<CreateOrder />} />
            <Route path="/orders/:id" element={<OrderDetail />} />

            {/* Purchase Orders */}
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route
              path="/purchase-orders/create"
              element={<CreatePurchaseOrder />}
            />
            <Route
              path="/purchase-orders/:id"
              element={<PurchaseOrderDetails />}
            />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
