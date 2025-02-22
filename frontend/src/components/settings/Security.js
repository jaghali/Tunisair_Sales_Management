import { Lock } from "lucide-react";
import SettingSection from "./SettingSection";
import ToggleSwitch from "./ToggleSwitch";
import { useState } from "react";

const Security = () => {
  const [twoFactor, setTwoFactor] = useState(false);

  // Styles
  const buttonStyle = {
    backgroundColor: "#4f46e5",
    color: "white",
    fontWeight: "bold",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    transition: "background-color 0.2s ease-in-out",
    marginTop: "1rem",
  };

  return (
    <SettingSection icon={Lock} title={"Security"}>
      <ToggleSwitch
        label={"Two-Factor Authentication"}
        isOn={twoFactor}
        onToggle={() => setTwoFactor(!twoFactor)}
      />
      <div style={{ marginTop: "1rem" }}>
        <button
          style={buttonStyle}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#4338ca")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#4f46e5")}
        >
          Change Password
        </button>
      </div>
    </SettingSection>
  );
};

export default Security;
