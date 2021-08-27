import { approve } from './approve';
import type { StakeDto } from './stake';
import { stake } from './stake';
import type { WithApi, WithFireblocks } from './types';

/**
 *
 * @param payload
 */
export async function approveAndStake(payload: WithApi<WithFireblocks<StakeDto>>): Promise<void> {
  try {
    await approve(payload);
  } catch (err) {
    if (!(err instanceof Error && err.message === 'TOKEN_ALREADY_APPROVED')) {
      throw err;
    }
  }

  await stake(payload);
}
