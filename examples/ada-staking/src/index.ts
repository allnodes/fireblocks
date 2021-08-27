import { AllnodesStakingADA } from '@allnodes/fireblocks-ada';
import { config } from 'dotenv';
import { FireblocksSDK } from 'fireblocks-sdk';
import fs from 'fs';
import path from 'path';

/**
 *
 */
async function main(): Promise<void> {
  config();

  const { FIREBLOCKS_API_SECRET_KEY_PATH, FIREBLOCKS_API_KEY, FIREBLOCKS_VAULT_ACCOUNT_ID, FIREBLOCKS_ADDRESS_INDEX } =
    process.env;

  assertEnvValueIsFilled(FIREBLOCKS_API_SECRET_KEY_PATH, 'Invalid FIREBLOCKS_API_SECRET_KEY_PATH');
  assertEnvValueIsFilled(FIREBLOCKS_API_KEY, 'Invalid FIREBLOCKS_API_KEY');
  assertEnvValueIsFilled(FIREBLOCKS_VAULT_ACCOUNT_ID, 'Invalid FIREBLOCKS_VAULT_ACCOUNT_ID');
  assertEnvValueIsFilled(FIREBLOCKS_ADDRESS_INDEX, 'Invalid FIREBLOCKS_ADDRESS_INDEX');

  const fireblocks = makeClient(FIREBLOCKS_API_SECRET_KEY_PATH, FIREBLOCKS_API_KEY);
  const stakingADA = new AllnodesStakingADA(fireblocks, FIREBLOCKS_VAULT_ACCOUNT_ID);

  await stakingADA.stake({ addressIndex: parseInt(FIREBLOCKS_ADDRESS_INDEX) });
}

/**
 *
 * @param value
 * @param message
 */
function assertEnvValueIsFilled(value: string | undefined, message: string): asserts value is string {
  if (value == null || value.length === 0) {
    throw new Error(message);
  }
}

/**
 *
 * @param apiSecretKeyPath
 * @param apiKey
 */
function makeClient(apiSecretKeyPath: string, apiKey: string): FireblocksSDK {
  const secretKeyPath = path.resolve(process.cwd(), apiSecretKeyPath);
  const secretKey = fs.readFileSync(secretKeyPath, 'utf-8');

  return new FireblocksSDK(secretKey, apiKey);
}

main();
