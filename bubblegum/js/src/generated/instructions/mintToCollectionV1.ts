/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@safecoin/web3.js';
import { MetadataArgs, metadataArgsBeet } from '../types/MetadataArgs';

/**
 * @category Instructions
 * @category MintToCollectionV1
 * @category generated
 */
export type MintToCollectionV1InstructionArgs = {
  metadataArgs: MetadataArgs;
};
/**
 * @category Instructions
 * @category MintToCollectionV1
 * @category generated
 */
export const mintToCollectionV1Struct = new beet.FixableBeetArgsStruct<
  MintToCollectionV1InstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['metadataArgs', metadataArgsBeet],
  ],
  'MintToCollectionV1InstructionArgs',
);
/**
 * Accounts required by the _mintToCollectionV1_ instruction
 *
 * @property [_writable_] treeAuthority
 * @property [] leafOwner
 * @property [] leafDelegate
 * @property [_writable_] merkleTree
 * @property [**signer**] payer
 * @property [**signer**] treeDelegate
 * @property [**signer**] collectionAuthority
 * @property [] collectionAuthorityRecordPda
 * @property [] collectionMint
 * @property [_writable_] collectionMetadata
 * @property [] editionAccount
 * @property [] bubblegumSigner
 * @property [] logWrapper
 * @property [] compressionProgram
 * @property [] tokenMetadataProgram
 * @category Instructions
 * @category MintToCollectionV1
 * @category generated
 */
export type MintToCollectionV1InstructionAccounts = {
  treeAuthority: web3.PublicKey;
  leafOwner: web3.PublicKey;
  leafDelegate: web3.PublicKey;
  merkleTree: web3.PublicKey;
  payer: web3.PublicKey;
  treeDelegate: web3.PublicKey;
  collectionAuthority: web3.PublicKey;
  collectionAuthorityRecordPda: web3.PublicKey;
  collectionMint: web3.PublicKey;
  collectionMetadata: web3.PublicKey;
  editionAccount: web3.PublicKey;
  bubblegumSigner: web3.PublicKey;
  logWrapper: web3.PublicKey;
  compressionProgram: web3.PublicKey;
  tokenMetadataProgram: web3.PublicKey;
  systemProgram?: web3.PublicKey;
  anchorRemainingAccounts?: web3.AccountMeta[];
};

export const mintToCollectionV1InstructionDiscriminator = [153, 18, 178, 47, 197, 158, 86, 15];

/**
 * Creates a _MintToCollectionV1_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category MintToCollectionV1
 * @category generated
 */
export function createMintToCollectionV1Instruction(
  accounts: MintToCollectionV1InstructionAccounts,
  args: MintToCollectionV1InstructionArgs,
  programId = new web3.PublicKey('BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY'),
) {
  const [data] = mintToCollectionV1Struct.serialize({
    instructionDiscriminator: mintToCollectionV1InstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.treeAuthority,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.leafOwner,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.leafDelegate,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.merkleTree,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.payer,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.treeDelegate,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.collectionAuthority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.collectionAuthorityRecordPda,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.collectionMint,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.collectionMetadata,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.editionAccount,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.bubblegumSigner,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.logWrapper,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.compressionProgram,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenMetadataProgram,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
  ];

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  });
  return ix;
}
