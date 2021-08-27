import { Assets } from '@allnodes/fireblocks-core';
import { FireblocksSDK } from 'fireblocks-sdk';
import invariant from 'tiny-invariant';
import { AllnodesApiADA } from '../api';
import { AllnodesSignerADA } from '../signer';
import type { Addresses } from '../types';
import { utils } from '../utils';

/**
 *
 */
export class AllnodesStakingADA {
  /**
   *
   * @private
   */
  private readonly signerADA: AllnodesSignerADA;

  /**
   *
   * @private
   */
  private readonly apiADA: AllnodesApiADA;

  /**
   *
   * @param fireblocks
   * @param vaultAccountId
   */
  constructor(private readonly fireblocks: FireblocksSDK, private readonly vaultAccountId: string) {
    this.signerADA = new AllnodesSignerADA(fireblocks, vaultAccountId);
    this.apiADA = new AllnodesApiADA();
  }

  /**
   *
   * @param payload
   */
  async stake(payload?: { addressIndex?: number }): Promise<void> {
    const addresses = await this.fetchAddresses({ addressIndex: payload?.addressIndex });
    const { baseAddress, stakeAddress } = addresses;

    if (__DEV__) {
      console.log(`Base Address = "${baseAddress.address.to_address().to_bech32()}"`);
      console.log(`Stake Address = "${stakeAddress.address.to_address().to_bech32()}"`);
    }

    const [{ utxo }, tip] = await Promise.all([
      this.apiADA.fetchAddressInfo({ address: baseAddress.address.to_address().to_bech32() }),
      this.apiADA.fetchTip(),
    ]);

    invariant(utxo.length > 0, `Base Address must have at least one UTXO`);

    const { body, hash } = utils.buildTransaction({
      utxo,
      tip,
      stakeCredential: stakeAddress.credential,
      inputAddress: baseAddress.address,
      outputAddress: baseAddress.address,
      shouldRegisterStakeAddress: true,
    });

    const inputSignature = await this.signerADA.signMessage({
      message: hash,
      change: 0,
      addressIndex: payload?.addressIndex,
    });

    const stakeSignature = await this.signerADA.signMessage({
      message: hash,
      change: 2,
    });

    const { bytes } = utils.signTransaction({
      body,
      inputAddress: { publicKey: baseAddress.publicKey, signature: inputSignature },
      stakeAddress: { publicKey: stakeAddress.publicKey, signature: stakeSignature },
    });

    if (__DEV__) {
      console.log(`Transaction ID = "${hash}"`);
    }

    await this.apiADA.broadcastTransaction({ bytes });

    if (__DEV__) {
      console.log('Successfully staked ADA');
    }
  }

  /**
   *
   * @param payload
   */
  async fetchAddresses(payload?: { addressIndex?: number }): Promise<Addresses> {
    if (__DEV__) {
      console.log(`Fetching public keys...`);
    }

    const vaultAccountId = parseInt(this.vaultAccountId);
    const addressIndex = payload?.addressIndex ?? 0;
    const baseArgs = { assetId: Assets.ADA, vaultAccountId, addressIndex: 0 };

    const baseResponse = await this.fireblocks.getPublicKeyInfoForVaultAccount({
      ...baseArgs,
      change: 0,
      addressIndex,
    });

    if (__DEV__) {
      console.log(`Fetched Base public key...`);
    }

    const stakeResponse = await this.fireblocks.getPublicKeyInfoForVaultAccount({ ...baseArgs, change: 2 });

    if (__DEV__) {
      console.log(`Fetched Stake public key...`);
    }

    const stakeAddress = utils.makeStakeAddress({ publicKey: stakeResponse.publicKey });
    const { credential: stakeCredential } = stakeAddress;
    const baseAddress = utils.makeBaseAddress({ publicKey: baseResponse.publicKey, stakeCredential });

    return { baseAddress, stakeAddress };
  }
}
