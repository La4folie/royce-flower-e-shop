import React from 'react';
import backgroundVideo from './../assets/video/flowers_royce.mp4';
import { Link } from 'react-router-dom';
import { FlowerCategories } from './FlowerCategories';

export const Home: React.FC = () => {
    return (
        <div className="relative min-h-screen text-black">
            <video
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                src={backgroundVideo}
                autoPlay
                loop
                muted
                playsInline
                webkit-playsinline="true"
                disablePictureInPicture
                controlsList="nodownload noremoteplayback noplaybackrate nofullscreen"
                style={{ pointerEvents: 'none' }}
            />
            <div className="h-40 sticky top-0"></div>
            <div className="relative z-10 w-full h-[70vh] overflow-auto flex flex-col items-center space-y-4 pb-8">
                <div className="relative top-1">
                    <Link to="/hint">
                        <button className="bg-black text-white py-2 px-4 rounded-lg text-lg mb-4">
                            Натякнути хлопцеві
                        </button>
                    </Link>
                </div>
                <div className="w-full max-w-screen-lg bg-white bg-opacity-60 p-4 rounded-lg shadow-lg">
                    <FlowerCategories />
                </div>
            </div>
        </div>
    );
};
