import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as HomeIcon } from '../assets/images/homeIcon.svg';
import { ReactComponent as CartIcon } from '../assets/images/CartIcon.svg';
import { ReactComponent as FavouritesIcon } from '../assets/images/Favourites.svg';

interface BottomMenuProps {
    currentScreen: string; // Define the type for the currentScreen prop
}

export const BottomMenu: React.FC<BottomMenuProps> = React.memo(
    ({ currentScreen }) => {
        const navigate = useNavigate();

        const handleHomeClick = () => navigate('/');
        const handleFavouritesClick = () => navigate('/favourites');
        const handleCartClick = () => navigate('/cart');

        return (
            <div className="fixed bottom-0 left-0 right-0 bg-black h-20 flex justify-around items-center z-10">
                <button
                    onClick={handleHomeClick}
                    className="flex flex-col items-center focus:outline-none"
                >
                    <HomeIcon
                        className={`w-6 h-6 mb-1 ${currentScreen === '/' ? 'fill-current text-purple' : 'text-white'}`}
                    />
                    <span className="text-sm text-white">Головна</span>
                </button>

                <button
                    onClick={handleFavouritesClick}
                    className="flex flex-col items-center focus:outline-none"
                >
                    <FavouritesIcon
                        className={`w-6 h-6 mb-1 ${currentScreen === '/favourites' ? 'fill-current text-purple' : 'text-white'}`}
                    />
                    <span className="text-sm text-white">Улюблене</span>
                </button>

                <button
                    onClick={handleCartClick}
                    className="flex flex-col items-center focus:outline-none"
                >
                    <CartIcon
                        className={`w-6 h-6 mb-1 ${currentScreen === '/cart' ? 'fill-current text-purple' : 'text-white'}`}
                    />
                    <span className="text-sm text-white">Кошик</span>
                </button>
            </div>
        );
    }
);
