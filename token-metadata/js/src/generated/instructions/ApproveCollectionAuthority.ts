/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@safecoin/web3.js';

/**
 * @category Instructions
 * @category ApproveCollectionAuthority
 * @category generated
 */
export const ApproveCollectionAuthorityStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number;
}>([['instructionDiscriminator', beet.u8]], 'ApproveCollectionAuthorityInstructionArgs');
/**
 * Accounts required by the _ApproveCollectionAuthority_ instruction
 *
 * @property [_writable_] collectionAuthorityRecord Collection Authority Record PDA
 * @property [] newCollectionAuthority A Collection Authority
 * @property [_writable_, **signer**] updateAuthority Update Authority of Collection NFT
 * @property [_writable_, **signer**] payer Payer
 * @property [] metadata Collection Metadata account
 * @property [] mint Mint of Collection Metadata
 * @category Instructions
 * @category ApproveCollectionAuthority
 * @category generated
 */
export type ApproveCollectionAuthorityInstructionAccounts = {
  collectionAuthorityRecord: web3.PublicKey;
  newCollectionAuthority: web3.PublicKey;
  updateAuthority: web3.PublicKey;
  payer: web3.PublicKey;
  metadata: web3.PublicKey;
  mint: web3.PublicKey;
  systemProgram?: web3.PublicKey;
  rent?: web3.PublicKey;
};

export const approveCollectionAuthorityInstructionDiscriminator = 23;

/**
 * Creates a _ApproveCollectionAuthority_ instruction.
 *
 * Optional accounts that are not provided will be omitted from the accounts
 * array passed with the instruction.
 * An optional account that is set cannot follow an optional account that is unset.
 * Otherwise an Error is raised.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category ApproveCollectionAuthority
 * @category generated
 */
export function createApproveCollectionAuthorityInstruction(
  accounts: ApproveCollectionAuthorityInstructionAccounts,
  programId = new web3.PublicKey('WbMTNyvtk8vSMu2AmXV7mKuYrADRNw9GSkNtWKsZ7qe'),
) {
  const [data] = ApproveCollectionAuthorityStruct.serialize({
    instructionDiscriminator: approveCollectionAuthorityInstructionDiscriminator,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.collectionAuthorityRecord,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.newCollectionAuthority,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.updateAuthority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.metadata,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.mint,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
  ];

  if (accounts.rent != null) {
    keys.push({
      pubkey: accounts.rent,
      isWritable: false,
      isSigner: false,
    });
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  });
  return ix;
}
