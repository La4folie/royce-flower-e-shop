import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import {
    BackButton,
    BottomMenu,
    Cart,
    Favourites,
    FlowerCategories,
    FlowerDetails,
    FlowerProducts,
    HintToBoyfriend,
    Home,
    OrderStatus,
} from './components';

const App: React.FC = () => {
    const location = useLocation();

    return (
        <div className="flex bg-white flex-col h-100vh">
            <BackButton />
            <div className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/categories" element={<FlowerCategories />} />
                    <Route
                        path="/products/:categoryId"
                        element={<FlowerProducts />}
                    />
                    <Route path="/flower-details" element={<FlowerDetails />} />
                    <Route path="/hint" element={<HintToBoyfriend />} />
                    <Route path="/favourites" element={<Favourites />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/order-status" element={<OrderStatus />} />
                </Routes>
            </div>
            <BottomMenu currentScreen={location.pathname} />
        </div>
    );
};

export default App;
