import { Users, Clock, Book, CheckCircle, Activity, Clock3 } from "lucide-react";
import { useState, useEffect } from "react";

const StaffDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-6 bg-white space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tasks Assigned"
          value="45"
          change="+5%"
          icon={<Activity className="w-6 h-6 text-white" />}
          bgFrom="from-indigo-500"
          bgTo="to-violet-600"
        />
        <StatCard
          title="Hours Worked"
          value="120h"
          change="+8%"
          icon={<Clock className="w-6 h-6 text-white" />}
          bgFrom="green-400"
          bgTo="to-emerald-600"
        />
        <StatCard
          title="Approvals Pending"
          value="12"
          change="+2%"
          icon={<CheckCircle className="w-6 h-6 text-white" />}
          bgFrom="from-cyan-500"
          bgTo="to-sky-600"
        />
        <StatCard
          title="Books Processed"
          value="78"
          change="+10%"
          icon={<Book className="w-6 h-6 text-white" />}
          bgFrom="from-amber-500"
          bgTo="to-orange-600"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-yellow-400/30">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black">📊 Task Overview</h2>
            <select className="border border-gray-300 rounded-md px-3 py-1 text-sm text-black focus:outline-none">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px] flex flex-col justify-center items-center bg-gray-50 rounded-md border-dashed border-2 border-yellow-400/40">
            <Activity className="text-yellow-500" size={100} />
            <p className="text-gray-600 mt-4 text-sm">Chart Coming Soon</p>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-yellow-400/30">
          <h2 className="text-xl font-semibold text-black mb-4">📋 Recent Activity</h2>
          <div className="space-y-5">
            {activities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Last Updated: {currentTime.toLocaleString("en-US", {
              timeZone: "Asia/Kolkata",
              hour12: true,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon, bgFrom, bgTo }) => {
  return (
    <div
      className={`bg-gradient-to-br ${bgFrom} ${bgTo} p-5 rounded-xl text-white shadow-md hover:shadow-lg transition-all cursor-pointer`}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <p className="text-sm mt-1 text-white/80">{change}</p>
        </div>
        <div className="p-2 bg-yellow-500/30 rounded-lg">{icon}</div>
      </div>
    </div>
  );
};

const ActivityItem = ({ user, action, time }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
        {user.charAt(0)}
      </div>
      <div>
        <p className="text-sm text-gray-700">
          <span className="font-medium text-black">{user}</span> {action}
        </p>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <Clock3 size={12} /> {time}
        </div>
      </div>
    </div>
  );
};

// Dummy Activity Feed Data
const activities = [
  { user: "John Doe", action: "completed a task", time: "10 minutes ago" },
  { user: "Sarah Smith", action: "submitted a report", time: "25 minutes ago" },
  { user: "Mike Johnson", action: "approved a request", time: "1 hour ago" },
  { user: "Anna Brown", action: "updated profile", time: "2 hours ago" },
  { user: "David Wilson", action: "logged work hours", time: "3 hours ago" },
];

export default StaffDashboard;