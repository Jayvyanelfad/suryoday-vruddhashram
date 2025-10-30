import * as React from "react";

export function DropdownMenu({ children }) {
  return <div className="relative inline-block">{children}</div>;
}

export function DropdownMenuTrigger({ asChild, children }) {
  return asChild ? children : <button>{children}</button>;
}

export function DropdownMenuContent({ children, align }) {
  return (
    <div
      className="absolute mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10"
      style={{ right: align === "end" ? 0 : "auto" }}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, onClick, className = "" }) {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-2 hover:bg-green-100 cursor-pointer select-none ${className}`}
    >
      {children}
    </div>
  );
}
