import { Assets } from '../../assets';
import type { NodeEntity } from '../types';
import type { WithGot } from '../types';

/**
 *
 */
export interface HostNodeDto {
  asset: Assets;
  collateral: { hash: string; index: number };
  nodeName?: string;
}

/**
 *
 * @param payload
 */
export async function hostNode(payload: WithGot<HostNodeDto>): Promise<NodeEntity> {
  return payload.got
    .post(`hosting`, {
      json: {
        currencySymbol: payload.asset,
        collateralHash: payload.collateral.hash,
        collateralIndex: payload.collateral.index,
        nodeName: payload.nodeName,
      },
    })
    .json<NodeEntity>();
}
