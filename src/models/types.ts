export interface Categories {
    id: number;
    name: string;
    description: string;
    image: { src: string } | null;
}
export interface Product {
    id: number;
    name: string;
    price: number;
    images: { src: string }[];
    description: string;
    stock_status: string;
    stock_quantity: number;
}

export interface Category {
    id: number;
    name: string;
    description: string;
}

export interface CartItem {
    product: {
        id: number;
        name: string;
        price: number;
        images: { src: string }[];
    };
    quantity: number;
    wish?: string;
    selectedCard?: string | null;
    packing?: string;
    status: string;
    completedTime: number;
}

export interface OrderData {
    cartItems: CartItem[];
    paymentMethod: string;
    email: string;
    deliveryMethod: string;
    senderName: string;
    senderPhone: string;
    receiverName: string;
    address: string;
    receiverPhone: string;
    date: string;
    time: string;
    comment?: string;
}

export interface Order {
    order_id: number;
    order_status: string;
    date_created: string;
    total: string;
}
