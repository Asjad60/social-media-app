import {
  Facebook,
  Heart,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
  Youtube,
  Zap,
} from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl flex gap-1 items-center font-monts font-bold text-blue-500 mb-4 animate-slide-up">
              <Zap />
              TALKto
            </h3>
            <p className="text-gray-400 animate-slide-up delay-100">
              Connecting people through meaningful social interactions and
              shared experiences.
            </p>
            <div className="flex space-x-4 animate-slide-up delay-200">
              <a
                href="#"
                className="hover:text-purple-500 transition-colors duration-300 hover-lift"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover:text-purple-500 transition-colors duration-300 hover-lift"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover:text-purple-500 transition-colors duration-300 hover-lift"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover:text-purple-500 transition-colors duration-300 hover-lift"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover:text-purple-500 transition-colors duration-300 hover-lift"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4 animate-slide-up">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {["About Us", "Features", "Pricing", "Blog", "Contact"].map(
                (item, index) => (
                  <li
                    key={item}
                    className={`animate-slide-up delay-${(index + 1) * 100}`}
                  >
                    <a
                      href="#"
                      className="hover:text-purple-500 transition-colors duration-300 hover-lift block"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4 animate-slide-up">
              Contact Us
            </h4>
            <div className="space-y-3">
              <p className="flex items-center space-x-3 animate-slide-up delay-100">
                <MapPin className="min-w-5 min-h-5 text-purple-500" />
                <span>char darwaza, jaipur Rajasthan, 302002</span>
              </p>
              <p className="flex items-center space-x-3 animate-slide-up delay-200">
                <Phone className="min-w-5 min-h-5 text-purple-500" />
                <span>+917014293992</span>
              </p>
              <p className="flex items-center space-x-3 animate-slide-up delay-300">
                <Mail className="min-w-5 min-h-5 text-purple-500" />
                <span>mohdasjad955@gmail.com</span>
              </p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4 animate-slide-up">
              Newsletter
            </h4>
            <p className="text-gray-400 animate-slide-up delay-100">
              Subscribe to our newsletter for updates and news.
            </p>
            <form className="flex animate-slide-up delay-200">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 text-white px-4 outline-none py-2 rounded-l-lg  w-full"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-lg transition-colors duration-300 hover-lift flex items-center"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Talkto. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <p className="text-gray-400 text-sm flex items-center">
                Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> by
                Asjad
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
