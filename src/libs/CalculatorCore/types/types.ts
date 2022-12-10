export interface IExecute {
    (a: number, b?: number): number,
}

export interface IOperator{
    symbol: string,
    importance: number,
    operands: number,
    execute?: IExecute
}