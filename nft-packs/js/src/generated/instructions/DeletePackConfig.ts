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
 * @category DeletePackConfig
 * @category generated
 */
export const DeletePackConfigStruct = new beet.BeetArgsStruct<{ instructionDiscriminator: number }>(
  [['instructionDiscriminator', beet.u8]],
  'DeletePackConfigInstructionArgs',
);
/**
 * Accounts required by the _DeletePackConfig_ instruction
 *
 * @property [] packSet
 * @property [_writable_] packConfig PDA, ['config', pack]
 * @property [_writable_] refunder
 * @property [**signer**] authority
 * @category Instructions
 * @category DeletePackConfig
 * @category generated
 */
export type DeletePackConfigInstructionAccounts = {
  packSet: web3.PublicKey;
  packConfig: web3.PublicKey;
  refunder: web3.PublicKey;
  authority: web3.PublicKey;
};

export const deletePackConfigInstructionDiscriminator = 14;

/**
 * Creates a _DeletePackConfig_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category DeletePackConfig
 * @category generated
 */
export function createDeletePackConfigInstruction(
  accounts: DeletePackConfigInstructionAccounts,
  programId = new web3.PublicKey('packFeFNZzMfD9aVWL7QbGz1WcU7R9zpf6pvNsw2BLu'),
) {
  const [data] = DeletePackConfigStruct.serialize({
    instructionDiscriminator: deletePackConfigInstructionDiscriminator,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.packSet,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.packConfig,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.refunder,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.authority,
      isWritable: false,
      isSigner: true,
    },
  ];

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  });
  return ix;
}
