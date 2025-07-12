import { useState } from "react";
import { SearchIcon, EyeIcon } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Categories = () => {
  const [categories] = useState([
    { id: 1, categoryName: "Fiction", description: "Imaginative literary works", status: "Available", categoryImage: "https://img.freepik.com/free-photo/still-life-sant-jordi-day-books-roses_23-2151197539.jpg?semt=ais_hybrid&w=740" },
    { id: 2, categoryName: "Non-Fiction", description: "Factual and informative books", status: "Available", categoryImage: "https://img.freepik.com/free-photo/top-view-different-wonderful-colorful-flowers-with-yellow-rose-wood_141793-17170.jpg?semt=ais_hybrid&w=740" },
    { id: 3, categoryName: "Children", description: "Books for young readers", status: "Out of Stock", categoryImage: "https://img.freepik.com/free-photo/still-life-sant-jordi-day-books-roses_23-2151197539.jpg?semt=ais_hybrid&w=740" },
    { id: 4, categoryName: "Textbooks", description: "Educational materials", status: "Available", categoryImage: "https://img.freepik.com/free-photo/top-view-different-wonderful-colorful-flowers-with-yellow-rose-wood_141793-17170.jpg?semt=ais_hybrid&w=740" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Filter categories
  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Toast Container */}
      <ToastContainer />

      {/* Background Shapes */}
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

      {/* Header */}
      <header className="bg-black/70 backdrop-blur-xl border-b border-yellow-400/30 p-4 flex justify-between items-center z-[2]">
        <div>
          <h1 className="text-2xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-600">
            View Book Categories
          </h1>
          <p className="text-white/70 font-sans">Browse and Monitor Book Categories</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 z-[2]">
        <div className="bg-black/70 backdrop-blur-xl rounded-xl border border-yellow-400/50 shadow-lg">
          {/* Search Bar */}
          <div className="p-4 border-b border-yellow-400/30">
            <div className="relative w-full md:w-96">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
              <input
                type="text"
                placeholder="Search categories..."
                className="pl-10 pr-4 py-2 bg-white/10 border border-yellow-400/50 rounded-lg w-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Categories Table */}
          <div className="overflow-x-auto">
            {filteredCategories.length === 0 ? (
              <div className="p-8 text-center text-white font-sans">
                No categories found.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-yellow-400/30">
                <thead className="bg-gradient-to-br from-indigo-500 to-violet-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Category Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Description
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
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-indigo-500/10">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white font-sans">
                          {category.categoryName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {category.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {category.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {category.categoryImage ? (
                          <img
                            src={category.categoryImage}
                            alt={category.categoryName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm text-white/70 font-sans">No Image</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        <span
                          className={`px-2 py-1 rounded-full ${
                            category.status === "Available" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
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
                            <EyeIcon className="h-5 w-5" />
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

      {/* View Category Modal */}
      {showViewModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-md border border-yellow-400/50">
            <h2 className="text-xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-600 mb-4">
              Category Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 font-sans">Category Name</label>
                <p className="text-sm text-white font-sans">{selectedCategory.categoryName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 font-sans">ID</label>
                <p className="text-sm text-white font-sans">{selectedCategory.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 font-sans">Description</label>
                <p className="text-sm text-white font-sans">{selectedCategory.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 font-sans">Image</label>
                {selectedCategory.categoryImage && typeof selectedCategory.categoryImage !== "string" ? (
                  <img
                    src={URL.createObjectURL(selectedCategory.categoryImage)}
                    alt={selectedCategory.categoryName}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : selectedCategory.categoryImage ? (
                  <img
                    src={selectedCategory.categoryImage}
                    alt={selectedCategory.categoryName}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-white/70 font-sans">No Image</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 font-sans">Status</label>
                <p className="text-sm text-white font-sans">
                  <span
                    className={`px-2 py-1 rounded-full ${
                      selectedCategory.status === "Available" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
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
  );
};

export default Categories;