import { Borsh, Transaction } from '@j0nnyboi/mpl-core';
import { TOKEN_PROGRAM_ID } from '@safecoin/safe-token';
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionCtorFields,
  TransactionInstruction,
} from '@safecoin/web3.js';
import { MetadataProgram } from '../MetadataProgram';

export class RevokeUseAuthorityArgs extends Borsh.Data {
  static readonly SCHEMA = new Map([...RevokeUseAuthorityArgs.struct([['instruction', 'u8']])]);
  instruction = 21;
}

type RevokeUseAuthorityParams = {
  useAuthorityRecord: PublicKey;
  user: PublicKey;
  owner: PublicKey;
  ownerTokenAccount: PublicKey;
  metadata: PublicKey;
  mint: PublicKey;
};

export class RevokeUseAuthority extends Transaction {
  constructor(options: TransactionCtorFields, params: RevokeUseAuthorityParams) {
    super(options);
    const { useAuthorityRecord, user, owner, ownerTokenAccount, metadata, mint } = params;

    const data = RevokeUseAuthorityArgs.serialize();
    const accounts = [
      {
        pubkey: useAuthorityRecord,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: owner,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: user,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: ownerTokenAccount,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: mint,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: metadata,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
    ];

    this.add(
      new TransactionInstruction({
        keys: accounts,
        programId: MetadataProgram.PUBKEY,
        data,
      }),
    );
  }
}
