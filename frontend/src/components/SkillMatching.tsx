import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const skillsList = [
  "Design",
  "Creativity",
  "Tech",
  "Math",
  "Marketing",
  "Finance",
  "Fine Art",
  "Writing",
  "Sales",
  "Teaching",
  "Coding",
  "Research",
  "Fashion",
  "Hair",
  "Pottery",
  "Cooking",
  "Photography",
  "Music",
  "Video Editing",
  "Public Speaking",
  "Leadership",
  "UI/UX",
  "Animation",
  "Game Dev",
  "AI",
  "Data Science",
  "Fitness",
  "Nutrition",
  "Languages",
  "Entrepreneurship",
];

function SkillMatching() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const navigate = useNavigate();

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  }

  async function handleConfirm() {
    if (selectedSkills.length === 0) {
      toast.error("Please select at least one skill");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await fetch("http://localhost:3000/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ interests: selectedSkills }),
      });

      localStorage.setItem("skills", JSON.stringify(selectedSkills));
      navigate("/account-created");
    } catch (error) {
      console.error("Failed to save skills:", error);
      toast.error("Could not save skills. Please try again.");
    }
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "440px",
        margin: "0 auto",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        className="screen-header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h2 className="header-title">Skill Matching</h2>
        <p className="header-subtitle">What are your Skills?</p>
      </div>

      {/* Card */}
      <div
        className="purple-card-2"
        style={{
          backgroundColor: "var(--coconut-milk)",
          height: "75vh",
          maxHeight: "720px",
          margin: "0 10px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Scrollable skills */}
        <div
          className="skills-scroll"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "5px",
            }}
          >
            {skillsList.map((skill) => {
              const isSelected = selectedSkills.includes(skill);

              return (
                <span
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  style={{
                    width: "90%",
                    padding: "10px",
                    borderRadius: "20px",
                    fontSize: "16px",
                    cursor: "pointer",
                    textAlign: "center",
                    background: isSelected ? "var(--passionfruit)" : "var(--mangosteen)",
                    color: isSelected ? "white" : "black",
                    transition: "0.2s",
                  }}
                >
                  {skill}
                </span>
              );
            })}
          </div>
        </div>

        {/* Button */}
        <button
          className="primary-button"
          onClick={handleConfirm}
          style={{
            width: "80%",
            alignSelf: "center",
            flexShrink: 0,
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default SkillMatching;
