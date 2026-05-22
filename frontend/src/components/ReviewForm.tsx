import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
const ReviewForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workshopId } = location.state || {};

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRating = (star: number) => {
    setRating(star);
    if (error) setError(""); // clear the error as soon as a star is picked
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!workshopId) return toast.error("Workshop ID missing. Go back and try again.");
    if (rating === 0) return setError("Please select a rating before submitting.");

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/workshops/${workshopId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment, rating }),
      });

      if (!res.ok) throw new Error("Server error");

      toast.success("Review submitted!");
      setTimeout(() => navigate(-1), 1000); // waits 1 sec, then goes back 1 page.
    } catch {
      toast.error("Failed to submit review. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = hoveredRating || rating;

  const ratingLabels: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  return (
    <div className="host-page-container">
      <div className="screen-header" style={{ flexDirection: "row", alignItems: "center" }}>
        <button className="back-button" onClick={() => navigate(-1)} type="button">
          ←
        </button>
        <h2 className="header-title" style={{ margin: 0 }}>
          Leave a Review
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "24px" }}
      >
        {/* Star Rating */}
        <div>
          <p style={{ fontWeight: "600", marginBottom: "12px", fontSize: "15px" }}>
            Workshop Rating <span style={{ color: "red" }}>*</span>
          </p>
          <div style={{ display: "flex", gap: "10px", fontSize: "2.4rem", marginBottom: "6px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                style={{
                  cursor: "pointer",
                  color: star <= displayRating ? "#f59e0b" : "#d1d5db",
                  transition: "color 0.15s ease, transform 0.1s ease",
                  display: "inline-block",
                  transform: star <= displayRating ? "scale(1.1)" : "scale(1)",
                  userSelect: "none",
                }}
                role="button"
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              >
                ★
              </span>
            ))}
          </div>
          {displayRating > 0 && (
            <div style={{ fontSize: "13px", color: "var(--text-gray)", fontWeight: "500" }}>
              {ratingLabels[displayRating]}
            </div>
          )}
          {error && (
            <p style={{ color: "#ef4444", fontSize: "13px", margin: "6px 0 0 0" }}>{error}</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <p style={{ fontWeight: "600", marginBottom: "8px", fontSize: "15px" }}>
            Comments{" "}
            <span style={{ fontWeight: "400", color: "var(--text-gray)", fontSize: "13px" }}>
              (optional)
            </span>
          </p>
          <textarea
            className="bordered-input"
            placeholder="Share your experience with this workshop… (max 150 characters)"
            maxLength={150}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ resize: "vertical", minHeight: "100px" }}
          />
          <div
            style={{
              textAlign: "right",
              fontSize: "12px",
              color: "var(--text-gray)",
              marginTop: "4px",
            }}
          >
            {comment.length}/150
          </div>
        </div>

        <button
          type="submit"
          className="btn-dark-purple"
          disabled={submitting}
          style={{ opacity: submitting ? 0.6 : 1 }}
        >
          {submitting ? "Submitting…" : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
