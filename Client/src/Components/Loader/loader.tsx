import React from 'react';
import './Loader.css';

const Loader: React.FC = () => {
  return (
    <div className="loader-container bg-gray-900">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
