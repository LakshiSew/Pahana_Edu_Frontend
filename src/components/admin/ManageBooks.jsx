// import { useState, useEffect } from "react";
// import {
//   PlusIcon,
//   SearchIcon,
//   EyeIcon,
//   EditIcon,
//   Trash2Icon,
//   CheckCircleIcon,
//   XCircleIcon,
// } from "lucide-react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

// const ManageBooks = () => {
//   const [books, setBooks] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [selectedBook, setSelectedBook] = useState(null);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showUpdateModal, setShowUpdateModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showPdfModal, setShowPdfModal] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState(null);
//   const [pdfBookId, setPdfBookId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [newBook, setNewBook] = useState({
//     title: "",
//     author: "",
//     aboutAuthor: "",
//     price: "",
//     stockQty: "",
//     description: "",
//     discount: "",
//     categoryId: "",
//     status: "Active",
//     image: null,
//     pdf: null,
//     language: "",
//     publisherName: "",
//     publicationYear: "",
//     pages: "",
//   });

//   // Fetch books and categories on mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) throw new Error("No authentication token found");

//         const booksResponse = await axios.get(
//           "http://localhost:8080/auth/getallbooks",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setBooks(booksResponse.data);

//         const categoriesResponse = await axios.get(
//           "http://localhost:8080/auth/getbookcategories",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setCategories(categoriesResponse.data);

//         setLoading(false);
//       } catch (err) {
//         setError(err.message || "Failed to fetch data");
//         setLoading(false);
//         toast.error(err.message || "Failed to fetch data", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       }
//     };

//     fetchData();
//   }, []);

//   // Fetch PDF when pdfBookId changes
//   useEffect(() => {
//     if (pdfBookId) {
//       const fetchPdf = async () => {
//         try {
//           const token = localStorage.getItem("token");
//           if (!token) throw new Error("No authentication token found");

//           const response = await axios.get(
//             `http://localhost:8080/auth/getpdfbybookid/${pdfBookId}`,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//               responseType: "blob",
//             }
//           );

//           const url = URL.createObjectURL(
//             new Blob([response.data], { type: "application/pdf" })
//           );
//           setPdfUrl(url);
//         } catch (err) {
//           toast.error("Failed to load PDF", {
//             position: "top-right",
//             autoClose: 3000,
//           });
//           setShowPdfModal(false);
//           setPdfBookId(null);
//         }
//       };

//       fetchPdf();
//     }

//     return () => {
//       if (pdfUrl) {
//         URL.revokeObjectURL(pdfUrl);
//         setPdfUrl(null);
//       }
//     };
//   }, [pdfBookId]);

//   // Handle adding a book
//   const handleAddBook = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No authentication token found");

//       const formData = new FormData();
//       formData.append("title", newBook.title);
//       formData.append("categoryId", newBook.categoryId);
//       formData.append("author", newBook.author);
//       formData.append("aboutAuthor", newBook.aboutAuthor);
//       formData.append("price", newBook.price);
//       formData.append("stockQty", newBook.stockQty);
//       formData.append("description", newBook.description);
//       formData.append("discount", newBook.discount || 0);
//       formData.append("status", newBook.status);
//       formData.append("language", newBook.language);
//       formData.append("publisherName", newBook.publisherName);
//       formData.append("publicationYear", newBook.publicationYear);
//       formData.append("pages", newBook.pages);
//       if (newBook.image) formData.append("image", newBook.image);
//       if (newBook.pdf) {
//         if (newBook.pdf.size > 10_000_000) {
//           toast.error("PDF file size exceeds 10MB limit", {
//             position: "top-right",
//             autoClose: 3000,
//           });
//           return;
//         }
//         formData.append("pdf", newBook.pdf);
//       }

//       const response = await axios.post(
//         "http://localhost:8080/auth/addbook",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       setBooks([...books, response.data]);
//       setShowAddModal(false);
//       setNewBook({
//         title: "",
//         author: "",
//         aboutAuthor: "",
//         price: "",
//         stockQty: "",
//         description: "",
//         discount: "",
//         categoryId: "",
//         status: "Active",
//         image: null,
//         pdf: null,
//         language: "",
//         publisherName: "",
//         publicationYear: "",
//         pages: "",
//       });
//       toast.success("Book added successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (err) {
//       toast.error(err.response?.data || "Failed to add book", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   // Handle updating a book
//   const handleUpdateBook = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No authentication token found");

//       const formData = new FormData();
//       if (selectedBook.title) formData.append("title", selectedBook.title);
//       if (selectedBook.categoryId)
//         formData.append("categoryId", selectedBook.categoryId);
//       if (selectedBook.author) formData.append("author", selectedBook.author);
//       if (selectedBook.aboutAuthor)
//         formData.append("aboutAuthor", selectedBook.aboutAuthor);
//       if (selectedBook.price) formData.append("price", selectedBook.price);
//       if (selectedBook.stockQty)
//         formData.append("stockQty", selectedBook.stockQty);
//       if (selectedBook.description)
//         formData.append("description", selectedBook.description);
//       if (selectedBook.discount)
//         formData.append("discount", selectedBook.discount);
//       if (selectedBook.status) formData.append("status", selectedBook.status);
//       if (selectedBook.language)
//         formData.append("language", selectedBook.language);
//       if (selectedBook.publisherName)
//         formData.append("publisherName", selectedBook.publisherName);
//       if (selectedBook.publicationYear)
//         formData.append("publicationYear", selectedBook.publicationYear);
//       if (selectedBook.pages) formData.append("pages", selectedBook.pages);
//       if (selectedBook.image && typeof selectedBook.image !== "string") {
//         formData.append("image", selectedBook.image);
//       }
//       if (selectedBook.pdf && typeof selectedBook.pdf !== "string") {
//         if (selectedBook.pdf.size > 10_000_000) {
//           toast.error("PDF file size exceeds 10MB limit", {
//             position: "top-right",
//             autoClose: 3000,
//           });
//           return;
//         }
//         formData.append("pdf", selectedBook.pdf);
//       }

//       const response = await axios.put(
//         `http://localhost:8080/updatebook/${selectedBook.bookId}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       setBooks(
//         books.map((book) =>
//           book.bookId === selectedBook.bookId ? response.data : book
//         )
//       );
//       setShowUpdateModal(false);
//       setSelectedBook(null);
//       toast.success("Book updated successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (err) {
//       toast.error(err.response?.data || "Failed to update book", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   // Handle deleting a book
//   const handleDeleteBook = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No authentication token found");

//       await axios.delete(
//         `http://localhost:8080/deletebook/${selectedBook.bookId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setBooks(books.filter((book) => book.bookId !== selectedBook.bookId));
//       setShowDeleteModal(false);
//       setSelectedBook(null);
//       toast.success("Book deleted successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (err) {
//       toast.error(err.response?.data || "Failed to delete book", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   // Filter books
//   const filteredBooks = books.filter((book) => {
//     const matchesSearch =
//       book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       book.author.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus =
//       statusFilter === "All" ||
//       book.status === (statusFilter === "In Stock" ? "Active" : "Inactive");
//     return matchesSearch && matchesStatus;
//   });

