import { useEffect, useState } from "react";
import ExtensionnapUI from "./components/ExtensionnapUI";
import { checkApiHealth } from "./services/api";

function App() {
  const [apiStatus, setApiStatus] = useState(null);
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to dark
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark";
  });

  useEffect(() => {
    // Check API health on app startup
    const verifyApiHealth = async () => {
      try {
        const result = await checkApiHealth();
        setApiStatus("connected");
        console.log("API Health Check:", result);
      } catch (error) {
        setApiStatus("disconnected");
        console.error("API Health Check Failed:", error);
      }
    };

    verifyApiHealth();
  }, []);

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    localStorage.setItem("theme", theme);
    // Apply theme class to document root
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className={`overflow-y-scroll scrollbar-hide ${theme === "dark" ? "dark" : ""}`}>
      {apiStatus === "disconnected" && (
        <div className={`border-b px-4 py-2 text-center ${
          theme === "dark" 
            ? "bg-yellow-900/50 border-yellow-500" 
            : "bg-yellow-100 border-yellow-400"
        }`}>
          <p className={`text-sm ${
            theme === "dark" ? "text-yellow-400" : "text-yellow-800"
          }`}>
            ⚠️ Unable to connect to server. Some features may not work.
          </p>
        </div>
      )}
      <ExtensionnapUI theme={theme} setTheme={handleThemeChange} />
    </div>
  );
}

export default App;
