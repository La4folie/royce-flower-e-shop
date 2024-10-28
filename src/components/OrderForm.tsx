import React, { useState, useRef, useEffect } from 'react';
import { api } from '../api';
import { DateTime } from 'luxon';
import { useMutation } from '@tanstack/react-query';
import 'react-phone-number-input/style.css';
import { CartItem } from '../models';
import { getOrderToWooCommerce } from '../utils';

interface OrderFormProps {
    cartItems: CartItem[];
    totalPrice: number;
    onOrderSubmitted: (email: string) => void;
    onCloseOrderForm: () => void;
}

export interface FormData {
    senderName: string;
    senderPhone: string;
    receiverName: string;
    receiverPhone: string;
    address: string;
    deliveryMethod: "Кур'єрська доставка" | 'Самовивіз';
    paymentMethod: string;
    email: string;
    date: string;
    time: string;
    comment?: string;
}

export const OrderForm: React.FC<OrderFormProps> = ({
    cartItems,
    totalPrice,
    onOrderSubmitted,
    onCloseOrderForm,
}) => {
    const [formData, setFormData] = useState<FormData>({
        senderName: '',
        senderPhone: '',
        receiverName: '',
        receiverPhone: '',
        address: '',
        deliveryMethod: "Кур'єрська доставка",
        paymentMethod: "Готівкою кур'єру",
        email: '',
        date: '',
        time: '',
        comment: '',
    });
    const [asapChecked, setAsapChecked] = useState(false);
    const [timeError, setTimeError] = useState('');
    // const [minTime, setMinTime] = useState<string>('');

    const formRef = useRef<HTMLDivElement | null>(null);
    const today = new Date().toISOString().split('T')[0];
    const oneWeekFromNow = DateTime.now()
        .setZone('Europe/Kyiv')
        .plus({ weeks: 1 })
        .toISODate();
    const maxDate = oneWeekFromNow;
    const now = DateTime.now().setZone('Europe/Kyiv');
    const twoHoursLater = now.plus({ hours: 2 });

    const { mutate, isLoading } = useMutation((orderPayload: any) =>
        api.post('orders', orderPayload)
    );

    useEffect(() => {
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        if (formData.email) {
            localStorage.setItem('userEmail', formData.email);
        }
        // const setMinTimeValue = () => {
        //     if (twoHoursLater > limitTime) {
        //         setMinTime('22:00');
        //     } else {
        //         const minHours = twoHoursLater.toFormat('HH');
        //         const minMinutes = twoHoursLater.toFormat('mm');
        //         setMinTime(`${minHours}:${minMinutes}`);
        //     }
        // };
        // setMinTimeValue();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (timeError) {
            alert('Будь ласка, виправте помилку з часом доставки.');
            return;
        }
        if (!isValidEmail(formData.email)) {
            alert('Будь ласка, введіть дійсний email.');
            return;
        }

        const orderData = {
            cartItems,
            totalPrice,
            ...formData,
            email: formData.email,
        };

        mutate(getOrderToWooCommerce(orderData), {
            onSuccess: () => {
                alert('Замовлення успішно відправлено!');
                onOrderSubmitted(formData.email);
            },
            onError: (error) => {
                console.error(
                    'Виникла помилка при відправці замовлення:',
                    error
                );
                alert('Виникла помилка при відправці замовлення.');
            },
        });
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
        if (id === 'date') {
            setFormData((prevData) => ({ ...prevData, time: '' }));
            setTimeError('');
        }
    };
    const handleAsapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAsapChecked(e.target.checked);
        if (e.target.checked) {
            setFormData((prevData) => ({
                ...prevData,
                time: 'ASAP',
            }));
        }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            time: value,
        }));
        const [hours, minutes] = value.split(':').map(Number);
        const selectedDate = DateTime.fromISO(formData.date).setZone(
            'Europe/Kyiv'
        );
        const selectedTime = selectedDate.set({ hour: hours, minute: minutes });

        if (formData.date) {
            if (selectedTime < twoHoursLater) {
                setTimeError(
                    'Час доставки не може бути менше ніж через 2 години.'
                );
            } else if (
                selectedTime.hour < 7 ||
                selectedTime.hour > 22 ||
                (selectedTime.hour === 22 && selectedTime.minute > 0)
            ) {
                setTimeError('Доставка можлива тільки з 7:00 до 22:00');
            } else {
                setTimeError('');
            }
        }
    };

    const isValidEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validateDate = () => {
        const selectedDate = DateTime.fromISO(formData.date).setZone(
            'Europe/Kyiv'
        );
        const maxAllowedDate = DateTime.now()
            .setZone('Europe/Kyiv')
            .plus({ weeks: 1 });
        if (selectedDate > maxAllowedDate) {
            alert('Не можна замовити квіти раніше ніж за тиждень');
            return false;
        }
        return true;
    };
    return (
        <div className="mt-4 p-4 border border-gray-300 rounded">
            <h2 className="text-lg font-bold mb-2">Форма замовлення</h2>
            <div ref={formRef} className="overflow-y-auto">
                <form
                    onSubmit={(e) => {
                        if (validateDate()) handleSubmit(e);
                    }}
                >
                    <div className="mb-2">
                        <label
                            htmlFor="deliveryMethod"
                            className="block text-sm font-medium"
                        >
                            Спосіб доставки*:
                        </label>
                        <select
                            id="deliveryMethod"
                            className="border text-sm rounded w-full p-2"
                            required
                            value={formData.deliveryMethod}
                            onChange={handleChange}
                        >
                            <option value="Кур'єрська доставка">
                                Кур'єрська доставка
                            </option>
                            <option value="Самовивіз">Самовивіз</option>
                        </select>
                    </div>

                    {formData.deliveryMethod === "Кур'єрська доставка" && (
                        <>
                            <div className="mb-2">
                                <label
                                    htmlFor="senderName"
                                    className="block text-sm font-medium"
                                >
                                    Ім'я відправника*:
                                </label>
                                <input
                                    type="text"
                                    id="senderName"
                                    className="border rounded w-full p-2"
                                    required
                                    value={formData.senderName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-2">
                                <label
                                    htmlFor="senderPhone"
                                    className="block text-sm font-medium"
                                >
                                    Телефон відправника*:
                                </label>
                                <input
                                    type="tel"
                                    id="senderPhone"
                                    className="border rounded w-full p-2"
                                    required
                                    value={formData.senderPhone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-2">
                                <label
                                    htmlFor="address"
                                    className="block text-sm font-medium"
                                >
                                    Адреса доставки*:
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    className="border rounded w-full p-2"
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}
                    <div className="mb-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium"
                        >
                            Email*:
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="border rounded w-full p-2"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="receiverName"
                            className="block text-sm font-medium"
                        >
                            Ім'я отримувача*:
                        </label>
                        <input
                            type="text"
                            id="receiverName"
                            className="border rounded w-full p-2"
                            required
                            value={formData.receiverName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="receiverPhone"
                            className="block text-sm font-medium"
                        >
                            Телефон отримувача*:
                        </label>
                        <input
                            type="tel"
                            id="receiverPhone"
                            className="border rounded w-full p-2"
                            required
                            value={formData.receiverPhone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 mb-2">
                        <div>
                            <label
                                htmlFor="date"
                                className="block text-sm font-medium mb-1"
                            >
                                Дата*:
                            </label>
                            <input
                                type="date"
                                id="date"
                                className="border text-sm rounded w-full p-2"
                                required
                                min={today}
                                max={maxDate!}
                                value={formData.date}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="-ms-8">
                            <label
                                htmlFor="time"
                                className="block text-sm font-medium mb-1"
                            >
                                Час*:
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="time"
                                    id="time"
                                    className="border text-sm rounded w-full p-2"
                                    required={!asapChecked}
                                    disabled={asapChecked}
                                    value={formData.time}
                                    onChange={handleTimeChange}
                                    // min={minTime}
                                />

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={asapChecked}
                                        onChange={handleAsapChange}
                                        className="ml-1 mr-1"
                                    />
                                    Чимшвидше
                                </label>
                            </div>
                            <span className="text-sm text-gray-500">
                                (За київським часом)
                            </span>
                        </div>
                    </div>
                    {timeError && (
                        <p className="text-red-500 text-sm mt-1">{timeError}</p>
                    )}
                    <div className="mb-2">
                        <label
                            htmlFor="comment"
                            className="block text-sm font-medium"
                        >
                            Коментар:
                        </label>
                        <textarea
                            id="comment"
                            className="border text-sm rounded w-full p-2"
                            value={formData.comment}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="mb-2">
                        <label
                            htmlFor="paymentMethod"
                            className="block text-sm font-medium"
                        >
                            Спосіб оплати*:
                        </label>
                        <select
                            id="paymentMethod"
                            className="border text-sm rounded w-full p-2"
                            required
                            value={formData.paymentMethod}
                            onChange={handleChange}
                        >
                            {formData.deliveryMethod === 'Самовивіз' ? (
                                <>
                                    <option value="Карткою на сайті">
                                        Карткою на сайті
                                    </option>
                                    <option value="Оплатити в магазині">
                                        Оплатити в магазині
                                    </option>
                                </>
                            ) : (
                                <>
                                    <option value="Карткою за букет та готівкою курʼєру за доставку">
                                        Карткою за букет та готівкою курʼєру за
                                        доставку
                                    </option>
                                    <option value="Готівкою курʼєру">
                                        Готівкою курʼєру
                                    </option>
                                </>
                            )}
                        </select>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-black text-white py-2 px-4 rounded"
                            disabled={isLoading}
                        >
                            Замовити
                        </button>
                    </div>
                </form>
            </div>
            <button onClick={onCloseOrderForm} className="text-black mt-2">
                Закрити
            </button>
        </div>
    );
};
