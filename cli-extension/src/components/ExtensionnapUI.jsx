import React, { useState, useEffect } from "react";
import { Settings, Moon, Sun } from "lucide-react";
import CommandHistory from "./CommandHistory.jsx";
import { getOS } from "../utils/getOS.js";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import GenrateCommand from "./GenrateCommand.jsx";
import Profile from "./Profile.jsx";
import { logoutUser, getStoredUser, isAuthenticated } from "../services/api";

export default function ExtensionnapUI({ theme, setTheme }) {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [os, setOS] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const token = localStorage.getItem("token");
  useEffect(() => {
    // Check if user is authenticated and load user data
    if (isAuthenticated()) {
      const storedUserData = getStoredUser();
      if (storedUserData) {
        setUser(storedUserData);
      }
    }

    // Listen for auth logout events (from API interceptor)
    const handleAuthLogout = () => {
      setUser(null);
      setShowLogin(true);
    };
    window.addEventListener("auth:logout", handleAuthLogout);

    return () => {
      window.removeEventListener("auth:logout", handleAuthLogout);
    };
  }, []);

  useEffect(() => {
    const detectedOS = getOS();
    setOS(detectedOS);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      setUser(null);
      setShowLogin(false);
      setShowRegister(false);
      // Optionally reload to reset all state
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, clear local state
      setUser(null);
      setShowLogin(false);
      setShowRegister(false);
      window.location.reload();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLogin(false);
    // Reload to refresh the app state
    window.location.reload();
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setShowRegister(false);
    // Switch to login after registration
    setShowLogin(true);
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen p-6 overflow-y-scroll scrollbar-hide transition-colors duration-200 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {showLogin && !user ? (
        <Login
          theme={theme}
          onLogin={handleLoginSuccess}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      ) : showRegister && !user ? (
        <Register
          theme={theme}
          onRegister={handleRegisterSuccess}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      ) : showProfile ? (
        <Profile theme={theme} onBack={() => setShowProfile(false)} />
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              
              <h1
                className={`text-2xl font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Command Pilot
              </h1>
              <h2
                className={`px-3 py-1 font-sans font-bold rounded-md ${
                  isDark ? "bg-white text-black" : "bg-gray-900 text-white"
                }`}
              >
                {os}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Hi, {user.username || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`px-3 text-center  py-2 text-sm rounded-md transition-colors
                              disabled:opacity-50
                              ${
                                isDark
                                  ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className={`text-sm transition-colors ${
                    isDark
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  Login
                </button>
              )}
              {token && (
                <button
                  onClick={() => setShowProfile(true)}
                  className={`p-1 rounded-lg transition-colors ${
                    isDark
                      ? "text-gray-400 hover:text-white hover:bg-gray-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  title="Settings"
                >
                  <Settings className="w-6 h-6" />
                </button>
              )}

              {isDark ? (
                <Sun
                  onClick={toggleTheme}
                  className={`w-6 h-6 cursor-pointer transition-colors ${
                    isDark
                      ? "text-gray-400 hover:text-yellow-400"
                      : "text-gray-600 hover:text-yellow-600"
                  }`}
                  title="Switch to light theme"
                />
              ) : (
                <Moon
                  onClick={toggleTheme}
                  className={`w-6 h-6 cursor-pointer transition-colors ${
                    isDark
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  title="Switch to dark theme"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <GenrateCommand theme={theme} />
            <CommandHistory theme={theme} />
          </div>
        </div>
      )}
    </div>
  );
}
