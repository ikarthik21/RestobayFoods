// eslint-disable-next-line react/prop-types
const BlockWrapper = ({ children, rounded, background, margin, padding }) => {
  return (
    <div
      className={`rounded-xl ${margin} ${rounded} ${padding}`}
      style={{ backgroundColor: background || "#fff0df" }}
    >
      {children}
    </div>
  );
};

export default BlockWrapper;
