import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Command,
  Bookmark,
  BarChart3,
  Settings,
  Copy,
  Trash,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getStoredUser, getUserProfile, isAuthenticated } from "../services/api";

const Profile = ({ theme, onBack }) => {
  const isDark = theme === "dark";
  const storedUser = getStoredUser();
  const [activeTab, setActiveTab] = useState("saved");
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated()) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const data = await getUserProfile();
        setProfileData(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Calculate stats from profile data
  const calculateStats = () => {
    if (!profileData?.profile) {
      return {
        totalCommandsGenerated: 0,
        totalCommandsSaved: 0,
        commandsThisMonth: 0,
        favoriteOS: "N/A",
        accountCreated: profileData?.profile?.createdAt || new Date().toISOString(),
        lastActive: profileData?.profile?.updatedAt || new Date().toISOString(),
        successRate: 0,
        streakDays: 0,
      };
    }

    const { profile } = profileData;
    const commands = profile.commands || [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Calculate commands this month
    const commandsThisMonth = commands.filter((cmd) => {
      const cmdDate = new Date(cmd.createdAt);
      return (
        cmdDate.getMonth() === currentMonth &&
        cmdDate.getFullYear() === currentYear
      );
    }).length;

    // Calculate favorite OS
    const osCounts = {};
    commands.forEach((cmd) => {
      const os = cmd.os || "unknown";
      osCounts[os] = (osCounts[os] || 0) + 1;
    });
    const favoriteOS =
      Object.keys(osCounts).length > 0
        ? Object.keys(osCounts).reduce((a, b) =>
            osCounts[a] > osCounts[b] ? a : b
          )
        : "N/A";

    // Calculate streak (simplified - consecutive days with commands)
    let streakDays = 0;
    if (commands.length > 0) {
      const sortedCommands = [...commands].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let currentStreak = 0;
      let checkDate = new Date(today);
      
      for (let i = 0; i < sortedCommands.length; i++) {
        const cmdDate = new Date(sortedCommands[i].createdAt);
        cmdDate.setHours(0, 0, 0, 0);
        
        if (cmdDate.getTime() === checkDate.getTime()) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (cmdDate.getTime() < checkDate.getTime()) {
          break;
        }
      }
      streakDays = currentStreak;
    }

    return {
      totalCommandsGenerated: profile.totalCommands || commands.length,
      totalCommandsSaved: commands.length,
      commandsThisMonth,
      favoriteOS: favoriteOS.charAt(0).toUpperCase() + favoriteOS.slice(1),
      accountCreated: profile.createdAt,
      lastActive: profile.updatedAt,
      successRate: 95, // Default or calculate from actual data
      streakDays,
    };
  };

  // Calculate weekly activity from commands
  const calculateWeeklyActivity = () => {
    if (!profileData?.profile?.commands) {
      return [
        { day: "Mon", commands: 0, saved: 0 },
        { day: "Tue", commands: 0, saved: 0 },
        { day: "Wed", commands: 0, saved: 0 },
        { day: "Thu", commands: 0, saved: 0 },
        { day: "Fri", commands: 0, saved: 0 },
        { day: "Sat", commands: 0, saved: 0 },
        { day: "Sun", commands: 0, saved: 0 },
      ];
    }

    const commands = profileData.profile.commands;
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyData = dayNames.map((day) => ({ day, commands: 0, saved: 0 }));

    commands.forEach((cmd) => {
      const cmdDate = new Date(cmd.createdAt);
      if (cmdDate >= weekStart) {
        const dayIndex = cmdDate.getDay();
        weeklyData[dayIndex].commands++;
        weeklyData[dayIndex].saved++;
      }
    });

    return weeklyData;
  };

  // Calculate monthly trend from commands
  const calculateMonthlyTrend = () => {
    if (!profileData?.profile?.commands) {
      return [];
    }

    const commands = profileData.profile.commands;
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyCounts = {};
    commands.forEach((cmd) => {
      const cmdDate = new Date(cmd.createdAt);
      const monthKey = `${monthNames[cmdDate.getMonth()]}`;
      monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
    });

    // Get last 6 months
    const now = new Date();
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = monthNames[date.getMonth()];
      last6Months.push({
        month: monthName,
        commands: monthlyCounts[monthName] || 0,
      });
    }

    return last6Months;
  };

  // Calculate OS distribution from commands
  const calculateOSDistribution = () => {
    if (!profileData?.profile?.commands) {
      return [
        { name: "Linux", value: 0, color: "#3b82f6" },
        { name: "Windows", value: 0, color: "#10b981" },
        { name: "macOS", value: 0, color: "#8b5cf6" },
      ];
    }

    const commands = profileData.profile.commands;
    const osCounts = {};
    commands.forEach((cmd) => {
      const os = cmd.os || "unknown";
      const osName =
        os === "linux"
          ? "Linux"
          : os === "windows"
          ? "Windows"
          : os === "mac" || os === "macos"
          ? "macOS"
          : "Other";
      osCounts[osName] = (osCounts[osName] || 0) + 1;
    });

    const total = commands.length;
    const osData = [
      {
        name: "Linux",
        value: total > 0 ? Math.round((osCounts["Linux"] || 0) / total * 100) : 0,
        color: "#3b82f6",
      },
      {
        name: "Windows",
        value: total > 0 ? Math.round((osCounts["Windows"] || 0) / total * 100) : 0,
        color: "#10b981",
      },
      {
        name: "macOS",
        value: total > 0 ? Math.round((osCounts["macOS"] || 0) / total * 100) : 0,
        color: "#8b5cf6",
      },
    ].filter((item) => item.value > 0);

    return osData.length > 0 ? osData : [
      { name: "No Data", value: 100, color: "#9ca3af" },
    ];
  };

  const profileStats = calculateStats();
  const commands = profileData?.profile?.commands || [];
  const weeklyData = calculateWeeklyActivity();
  const monthlyData = calculateMonthlyTrend();
  const osData = calculateOSDistribution();
  const user = profileData?.profile || storedUser;

  const tabs = [
    { id: "saved", label: "Saved", icon: Bookmark },
    { id: "stats", label: "Statistics", icon: BarChart3 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className={`text-center p-6 rounded-lg ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}>
          <p className={`${isDark ? "text-red-400" : "text-red-600"}`}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className={`flex items-center space-x-2 mb-6 px-3 py-2 rounded-lg transition-colors ${
            isDark
              ? "hover:bg-gray-800 text-gray-300 hover:text-white"
              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        {/* Profile Header - Instagram Style */}
        <div className="mb-8 pb-8 border-b border-gray-700/50">
          {/* Username and Action Buttons */}
          <div className="flex items-center justify-between mb-6">
            <h1
              className={`text-2xl sm:text-3xl font-light ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {user?.username || user?.email?.split("@")[0] || "guest_user"}
            </h1>
         
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-12 mb-6">
            <div className="text-center">
              <span
                className={`block text-2xl sm:text-3xl font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {profileStats.totalCommandsGenerated}
              </span>
              <span
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                commands
              </span>
            </div>
            <div className="text-center">
              <span
                className={`block text-2xl sm:text-3xl font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {profileStats.totalCommandsSaved}
              </span>
              <span
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                saved
              </span>
            </div>
            <div className="text-center">
              <span
                className={`block text-2xl sm:text-3xl font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {profileStats.streakDays}
              </span>
              <span
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                day streak
              </span>
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-2">
            <p
              className={`font-semibold text-sm ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {user?.username || "Command Pilot User"}
            </p>
            <p
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {user?.email || "Not logged in"}
            </p>
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Favorite OS: {profileStats.favoriteOS} • Member since{" "}
              {new Date(profileStats.accountCreated).getFullYear()}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-0 border-b border-gray-700/50 mb-0">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-8 py-4 border-b-2 transition-colors ${
                  isActive
                    ? isDark
                      ? "border-white text-white"
                      : "border-gray-900 text-gray-900"
                    : isDark
                    ? "border-transparent text-gray-400 hover:text-gray-300"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "saved" && (
          <div className="mt-6 space-y-3">
            {commands.length === 0 ? (
              <div className="text-center py-12">
                <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  No saved commands yet
                </p>
              </div>
            ) : (
              commands.map((cmd) => (
                <div
                  key={cmd._id}
                  className={`rounded-lg border p-4 transition-colors ${
                    isDark
                      ? "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Command
                          className={`w-5 h-5 flex-shrink-0 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <h3
                          className={`font-semibold text-base ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {cmd.appName}
                        </h3>
                      </div>
                      <div
                        className={`font-mono text-sm mb-2 ${
                          isDark ? "text-green-400" : "text-green-600"
                        }`}
                      >
                        {cmd.command}
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div
                          className={`flex items-center gap-1 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(cmd.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded ${
                            isDark
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {cmd.os || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(cmd.command);
                          alert("Command copied to clipboard!");
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                            : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        }`}
                        title="Copy command"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-8 mt-8">
            {/* Weekly Activity Chart */}
            <div
              className={`rounded-lg border p-6 ${
                isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Weekly Activity
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }}
                    stroke={isDark ? "#4b5563" : "#d1d5db"}
                  />
                  <YAxis
                    tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }}
                    stroke={isDark ? "#4b5563" : "#d1d5db"}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1f2937" : "#ffffff",
                      border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
                      borderRadius: "8px",
                      color: isDark ? "#ffffff" : "#111827",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ color: isDark ? "#ffffff" : "#111827" }}
                  />
                  <Bar dataKey="commands" fill="#3b82f6" name="Generated" />
                  <Bar dataKey="saved" fill="#10b981" name="Saved" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Trend Chart */}
            <div
              className={`rounded-lg border p-6 ${
                isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Monthly Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }}
                    stroke={isDark ? "#4b5563" : "#d1d5db"}
                  />
                  <YAxis
                    tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }}
                    stroke={isDark ? "#4b5563" : "#d1d5db"}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1f2937" : "#ffffff",
                      border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
                      borderRadius: "8px",
                      color: isDark ? "#ffffff" : "#111827",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="commands"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* OS Distribution Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className={`rounded-lg border p-6 ${
                  isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-6 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  OS Distribution
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={osData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {osData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#1f2937" : "#ffffff",
                        border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
                        borderRadius: "8px",
                        color: isDark ? "#ffffff" : "#111827",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
              <div
                className={`rounded-lg border p-6 ${
                  isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                <div
                  className={`text-3xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {profileStats.totalCommandsGenerated}
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Commands Generated
                </div>
              </div>
              <div
                className={`rounded-lg border p-6 ${
                  isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                <div
                  className={`text-3xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {profileStats.totalCommandsSaved}
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Commands Saved
                </div>
              </div>
              <div
                className={`rounded-lg border p-6 ${
                  isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                <div
                  className={`text-3xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {profileStats.successRate}%
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Success Rate
                </div>
              </div>
              <div
                className={`rounded-lg border p-6 ${
                  isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                <div
                  className={`text-3xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {profileStats.commandsThisMonth}
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  This Month
                </div>
              </div>
              </div>
            </div>

            {/* Additional Info */}
            <div
              className={`rounded-lg border p-6 ${
                isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Account Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div
                    className={`text-xs mb-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Account Created
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {new Date(profileStats.accountCreated).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div
                    className={`text-xs mb-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Last Active
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {new Date(profileStats.lastActive).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div
                    className={`text-xs mb-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Favorite OS
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {profileStats.favoriteOS}
                  </div>
                </div>
                <div>
                  <div
                    className={`text-xs mb-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Current Streak
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {profileStats.streakDays} days
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
