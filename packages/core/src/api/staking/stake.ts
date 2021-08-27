import { Assets } from '../../assets';
import type { EthereumTransactionParams, WithGot } from '../types';

/**
 *
 */
export interface StakeDto {
  asset: Assets;
  address: string;
  amount: string | number;
}

/**
 *
 * @param payload
 */
export async function stake(payload: WithGot<StakeDto>): Promise<EthereumTransactionParams> {
  return payload.got
    .post(``, {
      json: {
        currencySymbol: payload.asset,
        action: 'stake',
        address: payload.address,
        amount: `${payload.amount}`,
      },
    })
    .json<EthereumTransactionParams>();
}
