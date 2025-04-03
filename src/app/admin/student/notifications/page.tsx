import React from "react";

const NotificationsPage = () => {
  const notifications = [
    {
      id: 1,
      user: "Prof. Sarah Johnson",
      message: "responded to your application",
      details: 'Your application for "AI in Healthcare Research" has been reviewed.',
      time: "2m ago",
    },
    {
      id: 2,
      user: "Dr. Michael Chen",
      message: "posted a new project",
      details: "New research opportunity in Quantum Computing available.",
      time: "1h ago",
    },
    {
      id: 3,
      user: "System Update",
      message: "New features have been added to the platform.",
      details: "Learn More",
      time: "1d ago",
    },
  ];

  const messages = [
    {
      id: 1,
      user: "Prof. Sarah Johnson",
      message: "Thank you for your interest in the project...",
      time: "5m ago",
    },
    {
      id: 2,
      user: "Dr. Michael Chen",
      message: "Let's schedule a meeting to discuss...",
      time: "2h ago",
    },
  ];

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Notifications Column */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Notifications</h1>
          <button className="text-blue-500 hover:underline">Mark all as read</button>
        </div>
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <p className="font-semibold">{notification.user} <span className="text-gray-600">{notification.message}</span></p>
              <p className="text-gray-700">{notification.details}</p>
              <p className="text-sm text-gray-500">{notification.time}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Messages Column */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-4">Messages</h1>
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li key={msg.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
              <p className="font-semibold">{msg.user}</p>
              <p className="text-gray-700">{msg.message}</p>
              <p className="text-sm text-gray-500">{msg.time}</p>
            </li>
          ))}
        </ul>
        <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
          New Message
        </button>
      </div>
    </div>
  );
};

export default NotificationsPage;
