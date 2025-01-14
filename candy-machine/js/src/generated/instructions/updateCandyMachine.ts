/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@safecoin/web3.js';
import { CandyMachineData, candyMachineDataBeet } from '../types/CandyMachineData';

/**
 * @category Instructions
 * @category UpdateCandyMachine
 * @category generated
 */
export type UpdateCandyMachineInstructionArgs = {
  data: CandyMachineData;
};
/**
 * @category Instructions
 * @category UpdateCandyMachine
 * @category generated
 */
export const updateCandyMachineStruct = new beet.FixableBeetArgsStruct<
  UpdateCandyMachineInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['data', candyMachineDataBeet],
  ],
  'UpdateCandyMachineInstructionArgs',
);
/**
 * Accounts required by the _updateCandyMachine_ instruction
 *
 * @property [_writable_] candyMachine
 * @property [**signer**] authority
 * @property [] wallet
 * @category Instructions
 * @category UpdateCandyMachine
 * @category generated
 */
export type UpdateCandyMachineInstructionAccounts = {
  candyMachine: web3.PublicKey;
  authority: web3.PublicKey;
  wallet: web3.PublicKey;
  anchorRemainingAccounts?: web3.AccountMeta[];
};

export const updateCandyMachineInstructionDiscriminator = [243, 251, 124, 156, 211, 211, 118, 239];

/**
 * Creates a _UpdateCandyMachine_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category UpdateCandyMachine
 * @category generated
 */
export function createUpdateCandyMachineInstruction(
  accounts: UpdateCandyMachineInstructionAccounts,
  args: UpdateCandyMachineInstructionArgs,
  programId = new web3.PublicKey('cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ'),
) {
  const [data] = updateCandyMachineStruct.serialize({
    instructionDiscriminator: updateCandyMachineInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.candyMachine,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.authority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.wallet,
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
