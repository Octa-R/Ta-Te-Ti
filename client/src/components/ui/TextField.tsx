import React from 'react';

type TextFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
};

export const TextField: React.FC<TextFieldProps> = ({ label, value, onChange }) => {
    return (
        <div className="flex flex-col max-w-md max-h-md w-full">
            <label className="text-xl font-bold text-gray-200 uppercase mb-2">{label}</label>
            <input
                type="text"
                className="py-3 px-4 text-lg font-bold rounded-lg bg-blue-100 focus:bg-white border border-gray-300 focus:border-blue-500 shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-gray-900 "
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};
