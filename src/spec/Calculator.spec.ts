import CalculatorCore from '../libs/CalculatorCore/CalculatorCore';
import Parser from '../libs/CalculatorCore/Parser';
import operators from '../libs/CalculatorCore/Operators';

const parser = new Parser(operators);
const calculator = new CalculatorCore(parser);

describe('Простые выражения', () => {
  test('2 и 3', () => {
    expect(calculator.calculate('2 + 3')).toBe(5);
    expect(calculator.calculate('2 - 3')).toBe(-1);
    expect(calculator.calculate('2 * 3')).toBe(6);
    expect(calculator.calculate('2 / 3')).toBe(2 / 3);
    expect(calculator.calculate('2 ^ 3')).toBe(8);
    expect(calculator.calculate('3 ^ 2')).toBe(9);
    expect(calculator.calculate('sqrt(2)')).toBe(Math.sqrt(2));
    expect(calculator.calculate('sqrt(3)')).toBe(Math.sqrt(3));
    expect(calculator.calculate('2')).toBe(2);
  });

  test('0', () => {
    expect(calculator.calculate('0 + 0')).toBe(0);
    expect(calculator.calculate('0 - 0')).toBe(0);
    expect(calculator.calculate('0 * 0')).toBe(0);
    expect(() => calculator.calculate('0 / 0')).toThrow(Error);
    expect(() => calculator.calculate('0 ^ 0')).toThrow(Error);
    expect(calculator.calculate('sqrt(0)')).toBe(0);
  });
    
  test('Отрицательные выражения', () => {
    expect(() => calculator.calculate('-1!')).toThrow(Error);
    expect(() => calculator.calculate('sqrt(-1)')).toThrow(Error);
    expect(calculator.calculate('-1')).toBe(-1);
    expect(calculator.calculate('-(-1)')).toBe(1);
    expect(calculator.calculate('1-(-1)')).toBe(2);
  }); 
}); 

describe('Выражения с ошибками', () => {
  test('Несуществующий оператор', () => {
    expect(() => calculator.calculate('1 mod 4')).toThrow(Error);
    expect(() => calculator.calculate('1 div 4')).toThrow(Error);
  });

  test('Лишняя скобка', () => {
    expect(() => calculator.calculate('(1+1))')).toThrow(Error);
    expect(() => calculator.calculate('((1+1)')).toThrow(Error);
  });

  test('Пустая скобка', () => {
    expect(() => calculator.calculate('()')).toThrow(Error);
  });

  test('Не хватает скобки', () => {
    expect(() => calculator.calculate('(')).toThrow(Error);
    expect(() => calculator.calculate(')')).toThrow(Error);
  });

  test('Два оператора подряд', () => {
    expect(() => calculator.calculate('1 -- 1')).toThrow(Error);   
    expect(() => calculator.calculate('1 ++ 1')).toThrow(Error);   
    expect(() => calculator.calculate('1 ** 1')).toThrow(Error);   
    expect(() => calculator.calculate('++1')).toThrow(Error);   
    expect(() => calculator.calculate('**1')).toThrow(Error);
    expect(() => calculator.calculate('1 // 2')).toThrow(Error);  
  });
  test('Два оператора минус в начале', () => {
    expect(() => calculator.calculate('--1')).toThrow(Error);
  });
  test('Неправильные скобки', () => {
    expect(() => calculator.calculate(')(')).toThrow(Error);
  });
  test('Бинарный опретор в начале', () => {
    expect(() => calculator.calculate('+1')).toThrow(Error);
  });
});

describe('Сложные выражения', () => {
  test('((1 + 1))', () => {
    expect(calculator.calculate('((1 + 1))')).toBe(2);
  });
  test('sqrt(4)sqrt(4)', () => {
    expect(calculator.calculate('sqrt(4)sqrt(4)')).toBe(4);
    expect(calculator.calculate('sqrt4sqrt4')).toBe(4);
  });
  test('4 ^ (1/2)', () => {
    expect(calculator.calculate('4 ^ (1 / 2)')).toBe(2);
  });
  test('2 ^ (-1)', () => {
    expect(calculator.calculate('2 ^ (-1)')).toBe(1 / 2);
  });
  test('4 ^ (1 / (-2))', () => {
    expect(calculator.calculate('4 ^ (1 / (-2))')).toBe(Math.sqrt(1 / 4));
  });
  test('sqrt(sqrt(16))', () => {
    expect(calculator.calculate('sqrt(sqrt(16))')).toBe(2);
  });
  test('1+2⋅(1+2⋅(1+2⋅(1-14)))', () => {
    expect(calculator.calculate('1+2*(1+2*(1+2 *( 1 - 1 / 4)))')).toBe(13);
  });
  test('2/ 2 * sqrt(4) + (1 + 3) * 2 ^ 2', () => {
    expect(calculator.calculate('2/ 2 * sqrt(4) + (1 + 3) * 2 ^ 2')).toBe(18);
  });
  test('sqrt(1/4)', () => {
    expect(calculator.calculate('sqrt(1/4)')).toBe(1/2);
  });
  test('sqrtsqrt16', () => {
    expect(calculator.calculate('sqrtsqrt16')).toBe(2);
  });
  test('123/123sqrt4', () => {
    expect(calculator.calculate('123/123sqrt4')).toBe(2);
  });
  test('1(2 + 3)', () => {
    expect(calculator.calculate('1(2 + 3)')).toBe(5);
  });
});