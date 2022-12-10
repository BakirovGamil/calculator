import React, { FC, useEffect } from 'react';

interface CalculatorButtonProps {
	value: string,
	onClick: () => void,
  hotKey?: string
}

const CalculatorButton: FC<CalculatorButtonProps> = ({value, onClick, hotKey}) => {
  useEffect(() => {
    if(!hotKey) return;

    const pressHotKey = function(e: KeyboardEvent) {
      if(e.key === hotKey) {
        e.preventDefault();
        onClick();
      }
    };

    document.addEventListener('keydown', pressHotKey);

    return () => document.removeEventListener('keydown', pressHotKey);
  }, [value, onClick, hotKey]);

  return (
	  <button className="calculator__button" onClick={() => onClick()}>
      {value}
    </button>
  );
};

export default CalculatorButton;