import { AllnodesApiStaking } from '@allnodes/fireblocks-core';
import { makeBridge } from '@allnodes/fireblocks-matic/src/staking/make-bridge';
import { Web3Bridge } from 'fireblocks-defi-sdk';
import { FireblocksSDK } from 'fireblocks-sdk';
import type { ApproveDto } from './approve';
import { approve } from './approve';
import { approveAndStake } from './approve-and-stake';
import type { StakeDto } from './stake';
import { stake } from './stake';

/**
 *
 */
export class AllnodesStakingMATIC {
  /**
   *
   * @private
   */
  private readonly apiStaking: AllnodesApiStaking;

  /**
   *
   * @private
   */
  private readonly bridge: Web3Bridge;

  /**
   *
   * @param apiKey
   * @param fireblocks
   * @param vaultAccountId
   */
  constructor(apiKey: string, private readonly fireblocks: FireblocksSDK, private readonly vaultAccountId: string) {
    this.apiStaking = new AllnodesApiStaking(apiKey);
    this.bridge = makeBridge({ fireblocks, vaultAccountId });
  }

  /**
   *
   * @param payload
   */
  async approve(payload: ApproveDto): Promise<void> {
    await approve({
      ...payload,
      apiStaking: this.apiStaking,
      fireblocks: this.fireblocks,
      vaultAccountId: this.vaultAccountId,
      bridge: this.bridge,
    });
  }

  /**
   *
   * @param payload
   */
  async stake(payload: StakeDto): Promise<void> {
    await stake({
      ...payload,
      apiStaking: this.apiStaking,
      fireblocks: this.fireblocks,
      vaultAccountId: this.vaultAccountId,
      bridge: this.bridge,
    });
  }

  /**
   *
   * @param payload
   */
  async approveAndStake(payload: StakeDto): Promise<void> {
    await approveAndStake({
      ...payload,
      apiStaking: this.apiStaking,
      fireblocks: this.fireblocks,
      vaultAccountId: this.vaultAccountId,
      bridge: this.bridge,
    });
  }
}