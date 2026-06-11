import React from "react";

export const CardComponent = ({ title, description, buttonText, onClick }) => {
  return (
    <div className="mb-6 h-full w-full overflow-hidden rounded-lg border border-gray-200 bg-white p-5 shadow sm:p-8 lg:max-w-xl">
      <div>
        <h5 className="mb-1 text-lg font-bold tracking-tight text-gray-900">
          {title}
        </h5>
      </div>
      <p className="mb-5 font-normal text-gray-700">
        {description}
      </p>
      <div className="flex justify-center">
        <button
          onClick={onClick}
          className="inline-flex h-11 w-full items-center justify-center rounded-xl border bg-teal-500 px-3 py-2 text-center text-base font-bold text-white transition-all duration-300 hover:bg-teal-600 sm:w-80"
        >
          {buttonText}
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
