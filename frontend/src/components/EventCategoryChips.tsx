function EventCategoryChips({
  categories,
  activeCategory,
  onSelectCategory,
}: {
  categories: string[];
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}) {
  return (
    <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
      {categories.map((category) => {
        const isActive = activeCategory === category;

        return (
          <button
            key={category}
            onClick={() => onSelectCategory(isActive ? null : category)}
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              border: "none",
              transition: "all 0.15s ease",
              background: isActive ? "var(--mangosteen)" : "var(--passionfruit)",
              color: isActive ? "black" : "white",
              cursor: "pointer",
            }}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

export default EventCategoryChips;