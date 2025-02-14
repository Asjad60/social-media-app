import "./App.css";
import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
import { Routes, Route, useNavigate } from "react-router-dom";
import Footer from "./pages/Footer";
import Login from "./pages/Login";
// import Wrapper from "./components/common/Wrapper";
import PrivateRoute from "./components/common/PrivateRoute";
import OpenRoute from "./components/common/OpenRoute";
// import Profile from "./pages/Profile";
import { lazy, Suspense, useEffect } from "react";
import { getUserDetails } from "./services/operations/userAPI";
import { useDispatch, useSelector } from "react-redux";
import AuthSuccess from "./pages/AuthSuccess";

const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const Wrapper = lazy(() => import("./components/common/Wrapper"));

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    (() => {
      if (!token) return;
      dispatch(getUserDetails(token, navigate));
    })();
  }, []);

  return (
    <div className="font-roboto flex flex-col min-h-screen w-screen bg-gradient-to-br from-gray-950 via-gray-800 to-gray-950">
      <header className="sticky top-0 z-[1000]">
        <Navbar />
      </header>

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <Suspense
                fallback={
                  <div className="text-2xl font-monts text-gray-300 min-h-[calc(100vh-64px)] w-screen grid place-items-center">
                    Loading...
                  </div>
                }
              >
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />
          <Route
            path="/auth-success"
            element={
              <OpenRoute>
                <AuthSuccess />
              </OpenRoute>
            }
          />
          <Route
            element={
              <PrivateRoute>
                <Suspense
                  fallback={
                    <div className="text-2xl font-monts text-gray-300 min-h-[calc(100vh-64px)] w-screen grid place-items-center">
                      Loading...
                    </div>
                  }
                >
                  <Wrapper />
                </Suspense>
              </PrivateRoute>
            }
          >
            <Route path="/dashboard/profile" element={<Profile />}></Route>
          </Route>
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
