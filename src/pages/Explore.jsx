import React, { useState } from "react";
import {
  TrendingUp as Trending,
  Users,
  Hash,
  ExternalLink,
  Search,
} from "lucide-react";
import Categories from "../components/core/Dashboard/Explore/Categories";
import Btn from "../components/common/Btn";

const trendingTopics = [
  { tag: "technology", posts: 12500 },
  { tag: "photography", posts: 8900 },
  { tag: "travel", posts: 7600 },
  { tag: "food", posts: 6300 },
  { tag: "art", posts: 5200 },
];

const suggestedUsers = [
  {
    id: "1",
    name: "Sarah Wilson",
    username: "sarahcreates",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    followers: 12400,
  },
  {
    id: "2",
    name: "David Chen",
    username: "davidtech",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    followers: 8900,
  },
  {
    id: "3",
    name: "Emma Thompson",
    username: "emmaphotography",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    followers: 15600,
  },
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCategories, setShowCategories] = useState(false);

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people, topics, or keywords..."
              className="formData !pl-12 !py-4"
            />
          </div>

          <h1 className="text-3xl font-bold dark:text-gray-50">Explore</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Trending Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-6">
                <Trending className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-400">
                  Trending Now
                </h2>
              </div>
              <div className="space-y-4">
                {trendingTopics.map((topic) => (
                  <div
                    key={topic.tag}
                    className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <Hash className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-500 group-hover:text-blue-500">
                        #{topic.tag}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {topic.posts.toLocaleString()} posts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Content */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
                <div className="flex items-center mb-6">
                  <Users className="w-6 h-6 text-blue-500 mr-2" />
                  <h2 className="text-xl font-semibold dark:text-gray-400 text-gray-900">
                    Suggested Users
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {suggestedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-4 p-4 rounded-lg border border-gray-500 hover:border-blue-100 transition-colors"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium dark:text-gray-100 text-gray-900">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          @{user.username}
                        </p>
                        <p className="text-xs text-gray-400">
                          {user.followers.toLocaleString()} followers
                        </p>
                      </div>
                      <Btn>Follow</Btn>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Discover More</h2>
                  <ExternalLink className="w-6 h-6" />
                </div>
                <p className="text-blue-100 mb-6">
                  Explore trending topics, connect with creators, and join the
                  conversation.
                </p>
                <button
                  onClick={() => setShowCategories(true)}
                  className="px-6 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-opacity-90 transition-opacity"
                >
                  Browse Categories
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCategories && (
        <Categories onClose={() => setShowCategories(false)} />
      )}
    </div>
  );
};

export default Explore;
