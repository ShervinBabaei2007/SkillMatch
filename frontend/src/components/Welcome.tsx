// import { Link } from "react-router-dom";
// import heroImg from "../assets/welcome-hero.png";

// function Welcome() {
//   const categories = [
//     "🍳 Cooking",
//     "💰 Finance",
//     "💻 Programming",
//     "🎨 Design",
//     " 📐 Math",
//     "📚 Teaching",
//     "🔬 Research",
//     "✨ More",
//   ];

//   return (
//     <div
//       style={{
//         width: "100%",
//         maxWidth: "600px",
//         minHeight: "100vh",
//         margin: "0 auto",
//         padding: "24px",
//         boxSizing: "border-box",
//         background: "#f5f5f5",
//       }}
//     >
//       {/* Header */}
//       <div style={{ paddingTop: "20px", marginBottom: "24px" }}>
//         <h1
//           style={{
//             fontSize: "42px",
//             fontWeight: "800",
//             margin: 0,
//             color: "#111",
//           }}
//         >
//           SkillMatch
//         </h1>
//       </div>

//       {/* Main Card */}
//       <div
//         style={{
//           background: "linear-gradient(180deg, #8b6cff 0%, #7b61ff 100%)",
//           borderRadius: "28px",
//           padding: "28px 24px",
//           minHeight: "720px",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
//         }}
//       >
//         {/* Hero Image */}
//         <img
//           src={heroImg}
//           alt="People learning together"
//           style={{
//             width: "100%",
//             maxWidth: "600px",
//             borderRadius: "20px",
//             marginBottom: "28px",
//             objectFit: "cover",
//           }}
//         />

//         {/* Main Heading */}
//         <h2
//           style={{
//             color: "white",
//             fontSize: "38px",
//             fontWeight: "800",
//             textAlign: "center",
//             lineHeight: "1.1",
//             marginBottom: "16px",
//           }}
//         >
//           Learn Together.
//           <br />
//           Grow Together.
//         </h2>

//         {/* Description */}
//         <p
//           style={{
//             color: "rgba(255,255,255,0.9)",
//             textAlign: "center",
//             fontSize: "18px",
//             lineHeight: "1.5",
//             marginBottom: "28px",
//             maxWidth: "600px",
//           }}
//         >
//           Choose what you're interested in, get matched with like-minded people, and learn together in a course.
//         </p>

//         {/* Categories */}
//         <div
//           style={{
//             width: "100%",
//             display: "grid",
//             gridTemplateColumns: "repeat(2, 1fr)",
//             gap: "12px",
//             marginBottom: "40px",
//           }}
//         >
//           {categories.map((category) => (
//             <div
//               key={category}
//               style={{
//                 height: "52px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 background: "rgba(255,255,255,0.16)",
//                 border: "1px solid rgba(255,255,255,0.12)",
//                 color: "white",
//                 borderRadius: "16px",
//                 fontWeight: "600",
//                 fontSize: "15px",
//                 backdropFilter: "blur(10px)",
//                 WebkitBackdropFilter: "blur(10px)",
//                 boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//                 textAlign: "center",
//                 padding: "0 10px",
//               }}
//             >
//               {category}
//             </div>
//           ))}
//         </div>

//         {/* Buttons */}
//         <div
//           style={{
//             width: "100%",
//             display: "flex",
//             flexDirection: "column",
//             gap: "18px",
//             marginTop: "auto",
//           }}
//         >
//           <Link to="/signup" style={{ textDecoration: "none" }}>
//             <button
//               style={{
//                 width: "100%",
//                 height: "58px",
//                 borderRadius: "999px",
//                 border: "none",
//                 background: "#4b149d",
//                 color: "white",
//                 fontSize: "20px",
//                 fontWeight: "700",
//                 cursor: "pointer",
//                 boxShadow: "0 8px 20px rgba(75,20,157,0.35)",
//               }}
//             >
//               Sign Up
//             </button>
//           </Link>

//           <Link to="/login" style={{ textDecoration: "none" }}>
//             <button
//               style={{
//                 width: "100%",
//                 height: "58px",
//                 borderRadius: "999px",
//                 border: "none",
//                 background: "#4b149d",
//                 color: "white",
//                 fontSize: "20px",
//                 fontWeight: "700",
//                 cursor: "pointer",
//                 boxShadow: "0 8px 20px rgba(75,20,157,0.35)",
//               }}
//             >
//               Log In
//             </button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Welcome;

import { Link } from "react-router-dom";
import logo from "../assets/skillmatch-logo.svg";
import company from "../assets/company-name.png";

function Welcome() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#e9e7f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={company}
          alt="SkillMatch"
          style={{
            width: "100%",
            maxWidth: "300px",
            marginBottom: "20px",
          }}
        />

        {/* Logo */}
        <img
          src={logo}
          alt="SkillMatch Logo"
          style={{
            width: "100%",
            maxWidth: "280px",
            marginBottom: "48px",
          }}
        />

        {/* Buttons */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <Link
            to="/signup"
            style={{
              width: "50%",
              textDecoration: "none",
            }}
          >
            <button
              style={{
                width: "100%",
                height: "58px",
                borderRadius: "999px",
                border: "none",
                background: "#5a145f",
                color: "white",
                fontSize: "20px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Sign Up
            </button>
          </Link>

          <Link
            to="/login"
            style={{
              width: "50%",
              textDecoration: "none",
            }}
          >
            <button
              style={{
                width: "100%",
                height: "58px",
                borderRadius: "999px",
                border: "none",
                background: "#5a145f",
                color: "white",
                fontSize: "20px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Log In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Welcome;