//   // Stats for dashboard
//   const stats = [
//     {
//       id: "Total",
//       name: "Total Books",
//       count: books.length,
//       change: "+0%",
//       icon: <PlusIcon className="h-6 w-6 text-white" />,
//       bgFrom: "from-yellow-500",
//       bgTo: "to-amber-600",
//     },
//     {
//       id: "InStock",
//       name: "In Stock",
//       count: books.filter((b) => b.status === "Active").length,
//       change: "+0%",
//       icon: <CheckCircleIcon className="h-6 w-6 text-white" />,
//       bgFrom: "from-green-400",
//       bgTo: "to-emerald-600",
//     },
//     {
//       id: "OutStock",
//       name: "Out of Stock",
//       count: books.filter((b) => b.status === "Inactive").length,
//       change: "0%",
//       icon: <XCircleIcon className="h-6 w-6 text-white" />,
//       bgFrom: "from-red-500",
//       bgTo: "to-rose-600",
//     },
//     {
//       id: "Pending",
//       name: "Pending Review",
//       count: 0,
//       change: "0%",
//       icon: <EyeIcon className="h-6 w-6 text-white" />,
//       bgFrom: "from-indigo-500",
//       bgTo: "to-violet-600",
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen text-gray-600 font-sans">
//         Loading...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-screen text-red-600 font-sans">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
//       <ToastContainer />
//       <svg
//         className="absolute top-0 left-0 w-full h-[200px] z-[1] opacity-20"
//         viewBox="0 0 1440 320"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <path
//           fill="#FBBF24"
//           d="M0,128L60,138.7C120,149,240,171,360,170.7C480,171,600,149,720,133.3C840,117,960,107,1080,117.3C1200,128,1320,160,1380,176L1440,192L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
//         />
//       </svg>

//       <header className="bg-black/70 backdrop-blur-xl border-b border-yellow-400/30 p-4 flex justify-between items-center z-[2]">
//         <div>
//           <h1 className="text-2xl font-bold text-white font-sans bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
//             Manage Book Products
//           </h1>
//           <p className="text-yellow-400/70 font-sans">
//             Oversee and Administer Book Products
//           </p>
//         </div>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="bg-yellow-400 text-black px-4 py-2 rounded-lg flex items-center gap-2 font-sans font-semibold hover:bg-yellow-500 transition-colors"
//         >
//           <PlusIcon className="h-5 w-5" />
//           Add Book
//         </button>
//       </header>

//       <main className="flex-1 p-6 z-[2]">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           {stats.map((stat) => (
//             <div
//               key={stat.id}
//               className={`bg-gradient-to-br ${stat.bgFrom} ${stat.bgTo} p-5 rounded-xl text-white shadow-lg border border-yellow-400/50`}
//             >
//               <div className="flex justify-between items-center">
//                 <div className="flex flex-col">
//                   <p className="text-sm font-medium text-white font-sans">
//                     {stat.name}
//                   </p>
//                   <h3 className="text-2xl font-bold mt-1 font-sans">
//                     {stat.count}
//                   </h3>
//                 </div>
//                 <div className="p-2 bg-white/20 rounded-lg">{stat.icon}</div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="bg-black/70 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/50 mb-6">
//           <div className="relative w-full md:w-64">
//             <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 h-5 w-5" />
//             <input
//               type="text"
//               placeholder="Search books by title or author..."
//               className="pl-10 pr-4 py-2 bg-white/10 border border-yellow-400/50 rounded-lg w-full text-white placeholder-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="bg-black/70 backdrop-blur-xl rounded-xl border border-yellow-400/50 shadow-lg">
//           <div className="p-4 border-b border-yellow-400/30 flex justify-between items-center">
//             <h2 className="text-xl font-semibold text-white font-sans">
//               Book Products
//             </h2>
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="bg-white/10 border border-yellow-400/50 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//             >
//               <option value="All">All</option>
//               <option value="In Stock">In Stock</option>
//               <option value="Out of Stock">Out of Stock</option>
//             </select>
//           </div>
//     <div className="overflow-x-auto">
//   {filteredBooks.length === 0 ? (
//     <div className="p-8 text-center text-white font-sans">
//       No books found.
//     </div>
//   ) : (
//     <table className="min-w-full divide-y divide-yellow-400/30">
//       <thead className="bg-black/50">
//         <tr>
//           <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
//             S.No
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
//             Title
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
//             Author
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
//             Price
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
//             Image
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
//             Stock
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
//             Category
//           </th>
//           <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider font-sans">
//             Actions
//           </th>
//         </tr>
//       </thead>
//       <tbody className="divide-y divide-yellow-400/30">
//         {filteredBooks.map((book, index) => (
//           <tr key={book.bookId} className="hover:bg-yellow-400/10">
//             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white font-sans">
//               {index + 1}
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white font-sans">
//               {book.title}
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
//               {book.author}
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
//               Rs.{book.price}
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap">
//               {book.image ? (
//                 <img
//                   src={book.image}
//                   alt={book.title}
//                   className="h-10 w-10 rounded-full object-cover"
//                 />
//               ) : (
//                 <span className="text-sm text-yellow-400/70 font-sans">
//                   No Image
//                 </span>
//               )}
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap text-sm">
//               <span
//                 className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                   book.status === "Active"
//                     ? "bg-green-400/20 text-green-400"
//                     : "bg-red-400/20 text-red-400"
//                 }`}
//               >
//                 {book.status === "Active" ? "In Stock" : "Out of Stock"}
//               </span>
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
//               {categories.find((cat) => cat.categoryId === book.categoryId)
//                 ?.categoryName || "Unknown Category"}
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap text-right">
//               <div className="flex gap-2 justify-end">
//                 <button
//                   onClick={() => {
//                     setSelectedBook(book);
//                     setShowViewModal(true);
//                   }}
//                   className="bg-gradient-to-br from-green-400 to-emerald-600 text-white px-2 py-1 rounded-lg hover:opacity-90 transition-opacity"
//                 >
//                   <EyeIcon className="h-5 w-5" />
//                 </button>
//                 <button
//                   onClick={() => {
//                     setSelectedBook(book);
//                     setShowUpdateModal(true);
//                   }}
//                   className="bg-gradient-to-br from-cyan-500 to-sky-600 text-white px-2 py-1 rounded-lg hover:opacity-90 transition-opacity"
//                 >
//                   <EditIcon className="h-5 w-5" />
//                 </button>
//                 <button
//                   onClick={() => {
//                     setSelectedBook(book);
//                     setShowDeleteModal(true);
//                   }}
//                   className="bg-gradient-to-br from-amber-500 to-orange-600 text-white px-2 py-1 rounded-lg hover:opacity-90 transition-opacity"
//                 >
//                   <Trash2Icon className="h-5 w-5" />
//                 </button>
//               </div>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   )}
// </div>
//         </div>
//       </main>

