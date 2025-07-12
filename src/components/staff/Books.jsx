import { useState } from "react";
import { SearchIcon, EyeIcon, XCircleIcon } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Books = () => {
  const [products, setProducts] = useState([
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 15.99, stock: "In Stock", category: "Fiction", image: "https://via.placeholder.com/50" },
    { id: 2, title: "Sapiens", author: "Yuval Noah Harari", price: 24.99, stock: "In Stock", category: "Non-Fiction", image: "https://via.placeholder.com/50" },
    { id: 3, title: "The Cat in the Hat", author: "Dr. Seuss", price: 9.99, stock: "Out of Stock", category: "Children", image: "https://via.placeholder.com/50" },
    { id: 4, title: "Calculus Made Easy", author: "Silvanus P. Thompson", price: 19.99, stock: "In Stock", category: "Textbooks", image: "https://via.placeholder.com/50" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || product.stock === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats for dashboard
  const stats = [
    { id: "Total", name: "Total Books", count: products.length, change: "+3%", icon: <EyeIcon className="h-6 w-6 text-white" />, bgFrom: "from-indigo-500", bgTo: "to-violet-600" },
    { id: "InStock", name: "In Stock", count: products.filter((p) => p.stock === "In Stock").length, change: "+5%", icon: <EyeIcon className="h-6 w-6 text-white" />, bgFrom: "from-green-400", bgTo: "to-emerald-600" },
    { id: "OutStock", name: "Out of Stock", count: products.filter((p) => p.stock === "Out of Stock").length, change: "-1%", icon: <EyeIcon className="h-6 w-6 text-white" />, bgFrom: "from-red-500", bgTo: "to-rose-600" },
    { id: "Pending", name: "Pending Review", count: 0, change: "0%", icon: <EyeIcon className="h-6 w-6 text-white" />, bgFrom: "from-cyan-500", bgTo: "to-sky-600" },
  ];

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
          <h1 className="text-2xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-600">
            View Book Products
          </h1>
          <p className="text-white/70 font-sans">Browse and Monitor Book Products</p>
        </div>
      </header>

      <main className="flex-1 p-6 z-[2]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={stat.id} className={`bg-gradient-to-br ${stat.bgFrom} ${stat.bgTo} p-5 rounded-xl text-white shadow-lg border border-yellow-400/50`}>
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
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by title or author..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-yellow-400/50 rounded-lg w-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-black/70 backdrop-blur-xl rounded-xl border border-yellow-400/50 shadow-lg">
          <div className="p-4 border-b border-yellow-400/30 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white font-sans">Book Products</h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/10 border border-yellow-400/50 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            >
              <option value="All">All</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center text-white font-sans">
                No products found.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-yellow-400/30">
                <thead className="bg-gradient-to-br from-indigo-500 to-violet-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-400/30">
                  {filteredProducts.map((product, index) => (
                    <tr key={product.id} className="hover:bg-indigo-500/10">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white font-sans">
                        {product.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {product.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.title}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm text-white/70 font-sans">No Image</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.stock === "In Stock" ? "bg-green-400/20 text-green-400" : "bg-red-400/20 text-red-400"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={(e) => {
                              e.preventDefault(); // Prevent any default navigation
                              setSelectedProduct(product);
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

      {selectedProduct && showViewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/70 backdrop-blur-xl rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-yellow-400/50">
            <div className="relative bg-gradient-to-r from-indigo-500 to-violet-600 p-8 text-white">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedProduct(null);
                }}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <XCircleIcon className="h-7 w-7" />
              </button>
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  {selectedProduct.image ? (
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                      className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="h-28 w-28 rounded-full bg-indigo-500/20 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                      {selectedProduct.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-4xl font-semibold text-white font-sans">{selectedProduct.title}</h2>
                  <p className="text-xl font-medium mt-1 text-white/80 font-sans">{selectedProduct.author}</p>
                  <p className="text-sm font-medium mt-2 bg-black/50 inline-block px-3 py-1 rounded-full">
                    ${selectedProduct.price} - {selectedProduct.stock}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6 bg-black/50 p-6 rounded-lg border border-yellow-400/50">
                  <h3 className="text-2xl font-semibold text-white font-sans border-b border-yellow-400/30 pb-3">
                    Product Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-white w-28 font-sans">Title:</span>
                      <p className="text-md font-semibold text-white font-sans">{selectedProduct.title}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-white w-28 font-sans">Author:</span>
                      <p className="text-md font-semibold text-white font-sans">{selectedProduct.author}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-white w-28 font-sans">Price:</span>
                      <p className="text-md font-semibold text-white font-sans">${selectedProduct.price}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-white w-28 font-sans">Category:</span>
                      <p className="text-md font-semibold text-white font-sans">{selectedProduct.category}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 bg-black/50 p-6 rounded-lg border border-yellow-400/50">
                  <h3 className="text-2xl font-semibold text-white font-sans border-b border-yellow-400/30 pb-3">
                    Product Image
                  </h3>
                  <div>
                    {selectedProduct.image ? (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.title}
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
    </div>
  );
};

export default Books;