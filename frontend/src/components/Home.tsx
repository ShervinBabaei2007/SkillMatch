import { useEffect, useState } from 'react';
import EventCard from './EventCard';
import EventCategoryChips from './EventCategoryChips';
import FeaturedEventsCarousel from './FeaturedEventsCarousel';
import HomeSearchBar from './HomeSearchBar';
import FilterModal from './FilterModal';
import SearchResults from './SearchResults';
// 1

type Workshop = {
  _id: string;
  name?: string;
  title?: string;
  instructor?: string;
  time: string;
  date?: string;
  image?: string;
  imageUrl?: string;
  category?: string;
  categories?: string[];
  location?: string;
  about?: string;
  ticketPrice?: string;
  applicationPeriod?: string;
  seats?: string;
  hostedBy?: { _id: string; name: string; profilePicture: string | null };
  attendees?: { _id: string; name: string; profilePicture: string | null }[];
  reviews?: { name: string; comment: string; rating: number }[];
};

// 2
function Home() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [events, setEvents] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [showResults, setShowResults] = useState(false);

  const [filters, setFilters] = useState({
    location: '',
    date: '',
    minPrice: 0,
    maxPrice: 200,
  });

  const defaultCategories = ['Design', 'Coding', 'Marketing', 'UI/UX'];

  const token = localStorage.getItem('token');
  const savedSkills = JSON.parse(localStorage.getItem('skills') || '[]');
  // 5
  const visibleCategories =
    token && Array.isArray(savedSkills) && savedSkills.length > 0
      ? savedSkills.slice(0, 4)
      : defaultCategories;

  // 3
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/workshops`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((res) => res.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => console.error('Failed to fetch workshops'))
      .finally(() => setLoading(false));
  }, [token]);

  // 4
  const filteredEvents = events.filter((event) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (event.name || '').toLowerCase().includes(searchText) ||
      (event.location || '').toLowerCase().includes(searchText) ||
      (event.about || '').toLowerCase().includes(searchText) ||
      (event.hostedBy?.name || '').toLowerCase().includes(searchText) ||
      (event.categories || []).some((category) => category.toLowerCase().includes(searchText));

    const matchesCategory =
      !activeCategory ||
      event.category?.toLowerCase() === activeCategory.toLowerCase() ||
      event.categories?.some((category) => category.toLowerCase() === activeCategory.toLowerCase());

    const matchesLocation =
      !filters.location ||
      (event.location || '').toLowerCase().includes(filters.location.toLowerCase());

    const matchesDate =
      !filters.date ||
      (() => {
        if (!event.date) return false;

        const [year, month, day] = filters.date.split('-').map(Number);
        const filterDate = new Date(year, month - 1, day);
        const filterFormatted = filterDate.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });

        return event.date === filterFormatted || event.date === filters.date;
      })();

    const price = parseFloat((event.ticketPrice || '0').replace(/[^0-9.]/g, ''));
    const matchesPrice = price >= filters.minPrice && price <= filters.maxPrice;

    return matchesSearch && matchesCategory && matchesLocation && matchesDate && matchesPrice;
  });

  // 6
  const visibleEvents = filteredEvents.slice(0, visibleCount);
  const featuredEvents = events.slice(0, 10);

  if (showResults) {
    return (
      <SearchResults
        events={filteredEvents}
        filters={filters}
        search={search}
        onClearFilter={(key) =>
          setFilters({ ...filters, [key]: key === 'minPrice' ? 0 : key === 'maxPrice' ? 200 : '' })
        }
        onClearPrice={() => setFilters({ ...filters, minPrice: 0, maxPrice: 200 })}
        onClearSearch={() => setSearch('')}
        onBack={() => {
          setShowResults(false);
          setSearch('');
          setFilters({ location: '', date: '', minPrice: 0, maxPrice: 200 });
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        gap: '16px',
      }}
    >
      <HomeSearchBar
        value={search}
        onChange={setSearch}
        onFilterClick={() => setShowFilter(true)}
        onSearch={() => {
          if (search) setShowResults(true);
        }}
      />

      <h3
        style={{
          margin: '0',
          marginTop: '4px',
          fontSize: '24px',
          fontWeight: '700',
          color: 'var(--text-dark)',
          textAlign: 'left',
        }}
      >
        Featured Workshops
      </h3>

      {featuredEvents.length > 0 && <FeaturedEventsCarousel events={featuredEvents} />}

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3>Recommended Categories</h3>
        </div>

        <EventCategoryChips
          categories={visibleCategories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading events...</p>
        ) : filteredEvents.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>No events match your search</p>
        ) : (
          <>
            {visibleEvents.map((event, index) => (
              <EventCard key={event._id || index} event={event} />
            ))}

            {visibleCount < filteredEvents.length && (
              <button
                className="primary-button"
                onClick={() => setVisibleCount((prev) => Math.min(prev + 6, filteredEvents.length))}
                style={{
                  width: '70%',
                  alignSelf: 'center',
                  marginTop: '10px',
                }}
              >
                See More
              </button>
            )}
          </>
        )}
      </div>

      {showFilter && (
        <FilterModal
          onClose={() => setShowFilter(false)}
          onApply={(f) => {
            setFilters(f);
            setShowResults(true);
          }}
          initialValues={filters}
        />
      )}
    </div>
  );
}

export default Home;
