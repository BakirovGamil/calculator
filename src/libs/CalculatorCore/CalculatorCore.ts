import Parser from './Parser';
import { IOperator } from './types/types';

export default class CalculatorCore {
  private _operators: IOperator[];

  constructor(private _parser: Parser) {
    this._operators = _parser.operators;
  }

  private getPolistNotation(arrayOfTokens: string[]): string[] {
    const polishNotation: string[] = [];
    const stackOfOperators: string[] = [];

    for(const token of arrayOfTokens) {
      const isNumber = isFinite(+token);

      if(isNumber) {
        polishNotation.push(token);
        continue;
      }

      if(token === '(') {
        stackOfOperators.push(token);
        continue;
      }

      if(token === ')') {
        let poppedOperator = stackOfOperators.pop();

        while(poppedOperator && poppedOperator !== '(') {
          polishNotation.push(poppedOperator);
          poppedOperator = stackOfOperators.pop();
        }

        continue;
      }

      if(stackOfOperators.length === 0) {
        stackOfOperators.push(token);
        continue;
      }

      const currentOperator = this._operators.find((operator) => operator.symbol === token);
      if(currentOperator.operands === 1) {
        stackOfOperators.push(token);
        continue;
      }
      
      let lastOperatorOfStack = stackOfOperators.at(-1);
      let lastOperator = this._operators.find((operator) => operator.symbol === lastOperatorOfStack);

      while(lastOperator.importance >= currentOperator.importance) {
        polishNotation.push(stackOfOperators.pop());
        if(stackOfOperators.length === 0) break;

        lastOperatorOfStack = stackOfOperators.at(-1);
        // eslint-disable-next-line no-loop-func
        lastOperator = this._operators.find((operator) => operator.symbol === lastOperatorOfStack);
      }

      stackOfOperators.push(token);
    }

    if(stackOfOperators.length !== 0) polishNotation.push(...stackOfOperators.reverse());

    return polishNotation;
  }

  private calcPolistNotation(poslihNotation: string[]): number {
    const stack: string[] = [];

    for(const exp of poslihNotation) {
      const isNumber = isFinite(+exp);
      if(isNumber) {
        stack.push(exp);
        continue;
      }

      const currentOperator = this._operators.find((operator) => operator.symbol === exp);
      if(currentOperator.operands === 1) {
        const operand = stack.pop();
        stack.push(String(currentOperator.execute(+operand)));
      } else {
        const secondOperand = stack.pop();
        const firstOperand = stack.pop();

        if(firstOperand === undefined || secondOperand === undefined) throw new Error('Неверное выражение');
        
        stack.push(String(currentOperator.execute(+firstOperand, +secondOperand)));
      } 
    }

    return +stack[0];
  }

  public calculate(expression: string): number {
    const arrayOfTokens = this._parser.parseExpression(expression);
    const polishNotation = this.getPolistNotation(arrayOfTokens);
    if(!polishNotation.length) throw new Error('Неверное выражение');

    return this.calcPolistNotation(polishNotation);
  }
}