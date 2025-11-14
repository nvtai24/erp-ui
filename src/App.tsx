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
import WarehouseStatisticsReport from "./pages/Reports/WarehouseStatisticsReport";
import StockHistoryReport from "./pages/Reports/StockHistoryReport";
import CustomerOrdersReport from "./pages/Reports/CustomerOrdersReport";
import CustomerOrderDetailPage from "./pages/Reports/CustomerOrderDetailPage";
import Roles from "./pages/Roles/Roles";
import Accounts from "./pages/Accounts/Accounts";
import Orders from "./pages/SalesOrder/Orders";
import CreateOrder from "./pages/SalesOrder/CreateOrder";
import PurchaseOrders from "./pages/PurchaseOrder/PurchaseOrders";
import CreatePurchaseOrder from "./pages/PurchaseOrder/CreatePurchaseOrder";
import PurchaseOrderDetails from "./pages/PurchaseOrder/PurchaseOrderDetails";
import RoleDetail from "./components/role/RoleDetail";
import EmployeeListPage from "./pages/Employees/EmployeeListPage";
import EmployeeFormPage from "./pages/Employees/EmployeeFormPage";
import EmployeeDetailPage from "./pages/Employees/EmployeeDetailPage";
import OrderDetail from "./pages/SalesOrder/OrderDetails";
import Contracts from "./pages/Contracts/Contracts";
import Attendances from "./pages/Attendances/Attendances";
import Payrolls from "./pages/Payrolls/Payrolls";
import AuditLog from "./pages/AuditLog";
import PurchaseStaffListPage from "./pages/PurchaseStaff/PurchaseStaffListPage";
import SaleStaffListPage from "./pages/SaleStaff/SaleStaffListPage";

export default function App() {
  // Test API
  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await pingService.ping();
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
                <ProtectedRoute requiredPermission="Account_View">
                  <Accounts />
                </ProtectedRoute>
              }
            />

            <Route
              path="/roles"
              element={
                <ProtectedRoute requiredPermission="Role_View">
                  <Roles />
                </ProtectedRoute>
              }
            />

            <Route
              path="/roles/:roleName"
              element={
                <ProtectedRoute>
                  <RoleDetail />
                </ProtectedRoute>
              }
            />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Products */}
            {/* <Route
              path="/products"
              element={
                <ProtectedRoute requiredPermission="Product_View">
                  <Products />
                </ProtectedRoute>
              }
            /> */}

            {/* Categories */}
            <Route
              path="/categories"
              element={
                <ProtectedRoute requiredPermission="Category_Add">
                  <Categories />
                </ProtectedRoute>
              }
            />

            {/* Warehouses */}
            <Route
              path="/warehouses"
              element={
                <ProtectedRoute requiredPermission="Warehouse_View">
                  <Warehouses />
                </ProtectedRoute>
              }
            />

            {/* Contracts */}
            <Route
              path="/contracts"
              element={
                <ProtectedRoute requiredPermission="Contract_View">
                  <Contracts />
                </ProtectedRoute>
              }
            />

            {/* Payrolls */}
            <Route
              path="/payrolls"
              element={
                <ProtectedRoute requiredPermission="Payroll_View">
                  <Payrolls />
                </ProtectedRoute>
              }
            />

            {/* Attendances */}
            <Route
              path="/attendances"
              element={
                <ProtectedRoute requiredPermission="Attendance_View">
                  <Attendances />
                </ProtectedRoute>
              }
            />

            {/* Customers */}
            <Route
              path="/customers"
              element={
                <ProtectedRoute requiredPermission="Customer_View">
                  <Customers />
                </ProtectedRoute>
              }
            />

            {/* Suppliers */}
            <Route
              path="/suppliers"
              element={
                <ProtectedRoute requiredPermission="Supplier_View">
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
            <Route
              path="/orders"
              element={
                <ProtectedRoute requiredPermission="Order_View">
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route path="/orders/create" element={<CreateOrder />} />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute requiredPermission="Order_View">
                  <OrderDetail />
                </ProtectedRoute>
              }
            />

            {/* Reports */}
            <Route
              path="/reports/warehouse-statistics"
              element={<WarehouseStatisticsReport />}
            />

            <Route
              path="/reports/stock-history"
              element={<StockHistoryReport />}
            />
            <Route path="/reports/orders" element={<CustomerOrdersReport />} />
            <Route
              path="/reports/orders/:orderId"
              element={<CustomerOrderDetailPage />}
            />

            {/* Employees */}
            <Route
              path="/employees"
              element={
                <ProtectedRoute requiredPermission="Employee_View">
                  <EmployeeListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees/create"
              element={
                <ProtectedRoute>
                  <EmployeeFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees/edit/:employeeId"
              element={
                <ProtectedRoute>
                  <EmployeeFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees/:employeeId"
              element={
                <ProtectedRoute requiredPermission="Employee_View">
                  <EmployeeDetailPage />
                </ProtectedRoute>
              }
            />

            {/* Purchase Staff Management */}
            <Route
              path="/purchase-staff"
              element={
                <ProtectedRoute requiredPermission="PurchaseStaff_View">
                  <PurchaseStaffListPage />
                </ProtectedRoute>
              }
            />

            {/* Sale Staff Management */}
            <Route
              path="/sale-staff"
              element={
                <ProtectedRoute requiredPermission="SaleStaff_View">
                  <SaleStaffListPage />
                </ProtectedRoute>
              }
            />

            {/* Audit Log */}
            <Route
              path="/audit-log"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AuditLog />
                </ProtectedRoute>
              }
            />

            {/* Purchase Orders */}
            <Route
              path="/purchase-orders"
              element={
                <ProtectedRoute requiredPermission="PurchaseOrder_View">
                  <PurchaseOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchase-orders/create"
              element={<CreatePurchaseOrder />}
            />
            <Route
              path="/purchase-orders/:id"
              element={
                <ProtectedRoute requiredPermission="PurchaseOrder_View">
                  <PurchaseOrderDetails />
                </ProtectedRoute>
              }
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
