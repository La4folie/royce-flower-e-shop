import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../api';
import loadingGif from './../assets/images/loadingGif.gif';
import { useQuery } from '@tanstack/react-query';
import { Categories } from '../models';

export const FlowerCategories: React.FC = () => {
    const navigate = useNavigate();

    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: () =>
            fetchData<Categories[]>('products/categories', { _sort: 'name' }),
    });

    const handleCategoryClick = (categoryId: number) => {
        navigate(`/products/${categoryId}`);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center pt-20">
                <img
                    src={loadingGif}
                    alt="Завантаження..."
                    className="w-16 h-16"
                />
            </div>
        );
    }

    return (
        <div className="grid rounded-lg grid-rows-1 gap-2">
            {categories?.map((categories) => (
                <div
                    key={categories.id}
                    className="flex items-center justify-between border rounded-lg p-1 bg-gray-100 text-black w-full"
                >
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <h3 className="text-lg font-bold">{categories.name}</h3>
                        <button
                            onClick={() => handleCategoryClick(categories.id)}
                            className="bg-black text-sm text-white rounded-lg py-2 px-4 mt-2"
                        >
                            Вибрати
                        </button>
                    </div>
                    <div className="flex-1">
                        <img
                            src={
                                categories.image
                                    ? categories.image.src
                                    : 'default-image-url'
                            }
                            alt={categories.name}
                            className="object-cover h-36 w-full rounded-lg"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};
