import React, { useState } from "react";
import { getOS } from "../utils/getOS.js";
import {
  Copy,
  Save,
} from "lucide-react";
import {
  generateGuestCommand,
  generateAuthenticatedCommand,
  isAuthenticated,
} from "../services/api";

const GenrateCommand = ({ theme }) => {
  const isDark = theme === "dark";
  const [inputText, setInputText] = useState("");
  const [generatedCommand, setGeneratedCommand] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const myOs = getOS();

  const copyCommand = () => {
    if (!generatedCommand) return;
    navigator.clipboard.writeText(generatedCommand);
    alert("Copied To Clipboard");
  };

  const generateCommand = async (inputText, myOs) => {
    if (!inputText.trim()) {
      setError("Please enter an app name or description");
      return;
    }

    setIsGenerating(true);
    setError("");
    setGeneratedCommand("");

    const appName = inputText.trim();
    // Normalize OS value - ensure it matches API expectations
    let os = myOs?.toLowerCase() || "linux";
    
    // Map common OS names to API expected values
    if (os.includes("win")) {
      os = "windows";
    } else if (os.includes("mac")) {
      os = "mac";
    } else {
      os = "linux";
    }

    try {
      const isAuth = isAuthenticated();
      let data;

      if (isAuth) {
        // Authenticated user - command will be saved
        data = await generateAuthenticatedCommand({ appName, os });
      } else {
        // Guest user - command will not be saved
        data = await generateGuestCommand({ appName, os });
      }

      if (data.command) {
        setGeneratedCommand(data.command);
      } else {
        setError("No command generated. Please try again.");
      }
    } catch (error) {
      console.error("Command generation failed:", error);
      
      // Handle rate limiting
      if (error.response?.status === 429) {
        const resetTime = error.response.headers["x-ratelimit-reset"]
          ? new Date(Number(error.response.headers["x-ratelimit-reset"]))
          : null;
        setError(
          resetTime
            ? `Rate limit reached. Try again after: ${resetTime.toLocaleString()}`
            : "Rate limit reached. Please try again later."
        );
      } else {
        setError(error.message || "Failed to generate command. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = () => {
    generateCommand(inputText, myOs);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleGenerate();
    }
  };

  return (
    <div>
      <div className="lg:col-span-2 space-y-6">
        <div className={`rounded-lg p-6 border transition-colors ${
          isDark 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-300"
        }`}>
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setError(""); // Clear error when user types
            }}
            onKeyDown={handleKeyPress}
            placeholder="Enter app name or describe what you want to do... (e.g., 'git', 'docker', 'install node')"
            className={`w-full bg-transparent resize-none outline-none text-lg ${
              isDark 
                ? "text-gray-300 placeholder-gray-500" 
                : "text-gray-900 placeholder-gray-400"
            }`}
            rows={3}
          />
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

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !inputText.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-medium py-4 px-6 rounded-lg transition-colors text-lg"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generating...</span>
            </span>
          ) : (
            "Generate Command"
          )}
        </button>

        {generatedCommand && (
          <>
            <div className={`rounded-lg p-6 border transition-colors ${
              isDark 
                ? "bg-gray-800 border-gray-700" 
                : "bg-white border-gray-300"
            }`}>
              <div className={`font-mono text-lg break-words ${
                isDark ? "text-green-400" : "text-green-600"
              }`}>
                {generatedCommand}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={copyCommand}
                disabled={!generatedCommand}
                className={`flex items-center space-x-2 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors border ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 text-gray-300 border-gray-700"
                    : "bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 border-gray-300"
                }`}
              >
                <Copy className="w-4 h-4" />
                <span>Copy Command</span>
              </button>

              {!isAuthenticated() && (
                <button
                  onClick={() => {
                    alert("Please login to save commands");
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors border ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700"
                      : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>Login to Save</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GenrateCommand;
