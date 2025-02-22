import { User } from "lucide-react";
import SettingSection from "./SettingSection";

const Profile = () => {
  // Styles
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "1.5rem",
  };

  const imageStyle = {
    borderRadius: "50%",
    width: "5rem",
    height: "5rem",
    objectFit: "cover",
    marginRight: "1rem",
  };

  const textContainerStyle = {
    textAlign: "center",
  };

  const nameStyle = {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#f3f4f6",
  };

  const emailStyle = {
    color: "#9ca3af",
  };

  const buttonStyle = {
    backgroundColor: "#4f46e5",
    color: "white",
    fontWeight: "bold",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    transition: "background-color 0.2s ease-in-out",
    width: "100%",
    maxWidth: "200px",
  };

  return (
    <SettingSection icon={User} title={"Profile"}>
      <div style={containerStyle}>
        <img
          src="https://randomuser.me/api/portraits/men/3.jpg"
          alt="Profile"
          style={imageStyle}
        />
        <div style={textContainerStyle}>
          <h3 style={nameStyle}>John Doe</h3>
          <p style={emailStyle}>john.doe@example.com</p>
        </div>
      </div>

      <button
        style={buttonStyle}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#4338ca")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#4f46e5")}
      >
        Edit Profile
      </button>
    </SettingSection>
  );
};

export default Profile;
