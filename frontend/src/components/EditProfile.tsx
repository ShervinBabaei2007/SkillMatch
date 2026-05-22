import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const INTERESTS = [
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

export default function EditProfile() {
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, profilePicture: reader.result as string });
    };
    reader.readAsDataURL(file);
  };
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    position: "",
    instagram: "",
    facebook: "",
    interests: [] as string[],
    profilePicture: "",
  });
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/profile/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data;
        setFormData({
          name: user.name || "",
          bio: user.bio || "",
          instagram: user.social?.instagram || "",
          facebook: user.social?.facebook || "",
          interests: user.interests || [],
          profilePicture: user.profilePicture || "",
          position: user.position || "",
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile. Please try again.");
      }
    };
    fetchProfile();
  }, []);
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:3000/api/profile/update",
        {
          name: formData.name,
          bio: formData.bio,
          interests: formData.interests,
          social: {
            instagram: formData.instagram,
            facebook: formData.facebook,
          },
          position: formData.position,
          profilePicture: formData.profilePicture,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Profile saved!");
      navigate("/course/profile");
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="profile-page">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate("/course/profile")}>
          ←
        </button>
        <h2 className="header-title">Edit Profile</h2>
      </div>

      <div className="purple-card">
        <div className="edit-avatar">
          {formData.profilePicture ? (
            <img src={formData.profilePicture} className="avatar" alt="profile" />
          ) : (
            <div className="avatar-placeholder edit-avatar-circle">👤</div>
          )}
          <label className="edit-avatar-label" style={{ cursor: "pointer" }}>
            Upload Profile Image
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
          </label>
        </div>

        <div className="input-group">
          <label className="input-label">User Name</label>
          <input
            type="text"
            className="text-input"
            placeholder="@user_G68927"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Position / Job Title</label>
          <input
            type="text"
            className="text-input"
            placeholder="e.g. UX Designer"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Describe Yourself</label>
          <input
            type="text"
            className="text-input"
            placeholder="Description"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Instagram Link</label>
          <input
            type="text"
            className="text-input"
            placeholder="https://instagram.com/username"
            value={formData.instagram}
            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Facebook Link</label>
          <input
            type="text"
            className="text-input"
            placeholder="https://facebook.com/username"
            value={formData.facebook}
            onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Choose Interests</label>
          <div
          className="interests-list"
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "var(--primary-purple) transparent"
          }}
          >
            {INTERESTS.map((interest) => (
              <span
                key={interest}
                className={`interest-tag ${formData.interests.includes(interest) ? "interest-tag--selected" : ""}`}
                onClick={() => {
                  const already = formData.interests.includes(interest);
                  setFormData({
                    ...formData,
                    interests: already
                      ? formData.interests.filter((i) => i !== interest)
                      : [...formData.interests, interest],
                  });
                }}
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button className="primary-button" style={{ marginTop: "20px" }} onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
