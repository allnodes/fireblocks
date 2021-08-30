import type { WithGot } from '../types';

/**
 *
 */
export interface UtxoDto {
  address: string;
}

/**
 *
 */
export interface UtxoEntity {
  hash: string;
  index: number;
}

/**
 *
 * @param payload
 */
export async function fetchUtxo(payload: WithGot<UtxoDto>): Promise<Array<UtxoEntity>> {
  return payload.got.get(`utxo/${payload.address}`).json<Array<UtxoEntity>>();
}
