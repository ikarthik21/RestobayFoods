import { useEffect, memo } from "react";
import BlockWrapper from "@/_components/Wrappers/BlockWrapper";
import restoApiInstance from "../../service/api/api";
import { useQuery } from "@tanstack/react-query";
import MenuBar from "@/_components/Menu/MenuBar";
import useMenuStore from "../../store/use-menu";
import PropTypes from "prop-types";

const MenuItem = memo(({ item }) => (
  <div
    className="bg-[#fde4c7] flex flex-col items-center justify-center m-2 rounded p-2 w-56 h-56"
    key={item.id}
  >
    <div className="overflow-hidden rounded-xl">
      <img
        src="https://restobay.vercel.app/images/vt.jpg"
        className="h-32 w-32 object-cover rounded-xl transition-transform hover:scale-105"
        alt={item.name}
        loading="lazy"
      />
    </div>

    <div className="mt-2 text-center">
      <h3 className="font-medium truncate max-w-full">{item.name}</h3>
    </div>

    <div className="flex items-center justify-between w-full mt-2 px-2">
      <p className="text-sm font-medium">Price: {item.price}</p>
      <button
        className="ml-2 bg-[#ef5644] cursor-pointer text-white text-sm px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
        aria-label={`Add ${item.name} to order`}
      >
        Add
      </button>
    </div>
  </div>
));

MenuItem.displayName = "MenuItem";

MenuItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired
  }).isRequired
};

const Menu = () => {
  const { setMenu, search, setCategories, selectedCategory } = useMenuStore();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["restoMenu"],
    queryFn: restoApiInstance.getMenu
  });

  useEffect(() => {
    if (data?.menu && data?.categories) {
      setMenu(data.menu);
      setCategories(data.categories);
    }
  }, [data, setMenu, setCategories]);

  // Filter menu items based on selected category and search term
  const filteredItems = data?.menu
    ? data.menu
        .filter(
          (item) =>
            selectedCategory === "All" || item.category === selectedCategory
        )
        .filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
    : [];

  if (isLoading) {
    return (
      <BlockWrapper>
        <h1>Loading...</h1>
      </BlockWrapper>
    );
  }

  if (isError) {
    return (
      <BlockWrapper>
        <div className="text-center py-10">
          <p className="text-lg text-red-500">Failed to load menu items</p>
          <button
            className="mt-4 bg-[#ef5644] text-white px-6 py-2 rounded-full"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </BlockWrapper>
    );
  }

  // Render empty state
  if (!data || filteredItems.length === 0) {
    return (
      <BlockWrapper>
        <MenuBar />
        <div className="text-center py-10">
          <p className="text-lg">
            {search
              ? "No items match your search."
              : "No menu items available."}
          </p>
        </div>
      </BlockWrapper>
    );
  }

  return (
    <BlockWrapper>
      <MenuBar />
      <div className="flex items-center flex-wrap mt-4">
        {filteredItems.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </BlockWrapper>
  );
};

export default Menu;
