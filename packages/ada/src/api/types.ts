/**
 *
 */
export interface Utxo {
  in: { hash: string; index: number };
  amount: number;
}
