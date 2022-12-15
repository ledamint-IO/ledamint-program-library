/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token';
import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';
import { UseAssetArgs, useAssetArgsBeet } from '../types/UseAssetArgs';

/**
 * @category Instructions
 * @category UseAsset
 * @category generated
 */
export type UseAssetInstructionArgs = {
  useAssetArgs: UseAssetArgs;
};
/**
 * @category Instructions
 * @category UseAsset
 * @category generated
 */
export const UseAssetStruct = new beet.FixableBeetArgsStruct<
  UseAssetInstructionArgs & {
    instructionDiscriminator: number;
  }
>(
  [
    ['instructionDiscriminator', beet.u8],
    ['useAssetArgs', useAssetArgsBeet],
  ],
  'UseAssetInstructionArgs',
);
/**
 * Accounts required by the _UseAsset_ instruction
 *
 * @property [_writable_] metadata Metadata account
 * @property [_writable_] tokenAccount Token Account Of NFT
 * @property [_writable_] mint Mint of the Metadata
 * @property [_writable_, **signer**] useAuthority Use authority or current owner of the asset
 * @property [] owner Owner
 * @property [] splTokenProgram SPL Token program
 * @property [_writable_] useAuthorityRecord (optional) Use Authority Record PDA (if present the program assumes a delegated use authority)
 * @property [] authorizationRules (optional) Token Authorization Rules account
 * @property [] authorizationRulesProgram (optional) Token Authorization Rules Program
 * @category Instructions
 * @category UseAsset
 * @category generated
 */
export type UseAssetInstructionAccounts = {
  metadata: web3.PublicKey;
  tokenAccount: web3.PublicKey;
  mint: web3.PublicKey;
  useAuthority: web3.PublicKey;
  owner: web3.PublicKey;
  splTokenProgram: web3.PublicKey;
  ataProgram?: web3.PublicKey;
  systemProgram?: web3.PublicKey;
  useAuthorityRecord?: web3.PublicKey;
  authorizationRules?: web3.PublicKey;
  authorizationRulesProgram?: web3.PublicKey;
};

export const useAssetInstructionDiscriminator = 45;

/**
 * Creates a _UseAsset_ instruction.
 *
 * Optional accounts that are not provided will be omitted from the accounts
 * array passed with the instruction.
 * An optional account that is set cannot follow an optional account that is unset.
 * Otherwise an Error is raised.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category UseAsset
 * @category generated
 */
export function createUseAssetInstruction(
  accounts: UseAssetInstructionAccounts,
  args: UseAssetInstructionArgs,
  programId = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
) {
  const [data] = UseAssetStruct.serialize({
    instructionDiscriminator: useAssetInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.metadata,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.mint,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.useAuthority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.owner,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.splTokenProgram,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.ataProgram ?? splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
  ];

  if (accounts.useAuthorityRecord != null) {
    keys.push({
      pubkey: accounts.useAuthorityRecord,
      isWritable: true,
      isSigner: false,
    });
  }
  if (accounts.authorizationRules != null) {
    if (accounts.useAuthorityRecord == null) {
      throw new Error(
        "When providing 'authorizationRules' then 'accounts.useAuthorityRecord' need(s) to be provided as well.",
      );
    }
    keys.push({
      pubkey: accounts.authorizationRules,
      isWritable: false,
      isSigner: false,
    });
  }
  if (accounts.authorizationRulesProgram != null) {
    if (accounts.useAuthorityRecord == null || accounts.authorizationRules == null) {
      throw new Error(
        "When providing 'authorizationRulesProgram' then 'accounts.useAuthorityRecord', 'accounts.authorizationRules' need(s) to be provided as well.",
      );
    }
    keys.push({
      pubkey: accounts.authorizationRulesProgram,
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
