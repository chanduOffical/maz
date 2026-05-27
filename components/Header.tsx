import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full p-6 md:p-8">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase">
          MAZZURA
        </h1>
        <p className="text-sm text-deep-purple/70 tracking-wider">
          The Cultural Fashion OS
        </p>
      </div>
    </header>
  );
};

export default Header;
