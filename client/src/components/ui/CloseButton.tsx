import React from 'react';

interface CloseButtonProps {
    onClick: () => void;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="w-12 h-12 shadow-lg flex items-center justify-center rounded-full bg-slate-600 hover:bg-slate-500 text-black focus:outline-none border-2 border-slate-500"
        >
            <svg
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>
    );
};
