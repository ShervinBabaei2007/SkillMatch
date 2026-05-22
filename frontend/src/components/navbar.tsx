import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBullseye, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <nav className="bottom-nav">
      <button className={`nav-item ${isActive("/home") ? "nav-item--active" : ""}`}
        onClick={() => navigate("/home")}>
        <FontAwesomeIcon icon={faHouse} />
        <span>Home</span>
      </button>

      <button
        className={`nav-item nav-item--center ${isActive("/skill-matching-feature") ? "nav-item--active" : ""
          }`}
        onClick={() => navigate("/skill-matching-feature")}
      >
        <FontAwesomeIcon icon={faBullseye} />
        <span>SkillMatch</span>
      </button>

      <button className={`nav-item ${isActive("/host") ? "nav-item--active" : ""}`}
        onClick={() => navigate("/host")}>
        <FontAwesomeIcon icon={faPlus} />
        <span>Host</span>
      </button>

      <button className={`nav-item ${isActive("/course/profile") ? "nav-item--active" : ""}`}
        onClick={() => navigate("/course/profile")}>
        <FontAwesomeIcon icon={faUser} />
        <span>Profile</span>
      </button>
    </nav>
  );
}