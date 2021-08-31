import { Assets } from '@allnodes/fireblocks-core';
import { AllnodesApiSHIB, AllnodesStakingSHIB } from '@allnodes/fireblocks-shib';
import Decimal from 'decimal.js';
import { config } from 'dotenv';
import { FireblocksSDK } from 'fireblocks-sdk';
import fs from 'fs';
import path from 'path';

/**
 *
 */
async function main(): Promise<void> {
  config();

  const {
    FIREBLOCKS_API_SECRET_KEY_PATH,
    FIREBLOCKS_API_KEY,
    FIREBLOCKS_VAULT_ACCOUNT_ID,
    FIREBLOCKS_ADDRESS_INDEX,
    ALLNODES_API_KEY,
  } = process.env;

  assertEnvValueIsFilled(FIREBLOCKS_API_SECRET_KEY_PATH, 'Invalid FIREBLOCKS_API_SECRET_KEY_PATH');
  assertEnvValueIsFilled(FIREBLOCKS_API_KEY, 'Invalid FIREBLOCKS_API_KEY');
  assertEnvValueIsFilled(FIREBLOCKS_VAULT_ACCOUNT_ID, 'Invalid FIREBLOCKS_VAULT_ACCOUNT_ID');
  assertEnvValueIsFilled(FIREBLOCKS_ADDRESS_INDEX, 'Invalid FIREBLOCKS_ADDRESS_INDEX');
  assertEnvValueIsFilled(ALLNODES_API_KEY, 'Invalid ALLNODES_API_KEY');

  const fireblocks = makeClient(FIREBLOCKS_API_SECRET_KEY_PATH, FIREBLOCKS_API_KEY);
  const depositAddresses = await fireblocks.getDepositAddresses(FIREBLOCKS_VAULT_ACCOUNT_ID, Assets.GRT);
  const addressIndex = parseInt(FIREBLOCKS_ADDRESS_INDEX);
  const { address } = depositAddresses[addressIndex];
  const stakingSHIB = new AllnodesStakingSHIB(ALLNODES_API_KEY, fireblocks, FIREBLOCKS_VAULT_ACCOUNT_ID);
  const apiSHIB = new AllnodesApiSHIB();

  console.log(`Using address = "${address}"`);

  const addressInfo = await apiSHIB.fetchAddressInfo({ address });
  const balance = new Decimal(addressInfo.balance).div(1e18);
  const ethBalance = new Decimal(addressInfo.ethBalance).div(1e18);

  console.log(`SHIB balance = "${balance.toString()}"`);
  console.log(`ETH balance = "${ethBalance.toString()}"`);

  try {
    await stakingSHIB.approve({ address });

    console.log(`Exiting... Please rerun script after transaction has 3 confirmations`);
    process.exit(0);
  } catch (err: any) {
    if (err.message !== 'TOKEN_ALREADY_APPROVED') {
      throw err;
    }
  }

  if (balance.equals(0)) throw new Error(`Insufficient SHIB for delegation`);
  if (ethBalance.lessThan(0.01)) throw new Error(`Insufficient ETH for delegation`);

  await stakingSHIB.stake({ address, amount: balance.toString() });
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
