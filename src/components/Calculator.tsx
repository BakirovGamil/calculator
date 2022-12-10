import { FC, useState} from 'react';

import './Calculator.css';
import CalculatorKeyboard from './CalculatorKeyboard';

const Calculator: FC = () => {
  const [current, setCurrent] = useState<string>('');
  const [expression, setExpression] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  return (
    <div className="calculator">
      <div className="calculator__body">
        <div className="calculator__display">
          <div className="calculator__expression">{expression + current}</div>
          <div className="calculator__current">
            {errorMessage 
              ?<div className="calculator__message">{errorMessage}</div>
              :<div>{current || '0'}</div>
            }  
          </div>
        </div>
        <CalculatorKeyboard 
          current={current} 
          setCurrent={setCurrent} 
          expression={expression} 
          setExpression={setExpression}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage} 
        />
      </div>
    </div>
  );
};

export default Calculator;