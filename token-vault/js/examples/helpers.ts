import { airdrop } from '@j0nnyboi/amman';
import { Connection, Keypair } from '@safecoin/web3.js';

// -----------------
// Helpers not relevant to the examples
// -----------------
export async function fundedPayer(connection: Connection, sol = 1) {
  const payer = Keypair.generate();
  await airdrop(connection, payer.publicKey, sol);
  return payer;
}
