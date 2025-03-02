import React from "react";
import {
  Camera,
  Code,
  Music,
  Palette,
  Utensils,
  Globe,
  BookOpen,
  Dumbbell,
  Film,
  Users,
} from "lucide-react";

const categories = [
  {
    id: "1",
    name: "Photography",
    icon: <Camera className="w-6 h-6" />,
    posts: 125000,
    followers: 45000,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "2",
    name: "Technology",
    icon: <Code className="w-6 h-6" />,
    posts: 98000,
    followers: 62000,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "3",
    name: "Music",
    icon: <Music className="w-6 h-6" />,
    posts: 85000,
    followers: 38000,
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "4",
    name: "Art",
    icon: <Palette className="w-6 h-6" />,
    posts: 76000,
    followers: 29000,
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "5",
    name: "Food",
    icon: <Utensils className="w-6 h-6" />,
    posts: 92000,
    followers: 51000,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "6",
    name: "Travel",
    icon: <Globe className="w-6 h-6" />,
    posts: 68000,
    followers: 42000,
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: "7",
    name: "Education",
    icon: <BookOpen className="w-6 h-6" />,
    posts: 45000,
    followers: 28000,
    color: "from-red-500 to-pink-500",
  },
  {
    id: "8",
    name: "Fitness",
    icon: <Dumbbell className="w-6 h-6" />,
    posts: 56000,
    followers: 34000,
    color: "from-orange-500 to-amber-500",
  },
  {
    id: "9",
    name: "Entertainment",
    icon: <Film className="w-6 h-6" />,
    posts: 88000,
    followers: 47000,
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "10",
    name: "Community",
    icon: <Users className="w-6 h-6" />,
    posts: 72000,
    followers: 39000,
    color: "from-blue-500 to-indigo-500",
  },
];

const Categories = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex  justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl h-[calc(100vh-64px)] mt-12 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              Browse Categories
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-10 group-hover:opacity-15 transition-opacity`}
                />
                <div className="relative p-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-full bg-gradient-to-r ${category.color} text-white`}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {category.name}
                      </h3>
                      <div className="mt-1 flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          {category.posts.toLocaleString()} posts
                        </span>
                        <span className="text-sm text-gray-500">
                          {category.followers.toLocaleString()} followers
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="mt-4 w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors text-sm font-medium">
                    View Category
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
