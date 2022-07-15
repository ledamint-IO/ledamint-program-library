import { Borsh, Transaction } from '@j0nnyboi/mpl-core';
import { PublicKey, TransactionCtorFields, TransactionInstruction } from '@safecoin/web3.js';
import { MetadataProgram } from '../MetadataProgram';

export class RemoveCreatorVerificationArgs extends Borsh.Data {
  static readonly SCHEMA = RemoveCreatorVerificationArgs.struct([['instruction', 'u8']]);

  instruction = 28;
}

type RemoveCreatorVerificationParams = {
  metadata: PublicKey;
  creator: PublicKey;
};

export class RemoveCreatorVerification extends Transaction {
  constructor(options: TransactionCtorFields, params: RemoveCreatorVerificationParams) {
    super(options);
    const { metadata, creator } = params;

    const data = RemoveCreatorVerificationArgs.serialize();

    this.add(
      new TransactionInstruction({
        keys: [
          {
            pubkey: metadata,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: creator,
            isSigner: true,
            isWritable: false,
          },
        ],
        programId: MetadataProgram.PUBKEY,
        data,
      }),
    );
  }
}
