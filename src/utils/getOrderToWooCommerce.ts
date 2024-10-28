import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { OrderData } from "../models";

export const getOrderToWooCommerce = (orderData: OrderData) => {
    const { initData } = retrieveLaunchParams();
    console.log(
        `User ID: ${initData?.user?.id}, Username: ${initData?.user?.username}`
    );

    const orderItems = orderData.cartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        total: item.product.price.toString(),
    }));

    const wishes = orderData.cartItems.map((item) => item.wish).filter(Boolean);
    const selectedCarts = orderData.cartItems
        .map((item) => item.selectedCard)
        .filter(Boolean);
    const packingOrder = orderData.cartItems
        .map((item) => item.packing)
        .filter(Boolean);

    return {
        payment_method: orderData.paymentMethod,
        payment_method_title: orderData.paymentMethod,
        set_paid: false,
        billing: {
            first_name: orderData.senderName,
            phone: orderData.senderPhone,
            email: orderData.email,
        },
        shipping: {
            first_name: orderData.receiverName,
            address_1: orderData.address,
            phone: orderData.receiverPhone,
        },
        line_items: orderItems,
        shipping_lines: [
            {
                method_id: 'flat_rate',
                method_title: orderData.deliveryMethod,
                total: '0',
            },
        ],
        meta_data: [
            { key: 'userId', value: initData?.user?.id },
            { key: 'userName', value: initData?.user?.username },
            { key: 'Дата доставки', value: orderData.date },
            { key: 'Час доставки', value: orderData.time },
            { key: 'Коментар до замовлення', value: orderData.comment || '' },
            { key: 'Вибрана листівка', value: selectedCarts.join(') . ( ') },
            { key: 'Побажання на листівці: ', value: wishes.join(') . ( ') },
            {
                key: 'Побажання по упакуванню',
                value: packingOrder.join(') . ( '),
            },
        ],
    };
};
