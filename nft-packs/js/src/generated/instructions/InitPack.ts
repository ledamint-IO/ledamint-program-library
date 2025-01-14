/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@safecoin/web3.js';
import { InitPackSetArgs, initPackSetArgsBeet } from '../types/InitPackSetArgs';

/**
 * @category Instructions
 * @category InitPack
 * @category generated
 */
export type InitPackInstructionArgs = {
  initPackSetArgs: InitPackSetArgs;
};
/**
 * @category Instructions
 * @category InitPack
 * @category generated
 */
export const InitPackStruct = new beet.FixableBeetArgsStruct<
  InitPackInstructionArgs & {
    instructionDiscriminator: number;
  }
>(
  [
    ['instructionDiscriminator', beet.u8],
    ['initPackSetArgs', initPackSetArgsBeet],
  ],
  'InitPackInstructionArgs',
);
/**
 * Accounts required by the _InitPack_ instruction
 *
 * @property [_writable_] packSet
 * @property [**signer**] authority
 * @property [] store
 * @property [] clock Clock account
 * @property [] whitelistedCreator (optional)
 * @category Instructions
 * @category InitPack
 * @category generated
 */
export type InitPackInstructionAccounts = {
  packSet: web3.PublicKey;
  authority: web3.PublicKey;
  store: web3.PublicKey;
  rent?: web3.PublicKey;
  clock: web3.PublicKey;
  whitelistedCreator?: web3.PublicKey;
};

export const initPackInstructionDiscriminator = 0;

/**
 * Creates a _InitPack_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitPack
 * @category generated
 */
export function createInitPackInstruction(
  accounts: InitPackInstructionAccounts,
  args: InitPackInstructionArgs,
  programId = new web3.PublicKey('packFeFNZzMfD9aVWL7QbGz1WcU7R9zpf6pvNsw2BLu'),
) {
  const [data] = InitPackStruct.serialize({
    instructionDiscriminator: initPackInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.packSet,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.authority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.store,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.rent ?? web3.SYSVAR_RENT_PUBKEY,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.clock,
      isWritable: false,
      isSigner: false,
    },
  ];

  if (accounts.whitelistedCreator != null) {
    keys.push({
      pubkey: accounts.whitelistedCreator,
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
