import React, { FC, useState, useEffect, useCallback } from 'react';

import CalculatorButton from './CalculatorButton';

import CalculatorCore from '../libs/CalculatorCore/CalculatorCore';
import operators from '../libs/CalculatorCore/Operators';
import Parser from '../libs/CalculatorCore/Parser';
import { IKey, KeyType } from '../types/types';

const parser = new Parser(operators);
const calculator = new CalculatorCore(parser);

interface CalculatorKeyBoardProps {
  current: string,
  setCurrent: React.Dispatch<string>,
  expression: string,
  setExpression: React.Dispatch<string>,
  errorMessage: string,
  setErrorMessage: React.Dispatch<string>
}

const keyboard:  IKey[] = [
  {symbol: 'C', type: KeyType.erase, hotKey: 'Escape'},
  {symbol: '√', type: KeyType.operator, hotKey: 's'},
  {symbol: '%', type: KeyType.operator, hotKey: '%'},
  {symbol: '/', type: KeyType.operator, hotKey: '/'},
  {symbol: '7', type: KeyType.digit, hotKey: '7'},
  {symbol: '8', type: KeyType.digit, hotKey: '8'},
  {symbol: '9', type: KeyType.digit, hotKey: '9'},
  {symbol: '⨯', type: KeyType.operator, hotKey: '*'},
  {symbol: '4', type: KeyType.digit, hotKey: '4'},
  {symbol: '5', type: KeyType.digit, hotKey: '5'},
  {symbol: '6', type: KeyType.digit, hotKey: '6'},
  {symbol: '-', type: KeyType.operator, hotKey: '-'},
  {symbol: '1', type: KeyType.digit, hotKey: '1'},
  {symbol: '2', type: KeyType.digit, hotKey: '2'},
  {symbol: '3', type: KeyType.digit, hotKey: '3'},
  {symbol: '+', type: KeyType.operator, hotKey: '+'},
  {symbol: '00', type: KeyType.digit},
  {symbol: '0', type: KeyType.digit, hotKey: '0'},
  {symbol: '.', type: KeyType.digit, hotKey: '.'},
  {symbol: '=', type: KeyType.equal, hotKey: 'Enter'},
];

const CalculatorKeyboard: FC<CalculatorKeyBoardProps> = ({current, setCurrent, expression, setExpression, errorMessage, setErrorMessage}) => {
  const [lastToken, setLastToken] = useState<IKey>(null);
  const [isOverflow, setIsOverflow] = useState<boolean>(false);

  const clearDisplay = useCallback(function () {
    setExpression('');
    setCurrent('');
    setLastToken(null);
    setErrorMessage('');
  }, [setCurrent, setErrorMessage, setExpression]);

  const addOperator = useCallback(function (value: string) {
    if(errorMessage) clearDisplay();

    switch(lastToken?.type) {
      case KeyType.operator:
        const lastTokenOperator = operators.find(operator => operator.symbol === lastToken.symbol);
        const currentTokenOperator = operators.find(operator => operator.symbol === value);

        if(lastTokenOperator.operands === 1 && currentTokenOperator.operands === 1) {
          setExpression(expression + current);
        }

        if(lastToken.symbol === '(' || lastToken.symbol === ')') setExpression(expression + current);
        setCurrent(value);
        break;
      case KeyType.digit:
        setCurrent(value);
        setExpression(expression + current);
        break;
      case KeyType.equal:
        setExpression(current);
        setCurrent(value);
        break;
      default:
        setCurrent(value);
    }

    setLastToken({symbol: value, type: KeyType.operator});
  }, [clearDisplay, current, errorMessage, expression, lastToken, setCurrent, setExpression]);

  useEffect(() => {
    function pressBrackets(e: KeyboardEvent) {
      if(e.key === '(') {
        setCurrent('(');
      }

      if(e.key === ')') {
        addOperator(')');
      }
    }

    function pressBackspace(e: KeyboardEvent) {
      if(e.key === 'Backspace') {
        setCurrent(current.slice(0, current.length - 1));
      }
    }

    document.addEventListener('keydown', pressBrackets);
    document.addEventListener('keydown', pressBackspace);

    return () => {
      document.removeEventListener('keydown', pressBrackets);
      document.removeEventListener('keydown', pressBackspace);
    };
  }, [addOperator, setCurrent, current]);

  
  function addDigit(value: string) {
    if(isOverflow) return;
    if(errorMessage) clearDisplay();

    if(current.length > 14) {
      setErrorMessage('Переполнено');
      setIsOverflow(true);

      setTimeout(() => {
        setErrorMessage('');
        setIsOverflow(false);
      }, 1000);
      return;
    }

    switch(lastToken?.type) {
      case KeyType.operator: 
        setCurrent(value);
        setExpression(expression + current);
        break;
      case KeyType.digit:
        if(current === '0' && value === '0') return;
        if(value === '.' && current.includes('.')) return;
        setCurrent(current + value);
        break;
      case KeyType.equal:
        setExpression('');
        setCurrent(value);
        break;
      default:
        setCurrent(value);
    }

    setLastToken({symbol: value, type: KeyType.digit});
  }

  function calculate() {
    let fullExpression = expression;
    //Если последний введеный элемент число или скобка, то добавляем его к выражению
    if(lastToken?.type === KeyType.digit || lastToken?.symbol === ')') fullExpression += current; 
    
    setLastToken({symbol: '=', type: KeyType.equal});
    try {
      const result = calculator.calculate(fullExpression);
      const roundedResult = String(Math.round( result * 1e3) / 1e3);
      setExpression(fullExpression + '=' );
      setCurrent(roundedResult);
    } catch (e) {
      setErrorMessage(e.message);
      setExpression(fullExpression);
      setCurrent('');
    }
  }

  return (
    <div className="calculator__keyboard">
      {
        // eslint-disable-next-line array-callback-return
        keyboard.map((key) => {
          switch (key.type) {
            case KeyType.digit:
              return <CalculatorButton key={key.symbol} value={key.symbol} onClick={() => addDigit(key.symbol)} hotKey={key?.hotKey} />;
            case KeyType.operator:
              return <CalculatorButton key={key.symbol} value={key.symbol} onClick={() => addOperator(key.symbol)} hotKey={key?.hotKey} />;
            case KeyType.erase:
              return <CalculatorButton key={key.symbol} value={key.symbol} onClick={clearDisplay} hotKey={key?.hotKey} />;
            case KeyType.equal:
              return <CalculatorButton key={key.symbol} value={key.symbol} onClick={calculate} hotKey={key?.hotKey} />;
          }
        })
      }
    </div>
  );
};

export default CalculatorKeyboard;