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

const offers = [
  { offerId: "OFFER001", title: "Summer Reading Sale", description: "Get 20% off all Fiction books!", discountPercentage: 20, startDate: new Date("2025-06-01"), endDate: new Date("2025-07-15"), status: "Active", categoryId: 1, imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4ebf0c?w=400&q=80" },
  { offerId: "OFFER002", title: "Back to School", description: "15% off Stationery items for students.", discountPercentage: 15, startDate: new Date("2025-06-15"), endDate: new Date("2025-08-01"), status: "Active", categoryId: 3, imageUrl: "https://images.unsplash.com/photo-1598371695188-8e8e2b8d2a0b?w=400&q=80" },
  { offerId: "OFFER003", title: "Knowledge Boost", description: "25% off Non-Fiction books.", discountPercentage: 25, startDate: new Date("2025-05-01"), endDate: new Date("2025-06-30"), status: "Active", categoryId: 2, imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4ebf0c?w=400&q=80" },
  { offerId: "OFFER004", title: "Notebook Deals", description: "10% off all Notebooks.", discountPercentage: 10, startDate: new Date("2025-07-01"), endDate: new Date("2025-07-31"), status: "Active", categoryId: 4, imageUrl: "https://images.unsplash.com/photo-1598371695188-8e8e2b8d2a0b?w=400&q=80" },
];

const Offers = () => {
  const navigate = useNavigate();
  const currentDate = new Date("2025-06-30T20:27:00+05:30");

  const calculateOriginalPrice = (categoryId) => {
    const categoryProducts = products.filter((p) => p.categoryId === categoryId && p.status === "Available");
    return categoryProducts.length > 0 ? Math.max(...categoryProducts.map((p) => p.price)) : 0;
  };

  const calculateNewPrice = (originalPrice, discountPercentage) => {
    return originalPrice * (1 - discountPercentage / 100);
  };

  const activeOffers = offers.filter((offer) => {
    const start = new Date(offer.startDate.setHours(0, 0, 0, 0));
    const end = new Date(offer.endDate.setHours(23, 59, 59, 999));
    const current = new Date(currentDate.setHours(0, 0, 0, 0));
    return offer.status === "Active" && current >= start && current <= end;
  });

  const handleViewProducts = (categoryId) => {
    navigate(`/products?categoryId=${categoryId}`);
  };

  const handleAddToCart = (categoryId) => {
    const product = products.find((p) => p.categoryId === categoryId && p.status === "Available");
    if (product) {
      navigate(`/product/${product.id}`, { state: { product } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-yellow-300 to-orange-400 bg-[url('/assets/images/pattern.png')] bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-sans bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
            Exclusive Offers
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-800 font-sans max-w-2xl mx-auto">
            Grab these limited-time deals on your favorite books and stationery!
          </p>
        </div>
        {activeOffers.length === 0 ? (
          <div className="text-center text-gray-800 font-sans text-lg">
            No active offers available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOffers.map((offer) => {
              const originalPrice = calculateOriginalPrice(offer.categoryId);
              const newPrice = calculateNewPrice(originalPrice, offer.discountPercentage);
              return (
                <div
                  key={offer.offerId}
                  className="relative bg-white/90 rounded-3xl overflow-hidden backdrop-blur-md transform transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={offer.imageUrl}
                      alt={offer.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-orange-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                      {offer.discountPercentage}% OFF
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 truncate font-sans">
                      {offer.title}
                    </h3>
                    <p className="text-sm text-gray-600 font-sans mt-1">
                      {offer.description}
                    </p>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-sans">Category:</span>
                        <span className="font-medium text-gray-800 font-sans">
                          {categories.find((cat) => cat.categoryID === offer.categoryId)?.categoryName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-sans">Valid Until:</span>
                        <span className="font-medium text-gray-800 font-sans">
                          {offer.endDate.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-sans">Price:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 line-through font-sans">
                            Rs. {Number(originalPrice).toFixed(2)}
                          </span>
                          <span className="font-bold text-red-500 font-sans">
                            Rs. {Number(newPrice).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={() => handleViewProducts(offer.categoryId)}
                        className="flex-1 bg-orange-500 text-white font-sans py-3 px-4 rounded-full font-semibold text-md hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <Eye className="w-5 h-5" /> View Products
                      </button>
                      <button
                        onClick={() => handleAddToCart(offer.categoryId)}
                        className="flex-1 bg-red-500 text-white font-sans py-3 px-4 rounded-full font-semibold text-md hover:bg-red-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;