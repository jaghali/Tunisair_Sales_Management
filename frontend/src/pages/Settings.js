import DangerZone from "../components/settings/DangerZone";
import Notifications from "../components/settings/Notifications";
import Profile from "../components/settings/Profile";
import Security from "../components/settings/Security";

const SettingsPage = () => {
  const pageStyle = {
    padding : "5%",
    flex: 1,
    overflow: "auto",
    position: "relative",
    zIndex: 10,
  };

  const mainStyle = {
    maxWidth: "56rem", // Equivalent to max-w-4xl
    margin: "0 auto", // Equivalent to mx-auto
    paddingTop: "1.5rem", // Equivalent to py-6
    paddingBottom: "1.5rem",
    paddingLeft: "1rem", // Equivalent to px-4
    paddingRight: "1rem",
    // Adjust padding for larger screens (lg:px-8)
    "@media (min-width: 1024px)": {
      paddingLeft: "2rem",
      paddingRight: "2rem",
    },
  };

  return (
    <div style={pageStyle}>
      <main style={mainStyle}>
        <Profile />
        <Notifications />
        <Security />
        <DangerZone />
      </main>
    </div>
  );
};

export default SettingsPage;
