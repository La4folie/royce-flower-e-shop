import React, { useState, useEffect } from 'react';
import letter from './../assets/images/additional-letter.svg'; // Основное изображение
import { useNavigate } from 'react-router-dom';
import { ContactUs } from './ContactUs';
import { OrderForm } from './OrderForm';
import { CartItem } from '../models';

export const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [wish, setWish] = useState<string>('');
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [showOrderForm, setShowOrderForm] = useState<boolean>(false);
    const navigate = useNavigate();

    const card1 =
        'https://www.faynlab.com/wp-content/uploads/2024/10/Royce_with_bees-1.jpeg';
    const card2 =
        'https://www.faynlab.com/wp-content/uploads/2024/10/Royce_gold-1.jpeg';

    const handleActiveOrdersClick = () => {
        navigate('/order-status');
    };

    useEffect(() => {
        const storedCart = JSON.parse(
            localStorage.getItem('Royce_cart') || '[]'
        );
        setCartItems(storedCart);
    }, []);

    useEffect(() => {}, []);

    const handleCheckout = () => {
        setShowOrderForm(true);
    };

    const handleRemoveItem = (index: number) => {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        localStorage.setItem('Royce_cart', JSON.stringify(updatedCart));
    };

    const handleAddWish = (index: number) => {
        setSelectedIndex(index);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setWish('');
        setSelectedCard(null);
    };

    const handleSaveWish = () => {
        if (selectedIndex !== null) {
            const updatedCart = cartItems.map((item, i) => {
                if (i === selectedIndex) {
                    return { ...item, wish: wish, selectedCard: selectedCard };
                }
                return item;
            });
            setCartItems(updatedCart);
            localStorage.setItem('Royce_cart', JSON.stringify(updatedCart));
            handleClosePopup();
        }
    };

    const handleRemoveWish = (index: number) => {
        const updatedCart = cartItems.map((item, i) => {
            if (i === index) {
                return { ...item, wish: undefined, selectedCard: undefined };
            }
            return item;
        });
        setCartItems(updatedCart);
        localStorage.setItem('Royce_cart', JSON.stringify(updatedCart));
    };

    const calculateTotalPrice = (): number => {
        return cartItems.reduce((total, item) => {
            const cardOrWish = item.selectedCard || item.wish
            const itemTotal = item.product.price * item.quantity;
            const cardCost = cardOrWish? 50 : 0;
            return total + itemTotal + cardCost;
        }, 0);
    };

    const totalPrice = calculateTotalPrice();

    const handleOrderSubmitted = () => {
        setCartItems([]);
        localStorage.removeItem('Royce_cart');
        setShowOrderForm(false);
    };

    return (
        <div className="p-6 bg-white">
            <div className="text-center sticky top-0 bg-white w-full z-10">
                <h1 className="text-xl font-bold text-center"> Кошик</h1>
                <div className="mb-2 border-b border-black pb-2"></div>
            </div>
            <div className="h-[80vh] overflow-y-scroll pb-20">
                <div className="sticky bottom-4">
                    <button
                        onClick={handleActiveOrdersClick}
                        className={`py-2 px-4 rounded-lg mx-auto flex items-center justify-center 
                        ${'bg-black text-white'}`}
                    >
                        {'Активні замовлення'}
                        <span className="relative flex h-3 w-3 ml-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full relative"></span>
                            <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-100 animate-ping"></span>
                        </span>
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center mt-4">Кошик пустий</div>
                ) : (
                    <>
                        <ul>
                            {cartItems.map((item, index) => (
                                <li
                                    key={index}
                                    className="mb-4 border-b border-gray-300 pb-2 relative"
                                >
                                    <div className="flex justify-between items-center mt-6">
                                        <div className="flex items-center">
                                            <p className="mr-2 text-lg font-normal">
                                                {item.product.name}
                                            </p>
                                        </div>
                                        <img
                                            src={item.product.images[0]?.src}
                                            alt={item.product.name}
                                            className="w-20 h-20"
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm mt-1">
                                        <span className="font-bold">Ціна:</span>
                                        <span>{item.product.price} грн</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold">
                                            Кількість:
                                        </span>
                                        <span>{item.quantity}</span>
                                    </div>
                                    <p className="mb-2 text-sm">
                                        <span className="font-bold">
                                            Побажання по упакуванню:{' '}
                                        </span>
                                        <span>{item.packing}</span>
                                    </p>

                                    <div className="flex justify-center items-center text-sm relative my-4">
                                        <img
                                            src={letter}
                                            className="w-6 h-6 grayscale"
                                            alt="Letter Icon"
                                        />
                                        {item.wish || item.selectedCard ? (
                                            <button
                                                className="ml-2 bg-red-200 text-black py-1 px-3 rounded shadow hover:bg-gray-700 transition"
                                                onClick={() =>
                                                    handleRemoveWish(index)
                                                }
                                            >
                                                Видалити листівку
                                            </button>
                                        ) : (
                                            <button
                                                className="ml-2 bg-gray-200 text-black py-1 px-3 rounded shadow hover:bg-gray-300 transition"
                                                onClick={() =>
                                                    handleAddWish(index)
                                                }
                                            >
                                                Додати листівку
                                            </button>
                                        )}
                                        <button
                                            onClick={() =>
                                                handleRemoveItem(index)
                                            }
                                            className="absolute right-0 top-0 text-3xl text-gray-800 hover:text-gray-600 transition"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                    <p className="text-xs text-center mt-2 text-gray-700 mb-2 italic">
                                        Вартість листівки: 50 грн
                                    </p>
                                    {item.wish && (
                                        <p className="mt-2 text-sm text-gray-800">
                                            Побажання на листівці: {item.wish}
                                        </p>
                                    )}
                                    {item.selectedCard && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-700 mb-2 text-center">
                                                Вибрана листівка:
                                            </p>
                                            <div className="flex justify-center">
                                                <img
                                                    src={item.selectedCard}
                                                    alt="Открытка"
                                                    className="w-48 h-36 rounded-md shadow-lg"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between font-bold text-sm mt-4">
                            <span>Всього:</span>
                            <span>{totalPrice} грн</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="bg-black text-white py-2 px-4 rounded-lg mt-4 mx-auto block"
                        >
                            Оформити замовлення
                        </button>
                    </>
                )}
                {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                        <div className="bg-white p-4 rounded shadow-md w-80">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg font-bold">
                                    Ваші побажання
                                </h2>
                                <button
                                    onClick={handleClosePopup}
                                    className="text-2xl"
                                >
                                    &times;
                                </button>
                            </div>
                            <textarea
                                className="w-full border p-2 rounded mb-2"
                                placeholder="Ваші побажання"
                                value={wish}
                                onChange={(e) => setWish(e.target.value)}
                            />
                            <p className="text-sm mb-2">Оберіть листівку:</p>
                            <div className="flex justify-between mb-4">
                                <img
                                    src={card1}
                                    alt="Card 1"
                                    onClick={() => setSelectedCard(card1)}
                                    className={`w-32 h-24 cursor-pointer ${selectedCard === card1 ? 'border-2 border-purple' : ''}`}
                                />
                                <img
                                    src={card2}
                                    alt="Card 2"
                                    onClick={() => setSelectedCard(card2)}
                                    className={`w-32 h-24 cursor-pointer ${selectedCard === card2 ? 'border-2 border-purple' : ''}`}
                                />
                            </div>
                            <button
                                onClick={handleSaveWish}
                                className="bg-black text-white py-2 px-4 rounded w-full"
                            >
                                Зберегти
                            </button>
                        </div>
                    </div>
                )}
                {showOrderForm && (
                    <OrderForm
                        cartItems={cartItems}
                        totalPrice={totalPrice}
                        onOrderSubmitted={handleOrderSubmitted}
                        onCloseOrderForm={() => setShowOrderForm(false)}
                    />
                )}
                <ContactUs/>
            </div>
        </div>
    );
};
