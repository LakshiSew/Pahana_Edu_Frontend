import { useNavigate } from "react-router-dom";
import { Eye, ShoppingCart } from "lucide-react";

const categories = [
  { categoryID: 0, categoryName: "All Categories", categoryImg: "", description: "All products", status: "Active" },
  { categoryID: 1, categoryName: "Fiction", categoryImg: "/assets/images/fiction.jpg", description: "Novels and stories", status: "Active" },
  { categoryID: 2, categoryName: "Non-Fiction", categoryImg: "/assets/images/nonfiction.jpg", description: "Biographies and educational", status: "Active" },
  { categoryID: 3, categoryName: "Stationery", categoryImg: "/assets/images/stationery.jpg", description: "Pens and pencils", status: "Active" },
  { categoryID: 4, categoryName: "Notebooks", categoryImg: "/assets/images/notebooks.jpg", description: "Journals and notepads", status: "Active" },
];

const products = [
  { id: 1, categoryId: 1, bookTitle: "The Great Gatsby", author: "F. Scott Fitzgerald", images: "https://images.unsplash.com/photo-1544716278-ca5e3f4ebf0c?w=400&q=80", price: 1500, description: "A classic novel about the American Dream.", publisher: "Scribner", language: "English", publicationYear: 1925, stockQty: 50, pages: 180, discount: 10, previewPdf: "/assets/pdfs/gatsby.pdf", status: "Available", type: "Book" },
  { id: 2, categoryId: 1, bookTitle: "Pride and Prejudice", author: "Jane Austen", images: "https://images.unsplash.com/photo-1544716278-ca5e3f4ebf0c?w=400&q=80", price: 1200, description: "A romantic novel of manners.", publisher: "Penguin", language: "English", publicationYear: 1813, stockQty: 40, pages: 432, discount: 5, previewPdf: "/assets/pdfs/pride.pdf", status: "Available", type: "Book" },
  { id: 3, categoryId: 1, bookTitle: "1984", author: "George Orwell", images: "https://images.unsplash.com/photo-1544716278-ca5e3f4ebf0c?w=400&q=80", price: 1800, description: "A dystopian novel.", publisher: "Secker & Warburg", language: "English", publicationYear: 1949, stockQty: 30, pages: 328, discount: 15, previewPdf: "/assets/pdfs/1984.pdf", status: "Available", type: "Book" },
  { id: 4, categoryId: 1, bookTitle: "To Kill a Mockingbird", author: "Harper Lee", images: "https://images.unsplash.com/photo-1544716278-ca5e3f4ebf0c?w=400&q=80", price: 1600, description: "A story of justice and morality.", publisher: "J.B. Lippincott", language: "English", publicationYear: 1960, stockQty: 45, pages: 281, discount: 0, previewPdf: "/assets/pdfs/mockingbird.pdf", status: "Available", type: "Book" },
  { id: 5, categoryId: 1, bookTitle: "The Catcher in the Rye", author: "J.D. Salinger", images: "https://images.unsplash.com/photo-1544716278-ca5e3f4ebf0c?w=400&q=80", price: 1400, description: "A tale of teenage angst.", publisher: "Little, Brown", language: "English", publicationYear: 1951, stockQty: 35, pages: 277, discount: 10, previewPdf: "/assets/pdfs/catcher.pdf", status: "Available", type: "Book" },
  { id: 6, categoryId: 2, bookTitle: "Sapiens", author: "Yuval Noah Harari", images: "https://images.unsplash.com/photo-1544716278-ca5e3f4ebf0c?w=400&q=80", price: 2200, description: "A history of humankind.", publisher: "Harper", language: "English", publicationYear: 2011, stockQty: 25, pages: 443, discount: 20, previewPdf: "/assets/pdfs/sapiens.pdf", status: "Available", type: "Book" },
  { id: 7, categoryId: 2, bookTitle: "Educated", author: "Tara Westover", images: "https://images.unsplash.com/photo-1544716278-ca5e3f4ebf0c?w=400&q=80", price: 2000, description: "A memoir of self-education.", publisher: "Random House", language: "English", publicationYear: 2018, stockQty: 30, pages: 352, discount: 5, previewPdf: "/assets/pdfs/educated.pdf", status: "Available", type: "Book" },
  { id: 8, categoryId: 2, bookTitle: "Becoming", author: "Michelle Obama", images: "https://images.unsplash.com/photo-1544716278-ca5e3f4ebf0c?w=400&q=80", price: 2500, description: "A personal memoir.", publisher: "Crown", language: "English", publicationYear: 2018, stockQty: 20, pages: 426, discount: 10, previewPdf: "/assets/pdfs/becoming.pdf", status: "Available", type: "Book" },
  { id: 9, categoryId: 2, bookTitle: "The Immortal Life", author: "Rebecca Skloot", images: "https://images.unsplash.com/photo-1544716278-ca5e3f4ebf0c?w=400&q=80", price: 1900, description: "A story of science and ethics.", publisher: "Crown", language: "English", publicationYear: 2010, stockQty: 28, pages: 369, discount: 15, previewPdf: "/assets/pdfs/immortal.pdf", status: "Available", type: "Book" },
  { id: 10, categoryId: 2, bookTitle: "Thinking, Fast and Slow", author: "Daniel Kahneman", images: "https://images.unsplash.com/photo-1544716278-ca5e3f4ebf0c?w=400&q=80", price: 2100, description: "A study of decision-making.", publisher: "Farrar", language: "English", publicationYear: 2011, stockQty: 22, pages: 499, discount: 0, previewPdf: "/assets/pdfs/thinking.pdf", status: "Available", type: "Book" },
  { id: 11, categoryId: 3, itemName: "Gel Pen Set", brand: "Pilot", price: 500, stockQty: 100, image: "https://images.unsplash.com/photo-1598371695188-8e8e2b8d2a0b?w=400&q=80", description: "Set of 5 colorful gel pens.", status: "Available", type: "Accessory" },
  { id: 12, categoryId: 3, itemName: "Highlighter Pack", brand: "Stabilo", price: 600, stockQty: 80, image: "https://images.unsplash.com/photo-1598371695188-8e8e2b8d2a0b?w=400&q=80", description: "Set of 4 neon highlighters.", status: "Available", type: "Accessory" },
  { id: 13, categoryId: 3, itemName: "Mechanical Pencil", brand: "Pentel", price: 300, stockQty: 120, image: "https://images.unsplash.com/photo-1598371695188-8e8e2b8d2a0b?w=400&q=80", description: "0.7mm lead pencil.", status: "Available", type: "Accessory" },
  { id: 14, categoryId: 4, itemName: "A5 Notebook", brand: "Moleskine", price: 800, stockQty: 60, image: "https://images.unsplash.com/photo-1598371695188-8e8e2b8d2a0b?w=400&q=80", description: "Hardcover lined notebook.", status: "Available", type: "Accessory" },
  { id: 15, categoryId: 4, itemName: "Journal Planner", brand: "Paperblanks", price: 1000, stockQty: 50, image: "https://images.unsplash.com/photo-1598371695188-8e8e2b8d2a0b?w=400&q=80", description: "Weekly planner with bookmark.", status: "Available", type: "Accessory" },
];

