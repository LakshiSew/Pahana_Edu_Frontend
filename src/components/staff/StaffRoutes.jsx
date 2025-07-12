import { Routes, Route } from "react-router-dom";
import StaffLayout from "./StaffLayout";
import StaffDashboard from "./StaffDashboard";
import Books from "./Books";
import Accessories from "./Accessories";
import Categories from "./Categories";
import ManageOrder from "./ManageOrder";

// import ManageAdmins from "./ManageAdmins";
// import ManageCategories from "./ManageCategories";
// import AdminBookings from "./AdminBookings";
// import ManageCabs from "./ManageCabs";

const StaffRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<StaffLayout />}>
        {/* Default route when visiting '/' */}
        <Route index element={<StaffDashboard />} />
         <Route path="books" element={<Books />} />
          <Route path="accessories" element={<Accessories />} /> 
           <Route path="categories" element={<Categories />} />
            <Route path="orders" element={<ManageOrder />} />
  
      </Route>
    </Routes>
  );
};

export default StaffRoutes;
