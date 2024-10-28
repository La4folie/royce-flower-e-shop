import React, { useState } from 'react';

export const HintToBoyfriend: React.FC = () => {
    const [hint, setHint] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHint(e.target.value);
    };

    const handleSubmit = () => {
        alert(`Ваш намек: ${hint}`);
        setHint('');
    };

    return (
        <div className="text-center">
            <input
                type="text"
                value={hint}
                onChange={handleInputChange}
                placeholder="Введите намек"
                className="border border-gray-400 p-2 rounded-lg mb-4 w-3/4"
            />
            <button
                onClick={handleSubmit} // Handle button click
                className="bg-purple-600 text-white py-2 px-4 rounded-lg"
            >
                Отправить
            </button>
        </div>
    );
};
