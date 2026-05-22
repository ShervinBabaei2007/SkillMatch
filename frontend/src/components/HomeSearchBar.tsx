import { IoSearch } from "react-icons/io5";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";

function HomeSearchBar({
  value,
  onChange,
  onFilterClick,
  onSearch,
}: {
  value: string;
  onChange: (val: string) => void;
  onFilterClick: () => void;
  onSearch: () => void;
}) {
  return (
    <div
      style={{
        background: "var(--passionfruit)",
        borderRadius: "20px",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <span style={{ color: "var(--coconut-milk)", fontSize: "24px", display: "flex", alignItems: "center" }}>
        <IoSearch />
      </span>

      <input
        id="search"
        name="search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch();
        }}
        placeholder="Search..."
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          color: "var(--coconut-milk)",
          fontSize: "18px",
        }}
      />

      {value.length > 0 && (
        <button onClick={() => onChange("")}
          style={{ background: "transparent", border: "none", color: "var(--coconut-milk)", fontSize: "18px", cursor: "pointer" }}>
          ✕
        </button>
      )}

      <button onClick={onFilterClick}
        style={{ background: "transparent", border: "none", color: "var(--coconut-milk)", fontSize: "24px", cursor: "pointer", display: "flex", alignItems: "center" }}>
        <HiAdjustmentsHorizontal />
      </button>
    </div>
  );
}

export default HomeSearchBar;