// eslint-disable-next-line react/prop-types
const BlockWrapper = ({ children, rounded, background, margin, padding }) => {
  return (
    <div
      className={`rounded-xl ml-4 md:ml-12 mt-4  p-4 md:mt-12 ${margin} ${rounded} ${padding}  `}
      style={{ backgroundColor: background || "#fff0df" }}
    >
      {children}
    </div>
  );
};

export default BlockWrapper;
