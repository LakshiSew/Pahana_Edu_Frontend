import React from "react";
import { useState, useEffect } from "react";
import { PlusIcon, SearchIcon, MoreVerticalIcon, EditIcon, Trash2Icon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen text-red-500 font-sans">
          Something went wrong. Please try again or refresh the page.
        </div>
      );
    }
    return this.props.children;
  }
}

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    categoryName: "",
    description: "",
    status: "Active",
    categoryImage: null,
    type: "book", // Default to "book" as per backend
  });
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.get("http://localhost:8080/auth/getallcategories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setCategories(response.data.map((cat) => ({
          ...cat,
          status: cat.status || "Inactive",
        })));
      }
    } catch (error) {
      console.error("Fetch Error:", error.response ? error.response.data : error.message);
      toast.error("Failed to fetch categories.", { position: "top-right", autoClose: 3000 });
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("categoryName", newCategory.categoryName);
    formData.append("description", newCategory.description);
    formData.append("status", newCategory.status);
    formData.append("type", newCategory.type); // Include type in the request
    if (newCategory.categoryImage) {
      formData.append("categoryImg", newCategory.categoryImage);
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.post("http://localhost:8080/auth/addcategory", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        setCategories([...categories, { ...response.data, status: response.data.status || "Inactive" }]);
        setShowAddModal(false);
        setNewCategory({ categoryName: "", description: "", status: "Active", categoryImage: null, type: "book" });
        toast.success("Category added successfully!", { position: "top-right", autoClose: 3000 });
      }
    } catch (error) {
      console.error("Add Error:", error.response ? error.response.data : error.message);
      toast.error("Failed to add category.", { position: "top-right", autoClose: 3000 });
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (selectedCategory.categoryName) {
      formData.append("categoryName", selectedCategory.categoryName);
    }
    if (selectedCategory.description) {
      formData.append("description", selectedCategory.description);
    }
    if (selectedCategory.status) {
      formData.append("status", selectedCategory.status);
    }
    if (selectedCategory.type) {
      formData.append("type", selectedCategory.type); // Include type in the update
    }
    if (selectedCategory.categoryImage && typeof selectedCategory.categoryImage !== "string") {
      formData.append("categoryImg", selectedCategory.categoryImage);
    } else if (selectedCategory.categoryImg) {
      // Preserve existing image URL by not sending a new file
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.put(`http://localhost:8080/updatecategory/${selectedCategory.categoryId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        setCategories(
          categories.map((cat) =>
            cat.categoryId === selectedCategory.categoryId ? { ...response.data, status: response.data.status || "Inactive" } : cat
          )
        );
        setShowUpdateModal(false);
        setSelectedCategory(null);
        toast.success("Category updated successfully!", { position: "top-right", autoClose: 3000 });
      }
    } catch (error) {
      console.error("Update Error:", error.response ? error.response.data : error.message);
      console.log("Full Error:", error);
      toast.error("Failed to update category.", { position: "top-right", autoClose: 3000 });
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.delete(`http://localhost:8080/deletecategory/${selectedCategory.categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setCategories(categories.filter((cat) => cat.categoryId !== selectedCategory.categoryId));
        setShowDeleteModal(false);
        setSelectedCategory(null);
        toast.success("Category deleted successfully!", { position: "top-right", autoClose: 3000 });
      }
    } catch (error) {
      console.error("Delete Error:", error.response ? error.response.data : error.message);
      toast.error("Failed to delete category.", { position: "top-right", autoClose: 3000 });
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ErrorBoundary>
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
          <h1 className="text-2xl font-bold text-white font-sans bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            Manage Categories
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg flex items-center gap-2 font-sans font-semibold hover:bg-yellow-500 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Category
          </button>
        </header>

        <main className="flex-1 p-6 z-[2]">
          <div className="bg-black/70 backdrop-blur-xl rounded-xl border border-yellow-400/50 shadow-lg">
            <div className="p-4 border-b border-yellow-400/30">
              <div className="relative w-full md:w-96">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="pl-10 pr-4 py-2 bg-white/10 border border-yellow-400/50 rounded-lg w-full text-white placeholder-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              {filteredCategories.length === 0 ? (
                <div className="p-8 text-center text-white font-sans">
                  No categories found.
                </div>
              ) : (
                <table className="min-w-full divide-y divide-yellow-400/30">
                  <thead className="bg-black/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                        S.No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                        Category Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans max-w-xs">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider font-sans">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-yellow-400/30">
                    {filteredCategories.map((category, index) => (
                      <tr key={category.categoryId} className="hover:bg-yellow-400/10">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white font-sans">
                            {category.categoryName}
                          </div>
                        </td>
                        <td className="px-6 py-4 break-words max-w-xs">
                          <div className="text-sm text-white font-sans">
                            {category.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                          {category.type || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {category.categoryImg ? (
                            <img
                              src={category.categoryImg}
                              alt={category.categoryName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm text-yellow-400/70 font-sans">No Image</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                          <span
                            className={`px-2 py-1 rounded-full ${
                              category.status === "Active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {category.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                setSelectedCategory(category);
                                setShowViewModal(true);
                              }}
                              className="bg-gradient-to-br from-green-400 to-emerald-600 text-white px-2 py-1 rounded-lg hover:opacity-90 transition-opacity"
                            >
                              <MoreVerticalIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCategory({ ...category, categoryImage: null });
                                setShowUpdateModal(true);
                              }}
                              className="bg-gradient-to-br from-cyan-500 to-sky-600 text-white px-2 py-1 rounded-lg hover:opacity-90 transition-opacity"
                            >
                              <EditIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCategory(category);
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

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-md border border-yellow-400/50">
              <h2 className="text-xl font-bold text-white font-sans bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
                Add New Category
              </h2>
              <form onSubmit={handleAddCategory}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-yellow-400 font-sans">
                    Category Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                    value={newCategory.categoryName}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, categoryName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-yellow-400 font-sans">
                    Description
                  </label>
                  <textarea
                    className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-yellow-400 font-sans">
                    Category Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-yellow-400/20 file:text-yellow-400 hover:file:bg-yellow-400/30"
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, categoryImage: e.target.files[0] || null })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-yellow-400 font-sans">
                    Status
                  </label>
                  <select
                    className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                    value={newCategory.status}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, status: e.target.value })
                    }
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-yellow-400 font-sans">
                    Type
                  </label>
                  <select
                    className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                    value={newCategory.type}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, type: e.target.value })
                    }
                    required
                  >
                    <option value="book">Book</option>
                    <option value="accessory">Accessory</option>
                  </select>
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
                    Add Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showUpdateModal && selectedCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-md border border-yellow-400/50">
              <h2 className="text-xl font-bold text-white font-sans bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
                Update Category
              </h2>
              <form onSubmit={handleUpdateCategory}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-yellow-400 font-sans">
                    Category Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                    value={selectedCategory.categoryName || ""}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, categoryName: e.target.value })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-yellow-400 font-sans">
                    Description
                  </label>
                  <textarea
                    className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                    value={selectedCategory.description || ""}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, description: e.target.value })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-yellow-400 font-sans">
                    Category Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-yellow-400/20 file:text-yellow-400 hover:file:bg-yellow-400/30"
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, categoryImage: e.target.files[0] || null })
                    }
                  />
                  {selectedCategory.categoryImg ? (
                    <img
                      src={selectedCategory.categoryImg}
                      alt={selectedCategory.categoryName}
                      className="h-16 w-16 rounded-full object-cover mt-2"
                    />
                  ) : (
                    <span className="text-sm text-yellow-400/70 font-sans mt-2">No Image</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-yellow-400 font-sans">
                    Status
                  </label>
                  <select
                    className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                    value={selectedCategory.status || "Active"}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, status: e.target.value })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-yellow-400 font-sans">
                    Type
                  </label>
                  <select
                    className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                    value={selectedCategory.type || "book"}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, type: e.target.value })
                    }
                  >
                    <option value="book">Book</option>
                    <option value="accessory">Accessory</option>
                  </select>
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
                    Update Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteModal && selectedCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-md border border-yellow-400/50">
              <h2 className="text-xl font-bold text-white font-sans bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
                Delete Category
              </h2>
              <p className="text-sm text-white font-sans mb-6">
                Are you sure you want to delete <span className="font-semibold">{selectedCategory.categoryName}</span>? This action cannot be undone.
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
                  onClick={handleDeleteCategory}
                  className="bg-gradient-to-br from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg font-sans font-semibold hover:opacity-90 transition-opacity"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {showViewModal && selectedCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-md border border-yellow-400/50">
              <h2 className="text-xl font-bold text-white font-sans bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
                Category Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-400 font-sans">Category Name</label>
                  <p className="text-sm text-white font-sans">{selectedCategory.categoryName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-400 font-sans">ID</label>
                  <p className="text-sm text-white font-sans">{selectedCategory.categoryId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-400 font-sans">Description</label>
                  <p className="text-sm text-white font-sans">{selectedCategory.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-400 font-sans">Type</label>
                  <p className="text-sm text-white font-sans">{selectedCategory.type || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-400 font-sans">Image</label>
                  {selectedCategory.categoryImg ? (
                    <img
                      src={selectedCategory.categoryImg}
                      alt={selectedCategory.categoryName}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm text-yellow-400/70 font-sans">No Image</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-400 font-sans">Status</label>
                  <p className="text-sm text-white font-sans">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        selectedCategory.status === "Active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {selectedCategory.status}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-sans"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ManageCategories;