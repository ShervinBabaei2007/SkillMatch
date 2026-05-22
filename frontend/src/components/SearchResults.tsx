import EventCard from "./EventCard";

type Workshop = {
  _id: string;
  name?: string;
  time: string;
  date?: string;
  image?: string;
  imageUrl?: string;
  category?: string;
  categories?: string[];
  location?: string;
  ticketPrice?: string;
  hostedBy?: { _id: string; name: string; profilePicture: string | null };
};

type Filters = {
  location: string;
  date: string;
  minPrice: number;
  maxPrice: number;
};

type Props = {
  events: Workshop[];
  filters: Filters;
  search: string;
  onClearFilter: (key: keyof Filters) => void;
  onClearSearch: () => void;
  onClearPrice: () => void;
  onBack: () => void;
};

export default function SearchResults({ events, filters, search, onClearFilter, onClearSearch, onClearPrice, onBack }: Props) {

  return (
    <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto", display: "flex", flexDirection: "column", padding: "10px", gap: "16px" }}>
      
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button 
        onClick={onBack} 
        style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>←</button>
        <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "var(--text-dark)" }}>Results</h3>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {search && (
          <span
          onClick={() => onClearSearch()} 
          style={{ background: "var(--primary-purple)", color: "var(--bg-white)", borderRadius: "20px", padding: "6px 12px", fontSize: "14px", cursor: "pointer"}}>
            🔍 {search} X
          </span>
        )}
        {filters.location && (
          <span 
            onClick={() => onClearFilter("location")}
            style={{ background: "var(--primary-purple)", color: "var(--bg-white)", borderRadius: "20px", padding: "6px 12px", fontSize: "14px", cursor: "pointer" }}>
            📍 {filters.location} ✕
          </span>
        )}
        {filters.date && (
          <span 
            onClick={() => onClearFilter("date")}
            style={{ background: "var(--primary-purple)", color: "var(--bg-white)", borderRadius: "20px", padding: "6px 12px", fontSize: "14px", cursor: "pointer" }}>
            📅 {filters.date} ✕
          </span>
        )}
        {(filters.minPrice > 0 || filters.maxPrice < 200) && (
        <span 
            onClick={() => onClearPrice()}
            style={{ background: "var(--primary-purple)", color: "var(--bg-white)", borderRadius: "20px", padding: "6px 12px", fontSize: "14px", cursor: "pointer" }}>
            💰 ${filters.minPrice} - ${filters.maxPrice} ✕
        </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {events.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>No results found</p>
        ) : (
          events.map((event, index) => <EventCard key={event._id || index} event={event} />)
        )}
      </div>
    </div>
  );
}