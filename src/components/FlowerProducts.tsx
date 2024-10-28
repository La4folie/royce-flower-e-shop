import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchData } from '../api';
import loadingGif from './../assets/images/loadingGif.gif';
import { useQuery } from '@tanstack/react-query';
import { Category, Product } from '../models';

export const FlowerProducts: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();

    const { data: category, isLoading: isCategoryLoading } = useQuery({
        queryKey: ['category', categoryId],
        queryFn: () => fetchData<Category>(`products/categories/${categoryId}`),
    });

    const { data: products, isLoading: isProductsLoading } = useQuery({
        queryKey: ['products', categoryId],
        queryFn: () =>
            fetchData<Product[]>(`products`, { category: categoryId! }),
    });

    const handleDetailsClick = (product: Product) => {
        navigate('/flower-details', { state: { product } });
    };

    const renderProducts = () => {
        if (isCategoryLoading || isProductsLoading) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <img
                        src={loadingGif}
                        alt="Загрузка..."
                        className="w-16 h-16"
                    />
                </div>
            );
        }

        if (products) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="border rounded-lg p-4 bg-gray-100 text-black flex flex-col items-center"
                        >
                            <img
                                src={product.images[0]?.src}
                                alt={product.name}
                                className="w-72 h-48 object-cover rounded-md mb-2"
                            />
                            <h3 className="text-lg font-bold text-center">
                                {product.name}
                            </h3>
                            <h4
                                className={`text-lg font-bold text-center ${
                                    product.stock_status === 'instock'
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                }`}
                            >
                                {product.stock_status === 'instock'
                                    ? `В наявності${product.stock_quantity ? ` (${product.stock_quantity})` : ''}`
                                    : 'Немає в наявності'}
                            </h4>
                            <p className="text-gray-700 text-center">
                                Ціна: {product.price} грн
                            </p>
                            <button
                                className="bg-black text-white text-sm py-2 px-4 rounded mt-2 transition-colors hover:bg-purple-700"
                                onClick={() => handleDetailsClick(product)}
                            >
                                Детальніше
                            </button>
                        </div>
                    ))}
                </div>
            );
        }
        return (
            <div className="flex flex-col items-center justify-center text-center text-sm text-black mt-6">
                <p>Товарів в цій категорії не знайдено</p>
            </div>
        );
    };

    return (
        <div className="flex bg-white flex-col items-center p-6">
            {category && (
                <div className="text-center sticky top-0 bg-white w-full z-10">
                    {' '}
                    <h1 className="text-xl font-bold text-center">
                        {category.name}
                    </h1>
                    <div className="mb-2 border-b border-black pb-2"></div>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                        {category.description}
                    </p>
                </div>
            )}
            <div className="w-full h-[80vh] overflow-y-scroll pb-20">
                {' '}
                {renderProducts()}
            </div>
        </div>
    );
};
