import React from "react";

export const Modal = ({ open, onClose, children }) => {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-10 flex items-center justify-center overflow-y-auto p-3 ${
        open ? "visible bg-black/50 " : "invisible"
      }`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`my-auto flex max-h-[95vh] w-full max-w-2xl flex-col items-end overflow-y-auto rounded-lg bg-white transition-all ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="sticky top-0 z-20 h-12 w-12 bg-teal-600 text-2xl font-bold text-white transition-all hover:bg-teal-700"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};
