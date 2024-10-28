import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import './../swiper-custom.css';
import LiqPay from '../assets/images/liqpay-payment.svg';
import Mastercard from '../assets/images/mastercard-payment.svg';
import Visa from '../assets/images/visa-payment.svg';
import { ReactComponent as FavouritesIcon } from '../assets/images/Favourites.svg';
import loadingGif from './../assets/images/loadingGif.gif';
import { ContactUs } from './ContactUs';
import { Product } from '../models';

export const FlowerDetails: React.FC = () => {
    const location = useLocation();
    const product = location.state?.product as Product;
    const navigate = useNavigate();

    const [quantity, setQuantity] = useState<number>(1);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [packing, setPacking] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const savedFavorites = JSON.parse(
            localStorage.getItem('Royce_favorites') || '[]'
        );
        setFavorites(savedFavorites);

        if (product && savedFavorites.includes(product.id)) {
            setIsFavorite(true);
        }
        setLoading(false);
    }, [product]);

    const toggleFavorite = () => {
        const updatedFavorites = isFavorite
            ? favorites.filter((fav) => fav !== product.id)
            : [...favorites, product.id];

        setFavorites(updatedFavorites);
        localStorage.setItem(
            'Royce_favorites',
            JSON.stringify(updatedFavorites)
        );
        setIsFavorite(!isFavorite);
    };

    if (loading) {
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

    if (!product) {
        return (
            <div className="text-white text-center mt-4">
                Нажаль, немає доступних деталей продукта
            </div>
        );
    }

    const maxQuantity = product.stock_quantity ? product.stock_quantity : 99;
    const isOutOfStock =
        product.stock_status !== 'instock' || maxQuantity === 0;
    const price = product.price * quantity;

    const addToCart = () => {
        if (isOutOfStock) return alert('Неможливо додати в кошик');
        const cartItems = JSON.parse(
            localStorage.getItem('Royce_cart') || '[]'
        );

        const item = {
            product,
            quantity,
            packing,
        };

        const updatedCart = [...cartItems, item];
        localStorage.setItem('Royce_cart', JSON.stringify(updatedCart));

        navigate('/cart');
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-center sticky top-0 bg-white z-20">
                <h2 className="text-xl font-bold text-black">{product.name}</h2>
                <div className="mb-2 border-b border-black pb-2"></div>
            </div>
            <div className="w-full h-[80vh] overflow-y-scroll pb-20">
                {product.images && product.images.length > 0 ? (
                    <div className="mt-4 relative">
                        <Swiper
                            spaceBetween={10}
                            slidesPerView={1}
                            navigation
                            modules={[Navigation]}
                        >
                            {product.images.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        src={image.src}
                                        alt={`Image ${index + 1}`}
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <button onClick={toggleFavorite}>
                            <FavouritesIcon
                                className={`absolute top-2 right-2 w-14 h-14 cursor-pointer z-10 ${isFavorite ? 'fill-current text-purple' : 'text-white'}`}
                            />
                        </button>
                    </div>
                ) : null}

                <p className="text-xl text-black text-center mb-4">
                    Ціна: <span className="font-semibold">{price} грн</span>
                </p>

                <h4
                    className={`text-lg mb-2 font-bold text-center ${
                        product.stock_status === 'instock'
                            ? 'text-green-500'
                            : 'text-red-500'
                    }`}
                >
                    {product.stock_status === 'instock'
                        ? `В наявності${product.stock_quantity ? ` (${product.stock_quantity})` : ''}`
                        : 'Немає в наявності'}
                </h4>
                <div className="flex flex-row items-center justify-center mb-4">
                    <h4 className="font-semibold text-black">Кількість:</h4>
                    <button
                        onClick={() =>
                            setQuantity((prev) => Math.max(prev - 1, 1))
                        }
                        className={`px-3 py-1 rounded-full ml-2 ${quantity === 1 ? 'bg-darkBlue text-gray-400 cursor-not-allowed' : 'bg-purple text-white'}`}
                        disabled={quantity === 1}
                    >
                        -
                    </button>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                            const value = Math.min(
                                Math.max(1, Number(e.target.value)),
                                maxQuantity
                            );
                            setQuantity(value);
                        }}
                        className="w-16 text-center bg-darkBlue text-white rounded-full mx-2 border border-gray-600"
                        min="1"
                        max={maxQuantity}
                    />
                    <button
                        onClick={() =>
                            setQuantity((prev) =>
                                Math.min(prev + 1, maxQuantity)
                            )
                        }
                        className={`px-3 py-1 rounded-full ${quantity === maxQuantity ? 'bg-darkBlue text-gray-400 cursor-not-allowed' : 'bg-purple text-white'}`}
                        disabled={quantity >= maxQuantity}
                    >
                        +
                    </button>
                </div>
                <h4 className="text-center font-semibold text-black mt-4">
                    Опис товару
                </h4>
                <div
                    className="text-md text-black text-center mb-4"
                    dangerouslySetInnerHTML={{
                        __html:
                            product.description ||
                            'Немає опису до вибраного товару.',
                    }}
                />

                {/* Блок для пожеланий */}
                <div className="mb-4">
                    <h4 className="font-semibold text-black mb-2">
                        Ваші побажання по оформленю букету:
                    </h4>

                    <textarea
                        value={packing}
                        onChange={(e) => setPacking(e.target.value)}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Напишіть ваші побажання тут..."
                    />
                </div>

                <div className="text-black mt-6">
                    <h4 className="text-center font-semibold text-black mb-4">
                        Доставка та оплата
                    </h4>
                    <div className="flex items-start gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-purple mt-2"></div>
                        <p>
                            Самовивіз з магазину —{' '}
                            <span className="text-purple-500">безкоштовно</span>
                        </p>
                    </div>
                    <hr className="border-gray-600 mb-4" />
                    <div className="flex items-start gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-purple mt-2"></div>
                        <p>Доставка за тарифами курєрської служби</p>
                    </div>

                    <h4 className="text-center font-semibold text-black mb-4">
                        Методи оплати
                    </h4>
                    <div className="flex items-center justify-center gap-2">
                        <p>Безготівковий розрахунок</p>
                        <img src={Visa} alt="Visa" className="w-8 h-8" />
                        <img
                            src={Mastercard}
                            alt="Mastercard"
                            className="w-8 h-8"
                        />
                        <img src={LiqPay} alt="LiqPay" className="w-8 h-8" />
                    </div>
                </div>
                <button
                    onClick={addToCart}
                    className="mt-4 bg-black text-white py-2 px-6 rounded-lg block mx-auto"
                    disabled={isOutOfStock}
                >
                    В кошик
                </button>
                <ContactUs />
            </div>
        </div>
    );
};
