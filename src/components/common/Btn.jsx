import React from "react";

const Btn = ({
  text,
  disabled,
  children,
  onClick,
  type,
  customClass,
  bg,
  notPadding,
}) => {
  return (
    <button
      type={type}
      className={`rounded-lg font-semibold transition-all duration-500 transform hover:scale-[1.02] hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 animate-slide-up hover-lift   ${
        disabled
          ? "bg-purple-600/45 text-gray-400"
          : "bg-purple-600 text-white "
      } ${customClass}`}
      disabled={disabled}
      onClick={onClick}
      style={{
        background: bg,
        padding: notPadding ? 0 : "12px",
      }}
    >
      {text ? (
        text
      ) : (
        <span className="flex items-center gap-2">{children}</span>
      )}
    </button>
  );
};

export default Btn;
