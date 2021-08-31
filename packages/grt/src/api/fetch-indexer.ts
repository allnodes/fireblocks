import type { WithGot } from '@allnodes/fireblocks-core';

/**
 *
 */
export interface IndexerDto {
  address: string;
}

/**
 *
 */
export interface IndexerEntity {
  account: {
    defaultName: { id: string; name: string } | null;
    id: string;
    image: string | null;
  };
  allocatedTokens: string;
  createdAt: number;
  delegatedTokens: string;
  delegationExchangeRate: string;
  delegatorParameterCooldown: number;
  delegatorQueryFees: string;
  id: string;
  indexingRewardCut: number;
  indexingRewardEffectiveCut: string;
  lastDelegationParameterUpdate: number;
  lockedTokens: string;
  queryFeeCut: number;
  queryFeeRebates: string;
  queryFeesCollected: string;
  rewardsEarned: string;
  stakedTokens: string;
  url: string;
}

/**
 *
 * @param payload
 */
export async function fetchIndexer(payload: WithGot<IndexerDto>): Promise<IndexerEntity> {
  return payload.got.get(`indexer/${payload.address}`).json<IndexerEntity>();
}
