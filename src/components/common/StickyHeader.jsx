import Header from "./Header";
const StickyHeader = () => {
  return (
    <div className="w-full z-50 sticky top-0 shadow-md bg-yellow-500 transition-all duration-300">
      <Header showOnlyNav={true} />
    </div>
  );
};

export default StickyHeader;