import type { WithGot } from '@allnodes/fireblocks-core';

/**
 *
 */
export interface BroadcastTransactionDto {
  bytes: string;
}

/**
 *
 * @param payload
 */
export async function broadcastTransaction(payload: WithGot<BroadcastTransactionDto>): Promise<void> {
  await payload.got.post(`tx`, { json: { bytes: payload.bytes } });
}
