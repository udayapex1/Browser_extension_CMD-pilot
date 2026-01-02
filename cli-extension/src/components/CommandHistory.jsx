import React, { useEffect, useState } from "react";
import {
  Copy,
  Trash,
  RefreshCw,
} from "lucide-react";
import {
  getUserCommands,
  deleteCommand as deleteCommandAPI,
  isAuthenticated,
} from "../services/api";

const CommandHistory = ({ theme }) => {
  const isDark = theme === "dark";
  const [commands, setCommands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCommands = async () => {
    if (!isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await getUserCommands();
      
      // Handle different response formats
      if (data.userCommands) {
        setCommands(data.userCommands);
      } else if (Array.isArray(data)) {
        setCommands(data);
      } else {
        setCommands([]);
      }
    } catch (error) {
      console.error("Error fetching commands:", error);
      setError(error.message || "Failed to load command history");
      setCommands([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommands();
  }, []);

  const handleDeleteCommand = async (id) => {
    if (!window.confirm("Are you sure you want to delete this command?")) {
      return;
    }

    try {
      await deleteCommandAPI(id);
      
      // Update UI by removing the deleted command
      setCommands((prevCommands) =>
        prevCommands.filter((cmd) => cmd._id !== id)
      );
      
      // Show success feedback
      alert("Command deleted successfully");
    } catch (error) {
      console.error("Error deleting command:", error);
      alert(error.message || "Failed to delete command");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="space-y-6">
        <h2 className={`text-xl font-semibold ${
          isDark ? "text-white" : "text-gray-900"
        }`}>
          Command History
        </h2>
        <div className={`rounded-lg p-6 border text-center transition-colors ${
          isDark 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-300"
        }`}>
          <p className={`mb-4 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}>
            Login to save and view your command history
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-semibold ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            My Previous Commands
          </h2>
          <button
            onClick={fetchCommands}
            disabled={isLoading}
            className={`p-2 transition-colors disabled:opacity-50 ${
              isDark 
                ? "text-gray-400 hover:text-white" 
                : "text-gray-600 hover:text-gray-900"
            }`}
            title="Refresh commands"
          >
            <RefreshCw
              className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`border border-red-500 rounded-lg p-3 ${
            isDark ? "bg-red-900/50" : "bg-red-50"
          }`}>
            <p className={`text-sm ${
              isDark ? "text-red-400" : "text-red-700"
            }`}>
              {error}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {commands.length === 0 ? (
              <div className={`rounded-lg p-6 border text-center transition-colors ${
                isDark 
                  ? "bg-gray-800 border-gray-700" 
                  : "bg-white border-gray-300"
              }`}>
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                  No saved commands found.
                </p>
                <p className={`text-sm mt-2 ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}>
                  Generate commands while logged in to save them here.
                </p>
              </div>
            ) : (
              commands.map((cmd) => (
                <div
                  key={cmd._id || cmd.id}
                  className={`rounded-lg p-4 border transition-colors ${
                    isDark 
                      ? "bg-gray-800 border-gray-700 hover:border-gray-600" 
                      : "bg-white border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div className={`font-mono text-sm break-words flex-1 ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}>
                      {cmd.command}
                    </div>
                    <div className="flex space-x-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(cmd.command);
                          alert("✅ Command copied!");
                        }}
                        className={`transition-colors ${
                          isDark 
                            ? "text-gray-500 hover:text-gray-300" 
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                        title="Copy command"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCommand(cmd._id || cmd.id)}
                        className={`transition-colors ${
                          isDark 
                            ? "text-gray-500 hover:text-red-400" 
                            : "text-gray-600 hover:text-red-600"
                        }`}
                        title="Delete command"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className={`text-sm mb-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    App: {cmd.appName || "N/A"}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className={`text-xs ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    }`}>
                      OS: {cmd.os || "N/A"}
                    </div>
                    <div className={`text-xs ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    }`}>
                      {formatDate(cmd.createdAt || cmd.time)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandHistory;
