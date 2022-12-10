import { IOperator } from './types/types';

export default class Parser {
  private _exp: string;
  private _tokens: string[];
  private _prevToken: string;

  constructor(public readonly operators: IOperator[]) {
    this._tokens = this.operators.map((op) => op.symbol);
  }

  private parseToken(): string {
    const firstСharacter = this._exp[0];
    const isNumber = isFinite(+firstСharacter);

    if(!this._prevToken && firstСharacter === '-') { //- в начале выражения считаем унарным
      this._exp = this._exp.slice(1).trim();
      this._prevToken = 'umin';
      return 'umin';
    }

    if(this._prevToken === '(' && firstСharacter === '-' ) {  //Если после открывающей скобки -, то считаем его унарным
      this._exp = this._exp.slice(1).trim();
      this._prevToken = 'umin';
      return 'umin';
    }

    if(isNumber) {
      const parsedNumber = String(parseFloat(this._exp));
      this._prevToken = parsedNumber;
      this._exp = this._exp.slice(parsedNumber.length).trim();

      return parsedNumber;
    }

    for(const token of this._tokens) {
      const tokenLength = token.length;
      const slicedExp = this._exp.slice(0, tokenLength);
      
      if(slicedExp === token) {
        this._prevToken = token;
        this._exp = this._exp.slice(token.length).trim();

        return token;
      }
    }

    return '';
  }

  private checkBrackets(arrayOfTokens: string[]) {
    const arrayOfBrackets = arrayOfTokens.filter(token => token === '(' || token === ')');
    const stackOfBrackets = [];

    for(const bracket of arrayOfBrackets) {
      if(bracket === '(') {
        stackOfBrackets.push(bracket);
        continue;
      }

      const lastBracket = stackOfBrackets.at(-1);
      if(bracket === ')' && lastBracket === '(') {
        stackOfBrackets.pop();
      } else {
        throw new Error('Неверное выражение');
      }
    }
  }

  public parseExpression(exp: string): string[] {
    this._exp = exp;
    this._prevToken = null;
    const arrayOfTokens: string[] = [];

    while(this._exp.length) {
      const token = this.parseToken();
      if(token === '') throw new Error('Неверное выражение');

      arrayOfTokens.push(token);
    }

    for(let i = 0; i < arrayOfTokens.length - 1; i++) {
      const currentToken = arrayOfTokens[i];
      const nextToken = arrayOfTokens[i + 1];

      const isNumberCurrentToken = isFinite(+currentToken);
      const isNumberNextToken = isFinite(+nextToken);

      const operatorCurrentToken = this.operators.find(operator => operator.symbol === currentToken);
      const operatorNextToken = this.operators.find(operator => operator.symbol === nextToken);

      if(currentToken === ')' && isNumberNextToken) { //Если после закрыващей скобки стоит число, то между ними умножение
        arrayOfTokens.splice(i + 1, 0, '*');
        continue;
      }
      
      if(isNumberCurrentToken && nextToken === '(') {
        arrayOfTokens.splice(i + 1, 0, '*');
        continue;
      }

      if(isNumberCurrentToken && operatorNextToken?.operands === 1) { //если после числа стоит унарная операция, то ставим между ними умножение
        arrayOfTokens.splice(i + 1, 0, '*');
        continue;
      }

      if(!operatorCurrentToken || !operatorNextToken) continue;

      if(currentToken === ')' && operatorNextToken.operands === 1) { //Если после закрыващей скобки стоит унарный оператор, то между ними умножение
        arrayOfTokens.splice(i + 1, 0, '*');
        continue;
      }

      if(currentToken === 'umin' && nextToken === '-') { //После унарного минуса не может идти бинарный
        throw new Error('Неверное выражение');
      }

      if(operatorCurrentToken.operands === 2 && operatorNextToken.operands === 2) { //Бинарные опреаторы не могут идти подряд
        throw new Error('Неверное выражение');
      }
    }

    this.checkBrackets(arrayOfTokens);
    return arrayOfTokens;
  }
}