const NewArrivals = () => {
  const navigate = useNavigate();

  // Select first 6 available products as new arrivals (placeholder logic)
  const newArrivals = products.filter((product) => product.status === "Available").slice(0, 6);

  const handleSeeMore = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-b from-blue-50 to-white [clip-path:polygon(0_0,100%_0,100%_85%,0_100%)]"></div>
      </div>

      <div className="relative z-10 bg-transparent text-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              New Arrivals
            </h2>
            <p className="mt-4 text-lg md:text-xl text-gray-600 font-sans max-w-2xl mx-auto">
              Check out the latest additions to our collection of books and stationery!
            </p>
          </div>

          {newArrivals.length === 0 ? (
            <div className="text-center text-gray-600 font-sans text-lg">
              No new arrivals available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newArrivals.map((product) => (
                <div
                  key={product.id}
                  className="relative bg-white rounded-xl overflow-hidden shadow-lg transform transition-all hover:-translate-y-2 hover:shadow-2xl duration-300"
                >
                  <div className="relative">
                    <img
                      src={product.type === "Book" ? product.images : product.image}
                      alt={product.type === "Book" ? product.bookTitle : product.itemName}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-yellow-400 text-black text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                      Rs. {Number(product.price || 0).toFixed(2)}
                      {product.discount > 0 && (
                        <span className="ml-1 text-xs">({product.discount}% off)</span>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-black truncate font-sans">
                      {product.type === "Book" ? product.bookTitle : product.itemName}
                    </h3>
                    <p className="text-sm text-gray-600 font-sans mt-1">
                      {product.type === "Book" ? `by ${product.author}` : `Brand: ${product.brand}`}
                    </p>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-sans">Category:</span>
                        <span className="font-medium text-black font-sans">
                          {categories.find((cat) => cat.categoryID === product.categoryId)?.categoryName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-sans">Stock:</span>
                        <span className="font-medium text-green-600 font-sans">
                          {product.stockQty > 0 ? `${product.stockQty} Available` : "Out of Stock"}
                        </span>
                      </div>
                      {product.type === "Book" && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-sans">Pages:</span>
                          <span className="font-medium text-black font-sans">{product.pages}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={() => handleSeeMore(product)}
                        className="flex-1 bg-yellow-400 text-black font-sans py-3 px-4 rounded-full font-semibold text-md hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <Eye className="w-5 h-5" /> See More
                      </button>
                      <button
                        onClick={() => handleSeeMore(product)} // Placeholder for cart functionality
                        className="flex-1 bg-blue-600 text-white font-sans py-3 px-4 rounded-full font-semibold text-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" /> Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;