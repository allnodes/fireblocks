import type { WithGot } from '../types';

/**
 *
 */
export interface HostingStateDto {
  hash: string;
  index: number;
}

/**
 *
 */
export interface HostingStateEntity {
  isAlreadyHosted: boolean;
  isAlreadyHostedOnAllnodes: boolean;
  isActivated: boolean;
}

/**
 *
 * @param payload
 */
export async function fetchHostingState(payload: WithGot<HostingStateDto>): Promise<HostingStateEntity> {
  return payload.got.get(`state/${payload.hash}-${payload.index}`).json<HostingStateEntity>();
}
