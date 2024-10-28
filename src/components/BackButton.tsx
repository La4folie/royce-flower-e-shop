import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as BackIcon } from '../assets/images/left.svg'; 

export const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    if (location.pathname !== '/') {
      navigate(-1);
    }
  };

  return (
    <div className="fixed top-10 left-2 z-50">
      <button 
        onClick={handleBackClick}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-black focus:outline-none"
      >
        <BackIcon className="w-8 h-8 text-white" /> 
      </button>
    </div>
  );
};
