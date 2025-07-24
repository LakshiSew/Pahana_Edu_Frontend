import { useState, useEffect } from "react";
import { PlusIcon, SearchIcon, EyeIcon, EditIcon, Trash2Icon, CheckCircleIcon, XCircleIcon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAdmin, setNewAdmin] = useState({
    userName: "",
    password: "",
    email: "",
    position: "",
    adminImage: null,
  });

  // Fetch admins on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get("http://localhost:8080/auth/getalladmins", {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });

        // Map backend fields to frontend
        const adminsData = response.data.map((admin) => ({
          id: admin.id,
          userName: admin.userName,
          email: admin.email,
          position: admin.position,
          adminImage: admin.adminImage,
        }));

        setAdmins(adminsData);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch admins");
        setLoading(false);
        toast.error(err.message || "Failed to fetch admins", { position: "top-right", autoClose: 3000 });
      }
    };

    fetchData();
  }, []);

  // Handle adding an admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const formData = new FormData();
      formData.append("userName", newAdmin.userName);
      formData.append("password", newAdmin.password);
      formData.append("email", newAdmin.email);
      formData.append("position", newAdmin.position);
      if (newAdmin.adminImage) formData.append("adminImage", newAdmin.adminImage);

      const response = await axios.post("http://localhost:8080/auth/createadmin", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setAdmins([...admins, {
        id: response.data.id,
        userName: response.data.userName,
        email: response.data.email,
        position: response.data.position,
        adminImage: response.data.adminImage,
      }]);
      setShowAddModal(false);
      setNewAdmin({
        userName: "",
        password: "",
        email: "",
        position: "",
        adminImage: null,
      });
      toast.success("Admin added successfully!", { position: "top-right", autoClose: 3000 });
    } catch (err) {
      toast.error(err.response?.data || "Failed to add admin", { position: "top-right", autoClose: 3000 });
    }
  };

  // Handle updating an admin
  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const formData = new FormData();
      if (selectedAdmin.userName) formData.append("userName", selectedAdmin.userName);
      if (selectedAdmin.email) formData.append("email", selectedAdmin.email);
      if (selectedAdmin.position) formData.append("position", selectedAdmin.position);
      if (selectedAdmin.password) formData.append("password", selectedAdmin.password);
      if (selectedAdmin.adminImage && typeof selectedAdmin.adminImage !== "string") {
        formData.append("adminImage", selectedAdmin.adminImage);
      }

      const response = await axios.put(`http://localhost:8080/updateadmin/${selectedAdmin.id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setAdmins(admins.map((admin) => (admin.id === selectedAdmin.id ? {
        id: response.data.id,
        userName: response.data.userName,
        email: response.data.email,
        position: response.data.position,
        adminImage: response.data.adminImage,
      } : admin)));
      setShowUpdateModal(false);
      setSelectedAdmin(null);
      toast.success("Admin updated successfully!", { position: "top-right", autoClose: 3000 });
    } catch (err) {
      toast.error(err.response?.data || "Failed to update admin", { position: "top-right", autoClose: 3000 });
    }
  };

  // Handle deleting an admin
  const handleDeleteAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await axios.delete(`http://localhost:8080/deleteadmin/${selectedAdmin.id}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      setAdmins(admins.filter((admin) => admin.id !== selectedAdmin.id));
      setShowDeleteModal(false);
      setSelectedAdmin(null);
      toast.success("Admin deleted successfully!", { position: "top-right", autoClose: 3000 });
    } catch (err) {
      toast.error(err.response?.data || "Failed to delete admin", { position: "top-right", autoClose: 3000 });
    }
  };

  // Filter admins
  const filteredAdmins = admins.filter((admin) =>
    (admin.userName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (admin.id?.toString().toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (admin.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // Stats for dashboard
  const stats = [
    {
      id: "Total",
      name: "Total Admins",
      count: admins.length,
      change: "+0%",
      icon: <PlusIcon className="h-6 w-6 text-white" />,
      bgFrom: "from-yellow-500",
      bgTo: "to-amber-600",
    },
    {
      id: "Active",
      name: "Active Admins",
      count: admins.length, // Assuming all admins are active, as no status field exists
      change: "+0%",
      icon: <CheckCircleIcon className="h-6 w-6 text-white" />,
      bgFrom: "from-green-400",
      bgTo: "to-emerald-600",
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-600 font-sans">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-600 font-sans">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <ToastContainer />
      <svg
        className="absolute top-0 left-0 w-full h-[200px] z-[1] opacity-20"
        viewBox="0 0 1440 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#FBBF24"
          d="M0,128L60,138.7C120,149,240,171,360,170.7C480,171,600,149,720,133.3C840,117,960,107,1080,117.3C1200,128,1320,160,1380,176L1440,192L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
        />
      </svg>

      <header className="bg-black/70 backdrop-blur-xl border-b border-yellow-400/30 p-4 flex justify-between items-center z-[2]">
        <div>
          <h1 className="text-2xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
            Manage Admins
          </h1>
          <p className="text-yellow-400/70 font-sans">Oversee and Administer Admin Accounts</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg flex items-center gap-2 font-sans font-semibold hover:bg-yellow-500 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Add Admin
        </button>
      </header>

      <main className="flex-1 p-6 z-[2]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 ml-100">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className={`bg-gradient-to-br ${stat.bgFrom} ${stat.bgTo} p-5 rounded-xl text-white shadow-lg border border-yellow-400/50`}
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-white font-sans">{stat.name}</p>
                  <h3 className="text-2xl font-bold mt-1 font-sans">{stat.count}</h3>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-black/70 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/50 mb-6">
          <div className="relative w-full md:w-64">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search admins by ID, username, or email..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-yellow-400/50 rounded-lg w-full text-white placeholder-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-black/70 backdrop-blur-xl rounded-xl border border-yellow-400/50 shadow-lg">
          <div className="p-4 border-b border-yellow-400/30 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white font-sans">Admins</h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/10 border border-yellow-400/50 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
            >
              <option value="All">All</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            {filteredAdmins.length === 0 ? (
              <div className="p-8 text-center text-white font-sans">No admins found.</div>
            ) : (
              <table className="min-w-full divide-y divide-yellow-400/30">
                <thead className="bg-black/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Image
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-400/30">
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-yellow-400/10">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white font-sans">
                        {admin.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {admin.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {admin.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {admin.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {admin.adminImage ? (
                          <img
                            src={admin.adminImage}
                            alt={admin.userName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm text-yellow-400/70 font-sans">No Image</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setShowViewModal(true);
                            }}
                            className="bg-gradient-to-br from-green-400 to-emerald-600 text-white px-2 py-1 rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setShowUpdateModal(true);
                            }}
                            className="bg-gradient-to-br from-cyan-500 to-sky-600 text-white px-2 py-1 rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <EditIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setShowDeleteModal(true);
                            }}
                            className="bg-gradient-to-br from-amber-500 to-orange-600 text-white px-2 py-1 rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <Trash2Icon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {selectedAdmin && showViewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/70 backdrop-blur-xl rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-yellow-400/50">
            <div className="relative bg-gradient-to-r from-yellow-400 to-yellow-600 p-8 text-white">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedAdmin(null);
                }}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <XCircleIcon className="h-7 w-7" />
              </button>
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  {selectedAdmin.adminImage ? (
                    <img
                      src={selectedAdmin.adminImage}
                      alt={selectedAdmin.userName}
                      className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="h-28 w-28 rounded-full bg-yellow-400/20 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                      {selectedAdmin.userName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-4xl font-semibold text-white font-sans">{selectedAdmin.userName}</h2>
                  <p className="text-xl font-medium mt-1 text-white/80 font-sans">{selectedAdmin.email}</p>
                  <p className="text-sm font-medium mt-2 bg-black/50 inline-block px-3 py-1 rounded-full">
                    {selectedAdmin.position}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6 bg-black/50 p-6 rounded-lg border border-yellow-400/50">
                  <h3 className="text-2xl font-semibold text-yellow-400 font-sans border-b border-yellow-400/30 pb-3">
                    Admin Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">ID:</span>
                      <p className="text-md font-semibold text-white font-sans">{selectedAdmin.id}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">Username:</span>
                      <p className="text-md font-semibold text-white font-sans">{selectedAdmin.userName}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">Email:</span>
                      <p className="text-md font-semibold text-white font-sans">{selectedAdmin.email}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">Position:</span>
                      <p className="text-md font-semibold text-white font-sans">{selectedAdmin.position}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 bg-black/50 p-6 rounded-lg border border-yellow-400/50">
                  <h3 className="text-2xl font-semibold text-yellow-400 font-sans border-b border-yellow-400/30 pb-3">
                    Admin Image
                  </h3>
                  <div>
                    {selectedAdmin.adminImage ? (
                      <img
                        src={selectedAdmin.adminImage}
                        alt={selectedAdmin.userName}
                        className="mt-2 h-48 w-full object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200"
                      />
                    ) : (
                      <p className="text-white/70 mt-2 italic font-sans">No Image Available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedAdmin && showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto border border-yellow-400/50">
            <h2 className="text-xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
              Update Admin
            </h2>
            <form onSubmit={handleUpdateAdmin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-yellow-400 font-sans">Username</label>
                <input
                  type="text"
                  className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                  value={selectedAdmin.userName}
                  onChange={(e) => setSelectedAdmin({ ...selectedAdmin, userName: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-yellow-400 font-sans">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                  value={selectedAdmin.email}
                  onChange={(e) => setSelectedAdmin({ ...selectedAdmin, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-yellow-400 font-sans">Position</label>
                <select
                  className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                  value={selectedAdmin.position}
                  onChange={(e) => setSelectedAdmin({ ...selectedAdmin, position: e.target.value })}
                  required
                >
                  <option value="" disabled>Select Position</option>
                  <option value="Manager">Manager</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-yellow-400 font-sans">Password (Optional)</label>
                <input
                  type="password"
                  className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                  value={selectedAdmin.password || ""}
                  onChange={(e) => setSelectedAdmin({ ...selectedAdmin, password: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-yellow-400 font-sans">Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-yellow-400/20 file:text-yellow-400 hover:file:bg-yellow-400/30"
                  onChange={(e) => setSelectedAdmin({ ...selectedAdmin, adminImage: e.target.files[0] || selectedAdmin.adminImage })}
                />
                {selectedAdmin.adminImage && typeof selectedAdmin.adminImage !== "string" ? (
                  <img
                    src={URL.createObjectURL(selectedAdmin.adminImage)}
                    alt={selectedAdmin.userName}
                    className="h-16 w-16 rounded-full object-cover mt-2"
                  />
                ) : selectedAdmin.adminImage ? (
                  <img
                    src={selectedAdmin.adminImage}
                    alt={selectedAdmin.userName}
                    className="h-16 w-16 rounded-full object-cover mt-2"
                  />
                ) : (
                  <span className="text-sm text-yellow-400/70 font-sans mt-2">No Image</span>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-sans font-semibold hover:bg-yellow-500 transition-colors"
                >
                  Update Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedAdmin && showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-sm border border-yellow-400/50">
            <h2 className="text-xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
              Delete Admin
            </h2>
            <p className="text-sm text-white font-sans mb-6">
              Are you sure you want to delete <span className="font-semibold">{selectedAdmin.userName}</span>? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-sans"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAdmin}
                className="bg-gradient-to-br from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg font-sans font-semibold hover:opacity-90 transition-opacity"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto border border-yellow-400/50">
            <h2 className="text-xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
              Add New Admin
            </h2>
            <form onSubmit={handleAddAdmin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-yellow-400 font-sans">Username</label>
                <input
                  type="text"
                  className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                  value={newAdmin.userName}
                  onChange={(e) => setNewAdmin({ ...newAdmin, userName: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-yellow-400 font-sans">Password</label>
                <input
                  type="password"
                  className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-yellow-400 font-sans">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-yellow-400 font-sans">Position</label>
                <select
                  className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                  value={newAdmin.position}
                  onChange={(e) => setNewAdmin({ ...newAdmin, position: e.target.value })}
                  required
                >
                  <option value="" disabled>Select Position</option>
                  <option value="Manager">Manager</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-yellow-400 font-sans">Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-yellow-400/20 file:text-yellow-400 hover:file:bg-yellow-400/30"
                  onChange={(e) => setNewAdmin({ ...newAdmin, adminImage: e.target.files[0] })}
                />
                {newAdmin.adminImage && (
                  <img
                    src={URL.createObjectURL(newAdmin.adminImage)}
                    alt="Preview"
                    className="h-16 w-16 rounded-full object-cover mt-2"
                  />
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-sans font-semibold hover:bg-yellow-500 transition-colors"
                >
                  Add Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmins;