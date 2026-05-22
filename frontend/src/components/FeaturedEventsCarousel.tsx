import { useEffect, useRef, useState } from "react";
import FeaturedEventCard from "./FeaturedEventCard";

type Event = {
  _id?: string;
  name?: string;
  time: string;
  image?: string;
  imageUrl?: string;
  category?: string;
  categories?: string[];
  location?: string;
  date?: string;
  hostedBy?: {
    _id: string;
    name: string;
    profilePicture: string | null;
  };
};

function FeaturedEventsCarousel({ events }: { events: Event[] }) {
  const middleIndex = Math.floor(events.length / 2);

  const [activeIndex, setActiveIndex] = useState(middleIndex);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  const centerCard = (card: HTMLDivElement) => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;

    container.scrollTo({
      left:
        card.offsetLeft -
        container.clientWidth / 2 +
        card.clientWidth / 2,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;

    const middleCard = container.children[
      middleIndex
    ] as HTMLDivElement;

    if (middleCard) {
      centerCard(middleCard);
    }
  }, []);

  const snapToClosestCard = () => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const cards = Array.from(container.children) as HTMLDivElement[];

    let closestCard = cards[0];
    let closestDistance = Infinity;

    cards.forEach((card) => {
      const cardCenter =
        card.offsetLeft + card.clientWidth / 2;

      const containerCenter =
        container.scrollLeft + container.clientWidth / 2;

      const distance = Math.abs(
        cardCenter - containerCenter
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard = card;
      }
    });

    const closestIndex = cards.indexOf(closestCard);

    setActiveIndex(closestIndex);

    centerCard(closestCard);
  };

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div
        ref={scrollRef}
        className="hide-scrollbar"
        onScroll={() => {
          if (scrollTimeoutRef.current) {
            window.clearTimeout(scrollTimeoutRef.current);
          }

          scrollTimeoutRef.current = window.setTimeout(() => {
            snapToClosestCard();
          }, 120);
        }}
        style={{
          display: "flex",
          gap: "15px",
          overflowX: "auto",
          overflowY: "hidden",
          padding: "12px 80px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollBehavior: "smooth",
          touchAction: "pan-x",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {events.map((event, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={event._id || event.name || index}
              onMouseEnter={(e) => {
                setActiveIndex(index);
                centerCard(e.currentTarget);
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(index);
                centerCard(e.currentTarget);
              }}
              onTouchStart={() => {
                setActiveIndex(index);
              }}
              style={{
                minWidth: "300px",
                transform: isActive
                  ? "scale(1.05)"
                  : "scale(0.9)",
                opacity: isActive ? 1 : 0.7,
                zIndex: isActive ? 5 : 1,
                transition: "all 0.3s ease",
                flexShrink: 0,
              }}
            >
              <FeaturedEventCard event={event} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FeaturedEventsCarousel;