import React, { useState } from "react";
import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  Settings,
  PenSquare,
  Zap,
  LogOut,
  X,
} from "lucide-react";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import Btn from "./Btn";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../services/operations/userAPI";
import dummyprofile from "../../assets/images/blankprofilepic.webp";
import { CreatePost } from "../../pages/CreatePost";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Explore", path: "/dashboard/explore" },
  { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
  { icon: Mail, label: "Messages", path: "/dashboard/messages" },
  { icon: Bookmark, label: "Bookmarks", path: "/dashboard/bookmarks" },
  { icon: User, label: "Profile", path: "/dashboard/profile" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export function Sidebar({ ref, isVisible, setIsVisible }) {
  const { token, user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [createPostModal, setCreatePostModal] = useState(false);

  const handleLogout = async () => {
    // console.log("token in sidebar => ", token);
    if (!token) return navigate("/login");
    dispatch(logout(token));
    setIsVisible(false);
  };

  const isSameRoute = (path) => {
    return matchPath(path, location.pathname);
  };

  return (
    <>
      <div
        className={`min-h-screen w-72 text-gray-300 bg-gray-800 z-10 fixed top-[0] transition-all duration-300 ${
          isVisible ? "right-0" : "-right-full"
        }`}
        ref={ref}
      >
        <div className="p-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-2 font-monts text-blue-500 text-2xl font-bold mb-8">
              <Zap />
              Talkto
            </div>

            <Btn
              onClick={() => setIsVisible(false)}
              notPadding={true}
              customClass={
                "items-start justify-start mt-1 hover:text-purple-600"
              }
              bg={"none"}
            >
              <X size={25} />
            </Btn>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 text-gray-300 ${
                  isSameRoute(item.path) ? "bg-gray-50 text-gray-800" : ""
                } hover:bg-gray-50 hover:text-gray-800 rounded-lg transition-colors duration-150`}
                onClick={() => setIsVisible(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className={
                "flex items-center w-full cursor-pointer justify-start px-4 py-3 gap-4 text-gray-300 hover:bg-gray-50 hover:text-gray-800 rounded-lg transition-colors duration-150"
              }
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>

          <Btn
            onClick={() => {
              setCreatePostModal(true);
              setIsVisible(false);
            }}
            customClass={"w-full mt-10"}
          >
            <PenSquare className="w-5 h-5" />
            <span className="font-semibold">Post</span>
          </Btn>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3 p-4 group hover:bg-gray-50 rounded-lg cursor-pointer">
              <img
                src={user?.profilePic || dummyprofile}
                alt="Profile"
                className="w-10 h-10 object-cover rounded-full"
              />
              <div className="flex-1">
                <p className="font-semibold text-sm capitalize group-hover:text-black">
                  {user?.name}
                </p>
                <p className="text-gray-500 text-sm">@{user?.username}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {createPostModal && (
        <CreatePost setCreatePostModal={setCreatePostModal} />
      )}
    </>
  );
}
