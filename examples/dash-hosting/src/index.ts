import { AllnodesApiHosting, Assets } from '@allnodes/fireblocks-core';
import { AllnodesHostingDASH } from '@allnodes/fireblocks-dash';
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
    ALLNODES_API_KEY,
    ADDRESSES,
    HOST_UTXO,
    PAYEE_ADDRESS,
  } = process.env;

  assertEnvValueIsFilled(FIREBLOCKS_API_SECRET_KEY_PATH, 'Invalid FIREBLOCKS_API_SECRET_KEY_PATH');
  assertEnvValueIsFilled(FIREBLOCKS_API_KEY, 'Invalid FIREBLOCKS_API_KEY');
  assertEnvValueIsFilled(FIREBLOCKS_VAULT_ACCOUNT_ID, 'Invalid FIREBLOCKS_VAULT_ACCOUNT_ID');
  assertEnvValueIsFilled(ALLNODES_API_KEY, 'Invalid ALLNODES_API_KEY');
  assertEnvValueIsFilled(ADDRESSES, 'Invalid ADDRESSES');
  assertEnvValueIsFilled(HOST_UTXO, 'Invalid HOST_UTXO');

  const fireblocks = makeClient(FIREBLOCKS_API_SECRET_KEY_PATH, FIREBLOCKS_API_KEY);
  const depositAddresses = await fireblocks.getDepositAddresses(FIREBLOCKS_VAULT_ACCOUNT_ID, Assets.DASH);

  for (const addressIndex in depositAddresses) {
    const { address } = depositAddresses[addressIndex];

    if (!ADDRESSES.split(',').includes(address)) {
      console.log(`Skipping address = "${address}"`);

      continue;
    }

    console.log(`Using address = "${address}"`);

    const apiHosting = new AllnodesApiHosting(ALLNODES_API_KEY);
    const hostingDASH = new AllnodesHostingDASH(ALLNODES_API_KEY, fireblocks, FIREBLOCKS_VAULT_ACCOUNT_ID);
    const utxo = await apiHosting.fetchUtxo({ address });

    if (utxo.length) {
      console.log('-'.repeat(23));
      console.log(`Found collateral UTXOs:`);
      console.log(utxo.map(item => `${item.hash}-${item.index}`).join('\n'));
      console.log('-'.repeat(23));
    } else {
      throw new Error(`UTXOs not found`);
    }

    const utxoForHosting = utxo.filter(item => HOST_UTXO === 'all' || HOST_UTXO === `${item.hash}-${item.index}`);

    if (utxoForHosting.length) {
      for (const item of utxo) {
        console.log(`Trying to host node: UTXO hash = "${item.hash}", UTXO index = "${item.index}"`);

        try {
          const hostingState = await apiHosting.fetchHostingState(item);

          if (hostingState.isAlreadyHostedOnAllnodes && hostingState.isActivated) {
            throw new Error(`Node already hosted on Allnodes`);
          }

          if (hostingState.isAlreadyHosted) {
            throw new Error(`Node already hosted somewhere`);
          }

          const node = hostingState.isAlreadyHostedOnAllnodes
            ? await apiHosting.fetchNodes().then(nodes => {
                const node = nodes.find(node => {
                  return node.address.collateralHash === item.hash && node.address.collateralIndex === item.index;
                });

                if (node == null) {
                  throw new Error(`Node not found`);
                }

                return node;
              })
            : await hostingDASH.hostNode({ utxo: item });

          await hostingDASH.activateNode({ node, addressIndex: parseInt(addressIndex), payeeAddress: PAYEE_ADDRESS });
        } catch (err: any) {
          console.log(
            `Failed to host node: UTXO hash = "${item.hash}", UTXO index = "${item.index}", message = "${err.message}"`
          );
        }
      }
    } else {
      throw new Error(`UTXO for hosting not found`);
    }
  }
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
