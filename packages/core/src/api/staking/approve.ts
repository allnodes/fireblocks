import { Assets } from '../../assets';
import type { EthereumTransactionParams } from '../types';
import type { WithGot } from '../types';

/**
 *
 */
export interface ApproveDto {
  asset: Assets;
  address: string;
}

/**
 *
 * @param payload
 */
export async function approve(payload: WithGot<ApproveDto>): Promise<EthereumTransactionParams> {
  return payload.got
    .post(``, {
      json: {
        currencySymbol: payload.asset,
        action: 'approve',
        address: payload.address,
      },
    })
    .json<EthereumTransactionParams>();
}
