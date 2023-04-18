/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@safecoin/safe-token';
import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@safecoin/web3.js';

/**
 * @category Instructions
 * @category AuctioneerExecuteSale
 * @category generated
 */
export type AuctioneerExecuteSaleInstructionArgs = {
  escrowPaymentBump: number;
  freeTradeStateBump: number;
  programAsSignerBump: number;
  buyerPrice: beet.bignum;
  tokenSize: beet.bignum;
};
/**
 * @category Instructions
 * @category AuctioneerExecuteSale
 * @category generated
 */
export const auctioneerExecuteSaleStruct = new beet.BeetArgsStruct<
  AuctioneerExecuteSaleInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['escrowPaymentBump', beet.u8],
    ['freeTradeStateBump', beet.u8],
    ['programAsSignerBump', beet.u8],
    ['buyerPrice', beet.u64],
    ['tokenSize', beet.u64],
  ],
  'AuctioneerExecuteSaleInstructionArgs',
);
/**
 * Accounts required by the _auctioneerExecuteSale_ instruction
 *
 * @property [_writable_] buyer
 * @property [_writable_] seller
 * @property [_writable_] tokenAccount
 * @property [] tokenMint
 * @property [] metadata
 * @property [] treasuryMint
 * @property [_writable_] escrowPaymentAccount
 * @property [_writable_] sellerPaymentReceiptAccount
 * @property [_writable_] buyerReceiptTokenAccount
 * @property [] authority
 * @property [**signer**] auctioneerAuthority
 * @property [] auctionHouse
 * @property [_writable_] auctionHouseFeeAccount
 * @property [_writable_] auctionHouseTreasury
 * @property [_writable_] buyerTradeState
 * @property [_writable_] sellerTradeState
 * @property [_writable_] freeTradeState
 * @property [] ahAuctioneerPda
 * @property [] programAsSigner
 * @category Instructions
 * @category AuctioneerExecuteSale
 * @category generated
 */
export type AuctioneerExecuteSaleInstructionAccounts = {
  buyer: web3.PublicKey;
  seller: web3.PublicKey;
  tokenAccount: web3.PublicKey;
  tokenMint: web3.PublicKey;
  metadata: web3.PublicKey;
  treasuryMint: web3.PublicKey;
  escrowPaymentAccount: web3.PublicKey;
  sellerPaymentReceiptAccount: web3.PublicKey;
  buyerReceiptTokenAccount: web3.PublicKey;
  authority: web3.PublicKey;
  auctioneerAuthority: web3.PublicKey;
  auctionHouse: web3.PublicKey;
  auctionHouseFeeAccount: web3.PublicKey;
  auctionHouseTreasury: web3.PublicKey;
  buyerTradeState: web3.PublicKey;
  sellerTradeState: web3.PublicKey;
  freeTradeState: web3.PublicKey;
  ahAuctioneerPda: web3.PublicKey;
  tokenProgram?: web3.PublicKey;
  systemProgram?: web3.PublicKey;
  ataProgram?: web3.PublicKey;
  programAsSigner: web3.PublicKey;
  rent?: web3.PublicKey;
  anchorRemainingAccounts?: web3.AccountMeta[];
};

export const auctioneerExecuteSaleInstructionDiscriminator = [68, 125, 32, 65, 251, 43, 35, 53];

/**
 * Creates a _AuctioneerExecuteSale_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category AuctioneerExecuteSale
 * @category generated
 */
export function createAuctioneerExecuteSaleInstruction(
  accounts: AuctioneerExecuteSaleInstructionAccounts,
  args: AuctioneerExecuteSaleInstructionArgs,
  programId = new web3.PublicKey('hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk'),
) {
  const [data] = auctioneerExecuteSaleStruct.serialize({
    instructionDiscriminator: auctioneerExecuteSaleInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.buyer,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.seller,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenMint,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.metadata,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.treasuryMint,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.escrowPaymentAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.sellerPaymentReceiptAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.buyerReceiptTokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.authority,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.auctioneerAuthority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.auctionHouse,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.auctionHouseFeeAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.auctionHouseTreasury,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.buyerTradeState,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.sellerTradeState,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.freeTradeState,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.ahAuctioneerPda,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.ataProgram ?? splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.programAsSigner,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.rent ?? web3.SYSVAR_RENT_PUBKEY,
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
