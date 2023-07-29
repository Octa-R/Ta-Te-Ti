import React, { useState } from 'react';

const Selector = () => {
    const [selectedOption, setSelectedOption] = useState('X');

    const handleOptionChange = (option: React.SetStateAction<string>) => {
        setSelectedOption(option);
    };

    return (
        <div className="flex justify-center items-center space-x-4">
            <button
                className={`py-4 px-6 rounded-full text-lg font-bold ${selectedOption === 'X' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                onClick={() => handleOptionChange('X')}
                style={{ outline: 'none' }}
            >
                X
            </button>
            <button
                className={`py-4 px-6 rounded-full text-lg font-bold ${selectedOption === 'O' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                onClick={() => handleOptionChange('O')}
                style={{ outline: 'none' }}
            >
                O
            </button>
        </div>
    );
};

export default Selector;

