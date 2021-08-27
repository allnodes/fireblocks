import * as Cardano from '@emurgo/cardano-serialization-lib-nodejs';

/**
 *
 */
interface Payload {
  body: Cardano.TransactionBody;
  inputAddress: { publicKey: Cardano.PublicKey; signature: string };
  stakeAddress: { publicKey: Cardano.PublicKey; signature: string };
}

/**
 *
 */
interface Response {
  transaction: Cardano.Transaction;
  bytes: string;
}

/**
 *
 * @param payload
 */
export function signTransaction(payload: Payload): Response {
  const transactionWitnessSet = Cardano.TransactionWitnessSet.new();
  const vkeywitnesses = Cardano.Vkeywitnesses.new();

  const inputVkeywitness = Cardano.Vkeywitness.new(
    Cardano.Vkey.new(payload.inputAddress.publicKey),
    Cardano.Ed25519Signature.from_bytes(Buffer.from(payload.inputAddress.signature, 'hex'))
  );

  const stakeVkeywitness = Cardano.Vkeywitness.new(
    Cardano.Vkey.new(payload.stakeAddress.publicKey),
    Cardano.Ed25519Signature.from_bytes(Buffer.from(payload.stakeAddress.signature, 'hex'))
  );

  vkeywitnesses.add(inputVkeywitness);
  vkeywitnesses.add(stakeVkeywitness);
  transactionWitnessSet.set_vkeys(vkeywitnesses);

  const transaction = Cardano.Transaction.new(payload.body, transactionWitnessSet);
  const bytes = Buffer.from(transaction.to_bytes()).toString('base64');

  return { transaction, bytes };
}
