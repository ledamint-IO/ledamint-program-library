/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@safecoin/safe-token';
import * as beet from '@j0nnyboi/beet';
import * as web3 from '@safecoin/web3.js';

/**
 * @category Instructions
 * @category FreezeDelegatedAccount
 * @category generated
 */
const FreezeDelegatedAccountStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number;
}>([['instructionDiscriminator', beet.u8]], 'FreezeDelegatedAccountInstructionArgs');
/**
 * Accounts required by the _FreezeDelegatedAccount_ instruction
 *
 * @property [**signer**] delegate Delegate
 * @property [_writable_] tokenAccount Token account to freeze
 * @property [] edition Edition
 * @property [] mint Token mint
 * @category Instructions
 * @category FreezeDelegatedAccount
 * @category generated
 */
export type FreezeDelegatedAccountInstructionAccounts = {
  delegate: web3.PublicKey;
  tokenAccount: web3.PublicKey;
  edition: web3.PublicKey;
  mint: web3.PublicKey;
};

const freezeDelegatedAccountInstructionDiscriminator = 26;

/**
 * Creates a _FreezeDelegatedAccount_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 *
 * @category Instructions
 * @category FreezeDelegatedAccount
 * @category generated
 */
export function createFreezeDelegatedAccountInstruction(
  accounts: FreezeDelegatedAccountInstructionAccounts,
) {
  const { delegate, tokenAccount, edition, mint } = accounts;

  const [data] = FreezeDelegatedAccountStruct.serialize({
    instructionDiscriminator: freezeDelegatedAccountInstructionDiscriminator,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: delegate,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: tokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: edition,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: mint,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
  ];

  const ix = new web3.TransactionInstruction({
    programId: new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
    keys,
    data,
  });
  return ix;
}
