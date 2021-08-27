import { Assets } from '@allnodes/fireblocks-core';
import { AllnodesSignerDASH } from '@allnodes/fireblocks-dash';
import { config } from 'dotenv';
import { FireblocksSDK } from 'fireblocks-sdk';
import fs from 'fs';
import path from 'path';

/**
 *
 */
async function main(): Promise<void> {
  config();

  const { FIREBLOCKS_API_SECRET_KEY_PATH, FIREBLOCKS_API_KEY, FIREBLOCKS_VAULT_ACCOUNT_ID, ALLNODES_API_KEY } =
    process.env;

  assertEnvValueIsFilled(FIREBLOCKS_API_SECRET_KEY_PATH, 'Invalid FIREBLOCKS_API_SECRET_KEY_PATH');
  assertEnvValueIsFilled(FIREBLOCKS_API_KEY, 'Invalid FIREBLOCKS_API_KEY');
  assertEnvValueIsFilled(FIREBLOCKS_VAULT_ACCOUNT_ID, 'Invalid FIREBLOCKS_VAULT_ACCOUNT_ID');
  assertEnvValueIsFilled(ALLNODES_API_KEY, 'Invalid ALLNODES_API_KEY');

  const fireblocks = makeClient(FIREBLOCKS_API_SECRET_KEY_PATH, FIREBLOCKS_API_KEY);
  const depositAddresses = await fireblocks.getDepositAddresses(FIREBLOCKS_VAULT_ACCOUNT_ID, Assets.DASH);
  const { address } = depositAddresses[0];
  const signerDASH = new AllnodesSignerDASH(fireblocks, FIREBLOCKS_VAULT_ACCOUNT_ID);

  const message =
    'Xrtj5ZZw5o5aykqDJmN1p1scvjCATfqMkc|0|Xme4yZWKtnfnXcGiBCUjTf7KqNK2gVZNqR|Xi8tdWRXF72y3N3HSqn1g1KaiSXkk7ujfY|f4ee6e12b4f55f23d1b924642676d430786a45a45cc014287fd463525c52de46';

  const signature = await signerDASH.signMessage({ message });

  console.log(`Successfully signed message: address = "${address}", signature = "${signature}"`);
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
