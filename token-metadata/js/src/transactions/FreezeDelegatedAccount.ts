import { Borsh, Transaction } from '@j0nnyboi/mpl-core';
import { PublicKey, TransactionCtorFields, TransactionInstruction } from '@safecoin/web3.js';
import { MetadataProgram } from '../MetadataProgram';
import { TOKEN_PROGRAM_ID } from '@safecoin/safe-token';

export class FreezeDelegatedAccountArgs extends Borsh.Data {
  static readonly SCHEMA = new Map([...FreezeDelegatedAccountArgs.struct([['instruction', 'u8']])]);
  instruction = 26;
}

type FreezeDelegatedAccountParams = {
  delegate: PublicKey;
  token_account: PublicKey;
  edition: PublicKey;
  mint: PublicKey;
};

export class FreezeDelegatedAccount extends Transaction {
  constructor(options: TransactionCtorFields, params: FreezeDelegatedAccountParams) {
    super(options);
    const { delegate, token_account, edition, mint } = params;

    const data = FreezeDelegatedAccountArgs.serialize();

    this.add(
      new TransactionInstruction({
        keys: [
          {
            pubkey: delegate,
            isSigner: true,
            isWritable: true,
          },
          {
            pubkey: token_account,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: edition,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: mint,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: TOKEN_PROGRAM_ID,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: MetadataProgram.PUBKEY,
        data,
      }),
    );
  }
}
