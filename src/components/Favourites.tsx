import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../api';
import { ReactComponent as FavouritesIcon } from '../assets/images/Favourites.svg';
import loadingGif from './../assets/images/loadingGif.gif';
import { useQuery } from '@tanstack/react-query';
import { Product } from '../models';

export const Favourites: React.FC = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() => {
        const savedFavorites =
            JSON.parse(localStorage.getItem('Royce_favorites') || '[]') || [];
        setFavorites(savedFavorites);
    }, []);
    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => fetchData<Product[]>('products', { _sort: 'name' }),
    });

    const handleRemoveFavorite = (id: number) => {
        const updatedFavorites = favorites.filter((favId) => favId !== id);
        setFavorites(updatedFavorites);
        localStorage.setItem(
            'Royce_favorites',
            JSON.stringify(updatedFavorites)
        );
    };

    const handleImageClick = (flower: Product) => {
        navigate('/flower-details', { state: { product: flower } });
    };

    const renderFavorites = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center pt-32">
                    <img
                        src={loadingGif}
                        alt="Завантаження..."
                        className="w-16 h-16"
                    />
                </div>
            );
        }

        if (favorites.length === 0) {
            return (
                <p className="text-center">
                    Нажаль, у вас немає улюблених товарів
                </p>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {favorites.map((favId) => {
                    const flower = products?.find(
                        (product) => product.id === favId
                    );

                    if (!flower) {
                        return null;
                    }

                    return (
                        <div
                            key={flower.id}
                            className="border border-black rounded-lg p-4 bg-gray-100 text-black flex flex-col items-center"
                        >
                            <img
                                src={
                                    flower.images[0]?.src || 'default-image-url'
                                }
                                alt={flower.name}
                                className="w-72 h-48 object-cover rounded-md mb-2 cursor-pointer"
                                onClick={() => handleImageClick(flower)}
                            />
                            <h3 className="text-lg font-bold text-center">
                                {flower.name}
                            </h3>
                            <div className="flex items-center">
                                <FavouritesIcon
                                    className="w-6 h-6 ml-2 cursor-pointer text-purple"
                                    onClick={() =>
                                        handleRemoveFavorite(flower.id)
                                    }
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="text-center sticky top-0 bg-white w-full z-10 p-6">
            <h1 className="text-xl font-bold text-center">Улюблені товари</h1>
            <div className="mb-2 border-b border-black pb-2"></div>
            <div className="h-[80vh] overflow-y-scroll pb-20">
                {renderFavorites()}
            </div>
        </div>
    );
};
