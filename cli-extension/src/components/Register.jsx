import React, { useState } from "react";
import {
  Settings,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Check,
} from "lucide-react";
import { registerUser } from "../services/api";

export default function Register({ theme, onRegister, onSwitchToLogin }) {
  const isDark = theme === "dark";
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (formData.username.trim().length > 30) {
      newErrors.username = "Username must be less than 30 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    setApiError(""); // Clear API error on validation
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError("");
    setSuccessMessage("");

    try {
      const data = await registerUser(formData);
      
      // If registration returns a token, user is automatically logged in
      if (data.token && data.user) {
        setSuccessMessage("Registration successful! Logging you in...");
        
        // Call onRegister callback to update parent state
        if (onRegister) {
          onRegister(data.user);
        }
        
        // Reload to refresh app state with logged-in user
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        // No token returned, redirect to login
        setSuccessMessage("Registration successful! Redirecting to login...");
        
        setTimeout(() => {
          if (onSwitchToLogin) {
            onSwitchToLogin();
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setApiError(error.message || "Registration failed. User may already exist.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-200 ${
      isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
    }`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
              <img
                src="https://res.cloudinary.com/dwemivxbp/image/upload/v1749876793/WhatsApp_Image_2025-06-14_at_10.15.25_AM_1_atltbj.png"
                alt="Command Pilot Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className={`text-3xl font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Command Pilot
            </h1>
          </div>
          <p className={`text-lg ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}>
            Create your account
          </p>
        </div>

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

        <div className="space-y-6">
          {/* Success Message */}
          {successMessage && (
            <div className={`border border-green-500 rounded-lg p-3 ${
              isDark ? "bg-green-900/50" : "bg-green-50"
            }`}>
              <p className={`text-sm ${
                isDark ? "text-green-400" : "text-green-700"
              }`}>
                {successMessage}
              </p>
            </div>
          )}

          {/* API Error Message */}
          {apiError && (
            <div className={`border border-red-500 rounded-lg p-3 ${
              isDark ? "bg-red-900/50" : "bg-red-50"
            }`}>
              <p className={`text-sm ${
                isDark ? "text-red-400" : "text-red-700"
              }`}>
                {apiError}
              </p>
            </div>
          )}

          {/* Full Name */}
          <div>
              <label
              htmlFor="username"
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className={`w-5 h-5 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`} />
              </div>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.username 
                    ? "border-red-500" 
                    : isDark 
                      ? "border-gray-700 bg-gray-800 text-white" 
                      : "border-gray-300 bg-white text-gray-900"
                }`}
                placeholder="Enter your username"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-400">{errors.username}</p>
            )}
          </div>

          {/* Email */}
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
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
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

          {/* Password */}
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
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.password 
                    ? "border-red-500" 
                    : isDark 
                      ? "border-gray-700 bg-gray-800 text-white" 
                      : "border-gray-300 bg-white text-gray-900"
                }`}
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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

          {/* Terms */}
          <div>
            <label className="flex items-start space-x-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    agreedToTerms
                      ? "bg-blue-600 border-blue-600"
                      : isDark
                        ? "border-gray-600 bg-gray-800"
                        : "border-gray-300 bg-white"
                  }`}
                >
                  {agreedToTerms && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <span className={`text-sm leading-5 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                I agree to the{" "}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-400">{errors.terms}</p>
            )}
          </div>

          {/* Register Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-lg"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Create Account</span>
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

        {/* Login Link */}
        <div className="text-center">
          <p className={`mt-4 text-sm ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}>
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
            >
              Login
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
