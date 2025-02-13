import React, { useState } from "react";
import {
  LogIn,
  UserPlus,
  Mail,
  Github,
  Twitter,
  Eye,
  EyeClosed,
} from "lucide-react";
import Btn from "../components/common/Btn";
import { useActionState } from "react";
import { login, register } from "../services/operations/userAPI";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, formAction, isPending] = useActionState(handleSubmit, null);

  async function handleSubmit(prev, formData) {
    const fields = {
      name: formData.get("name"),
      username: formData.get("username"),
      password: formData.get("password"),
    };

    const errors = {};

    for (const key in fields) {
      if (!fields[key] && (!isLogin || key !== "name")) {
        errors[key] = `Please enter ${key}`;
      }
    }
    if (Object.keys(errors).length) return errors;

    // API call
    if (isLogin) {
      dispatch(login(fields, navigate));
    } else {
      dispatch(register(fields, setIsLogin));
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] animate-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-xl lg:max-w-7xl flex items-center gap-16">
        <div className="hidden lg:block w-1/2 transition-all duration-500 ease-out animate-fade-in">
          <div className="relative group">
            <img
              src="https://images.unsplash.com/photo-1554177255-61502b352de3?auto=format&fit=crop&q=80&w=800"
              alt="Social Connection"
              className="rounded-2xl shadow-2xl animate-float group-hover:scale-[1.02] transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-500/20 to-transparent rounded-2xl group-hover:from-gray-600/50 transition-all duration-700" />
            <div className="absolute bottom-8 left-8 right-8 text-white transform group-hover:translate-y-[-5px] transition-all duration-700">
              <h2 className="text-3xl font-bold mb-2 animate-slide-up">
                Connect with friends
              </h2>
              <p className="text-lg opacity-90 animate-slide-up delay-100">
                Share your moments with the world
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2">
          <div className=" backdrop-blur-lg rounded-2xl shadow-2xl p-8 transform transition-all duration-500 ease-out animate-slide-in bg-gray-800 hover:bg-gray-900 animate-pulse-shadow form-card">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-200 mb-2 animate-slide-down">
                {isLogin ? "Welcome back!" : "Create account"}
              </h1>
              <p className="text-gray-400 animate-fade-in delay-200">
                {isLogin
                  ? "Sign in to connect with your friends"
                  : "Join the community today"}
              </p>
            </div>

            <form action={formAction} className="space-y-6">
              {!isLogin && (
                <div className="transform transition-all text-gray-300 duration-500 ease-out animate-slide-in">
                  <label className="block text-sm font-medium  mb-2">
                    Full Name
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-500 group-hover:border-purple-400 input-focus-effect"
                      placeholder="John Doe"
                    />
                    <UserPlus className="absolute right-3 top-3 h-5 w-5 text-gray-400 transition-colors duration-500 group-hover:text-purple-500 group-hover:rotate-12" />
                    <span className="text-sm text-red-500 ml-1">
                      {data?.name}
                    </span>
                  </div>
                </div>
              )}

              <div className="transform transition-all duration-500 text-gray-300 ease-out animate-slide-in delay-100">
                <label className="block text-sm font-medium  mb-2">
                  Username
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    name="username"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-500 group-hover:border-purple-400 input-focus-effect"
                    placeholder="John_Doe_123"
                  />
                  <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400 transition-all duration-500 group-hover:text-purple-500 group-hover:rotate-12" />
                  <span className="text-sm text-red-500 ml-1">
                    {data?.username}
                  </span>
                </div>
              </div>

              <div className="transform transition-all duration-500 text-gray-300 ease-out animate-slide-in delay-200">
                <label className="block text-sm font-medium  mb-2">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : `password`}
                    name="password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-500 group-hover:border-purple-400 input-focus-effect"
                    placeholder="••••••••"
                  />
                  <Btn
                    type={"button"}
                    notPadding={true}
                    bg={"none"}
                    customClass="absolute right-3 top-3 h-5 w-5 "
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeClosed className="text-gray-400  transition-all duration-500 group-hover:text-purple-500 group-hover:rotate-12" />
                    ) : (
                      <Eye className="text-gray-400  transition-all duration-500 group-hover:text-purple-500 group-hover:rotate-12" />
                    )}
                  </Btn>
                  <span className="text-sm text-red-500 ml-1">
                    {data?.password}
                  </span>
                </div>
              </div>

              <Btn customClass={`w-full`} disabled={isPending}>
                <LogIn className="h-5 w-5" />
                {isPending
                  ? "Submitting"
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </Btn>
            </form>

            <div className="mt-8 animate-fade-in delay-300">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 continue-with backdrop-blur-lg text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-gray-300">
                <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg transition-all duration-500 transform hover:scale-[1.02] hover:shadow-md hover:border-purple-300 hover-lift group">
                  <Github className="h-5 w-5 group-hover:rotate-12 transition-transform duration-500" />
                  <span className="font-medium">GitHub</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg transition-all duration-500 transform hover:scale-[1.02] hover:shadow-md hover:border-purple-300 hover-lift group">
                  <Twitter className="h-5 w-5 group-hover:rotate-12 transition-transform duration-500" />
                  <span className="font-medium">Twitter</span>
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-gray-300 animate-fade-in delay-400 flex items-center justify-center">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Btn
                type={"button"}
                notPadding={true}
                bg={"none"}
                onClick={() => setIsLogin(!isLogin)}
                customClass=" underline ml-1"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </Btn>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
