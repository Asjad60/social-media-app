import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Btn from "../Btn";

export function Modal({ isOpen, onClose, title, children }) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`relative text-white  bg-gray-800 rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-x-hidden overflow-y-auto transition-all duration-200 ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b ">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Btn onClick={onClose} bg={"none"} customClass="">
            <X className="w-5 h-5" />
          </Btn>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}
