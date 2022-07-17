import { PublicKey } from '@safecoin/web3.js';
import { config } from '@leda-mint-io/lpl-core';

export const VaultProgram = {
  PUBKEY: new PublicKey(config.programs.vault),
};

export type ParamsWithStore<P> = P & { store: PublicKey };
