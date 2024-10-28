import React from 'react';
import { fetchHalidKashmiri } from '../api';
import loadingGif from './../assets/images/loadingGif.gif';
import { useQuery } from '@tanstack/react-query';
import shop from './../assets/images/shop.svg';
import pending from './../assets/images/pending.svg';
import completed from './../assets/images/completed.svg';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { Order } from '../models';

export const OrderStatus: React.FC = () => {
    const { initData } = retrieveLaunchParams();

    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders', initData?.user?.id],
        queryFn: () =>
            initData?.user?.id
                ? fetchHalidKashmiri<Order[]>(`orders/${initData.user.id}`)
                : undefined,
    });

    const getStatusLabel = (status: string): string => {
        switch (status) {
            case 'pending':
                return 'Очікується';
            case 'processing':
                return 'Обробляється';
            case 'completed':
                return 'Виконано';
            case 'on-hold':
                return 'На утриманні';
            case 'cancelled':
                return 'Скасовано';
            case 'refunded':
                return 'Повернуто';
            case 'failed':
                return 'Не вдалося';
            case 'royce-accepted':
                return 'Royce готує ваше замовлення';
            case 'u-can-pickup':
                return 'Ваше замовлення готове для самовивозу';
            case 'ready-for-courier':
                return 'Замовлення готове, очікуємо кур`єра';
            case 'courier-haveorder':
                return 'Royce передав ваше замовлення кур`єру';
            default:
                return 'Невідомий статус';
        }
    };

    const getProgress = (status: string): number => {
        switch (status) {
            case 'pending':
            case 'processing':
            case 'on-hold':
            case 'cancelled':
            case 'failed':
                return 1;
            case 'royce-accepted':
            case 'ready-for-courier':
            case 'u-can-pickup':
            case 'courier-haveorder':
                return 2;
            case 'completed':
                return 3;
            default:
                return 0;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <img src={loadingGif} alt="Загрузка..." className="w-16 h-16" />
            </div>
        );
    }
    return (
        <div className="p-6 bg-white">
            <div className="sticky top-0 bg-white"></div>
            <h1 className="text-xl font-bold text-center">
                Активні замовлення
            </h1>
            <div className="mb-2 border-b border-black pb-2"></div>
            {orders?.length === 0 ? (
                <div className="text-center mt-4">Немає активних замовлень</div>
            ) : (
                <div className="w-full h-[80vh] overflow-y-scroll pb-20">
                    <ul className="space-y-4">
                        {orders?.map((order) => {
                            const progress = getProgress(order.order_status);
                            return (
                                <li
                                    key={order.order_id}
                                    className="border p-4 rounded-md"
                                >
                                    <h2 className="text-lg font-semibold">
                                        Замовлення №{order.order_id}
                                    </h2>
                                    <p>
                                        Дата замовлення:{' '}
                                        {new Date(
                                            order.date_created
                                        ).toLocaleDateString()}
                                    </p>
                                    <p>Сума замовлення: {order.total} грн</p>
                                    <p>
                                        Статус:{' '}
                                        <span className="font-bold">
                                            {getStatusLabel(order.order_status)}
                                        </span>
                                    </p>

                                    <div className="mt-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <img
                                                src={pending}
                                                alt="Shop Icon"
                                                className="w-10 h-10"
                                            ></img>
                                            <img
                                                src={shop}
                                                alt="Shop Icon"
                                                className="w-8 h-8"
                                            ></img>
                                            <img
                                                src={completed}
                                                alt="Shop Icon"
                                                className="w-8 h-8"
                                            ></img>
                                        </div>
                                        <div className="w-full bg-gray-200 h-2 rounded">
                                            <div
                                                className={`h-full rounded ${progress === 1 ? 'w-1/12 bg-green-500' : ''} ${progress === 2 ? 'w-1/2 bg-green-500' : ''} ${progress === 3 ? 'w-full bg-green-500' : ''}`}
                                            ></div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};
