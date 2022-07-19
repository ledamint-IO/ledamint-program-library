import { Borsh, Transaction } from '@leda-mint-io/lpl-core';
import {
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  TransactionCtorFields,
  TransactionInstruction,
} from '@safecoin/web3.js';
import { AuctionProgram } from '@leda-mint-io/lpl-auction';
import { MetaplexProgram } from '../MetaplexProgram';
import { ParamsWithStore } from '@leda-mint-io/lpl-token-vault';

export class StartAuctionArgs extends Borsh.Data {
  static readonly SCHEMA = this.struct([['instruction', 'u8']]);

  instruction = 5;
}

type StartAuctionParams = {
  auction: PublicKey;
  auctionManager: PublicKey;
  auctionManagerAuthority: PublicKey;
};

export class StartAuction extends Transaction {
  constructor(options: TransactionCtorFields, params: ParamsWithStore<StartAuctionParams>) {
    super(options);
    const { store, auction, auctionManager, auctionManagerAuthority } = params;

    const data = StartAuctionArgs.serialize();

    this.add(
      new TransactionInstruction({
        keys: [
          {
            pubkey: auctionManager,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: auction,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: auctionManagerAuthority,
            isSigner: true,
            isWritable: false,
          },
          {
            pubkey: store,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: AuctionProgram.PUBKEY,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: SYSVAR_CLOCK_PUBKEY,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: MetaplexProgram.PUBKEY,
        data,
      }),
    );
  }
}
