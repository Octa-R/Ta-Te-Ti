import React from 'react';

type TextFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
};

export const TextField: React.FC<TextFieldProps> = ({ label, value, onChange }) => {
    return (
        <div className="text-white font-bold py-2 px-4 rounded max-w-xs max-h-xs">
            <label className="block text-sm font-medium text-gray-700 uppercase">{label}</label>
            <input
                type="text"
                className="mt-1 block w-full bg-slate-600 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-950 p-2"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};