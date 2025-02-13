import { Bell, Home, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sidebar } from "./common/Sidebar";
import dummyprofile from "../assets/images/blankprofilepic.webp";
import Btn from "./common/Btn";
import useClickOutside from "../hooks/useClickOutside";
import { useSelector } from "react-redux";

export default function Navbar() {
  const { token, user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { isVisible, setIsVisible, ref } = useClickOutside();

  const handleClickProfile = () => {
    if (!token) {
      return navigate("/login");
    }
    setIsVisible(true);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl sm:text-2xl font-monts font-bold text-blue-500 flex gap-1 items-center"
            >
              <Zap />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block ml-10">
              <input type="text" placeholder="Search..." className="formData" />
            </div>
            <NavIcon
              icon={<Home className="h-5 w-5" />}
              label="Notifications"
              path={"/"}
            />
            <NavIcon
              icon={<Bell className="h-5 w-5" />}
              label="Notifications"
              path={"/notifications"}
            />
            <Btn bg={"transparent"} onClick={handleClickProfile}>
              <img
                src={user?.profilePic || dummyprofile}
                alt="profile"
                className="w-7 h-7 rounded-full object-cover"
              />
            </Btn>
          </div>
        </div>
      </div>
      <Sidebar ref={ref} isVisible={isVisible} setIsVisible={setIsVisible} />
    </nav>
  );
}

function NavIcon({ icon, label, path, customClass }) {
  return (
    <Link
      to={path}
      className={`text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-600 ${customClass}`}
    >
      <span className="sr-only">{label}</span>
      {icon}
    </Link>
  );
}