//       {selectedBook && showViewModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-black/70 backdrop-blur-xl rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-yellow-400/50">
//             <div className="relative bg-gradient-to-r from-yellow-400 to-yellow-600 p-8 text-white">
//               <button
//                 onClick={() => {
//                   setShowViewModal(false);
//                   setSelectedBook(null);
//                 }}
//                 className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
//               >
//                 <XCircleIcon className="h-7 w-7" />
//               </button>
//               <div className="flex items-center space-x-6">
//                 <div className="flex-shrink-0">
//                   {selectedBook.image ? (
//                     <img
//                       src={selectedBook.image}
//                       alt={selectedBook.title}
//                       className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-lg"
//                     />
//                   ) : (
//                     <div className="h-28 w-28 rounded-full bg-yellow-400/20 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
//                       {selectedBook.title.charAt(0)}
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <h2 className="text-4xl font-semibold text-white font-sans">
//                     {selectedBook.title}
//                   </h2>
//                   <p className="text-xl font-medium mt-1 text-white/80 font-sans">
//                     {selectedBook.author}
//                   </p>
//                   <p className="text-sm font-medium mt-2 bg-black/50 inline-block px-3 py-1 rounded-full">
//                     Rs.{selectedBook.price} -{" "}
//                     {selectedBook.status === "Active"
//                       ? "In Stock"
//                       : "Out of Stock"}
//                   </p>
//                   {selectedBook.pdf && (
//                     <button
//                       onClick={() => {
//                         setPdfBookId(selectedBook.bookId);
//                         setShowPdfModal(true);
//                       }}
//                       className="mt-2 inline-block bg-gradient-to-br from-blue-400 to-blue-600 text-white px-3 py-1 rounded-lg hover:opacity-90 transition-opacity font-sans"
//                     >
//                       View PDF
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="p-8">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="space-y-6 bg-black/50 p-6 rounded-lg border border-yellow-400/50">
//                   <h3 className="text-2xl font-semibold text-yellow-400 font-sans border-b border-yellow-400/30 pb-3">
//                     Book Details
//                   </h3>
//                   <div className="space-y-4">
//                     <div className="flex items-center">
//                       <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
//                         Title:
//                       </span>
//                       <p className="text-md font-semibold text-white font-sans">
//                         {selectedBook.title}
//                       </p>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
//                         Author:
//                       </span>
//                       <p className="text-md font-semibold text-white font-sans">
//                         {selectedBook.author}
//                       </p>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
//                         About Author:
//                       </span>
//                       <p className="text-md font-semibold text-white font-sans">
//                         {selectedBook.aboutAuthor || "N/A"}
//                       </p>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
//                         Language:
//                       </span>
//                       <p className="text-md font-semibold text-white font-sans">
//                         {selectedBook.language || "N/A"}
//                       </p>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
//                         Publisher:
//                       </span>
//                       <p className="text-md font-semibold text-white font-sans">
//                         {selectedBook.publisherName || "N/A"}
//                       </p>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
//                         Publication Year:
//                       </span>
//                       <p className="text-md font-semibold text-white font-sans">
//                         {selectedBook.publicationYear || "N/A"}
//                       </p>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
//                         Pages:
//                       </span>
//                       <p className="text-md font-semibold text-white font-sans">
//                         {selectedBook.pages || "N/A"}
//                       </p>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
//                         Price:
//                       </span>
//                       <p className="text-md font-semibold text-white font-sans">
//                         Rs.{selectedBook.price}
//                       </p>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
//                         Discount:
//                       </span>
//                       <p className="text-md font-semibold text-white font-sans">
//                         {selectedBook.discount
//                           ? `${selectedBook.discount}%`
//                           : "None"}
//                       </p>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
//                         Stock Quantity:
//                       </span>
//                       <p className="text-md font-semibold text-white font-sans">
//                         {selectedBook.stockQty}
//                       </p>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
//                         Category:
//                       </span>
//                       <p className="text-md font-semibold text-white font-sans">
//                         {categories.find(
//                           (cat) => cat.categoryId === selectedBook.categoryId
//                         )?.categoryName || "Unknown Category"}
//                       </p>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
//                         Description:
//                       </span>
//                       <p className="text-md font-semibold text-white font-sans">
//                         {selectedBook.description || "N/A"}
//                       </p>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
//                         PDF:
//                       </span>
//                       {selectedBook.pdf ? (
//                         <button
//                           onClick={() => {
//                             setPdfBookId(selectedBook.bookId);
//                             setShowPdfModal(true);
//                           }}
//                           className="text-md font-semibold text-blue-400 hover:underline font-sans"
//                         >
//                           View PDF
//                         </button>
//                       ) : (
//                         <p className="text-md font-semibold text-white font-sans">
//                           No PDF Available
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="space-y-6 bg-black/50 p-6 rounded-lg border border-yellow-400/50">
//                   <h3 className="text-2xl font-semibold text-yellow-400 font-sans border-b border-yellow-400/30 pb-3">
//                     Book Image
//                   </h3>
//                   <div>
//                     {selectedBook.image ? (
//                       <img
//                         src={selectedBook.image}
//                         alt={selectedBook.title}
//                         className="mt-2 h-48 w-full object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200"
//                       />
//                     ) : (
//                       <p className="text-white/70 mt-2 italic font-sans">
//                         No Image Available
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {selectedBook && showUpdateModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto border border-yellow-400/50">
//             <h2 className="text-xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
//               Update Book
//             </h2>
//             <form onSubmit={handleUpdateBook}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Title
//                 </label>
//                 <input
//                   type="text"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={selectedBook.title}
//                   onChange={(e) =>
//                     setSelectedBook({ ...selectedBook, title: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Author
//                 </label>
//                 <input
//                   type="text"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={selectedBook.author}
//                   onChange={(e) =>
//                     setSelectedBook({ ...selectedBook, author: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   About Author
//                 </label>
//                 <textarea
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={selectedBook.aboutAuthor}
//                   onChange={(e) =>
//                     setSelectedBook({
//                       ...selectedBook,
//                       aboutAuthor: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Language
//                 </label>
//                 <input
//                   type="text"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={selectedBook.language || ""}
//                   onChange={(e) =>
//                     setSelectedBook({
//                       ...selectedBook,
//                       language: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Publisher Name
//                 </label>
//                 <input
//                   type="text"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={selectedBook.publisherName || ""}
//                   onChange={(e) =>
//                     setSelectedBook({
//                       ...selectedBook,
//                       publisherName: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Publication Year
//                 </label>
//                 <input
//                   type="number"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={selectedBook.publicationYear || ""}
//                   onChange={(e) =>
//                     setSelectedBook({
//                       ...selectedBook,
//                       publicationYear: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Pages
//                 </label>
//                 <input
//                   type="number"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={selectedBook.pages || ""}
//                   onChange={(e) =>
//                     setSelectedBook({
//                       ...selectedBook,
//                       pages: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Price
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={selectedBook.price}
//                   onChange={(e) =>
//                     setSelectedBook({ ...selectedBook, price: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Stock Quantity
//                 </label>
//                 <input
//                   type="number"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={selectedBook.stockQty}
//                   onChange={(e) =>
//                     setSelectedBook({
//                       ...selectedBook,
//                       stockQty: e.target.value,
//                     })
//                   }
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Discount (%)
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={selectedBook.discount}
//                   onChange={(e) =>
//                     setSelectedBook({
//                       ...selectedBook,
//                       discount: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Description
//                 </label>
//                 <textarea
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={selectedBook.description}
//                   onChange={(e) =>
//                     setSelectedBook({
//                       ...selectedBook,
//                       description: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Image (Optional)
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-yellow-400/20 file:text-yellow-400 hover:file:bg-yellow-400/30"
//                   onChange={(e) =>
//                     setSelectedBook({
//                       ...selectedBook,
//                       image: e.target.files[0] || selectedBook.image,
//                     })
//                   }
//                 />
//                 {selectedBook.image &&
//                 typeof selectedBook.image !== "string" ? (
//                   <img
//                     src={URL.createObjectURL(selectedBook.image)}
//                     alt={selectedBook.title}
//                     className="h-16 w-16 rounded-full object-cover mt-2"
//                   />
//                 ) : selectedBook.image ? (
//                   <img
//                     src={selectedBook.image}
//                     alt={selectedBook.title}
//                     className="h-16 w-16 rounded-full object-cover mt-2"
//                   />
//                 ) : (
//                   <span className="text-sm text-yellow-400/70 font-sans mt-2">
//                     No Image
//                   </span>
//                 )}
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   PDF (Optional)
//                 </label>
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-yellow-400/20 file:text-yellow-400 hover:file:bg-yellow-400/30"
//                   onChange={(e) => {
//                     const file = e.target.files[0];
//                     if (file && file.size > 10_000_000) {
//                       toast.error("PDF file size exceeds 10MB limit", {
//                         position: "top-right",
//                         autoClose: 3000,
//                       });
//                       return;
//                     }
//                     setSelectedBook({
//                       ...selectedBook,
//                       pdf: file || selectedBook.pdf,
//                     });
//                   }}
//                 />
//                 {selectedBook.pdf && typeof selectedBook.pdf !== "string" ? (
//                   <span className="text-sm text-yellow-400 font-sans mt-2">
//                     PDF Selected: {selectedBook.pdf.name}
//                   </span>
//                 ) : selectedBook.pdf ? (
//                   <button
//                     onClick={() => {
//                       setPdfBookId(selectedBook.bookId);
//                       setShowPdfModal(true);
//                     }}
//                     className="text-sm text-blue-400 hover:underline font-sans mt-2"
//                   >
//                     View Current PDF
//                   </button>
//                 ) : (
//                   <span className="text-sm text-yellow-400/70 font-sans mt-2">
//                     No PDF
//                   </span>
//                 )}
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Stock Status
//                 </label>
//                 <select
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={selectedBook.status}
//                   onChange={(e) =>
//                     setSelectedBook({ ...selectedBook, status: e.target.value })
//                   }
//                   required
//                 >
//                   <option value="Active" className="text-black">In Stock</option>
//                   <option value="Inactive" className="text-black">Out of Stock</option>
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Category
//                 </label>
//                 <select
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={selectedBook.categoryId}
//                   onChange={(e) =>
//                     setSelectedBook({
//                       ...selectedBook,
//                       categoryId: e.target.value,
//                     })
//                   }
//                   required
//                 >
//                   <option value="" className="text-black">Select Category</option>
//                   {categories.map((category) => (
//                     <option className="text-black"
//                       key={category.categoryId}
//                       value={category.categoryId}
//                     >
//                       {category.categoryName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowUpdateModal(false)}
//                   className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-sans"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-sans font-semibold hover:bg-yellow-500 transition-colors"
//                 >
//                   Update Book
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {selectedBook && showDeleteModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-sm border border-yellow-400/50">
//             <h2 className="text-xl font-bold text-white font-sans bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
//               Delete Book
//             </h2>
//             <p className="text-sm text-white font-sans mb-6">
//               Are you sure you want to delete{" "}
//               <span className="font-semibold">{selectedBook.title}</span>? This
//               action cannot be undone.
//             </p>
//             <div className="flex justify-end gap-2">
//               <button
//                 type="button"
//                 onClick={() => setShowDeleteModal(false)}
//                 className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-sans"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleDeleteBook}
//                 className="bg-gradient-to-br from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg font-sans font-semibold hover:opacity-90 transition-opacity"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showAddModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto border border-yellow-400/50">
//             <h2 className="text-xl font-bold text-white font-sans bg-clip-text  bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
//               Add New Book
//             </h2>
//             <form onSubmit={handleAddBook}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Title
//                 </label>
//                 <input
//                   type="text"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={newBook.title}
//                   onChange={(e) =>
//                     setNewBook({ ...newBook, title: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Author
//                 </label>
//                 <input
//                   type="text"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={newBook.author}
//                   onChange={(e) =>
//                     setNewBook({ ...newBook, author: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   About Author
//                 </label>
//                 <textarea
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={newBook.aboutAuthor}
//                   onChange={(e) =>
//                     setNewBook({ ...newBook, aboutAuthor: e.target.value })
//                   }
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Language
//                 </label>
//                 <input
//                   type="text"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={newBook.language}
//                   onChange={(e) =>
//                     setNewBook({ ...newBook, language: e.target.value })
//                   }
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Publisher Name
//                 </label>
//                 <input
//                   type="text"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={newBook.publisherName}
//                   onChange={(e) =>
//                     setNewBook({ ...newBook, publisherName: e.target.value })
//                   }
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Publication Year
//                 </label>
//                 <input
//                   type="number"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={newBook.publicationYear}
//                   onChange={(e) =>
//                     setNewBook({ ...newBook, publicationYear: e.target.value })
//                   }
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Pages
//                 </label>
//                 <input
//                   type="number"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={newBook.pages}
//                   onChange={(e) =>
//                     setNewBook({ ...newBook, pages: e.target.value })
//                   }
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Price
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={newBook.price}
//                   onChange={(e) =>
//                     setNewBook({ ...newBook, price: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Stock Quantity
//                 </label>
//                 <input
//                   type="number"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={newBook.stockQty}
//                   onChange={(e) =>
//                     setNewBook({ ...newBook, stockQty: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Discount (%)
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={newBook.discount}
//                   onChange={(e) =>
//                     setNewBook({ ...newBook, discount: e.target.value })
//                   }
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Description
//                 </label>
//                 <textarea
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={newBook.description}
//                   onChange={(e) =>
//                     setNewBook({ ...newBook, description: e.target.value })
//                   }
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Image (Optional)
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-yellow-400/20 file:text-yellow-400 hover:file:bg-yellow-400/30"
//                   onChange={(e) =>
//                     setNewBook({ ...newBook, image: e.target.files[0] })
//                   }
//                 />
//                 {newBook.image && (
//                   <img
//                     src={URL.createObjectURL(newBook.image)}
//                     alt="Preview"
//                     className="h-16 w-16 rounded-full object-cover mt-2"
//                   />
//                 )}
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   PDF (Optional)
//                 </label>
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-yellow-400/20 file:text-yellow-400 hover:file:bg-yellow-400/30"
//                   onChange={(e) => {
//                     const file = e.target.files[0];
//                     if (file && file.size > 10_000_000) {
//                       toast.error("PDF file size exceeds 10MB limit", {
//                         position: "top-right",
//                         autoClose: 3000,
//                       });
//                       return;
//                     }
//                     setNewBook({ ...newBook, pdf: file });
//                   }}
//                 />
//                 {newBook.pdf && (
//                   <span className="text-sm text-yellow-400 font-sans mt-2">
//                     PDF Selected: {newBook.pdf.name}
//                   </span>
//                 )}
//               </div>
//               <div className="mb-4">
//                 <label className=" block text-sm font-medium text-yellow-400 font-sans">
//                   Stock Status
//                 </label>
//                 <select
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={newBook.status}
//                   onChange={(e) =>
//                     setNewBook({ ...newBook, status: e.target.value })
//                   }
//                   required
//                 >
//                   <option value="Active" className="text-black">
//                     In Stock
//                   </option>
//                   <option value="Inactive" className="text-black">
//                     Out of Stock
//                   </option>
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-yellow-400 font-sans">
//                   Category
//                 </label>
//                 <select
//                   className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
//                   value={newBook.categoryId}
//                   onChange={(e) =>
//                     setNewBook({ ...newBook, categoryId: e.target.value })
//                   }
//                   required
//                 >
//                   <option value="" className="text-black">
//                     Select Category
//                   </option>
//                   {categories.map((category) => (
//                     <option
//                       className="text-black"
//                       key={category.categoryId}
//                       value={category.categoryId}
//                     >
//                       {category.categoryName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(false)}
//                   className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-sans"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-sans font-semibold hover:bg-yellow-500 transition-colors"
//                 >
//                   Add Book
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {showPdfModal && pdfUrl && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-yellow-400/50">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-white font-sans bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
//                 PDF Preview
//               </h2>
//               <button
//                 onClick={() => {
//                   setShowPdfModal(false);
//                   setPdfBookId(null);
//                   setPdfUrl(null);
//                 }}
//                 className="text-white hover:text-gray-200 transition-colors"
//               >
//                 <XCircleIcon className="h-7 w-7" />
//               </button>
//             </div>
//             <div className="w-full h-[70vh]">
//               <iframe
//                 src={pdfUrl}
//                 className="w-full h-full rounded-lg"
//                 title="PDF Preview"
//                 onError={() => {
//                   toast.error("Failed to load PDF", {
//                     position: "top-right",
//                     autoClose: 3000,
//                   });
//                   setShowPdfModal(false);
//                   setPdfBookId(null);
//                   setPdfUrl(null);
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageBooks;


















import { useState, useEffect } from "react";
import {
  PlusIcon,
  SearchIcon,
  EyeIcon,
  EditIcon,
  Trash2Icon,
  CheckCircleIcon,
  XCircleIcon,
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfBookId, setPdfBookId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    aboutAuthor: '',
    price: '',
    stockQty: '',
    description: '',
    discount: '',
    categoryId: '',
    status: 'Active',
    image: null,
    pdf: null,
    language: '',
    publisherName: '',
    publicationYear: '',
    pages: '',
  });

  // Fetch books and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const booksResponse = await axios.get(
          'http://localhost:8080/auth/getallbooks',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setBooks(booksResponse.data);

        const categoriesResponse = await axios.get(
          'http://localhost:8080/auth/getbookcategories',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setCategories(categoriesResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
        toast.error(err.message || 'Failed to fetch data', {
          position: 'top-right',
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
          const token = localStorage.getItem('token');
          if (!token) throw new Error('No authentication token found');

          const response = await axios.get(
            `http://localhost:8080/auth/getpdfbybookid/${pdfBookId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              responseType: 'blob',
            }
          );

          const url = URL.createObjectURL(
            new Blob([response.data], { type: 'application/pdf' })
          );
          setPdfUrl(url);
        } catch (err) {
          toast.error('Failed to load PDF', {
            position: 'top-right',
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

  // Handle adding a book
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const formData = new FormData();
      formData.append('title', newBook.title);
      formData.append('categoryId', newBook.categoryId);
      formData.append('author', newBook.author);
      formData.append('aboutAuthor', newBook.aboutAuthor);
      formData.append('price', newBook.price);
      formData.append('stockQty', newBook.stockQty);
      formData.append('description', newBook.description);
      formData.append('discount', newBook.discount || 0);
      formData.append('status', newBook.status);
      formData.append('language', newBook.language);
      formData.append('publisherName', newBook.publisherName);
      formData.append('publicationYear', newBook.publicationYear);
      formData.append('pages', newBook.pages);
      if (newBook.image) formData.append('image', newBook.image);
      if (newBook.pdf) {
        if (newBook.pdf.size > 10_000_000) {
          toast.error('PDF file size exceeds 10MB limit', {
            position: 'top-right',
            autoClose: 3000,
          });
          return;
        }
        formData.append('pdf', newBook.pdf);
      }

      const response = await axios.post(
        'http://localhost:8080/auth/addbook',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setBooks([...books, response.data]);
      setShowAddModal(false);
      setNewBook({
        title: '',
        author: '',
        aboutAuthor: '',
        price: '',
        stockQty: '',
        description: '',
        discount: '',
        categoryId: '',
        status: 'Active',
        image: null,
        pdf: null,
        language: '',
        publisherName: '',
        publicationYear: '',
        pages: '',
      });
      toast.success('Book added successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.response?.data || 'Failed to add book', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  // Handle updating a book
  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const formData = new FormData();
      if (selectedBook.title) formData.append('title', selectedBook.title);
      if (selectedBook.categoryId)
        formData.append('categoryId', selectedBook.categoryId);
      if (selectedBook.author) formData.append('author', selectedBook.author);
      if (selectedBook.aboutAuthor)
        formData.append('aboutAuthor', selectedBook.aboutAuthor);
      if (selectedBook.price) formData.append('price', selectedBook.price);
      if (selectedBook.stockQty)
        formData.append('stockQty', selectedBook.stockQty);
      if (selectedBook.description)
        formData.append('description', selectedBook.description);
      if (selectedBook.discount)
        formData.append('discount', selectedBook.discount);
      if (selectedBook.status) formData.append('status', selectedBook.status);
      if (selectedBook.language)
        formData.append('language', selectedBook.language);
      if (selectedBook.publisherName)
        formData.append('publisherName', selectedBook.publisherName);
      if (selectedBook.publicationYear)
        formData.append('publicationYear', selectedBook.publicationYear);
      if (selectedBook.pages) formData.append('pages', selectedBook.pages);
      if (selectedBook.image && typeof selectedBook.image !== 'string') {
        formData.append('image', selectedBook.image);
      }
      if (selectedBook.pdf && typeof selectedBook.pdf !== 'string') {
        if (selectedBook.pdf.size > 10_000_000) {
          toast.error('PDF file size exceeds 10MB limit', {
            position: 'top-right',
            autoClose: 3000,
          });
          return;
        }
        formData.append('pdf', selectedBook.pdf);
      }

      const response = await axios.put(
        `http://localhost:8080/updatebook/${selectedBook.bookId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setBooks(
        books.map((book) =>
          book.bookId === selectedBook.bookId ? response.data : book
        )
      );
      setShowUpdateModal(false);
      setSelectedBook(null);
      toast.success('Book updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.response?.data || 'Failed to update book', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  // Handle deleting a book
  const handleDeleteBook = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      await axios.delete(
        `http://localhost:8080/deletebook/${selectedBook.bookId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setBooks(books.filter((book) => book.bookId !== selectedBook.bookId));
      setShowDeleteModal(false);
      setSelectedBook(null);
      toast.success('Book deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.response?.data || 'Failed to delete book', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  // Filter books
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' ||
      book.status === (statusFilter === 'In Stock' ? 'Active' : 'Inactive');
    return matchesSearch && matchesStatus;
  });

  // Stats for dashboard
  const stats = [
    {
      id: 'Total',
      name: 'Total Books',
      count: books.length,
      change: '+0%',
      icon: <PlusIcon className='h-6 w-6 text-white' />,
      bgFrom: 'from-yellow-500',
      bgTo: 'to-amber-600',
    },
    {
      id: 'InStock',
      name: 'In Stock',
      count: books.filter((b) => b.status === 'Active').length,
      change: '+0%',
      icon: <CheckCircleIcon className='h-6 w-6 text-white' />,
      bgFrom: 'from-green-400',
      bgTo: 'to-emerald-600',
    },
    {
      id: 'OutStock',
      name: 'Out of Stock',
      count: books.filter((b) => b.status === 'Inactive').length,
      change: '0%',
      icon: <XCircleIcon className='h-6 w-6 text-white' />,
      bgFrom: 'from-red-500',
      bgTo: 'to-rose-600',
    },
    {
      id: 'Pending',
      name: 'Pending Review',
      count: 0,
      change: '0%',
      icon: <EyeIcon className='h-6 w-6 text-white' />,
      bgFrom: 'from-indigo-500',
      bgTo: 'to-violet-600',
    },
  ];

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen text-gray-600 font-sans'>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen text-red-600 font-sans'>
        {error}
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white flex flex-col relative overflow-hidden'>
      <ToastContainer />
      <svg
        className='absolute top-0 left-0 w-full h-[200px] z-[1] opacity-20'
        viewBox='0 0 1440 320'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fill='#FBBF24'
          d='M0,128L60,138.7C120,149,240,171,360,170.7C480,171,600,149,720,133.3C840,117,960,107,1080,117.3C1200,128,1320,160,1380,176L1440,192L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z'
        />
      </svg>

      <header className='bg-black/70 backdrop-blur-xl border-b border-yellow-400/30 p-4 flex justify-between items-center z-[2]'>
        <div>
          <h1 className='text-2xl font-bold text-white font-sans bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600'>
            Manage Book Products
          </h1>
          <p className='text-yellow-400/70 font-sans'>
            Oversee and Administer Book Products
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className='bg-yellow-400 text-black px-4 py-2 rounded-lg flex items-center gap-2 font-sans font-semibold hover:bg-yellow-500 transition-colors'
        >
          <PlusIcon className='h-5 w-5' />
          Add Book
        </button>
      </header>

      <main className='flex-1 p-6 z-[2]'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
          {stats.map((stat) => (
            <div
              key={stat.id}
              className={`bg-gradient-to-br ${stat.bgFrom} ${stat.bgTo} p-5 rounded-xl text-white shadow-lg border border-yellow-400/50`}
            >
              <div className='flex justify-between items-center'>
                <div className='flex flex-col'>
                  <p className='text-sm font-medium text-white font-sans'>
                    {stat.name}
                  </p>
                  <h3 className='text-2xl font-bold mt-1 font-sans'>
                    {stat.count}
                  </h3>
                </div>
                <div className='p-2 bg-white/20 rounded-lg'>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className='bg-black/70 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/50 mb-6'>
          <div className='relative w-full md:w-64'>
            <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 h-5 w-5' />
            <input
              type='text'
              placeholder='Search books by title or author...'
              className='pl-10 pr-4 py-2 bg-white/10 border border-yellow-400/50 rounded-lg w-full text-white placeholder-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className='bg-black/70 backdrop-blur-xl rounded-xl border border-yellow-400/50 shadow-lg'>
          <div className='p-4 border-b border-yellow-400/30 flex justify-between items-center'>
            <h2 className='text-xl font-semibold text-white font-sans'>
              Book Products
            </h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='bg-white/10 border border-yellow-400/50 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
            >
              <option value='All'>All</option>
              <option value='In Stock'>In Stock</option>
              <option value='Out of Stock'>Out of Stock</option>
            </select>
          </div>
          <div className='overflow-x-auto'>
            {filteredBooks.length === 0 ? (
              <div className='p-8 text-center text-white font-sans'>
                No books found.
              </div>
            ) : (
              <table className='min-w-full divide-y divide-yellow-400/30'>
                <thead className='bg-black/50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans'>
                      S.No
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans'>
                      Title
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans'>
                      Author
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans'>
                      Price
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans'>
                      Image
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans'>
                      Stock
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans'>
                      Category
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider font-sans'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-yellow-400/30'>
                  {filteredBooks.map((book, index) => (
                    <tr key={book.bookId} className='hover:bg-yellow-400/10'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-white font-sans'>
                        {index + 1}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-white font-sans'>
                        {book.title}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-white font-sans'>
                        {book.author}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-white font-sans'>
                        Rs.{book.price}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {book.image ? (
                          <img
                            src={book.image}
                            alt={book.title}
                            className='h-10 w-10 rounded-full object-cover'
                          />
                        ) : (
                          <span className='text-sm text-yellow-400/70 font-sans'>
                            No Image
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm'>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            book.status === 'Active'
                              ? 'bg-green-400/20 text-green-400'
                              : 'bg-red-400/20 text-red-400'
                          }`}
                        >
                          {book.status === 'Active' ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-white font-sans'>
                        {categories.find((cat) => cat.categoryId === book.categoryId)
                          ?.categoryName || 'Unknown Category'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right'>
                        <div className='flex gap-2 justify-end'>
                          <button
                            onClick={() => {
                              setSelectedBook(book);
                              setShowViewModal(true);
                            }}
                            className='bg-gradient-to-br from-green-400 to-emerald-600 text-white px-2 py-1 rounded-lg hover:opacity-90 transition-opacity'
                          >
                            <EyeIcon className='h-5 w-5' />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBook(book);
                              setShowUpdateModal(true);
                            }}
                            className='bg-gradient-to-br from-cyan-500 to-sky-600 text-white px-2 py-1 rounded-lg hover:opacity-90 transition-opacity'
                          >
                            <EditIcon className='h-5 w-5' />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBook(book);
                              setShowDeleteModal(true);
                            }}
                            className='bg-gradient-to-br from-amber-500 to-orange-600 text-white px-2 py-1 rounded-lg hover:opacity-90 transition-opacity'
                          >
                            <Trash2Icon className='h-5 w-5' />
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
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-black/70 backdrop-blur-xl rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-yellow-400/50'>
            <div className='relative bg-gradient-to-r from-yellow-400 to-yellow-600 p-8 text-white'>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedBook(null);
                }}
                className='absolute top-4 right-4 text-white hover:text-gray-200 transition-colors'
              >
                <XCircleIcon className='h-7 w-7' />
              </button>
              <div className='flex items-center space-x-6'>
                <div className='flex-shrink-0'>
                  {selectedBook.image ? (
                    <img
                      src={selectedBook.image}
                      alt={selectedBook.title}
                      className='h-28 w-28 rounded-full object-cover border-4 border-white shadow-lg'
                    />
                  ) : (
                    <div className='h-28 w-28 rounded-full bg-yellow-400/20 flex items-center justify-center text-white font-bold text-3xl shadow-lg'>
                      {selectedBook.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className='text-4xl font-semibold text-white font-sans'>
                    {selectedBook.title}
                  </h2>
                  <p className='text-xl font-medium mt-1 text-white/80 font-sans'>
                    {selectedBook.author}
                  </p>
                  <p className='text-sm font-medium mt-2 bg-black/50 inline-block px-3 py-1 rounded-full'>
                    Rs.{selectedBook.price} -{' '}
                    {selectedBook.status === 'Active' ? 'In Stock' : 'Out of Stock'}
                  </p>
                  {selectedBook.pdf && (
                    <button
                      onClick={() => {
                        setPdfBookId(selectedBook.bookId);
                        setShowPdfModal(true);
                      }}
                      className='mt-2 inline-block bg-gradient-to-br from-blue-400 to-blue-600 text-white px-3 py-1 rounded-lg hover:opacity-90 transition-opacity font-sans'
                    >
                      View PDF
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className='p-8'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='space-y-6 bg-black/50 p-6 rounded-lg border border-yellow-400/50'>
                  <h3 className='text-2xl font-semibold text-yellow-400 font-sans border-b border-yellow-400/30 pb-3'>
                    Book Details
                  </h3>
                  <div className='space-y-4'>
                    <div className='flex items-center'>
                      <span className='text-sm font-medium text-yellow-400 w-28 font-sans'>
                        Title:
                      </span>
                      <p className='text-md font-semibold text-white font-sans'>
                        {selectedBook.title}
                      </p>
                    </div>
                    <div className='flex items-center'>
                      <span className='text-sm font-medium text-yellow-400 w-28 font-sans'>
                        Author:
                      </span>
                      <p className='text-md font-semibold text-white font-sans'>
                        {selectedBook.author}
                      </p>
                    </div>
                    <div className='flex items-center'>
                      <span className='text-sm font-medium text-yellow-400 w-28 font-sans'>
                        About Author:
                      </span>
                      <p className='text-md font-semibold text-white font-sans'>
                        {selectedBook.aboutAuthor || 'N/A'}
                      </p>
                    </div>
                    <div className='flex items-center'>
                      <span className='text-sm font-medium text-yellow-400 w-28 font-sans'>
                        Language:
                      </span>
                      <p className='text-md font-semibold text-white font-sans'>
                        {selectedBook.language || 'N/A'}
                      </p>
                    </div>
                    <div className='flex items-center'>
                      <span className='text-sm font-medium text-yellow-400 w-28 font-sans'>
                        Publisher:
                      </span>
                      <p className='text-md font-semibold text-white font-sans'>
                        {selectedBook.publisherName || 'N/A'}
                      </p>
                    </div>
                    <div className='flex items-center'>
                      <span className='text-sm font-medium text-yellow-400 w-28 font-sans'>
                        Publication Year:
                      </span>
                      <p className='text-md font-semibold text-white font-sans'>
                        {selectedBook.publicationYear || 'N/A'}
                      </p>
                    </div>
                    <div className='flex items-center'>
                      <span className='text-sm font-medium text-yellow-400 w-28 font-sans'>
                        Pages:
                      </span>
                      <p className='text-md font-semibold text-white font-sans'>
                        {selectedBook.pages || 'N/A'}
                      </p>
                    </div>
                    <div className='flex items-center'>
                      <span className='text-sm font-medium text-yellow-400 w-28 font-sans'>
                        Price:
                      </span>
                      <p className='text-md font-semibold text-white font-sans'>
                        Rs.{selectedBook.price}
                      </p>
                    </div>
                    <div className='flex items-center'>
                      <span className='text-sm font-medium text-yellow-400 w-28 font-sans'>
                        Discount:
                      </span>
                      <p className='text-md font-semibold text-white font-sans'>
                        {selectedBook.discount
                          ? `${selectedBook.discount}%`
                          : 'None'}
                      </p>
                    </div>
                    <div className='flex items-center'>
                      <span className='text-sm font-medium text-yellow-400 w-28 font-sans'>
                        Stock Quantity:
                      </span>
                      <p className='text-md font-semibold text-white font-sans'>
                        {selectedBook.stockQty}
                      </p>
                    </div>
                    <div className='flex items-center'>
                      <span className='text-sm font-medium text-yellow-400 w-28 font-sans'>
                        Category:
                      </span>
                      <p className='text-md font-semibold text-white font-sans'>
                        {categories.find(
                          (cat) => cat.categoryId === selectedBook.categoryId
                        )?.categoryName || 'Unknown Category'}
                      </p>
                    </div>
                    <div className='flex items-center'>
                      <span className='text-sm font-medium text-yellow-400 w-28 font-sans'>
                        Description:
                      </span>
                      <p className='text-md font-semibold text-white font-sans'>
                        {selectedBook.description || 'N/A'}
                      </p>
                    </div>
                    <div className='flex items-center'>
                      <span className='text-sm font-medium text-yellow-400 w-28 font-sans'>
                        PDF:
                      </span>
                      {selectedBook.pdf ? (
                        <button
                          onClick={() => {
                            setPdfBookId(selectedBook.bookId);
                            setShowPdfModal(true);
                          }}
                          className='text-md font-semibold text-blue-400 hover:underline font-sans'
                        >
                          View PDF
                        </button>
                      ) : (
                        <p className='text-md font-semibold text-white font-sans'>
                          No PDF Available
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className='space-y-6 bg-black/50 p-6 rounded-lg border border-yellow-400/50'>
                  <h3 className='text-2xl font-semibold text-yellow-400 font-sans border-b border-yellow-400/30 pb-3'>
                    Book Image
                  </h3>
                  <div>
                    {selectedBook.image ? (
                      <img
                        src={selectedBook.image}
                        alt={selectedBook.title}
                        className='mt-2 h-48 w-full object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200'
                      />
                    ) : (
                      <p className='text-white/70 mt-2 italic font-sans'>
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

      {selectedBook && showUpdateModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-yellow-400/50'>
            <h2 className='text-xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4'>
              Update Book
            </h2>
            <form onSubmit={handleUpdateBook}>
              <div className='grid grid-cols-4 gap-4 mb-4'>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Title
                  </label>
                  <input
                    type='text'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={selectedBook.title}
                    onChange={(e) =>
                      setSelectedBook({ ...selectedBook, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Author
                  </label>
                  <input
                    type='text'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={selectedBook.author}
                    onChange={(e) =>
                      setSelectedBook({ ...selectedBook, author: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Language
                  </label>
                  <input
                    type='text'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={selectedBook.language || ''}
                    onChange={(e) =>
                      setSelectedBook({
                        ...selectedBook,
                        language: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Publisher Name
                  </label>
                  <input
                    type='text'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={selectedBook.publisherName || ''}
                    onChange={(e) =>
                      setSelectedBook({
                        ...selectedBook,
                        publisherName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className='grid grid-cols-4 gap-4 mb-4'>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Publication Year
                  </label>
                  <input
                    type='number'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={selectedBook.publicationYear || ''}
                    onChange={(e) =>
                      setSelectedBook({
                        ...selectedBook,
                        publicationYear: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Pages
                  </label>
                  <input
                    type='number'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={selectedBook.pages || ''}
                    onChange={(e) =>
                      setSelectedBook({
                        ...selectedBook,
                        pages: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Price
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={selectedBook.price}
                    onChange={(e) =>
                      setSelectedBook({ ...selectedBook, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Stock Quantity
                  </label>
                  <input
                    type='number'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={selectedBook.stockQty}
                    onChange={(e) =>
                      setSelectedBook({
                        ...selectedBook,
                        stockQty: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className='grid grid-cols-3 gap-4 mb-4'>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Discount (%)
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={selectedBook.discount}
                    onChange={(e) =>
                      setSelectedBook({
                        ...selectedBook,
                        discount: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Stock Status
                  </label>
                  <select
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={selectedBook.status}
                    onChange={(e) =>
                      setSelectedBook({ ...selectedBook, status: e.target.value })
                    }
                    required
                  >
                    <option value='Active' className='text-black'>In Stock</option>
                    <option value='Inactive' className='text-black'>Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Category
                  </label>
                  <select
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={selectedBook.categoryId}
                    onChange={(e) =>
                      setSelectedBook({
                        ...selectedBook,
                        categoryId: e.target.value,
                      })
                    }
                    required
                  >
                    <option value='' className='text-black'>Select Category</option>
                    {categories.map((category) => (
                      <option
                        key={category.categoryId}
                        value={category.categoryId}
                        className='text-black'
                      >
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    About Author
                  </label>
                  <textarea
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    rows='4'
                    value={selectedBook.aboutAuthor}
                    onChange={(e) =>
                      setSelectedBook({
                        ...selectedBook,
                        aboutAuthor: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Description
                  </label>
                  <textarea
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    rows='4'
                    value={selectedBook.description}
                    onChange={(e) =>
                      setSelectedBook({
                        ...selectedBook,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Image (Optional)
                  </label>
                  <input
                    type='file'
                    accept='image/*'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-yellow-400/20 file:text-yellow-400 hover:file:bg-yellow-400/30'
                    onChange={(e) =>
                      setSelectedBook({
                        ...selectedBook,
                        image: e.target.files[0] || selectedBook.image,
                      })
                    }
                  />
                  {selectedBook.image && typeof selectedBook.image !== 'string' ? (
                    <img
                      src={URL.createObjectURL(selectedBook.image)}
                      alt={selectedBook.title}
                      className='h-16 w-16 rounded-full object-cover mt-2'
                    />
                  ) : selectedBook.image ? (
                    <img
                      src={selectedBook.image}
                      alt={selectedBook.title}
                      className='h-16 w-16 rounded-full object-cover mt-2'
                    />
                  ) : (
                    <span className='text-sm text-yellow-400/70 font-sans mt-2'>
                      No Image
                    </span>
                  )}
                </div>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    PDF (Optional)
                  </label>
                  <input
                    type='file'
                    accept='application/pdf'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-yellow-400/20 file:text-yellow-400 hover:file:bg-yellow-400/30'
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size > 10_000_000) {
                        toast.error('PDF file size exceeds 10MB limit', {
                          position: 'top-right',
                          autoClose: 3000,
                        });
                        return;
                      }
                      setSelectedBook({
                        ...selectedBook,
                        pdf: file || selectedBook.pdf,
                      })
                    }}
                  />
                  {selectedBook.pdf && typeof selectedBook.pdf !== 'string' ? (
                    <span className='text-sm text-yellow-400 font-sans mt-2'>
                      PDF Selected: {selectedBook.pdf.name}
                    </span>
                  ) : selectedBook.pdf ? (
                    <button
                      onClick={() => {
                        setPdfBookId(selectedBook.bookId);
                        setShowPdfModal(true);
                      }}
                      className='text-sm text-blue-400 hover:underline font-sans mt-2'
                    >
                      View Current PDF
                    </button>
                  ) : (
                    <span className='text-sm text-yellow-400/70 font-sans mt-2'>
                      No PDF
                    </span>
                  )}
                </div>
              </div>
              <div className='flex justify-end gap-2'>
                <button
                  type='button'
                  onClick={() => setShowUpdateModal(false)}
                  className='px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-sans'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='bg-yellow-400 text-black px-4 py-2 rounded-lg font-sans font-semibold hover:bg-yellow-500 transition-colors'
                >
                  Update Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedBook && showDeleteModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-sm border border-yellow-400/50'>
            <h2 className='text-xl font-bold text-white font-sans bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4'>
              Delete Book
            </h2>
            <p className='text-sm text-white font-sans mb-6'>
              Are you sure you want to delete{' '}
              <span className='font-semibold'>{selectedBook.title}</span>? This
              action cannot be undone.
            </p>
            <div className='flex justify-end gap-2'>
              <button
                type='button'
                onClick={() => setShowDeleteModal(false)}
                className='px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-sans'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleDeleteBook}
                className='bg-gradient-to-br from-amber-500

 to-orange-600 text-white px-4 py-2 rounded-lg font-sans font-semibold hover:opacity-90 transition-opacity'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-yellow-400/50'>
            <h2 className='text-xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4'>
              Add New Book
            </h2>
            <form onSubmit={handleAddBook}>
              <div className='grid grid-cols-4 gap-4 mb-4'>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Title
                  </label>
                  <input
                    type='text'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={newBook.title}
                    onChange={(e) =>
                      setNewBook({ ...newBook, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Author
                  </label>
                  <input
                    type='text'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={newBook.author}
                    onChange={(e) =>
                      setNewBook({ ...newBook, author: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Language
                  </label>
                  <input
                    type='text'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={newBook.language}
                    onChange={(e) =>
                      setNewBook({ ...newBook, language: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Publisher Name
                  </label>
                  <input
                    type='text'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={newBook.publisherName}
                    onChange={(e) =>
                      setNewBook({ ...newBook, publisherName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className='grid grid-cols-4 gap-4 mb-4'>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Publication Year
                  </label>
                  <input
                    type='number'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={newBook.publicationYear}
                    onChange={(e) =>
                      setNewBook({ ...newBook, publicationYear: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Pages
                  </label>
                  <input
                    type='number'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={newBook.pages}
                    onChange={(e) =>
                      setNewBook({ ...newBook, pages: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Price
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={newBook.price}
                    onChange={(e) =>
                      setNewBook({ ...newBook, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Stock Quantity
                  </label>
                  <input
                    type='number'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={newBook.stockQty}
                    onChange={(e) =>
                      setNewBook({ ...newBook, stockQty: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className='grid grid-cols-3 gap-4 mb-4'>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Discount (%)
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={newBook.discount}
                    onChange={(e) =>
                      setNewBook({ ...newBook, discount: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Stock Status
                  </label>
                  <select
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={newBook.status}
                    onChange={(e) =>
                      setNewBook({ ...newBook, status: e.target.value })
                    }
                    required
                  >
                    <option value='Active' className='text-black'>In Stock</option>
                    <option value='Inactive' className='text-black'>Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Category
                  </label>
                  <select
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    value={newBook.categoryId}
                    onChange={(e) =>
                      setNewBook({ ...newBook, categoryId: e.target.value })
                    }
                    required
                  >
                    <option value='' className='text-black'>Select Category</option>
                    {categories.map((category) => (
                      <option
                        key={category.categoryId}
                        value={category.categoryId}
                        className='text-black'
                      >
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    About Author
                  </label>
                  <textarea
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    rows='4'
                    value={newBook.aboutAuthor}
                    onChange={(e) =>
                      setNewBook({ ...newBook, aboutAuthor: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Description
                  </label>
                  <textarea
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans'
                    rows='4'
                    value={newBook.description}
                    onChange={(e) =>
                      setNewBook({ ...newBook, description: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    Image (Optional)
                  </label>
                  <input
                    type='file'
                    accept='image/*'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-yellow-400/20 file:text-yellow-400 hover:file:bg-yellow-400/30'
                    onChange={(e) =>
                      setNewBook({ ...newBook, image: e.target.files[0] })
                    }
                  />
                  {newBook.image && (
                    <img
                      src={URL.createObjectURL(newBook.image)}
                      alt='Preview'
                      className='h-16 w-16 rounded-full object-cover mt-2'
                    />
                  )}
                </div>
                <div>
                  <label className='block text-sm font-medium text-yellow-400 font-sans'>
                    PDF (Optional)
                  </label>
                  <input
                    type='file'
                    accept='application/pdf'
                    className='mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-yellow-400/20 file:text-yellow-400 hover:file:bg-yellow-400/30'
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size > 10_000_000) {
                        toast.error('PDF file size exceeds 10MB limit', {
                          position: 'top-right',
                          autoClose: 3000,
                        });
                        return;
                      }
                      setNewBook({ ...newBook, pdf: file });
                    }}
                  />
                  {newBook.pdf && (
                    <span className='text-sm text-yellow-400 font-sans mt-2'>
                      PDF Selected: {newBook.pdf.name}
                    </span>
                  )}
                </div>
              </div>
              <div className='flex justify-end gap-2'>
                <button
                  type='button'
                  onClick={() => setShowAddModal(false)}
                  className='px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-sans'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='bg-yellow-400 text-black px-4 py-2 rounded-lg font-sans font-semibold hover:bg-yellow-500 transition-colors'
                >
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPdfModal && pdfUrl && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-yellow-400/50'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600'>
                PDF Preview
              </h2>
              <button
                onClick={() => {
                  setShowPdfModal(false);
                  setPdfBookId(null);
                  setPdfUrl(null);
                }}
                className='text-white hover:text-gray-200 transition-colors'
              >
                <XCircleIcon className='h-7 w-7' />
              </button>
            </div>
            <div className='w-full h-[70vh]'>
              <iframe
                src={pdfUrl}
                className='w-full h-full rounded-lg'
                title='PDF Preview'
                onError={() => {
                  toast.error('Failed to load PDF', {
                    position: 'top-right',
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

export default ManageBooks;