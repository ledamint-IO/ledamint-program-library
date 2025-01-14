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
 * @category Authorize
 * @category generated
 */
const authorizeStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */;
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'AuthorizeInstructionArgs',
);
/**
 * Accounts required by the _authorize_ instruction
 *
 * @property [_writable_, **signer**] wallet
 * @property [] auctionHouse
 * @property [_writable_] auctioneerAuthority
 * @category Instructions
 * @category Authorize
 * @category generated
 */
export type AuthorizeInstructionAccounts = {
  wallet: web3.PublicKey;
  auctionHouse: web3.PublicKey;
  auctioneerAuthority: web3.PublicKey;
};

const authorizeInstructionDiscriminator = [173, 193, 102, 210, 219, 137, 113, 120];

/**
 * Creates a _Authorize_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category Authorize
 * @category generated
 */
export function createAuthorizeInstruction(accounts: AuthorizeInstructionAccounts) {
  const { wallet, auctionHouse, auctioneerAuthority } = accounts;

  const [data] = authorizeStruct.serialize({
    instructionDiscriminator: authorizeInstructionDiscriminator,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: wallet,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: auctionHouse,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: auctioneerAuthority,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
  ];

  const ix = new web3.TransactionInstruction({
    programId: new web3.PublicKey('neer8g6yJq2mQM6KbnViEDAD4gr3gRZyMMf4F2p3MEh'),
    keys,
    data,
  });
  return ix;
}
