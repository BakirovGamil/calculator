export enum KeyType {
    digit,
    operator,
    erase,
    equal
}
  
export interface IKey {
    symbol: string,
    type: KeyType,
    hotKey?: string
}