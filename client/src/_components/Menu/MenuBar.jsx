import { useState, useEffect, useRef } from "react";
import useMenuStore from "../../store/use-menu";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const MenuBar = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    setSearch,
    search
  } = useMenuStore();

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const categoriesRef = useRef(null);

  useEffect(() => {
    const checkScrollable = () => {
      if (categoriesRef.current) {
        const container = categoriesRef.current;
        const isOverflowing = container.scrollWidth > container.clientWidth;
        setShowRightArrow(isOverflowing);
        setShowLeftArrow(container.scrollLeft > 0);
      }
    };
    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [categories]);

  const handleScroll = () => {
    if (categoriesRef.current) {
      const container = categoriesRef.current;
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  useEffect(() => {
    const container = categoriesRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollLeft = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({
        left: -200,
        behavior: "smooth"
      });
    }
  };

  const scrollRight = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({
        left: 200,
        behavior: "smooth"
      });
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (selectedCategory !== "All") {
      setSelectedCategory("All");
    }
  };

  return (
    <div className="sticky top-12 z-30 bg-[#fff0df] p-2">
      <div className="flex items-center justify-between">
        <div className="relative flex items-center max-w-[70%]">
          {showLeftArrow && (
            <button
              onClick={scrollLeft}
              className="relative mr-1 right-0  z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100"
              aria-label="Scroll left"
            >
              <ArrowBackIosNewIcon style={{ fontSize: 16 }} />
            </button>
          )}

          <div
            ref={categoriesRef}
            className="flex items-center overflow-x-auto scrollbar-hide gap-x-2 px-10"
            onScroll={handleScroll}
            data-testid="category-container"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <button
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === "All"
                  ? "bg-[#ef5644] text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
              onClick={() => handleCategorySelect("All")}
            >
              All
            </button>

            {categories.map((category) => (
              <button
                key={category}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-[#ef5644] text-white"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {showRightArrow && (
            <button
              onClick={scrollRight}
              className="relative ml-1 right-0 z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100"
              aria-label="Scroll right"
            >
              <ArrowForwardIosIcon style={{ fontSize: 16 }} />
            </button>
          )}
        </div>

        <div className="relative flex-shrink-0 bg-white flex items-center rounded-full px-3 py-1.5 border border-gray-200 focus-within:ring-2 focus-within:ring-amber-300 focus-within:border-amber-500">
          <SearchIcon className="text-gray-500" />
          <input
            type="text"
            className="ml-2 outline-none   w-full max-w-[150px] rounded-full text-sm font-medium "
            placeholder="Search..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
