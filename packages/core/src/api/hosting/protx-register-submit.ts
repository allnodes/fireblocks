import type { WithGot } from '../types';

/**
 *
 */
export interface ProtxRegisterSubmitDto {
  id: string;
  signature: string;
  tx: string;
}

/**
 *
 */
export interface ProtxRegisterSubmitResponse {
  hash: string;
}

/**
 *
 * @param payload
 */
export async function protxRegisterSubmit(
  payload: WithGot<ProtxRegisterSubmitDto>
): Promise<ProtxRegisterSubmitResponse> {
  return payload.got
    .post(`${payload.id}/deterministic/submit`, {
      json: {
        signature: payload.signature,
        tx: payload.tx,
      },
    })
    .json<ProtxRegisterSubmitResponse>();
}
