import { useState } from "react";
import HomeSearchBar from "./HomeSearchBar";
import EventCard from "./EventCard";

const skillsList = [
    "AI",
    "Coding",
    "Tech",
    "UI/UX",
    "Design",
    "Data Science",
    "Marketing",
    "Entrepreneurship",
    "Photography",
    "Music",
    "Video Editing",
    "Game Dev",
    "Fitness",
    "Leadership",
    "Public Speaking",
    "Finance",
    "Creativity",
    "Animation",
    "Writing",
    "Teaching",
    "Research",
    "Fashion",
    "Cooking",
    "Languages",
    "Math",
    "Nutrition",
    "Sales",
    "Fine Art",
    "Pottery",
    "Hair",
];

type Workshop = {
    _id: string;
    name?: string;
    title?: string;
    time: string;
    date?: string;
    imageUrl?: string;
    categories?: string[];
    location?: string;
    about?: string;
    ticketPrice?: string;
};

function SkillMatchingFeature() {
    const [search, setSearch] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [matchedWorkshops, setMatchedWorkshops] = useState<Workshop[]>([]);
    const [loading, setLoading] = useState(false);

    function toggleSkill(skill: string) {
        setSelectedSkills((prev) =>
            prev.includes(skill)
                ? prev.filter((item) => item !== skill)
                : [...prev, skill]
        );
    }

    const filteredSkills = skillsList
        .filter((skill) => skill.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            const aSelected = selectedSkills.includes(a);
            const bSelected = selectedSkills.includes(b);

            if (aSelected && !bSelected) return -1;
            if (!aSelected && bSelected) return 1;
            return 0;
        });

    async function handleSkillMatch() {
        if (selectedSkills.length === 0)
            return;

        setLoading(true);

        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:3000/api/workshops/match", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    categories: selectedSkills,
                }),
            });

            const data = await res.json();
            setMatchedWorkshops(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to match workshops:", error);
        } finally {
            setLoading(false);
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
                padding: "70px 16px 94px",
                boxSizing: "border-box",
                background: "var(--coconut)",
            }}
        >
            <h1
                style={{
                    textAlign: "center",
                    fontSize: "28px",
                    fontWeight: "800",
                    marginBottom: "8px",
                }}
            >
                Skill Matching
            </h1>

            <p
                style={{
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "24px",
                }}
            >
                Match your skills to workshops made by professionals.
            </p>

            <HomeSearchBar value={search} onChange={setSearch} onFilterClick={() => { }} onSearch={() => { }} />

            <div style={{ marginTop: "24px" }}>
                <p
                    style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        marginBottom: "8px",
                    }}
                >
                    Skills Chosen
                </p>

                <div
                    style={{
                        minHeight: "38px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                    }}
                >
                    {selectedSkills.length === 0 ? (
                        <span
                            style={{
                                background: "var(--mangosteen)",
                                color: "var(--text-dark)",
                                padding: "8px 22px",
                                borderRadius: "20px",
                                fontWeight: "600",
                                fontSize: "14px",
                            }}
                        >
                            None
                        </span>
                    ) : (
                        selectedSkills.map((skill) => (
                            <span
                                key={skill}
                                style={{
                                    background: "var(--passionfruit)",
                                    color: "var(--coconut-milk)",
                                    padding: "8px 18px",
                                    borderRadius: "20px",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                }}
                            >
                                {skill}
                            </span>
                        ))
                    )}
                </div>
            </div>

            <div
                style={{
                    marginTop: "24px",
                    background: "var(--coconut-milk)",
                    borderRadius: "16px",
                    padding: "16px",
                }}
            >
                <p
                    style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        marginBottom: "12px",
                    }}
                >
                    Skills
                </p>

                <div
                    className="skills-scroll"
                    style={{
                        height: "260px",
                        overflowY: "auto",
                        paddingRight: "6px",
                        padding: "10px",
                        fontSize: "0.9rem"
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "10px",
                        }}
                    >
                        {filteredSkills.map((skill) => {
                            const isSelected = selectedSkills.includes(skill);

                            return (
                                <button
                                    key={skill}
                                    type="button"
                                    onClick={() => toggleSkill(skill)}
                                    style={{
                                        padding: "10px",
                                        borderRadius: "20px",
                                        border: "none",
                                        background: isSelected
                                            ? "var(--passionfruit)"
                                            : "var(--mangosteen)",
                                        color: isSelected
                                            ? "var(--coconut-milk)"
                                            : "var(--text-dark)",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                        boxShadow: "0 3px 8px rgba(81, 23, 78, 0.3)"
                                    }}
                                >
                                    {skill}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                    marginTop: "24px",
                }}
            >
                <button
                    type="button"
                    className="primary-button"
                    onClick={handleSkillMatch}
                    style={{
                        width: "70%",
                    }}
                >
                    SkillMatch
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setSelectedSkills([]);
                        setMatchedWorkshops([]);
                        setSearch("");
                    }}
                    style={{
                        width: "70%",
                        border: "none",
                        borderRadius: "25px",
                        background: "var(--mangosteen)",
                        color: "var(--black)",
                        fontWeight: "700",
                        cursor: "pointer",
                        padding: "15px",
                        fontSize: "16px",
                    }}
                >
                    Clear
                </button>
            </div>

            <div
                style={{
                    marginTop: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                {loading ? (
                    <p style={{ textAlign: "center" }}>Finding workshops...</p>
                ) : matchedWorkshops.length > 0 ? (
                    matchedWorkshops.map((workshop) => (
                        <EventCard key={workshop._id} event={workshop} />
                    ))
                ) : (
                    <p style={{ textAlign: "center", color: "var(--text-dark)" }}>
                        No matched workshops yet.
                    </p>
                )}
            </div>
        </div>
    );
}

export default SkillMatchingFeature;