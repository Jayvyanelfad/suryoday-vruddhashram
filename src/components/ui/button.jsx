import * as React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={
        "inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium transition-colors px-4 py-2 bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
