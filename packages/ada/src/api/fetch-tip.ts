import type { WithGot } from '@allnodes/fireblocks-core';

/**
 *
 */
export interface Tip {
  slot: number;
  hash: string;
}

/**
 *
 * @param payload
 */
export async function fetchTip(payload: WithGot<{}>): Promise<Tip> {
  return payload.got.get(`tip`).json<Tip>();
}
