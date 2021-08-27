import * as Cardano from '@emurgo/cardano-serialization-lib-nodejs';
import type { Tip } from '../api/fetch-tip';
import type { Utxo } from '../api/types';
import * as Constants from '../constants';

/**
 *
 */
interface Payload {
  utxo: Utxo[];
  tip: Tip;
  stakeCredential: Cardano.StakeCredential;
  inputAddress: Cardano.BaseAddress;
  outputAddress: Cardano.BaseAddress;
  shouldRegisterStakeAddress: boolean;
}

/**
 *
 */
interface Response {
  body: Cardano.TransactionBody;
  hash: string;
}

/**
 *
 * @param payload
 */
export function buildTransaction(payload: Payload): Response {
  const transactionBuilder = Cardano.TransactionBuilder.new(
    Cardano.LinearFee.new(Constants.MIN_FEE_DYNAMIC, Constants.MIN_FEE_STATIC),
    Constants.MIN_UTXO_VALUE,
    Constants.POOL_DEPOSIT,
    Constants.KEY_DEPOSIT
  );

  const certificates = Cardano.Certificates.new();

  if (payload.shouldRegisterStakeAddress) {
    const stakeRegistration = Cardano.StakeRegistration.new(payload.stakeCredential);
    const stakeRegistrationCertificate = Cardano.Certificate.new_stake_registration(stakeRegistration);

    certificates.add(stakeRegistrationCertificate);
  }

  const poolHash = Cardano.Ed25519KeyHash.from_bytes(Constants.POOL_HASH);
  const stakeDelegation = Cardano.StakeDelegation.new(payload.stakeCredential, poolHash);
  const stakeDelegationCertificate = Cardano.Certificate.new_stake_delegation(stakeDelegation);

  certificates.add(stakeDelegationCertificate);

  for (const utxo of payload.utxo) {
    const hash = Buffer.from(utxo.in.hash, 'hex');
    const transactionHash = Cardano.TransactionHash.from_bytes(hash);
    const transactionInput = Cardano.TransactionInput.new(transactionHash, utxo.in.index);
    const value = Cardano.Value.new(Cardano.BigNum.from_str(utxo.amount.toString()));

    transactionBuilder.add_input(payload.inputAddress.to_address(), transactionInput, value);
  }

  transactionBuilder.set_certs(certificates);
  transactionBuilder.set_ttl(payload.tip.slot + Constants.TTL_OFFSET);
  transactionBuilder.add_change_if_needed(payload.outputAddress.to_address());

  const body = transactionBuilder.build();
  const hash = Cardano.hash_transaction(body);

  return { body, hash: Buffer.from(hash.to_bytes()).toString('hex') };
}
