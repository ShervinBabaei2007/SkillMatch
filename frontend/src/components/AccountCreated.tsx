import { useNavigate } from "react-router-dom";

function AccountCreated() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "390px",
        margin: "0 auto",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="screen-header"
        style={{
          alignItems: "center",
          textAlign: "center",
          padding: "20px 0",
        }}
      >
        <h2 className="header-title">Account Created!</h2>

        <p
          className="header-subtitle"
          style={{
            fontSize: "22px",
            lineHeight: "26px",
          }}
        >
          Your profile is ready to go.
        </p>
      </div>

      <div
        className="purple-card"
        style={{
          minHeight: "420px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "22px",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            lineHeight: "44px",
            fontWeight: "800",
            margin: 0,
            color: "var(--bg-white)",
          }}
        >
          You're All Set!
        </h1>

        <p
          style={{
            fontSize: "18px",
            lineHeight: "26px",
            margin: 0,
            color: "var(--bg-white)",
            maxWidth: "300px",
          }}
        >
          Start exploring courses, discovering new skills, and connecting with
          people who share your interests.
        </p>

        <button
          className="primary-button"
          onClick={() => navigate("/Home")}
          style={{
            width: "80%",
            marginTop: "20px",
          }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default AccountCreated;