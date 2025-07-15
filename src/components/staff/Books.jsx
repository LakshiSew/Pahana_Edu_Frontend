import { useState, useEffect } from "react";
import { SearchIcon, EyeIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfBookId, setPdfBookId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch books and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const booksResponse = await axios.get(
          "http://localhost:8080/auth/getallbooks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setBooks(booksResponse.data);

        const categoriesResponse = await axios.get(
          "http://localhost:8080/auth/getbookcategories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setCategories(categoriesResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        setLoading(false);
        toast.error(err.message || "Failed to fetch data", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchData();
  }, []);

  // Fetch PDF when pdfBookId changes
  useEffect(() => {
    if (pdfBookId) {
      const fetchPdf = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No authentication token found");

          const response = await axios.get(
            `http://localhost:8080/auth/getpdfbybookid/${pdfBookId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              responseType: "blob",
            }
          );

          const url = URL.createObjectURL(
            new Blob([response.data], { type: "application/pdf" })
          );
          setPdfUrl(url);
        } catch (err) {
          toast.error("Failed to load PDF", {
            position: "top-right",
            autoClose: 3000,
          });
          setShowPdfModal(false);
          setPdfBookId(null);
        }
      };

      fetchPdf();
    }

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
    };
  }, [pdfBookId]);

  // Filter books
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      book.status === (statusFilter === "In Stock" ? "Active" : "Inactive");
    return matchesSearch && matchesStatus;
  });

  // Stats for dashboard
  const stats = [
    {
      id: "Total",
      name: "Total Books",
      count: books.length,
      change: "+0%",
      icon: <EyeIcon className="h-6 w-6 text-white" />,
      bgFrom: "from-yellow-500",
      bgTo: "to-amber-600",
    },
    {
      id: "InStock",
      name: "In Stock",
      count: books.filter((b) => b.status === "Active").length,
      change: "+0%",
      icon: <CheckCircleIcon className="h-6 w-6 text-white" />,
      bgFrom: "from-green-400",
      bgTo: "to-emerald-600",
    },
    {
      id: "OutStock",
      name: "Out of Stock",
      count: books.filter((b) => b.status === "Inactive").length,
      change: "0%",
      icon: <XCircleIcon className="h-6 w-6 text-white" />,
      bgFrom: "from-red-500",
      bgTo: "to-rose-600",
    },
    {
      id: "Pending",
      name: "Pending Review",
      count: 0,
      change: "0%",
      icon: <EyeIcon className="h-6 w-6 text-white" />,
      bgFrom: "from-indigo-500",
      bgTo: "to-violet-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 font-sans">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 font-sans">
        {error}
      </div>
    );
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
            Manage Book Products
          </h1>
          <p className="text-yellow-400/70 font-sans">
            Oversee and Administer Book Products
          </p>
        </div>
      </header>

      <main className="flex-1 p-6 z-[2]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className={`bg-gradient-to-br ${stat.bgFrom} ${stat.bgTo} p-5 rounded-xl text-white shadow-lg border border-yellow-400/50`}
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-white font-sans">
                    {stat.name}
                  </p>
                  <h3 className="text-2xl font-bold mt-1 font-sans">
                    {stat.count}
                  </h3>
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
              placeholder="Search books by title or author..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-yellow-400/50 rounded-lg w-full text-white placeholder-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-black/70 backdrop-blur-xl rounded-xl border border-yellow-400/50 shadow-lg">
          <div className="p-4 border-b border-yellow-400/30 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white font-sans">
              Book Products
            </h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/10 border border-yellow-400/50 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
            >
              <option value="All">All</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            {filteredBooks.length === 0 ? (
              <div className="p-8 text-center text-white font-sans">
                No books found.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-yellow-400/30">
                <thead className="bg-black/50">
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
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Language
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Publisher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Publication Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Pages
                    </th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      PDF
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-400/30">
                  {filteredBooks.map((book) => (
                    <tr key={book.bookId} className="hover:bg-yellow-400/10">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white font-sans">
                        {book.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {book.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        ${book.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {book.image ? (
                          <img
                            src={book.image}
                            alt={book.title}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm text-yellow-400/70 font-sans">
                            No Image
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            book.status === "Active"
                              ? "bg-green-400/20 text-green-400"
                              : "bg-red-400/20 text-red-400"
                          }`}
                        >
                          {book.status === "Active"
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {categories.find(
                          (cat) => cat.categoryId === book.categoryId
                        )?.categoryName || "Unknown Category"}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {book.language || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {book.publisherName || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {book.publicationYear || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {book.pages || "N/A"}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {book.pdf ? (
                          <button
                            onClick={() => {
                              setPdfBookId(book.bookId);
                              setShowPdfModal(true);
                            }}
                            className="bg-gradient-to-br from-blue-400 to-blue-600 text-white px-2 py-1 rounded-lg hover:opacity-90 transition-opacity"
                          >
                            View PDF
                          </button>
                        ) : (
                          <span className="text-yellow-400/70">No PDF</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => {
                              setSelectedBook(book);
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

      {selectedBook && showViewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/70 backdrop-blur-xl rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-yellow-400/50">
            <div className="relative bg-gradient-to-r from-yellow-400 to-yellow-600 p-8 text-white">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedBook(null);
                }}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <XCircleIcon className="h-7 w-7" />
              </button>
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  {selectedBook.image ? (
                    <img
                      src={selectedBook.image}
                      alt={selectedBook.title}
                      className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="h-28 w-28 rounded-full bg-yellow-400/20 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                      {selectedBook.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-4xl font-semibold text-white font-sans">
                    {selectedBook.title}
                  </h2>
                  <p className="text-xl font-medium mt-1 text-white/80 font-sans">
                    {selectedBook.author}
                  </p>
                  <p className="text-sm font-medium mt-2 bg-black/50 inline-block px-3 py-1 rounded-full">
                    ${selectedBook.price} -{" "}
                    {selectedBook.status === "Active"
                      ? "In Stock"
                      : "Out of Stock"}
                  </p>
                  {selectedBook.pdf && (
                    <button
                      onClick={() => {
                        setPdfBookId(selectedBook.bookId);
                        setShowPdfModal(true);
                      }}
                      className="mt-2 inline-block bg-gradient-to-br from-blue-400 to-blue-600 text-white px-3 py-1 rounded-lg hover:opacity-90 transition-opacity font-sans"
                    >
                      View PDF
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6 bg-black/50 p-6 rounded-lg border border-yellow-400/50">
                  <h3 className="text-2xl font-semibold text-yellow-400 font-sans border-b border-yellow-400/30 pb-3">
                    Book Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        Title:
                      </span>
                      <p className="text-md font-semibold text-white font-sans">
                        {selectedBook.title}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        Author:
                      </span>
                      <p className="text-md font-semibold text-white font-sans">
                        {selectedBook.author}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        About Author:
                      </span>
                      <p className="text-md font-semibold text-white font-sans">
                        {selectedBook.aboutAuthor || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        Language:
                      </span>
                      <p className="text-md font-semibold text-white font-sans">
                        {selectedBook.language || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        Publisher:
                      </span>
                      <p className="text-md font-semibold text-white font-sans">
                        {selectedBook.publisherName || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        Publication Year:
                      </span>
                      <p className="text-md font-semibold text-white font-sans">
                        {selectedBook.publicationYear || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        Pages:
                      </span>
                      <p className="text-md font-semibold text-white font-sans">
                        {selectedBook.pages || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        Price:
                      </span>
                      <p className="text-md font-semibold text-white font-sans">
                        ${selectedBook.price}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        Discount:
                      </span>
                      <p className="text-md font-semibold text-white font-sans">
                        {selectedBook.discount
                          ? `${selectedBook.discount}%`
                          : "None"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        Stock Quantity:
                      </span>
                      <p className="text-md font-semibold text-white font-sans">
                        {selectedBook.stockQty}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        Category:
                      </span>
                      <p className="text-md font-semibold text-white font-sans">
                        {categories.find(
                          (cat) => cat.categoryId === selectedBook.categoryId
                        )?.categoryName || "Unknown Category"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        Description:
                      </span>
                      <p className="text-md font-semibold text-white font-sans">
                        {selectedBook.description || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        PDF:
                      </span>
                      {selectedBook.pdf ? (
                        <button
                          onClick={() => {
                            setPdfBookId(selectedBook.bookId);
                            setShowPdfModal(true);
                          }}
                          className="text-md font-semibold text-blue-400 hover:underline font-sans"
                        >
                          View PDF
                        </button>
                      ) : (
                        <p className="text-md font-semibold text-white font-sans">
                          No PDF Available
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-6 bg-black/50 p-6 rounded-lg border border-yellow-400/50">
                  <h3 className="text-2xl font-semibold text-yellow-400 font-sans border-b border-yellow-400/30 pb-3">
                    Book Image
                  </h3>
                  <div>
                    {selectedBook.image ? (
                      <img
                        src={selectedBook.image}
                        alt={selectedBook.title}
                        className="mt-2 h-48 w-full object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200"
                      />
                    ) : (
                      <p className="text-white/70 mt-2 italic font-sans">
                        No Image Available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPdfModal && pdfUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-yellow-400/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                PDF Preview
              </h2>
              <button
                onClick={() => {
                  setShowPdfModal(false);
                  setPdfBookId(null);
                  setPdfUrl(null);
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <XCircleIcon className="h-7 w-7" />
              </button>
            </div>
            <div className="w-full h-[70vh]">
              <iframe
                src={pdfUrl}
                className="w-full h-full rounded-lg"
                title="PDF Preview"
                onError={() => {
                  toast.error("Failed to load PDF", {
                    position: "top-right",
                    autoClose: 3000,
                  });
                  setShowPdfModal(false);
                  setPdfBookId(null);
                  setPdfUrl(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;