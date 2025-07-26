import { Routes, Route } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import AdminDashboard from "./AdminDashboard";
import ManageCategories from "./ManageCategories";
import ManageBooks from "./ManageBooks";
import ManageOrder from "./ManageOrder";
import AdminCustomer from "./AdminCustomer";
import ManageSuggestions from "./ManageSuggestions";
import CustomerHelp from "./CustomerHelp";
import ManageAdmins from "./ManageAdmins";
import ManageAccessories from "./ManageAccessories";


const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="categories" element={<ManageCategories />} />
        <Route path="books" element={<ManageBooks />} />
        <Route path="orders" element={<ManageOrder />} />
        <Route path="customers" element={<AdminCustomer />} />
        <Route path="suggestions" element={<ManageSuggestions />} />
        <Route path="reports" element={<CustomerHelp />} />
        <Route path="admins" element={<ManageAdmins />} />
        <Route path="accessories" element={<ManageAccessories />} />

      </Route>
    </Routes>
  );
};

export default AdminRoutes;
