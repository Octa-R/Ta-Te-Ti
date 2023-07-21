import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded max-w-md max-h-md w-full h-14 transition-all duration-300 ease-in-out"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
