import React, { useState } from "react";
import {
  Settings,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";
import { loginUser } from "../services/api";

export default function Login({ theme, onLogin, onSwitchToRegister }) {
  const isDark = theme === "dark";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    setApiError(""); // Clear API error on validation
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError("");

    try {
      const data = await loginUser({ email, password });
      
      // Call onLogin callback with user data
      if (onLogin && data.user) {
        onLogin(data.user);
      }
      
      // Reload to refresh the app state
      window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
      setApiError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-200 ${
      isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
    }`}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
          
            <h1 className={`text-3xl font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Command Pilot
            </h1>
          </div>
          <p className={`text-lg ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}>
            Sign in to your account
          </p>
        </div>

        {/* Settings Icons */}
        <div className="flex justify-end space-x-3 mb-6">
          <Settings className={`w-5 h-5 cursor-pointer transition-colors ${
            isDark 
              ? "text-gray-400 hover:text-white" 
              : "text-gray-600 hover:text-gray-900"
          }`} />
          {isDark ? (
            <Sun className={`w-5 h-5 cursor-pointer transition-colors ${
              isDark 
                ? "text-gray-400 hover:text-yellow-400" 
                : "text-gray-600 hover:text-yellow-600"
            }`} />
          ) : (
            <Moon className={`w-5 h-5 cursor-pointer transition-colors ${
              isDark 
                ? "text-gray-400 hover:text-white" 
                : "text-gray-600 hover:text-gray-900"
            }`} />
          )}
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className={`w-5 h-5 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`} />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.email 
                    ? "border-red-500" 
                    : isDark 
                      ? "border-gray-700 bg-gray-800 text-white" 
                      : "border-gray-300 bg-white text-gray-900"
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className={`w-5 h-5 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`} />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.password 
                    ? "border-red-500" 
                    : isDark 
                      ? "border-gray-700 bg-gray-800 text-white" 
                      : "border-gray-300 bg-white text-gray-900"
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${
                  isDark 
                    ? "text-gray-400 hover:text-white" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {/* API Error Message */}
          {apiError && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-3">
              <p className="text-sm text-red-400">{apiError}</p>
            </div>
          )}

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <a
              href="#"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot your password?
            </a>
          </div>

          {/* Login Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-lg"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className={`flex-1 border-t ${
            isDark ? "border-gray-700" : "border-gray-300"
          }`}></div>
          <span className={`px-4 text-sm ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}>
            or
          </span>
          <div className={`flex-1 border-t ${
            isDark ? "border-gray-700" : "border-gray-300"
          }`}></div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className={`text-sm mt-4 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}>
            Don't have an account?{" "}
            <button
              className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              onClick={onSwitchToRegister}
            >
              Register here
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className={`text-sm ${
            isDark ? "text-gray-600" : "text-gray-400"
          }`}>
            © 2025 Command Pilot. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
