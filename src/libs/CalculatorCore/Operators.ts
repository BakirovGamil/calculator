import { IOperator } from './types/types';

const operators: IOperator[] = [
  {
    symbol: '+',
    importance: 1,
    operands: 2,
    execute: (a, b) => a + b,
  },
  {
    symbol: '-',
    importance: 1,
    operands: 2,
    execute: (a, b) => a - b,
  },
  {
    symbol: 'umin',
    importance: 5,
    operands: 1,
    execute: (a) => -a,
  },
  {
    symbol: '*',
    importance: 2,
    operands: 2,
    execute: (a, b) => a * b,
  },
  {
    symbol: '⨯',
    importance: 2,
    operands: 2,
    execute: (a, b) => a * b,
  },
  {
    symbol: '/',
    importance: 2,
    operands: 2,
    execute: (a, b) => {
      if(b === 0) throw new Error('Деление на ноль');
      return a / b;
    },
  },
  {
    symbol: '(',
    importance: 0,
    operands: 0
  },
  {
    symbol: ')',
    importance: 0,
    operands: 0
  },
  {
    symbol: '%',
    importance: 3,
    operands: 2,
    execute: (a, b) => a % b
  },
  {
    symbol: '^',
    importance: 3,
    operands: 2,
    execute: (a, b) => {
      if(a ===0 && b === 0) throw new Error('Выражение не определено');
      return Math.pow(a, b);
    }
  },
  {
    symbol: 'sqrt',
    importance: 3,
    operands: 1,
    execute: (a) => { 
      if(a < 0) throw new Error('Комплексное число');
      return Math.sqrt(a);
    }
  },
  {
    symbol: '√',
    importance: 3,
    operands: 1,
    execute: (a) => { 
      if(a < 0) throw new Error('Комплексное число');
      return Math.sqrt(a);
    }
  }
];

export default operators;