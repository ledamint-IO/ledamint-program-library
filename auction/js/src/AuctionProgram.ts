import { PublicKey } from '@safecoin/web3.js';
import { config, Program } from '@leda-mint-io/lpl-core';

export class AuctionProgram extends Program {
  static readonly PREFIX = 'auction';
  static readonly EXTENDED = 'extended';
  static readonly PUBKEY = new PublicKey(config.programs.auction);
}
