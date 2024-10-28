import React from 'react';
import mobile from './../assets/images/mobile.svg';

export const ContactUs: React.FC = () => {
    const phoneNumber = '+380123456789';

    return (
        <div className="flex flex-col items-center mt-6 mb-4 justify-center p-4 border border-black rounded bg-white text-black shadow-lg">
            <p className="text-center mb-2">
                Якщо у вас виникли запитання, не вагайтесь нас контактувати
            </p>
            <div className="flex items-center space-x-2">
                <img src={mobile} alt="mobile" className="w-8 h-8"></img>
                <a
                    href={`tel:${phoneNumber}`}
                    className="text-lg hover:text-gray-600"
                >
                    {phoneNumber}
                </a>
            </div>
        </div>
    );
};
