import { URLSearchParams } from 'url';
import type { WithGot } from '../types';

/**
 *
 */
export interface ProtxRegisterPrepareDto {
  id: string;
  payeeAddress?: string;
}

/**
 *
 */
export interface ProtxRegisterPrepareResponse {
  tx: string;
  collateralAddress: string;
  signMessage: string;
}

/**
 *
 * @param payload
 */
export async function protxRegisterPrepare(
  payload: WithGot<ProtxRegisterPrepareDto>
): Promise<ProtxRegisterPrepareResponse> {
  return payload.got
    .get(`${payload.id}/deterministic/prepare`, {
      searchParams: new URLSearchParams({
        payeeAddress: payload.payeeAddress,
      }),
    })
    .json<ProtxRegisterPrepareResponse>();
}
