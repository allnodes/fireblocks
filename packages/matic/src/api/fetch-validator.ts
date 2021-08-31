import type { WithGot } from '@allnodes/fireblocks-core';

/**
 *
 */
export interface ValidatorDto {
  address: string;
}

/**
 *
 */
export interface ValidatorEntity {
  validatorId: number;
  ownerAddress: string;
  signerAddress: string;
  contractAddress: string;
  selfStakeAmount: string;
  delegatorAmount: number;
  delegatorStakeAmount: string;
  delegatorClaimedAmount: string;
  isAlive: boolean;
}

/**
 *
 * @param payload
 */
export async function fetchValidator(payload: WithGot<ValidatorDto>): Promise<ValidatorEntity> {
  return payload.got.get(`validator/${payload.address}`).json<ValidatorEntity>();
}
