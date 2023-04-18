/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@safecoin/web3.js';
import * as beet from '@metaplex-foundation/beet';
import * as beetSolana from '@j0nnyboi/beet-safecoin';
import { CandyMachineData, candyMachineDataBeet } from '../types/CandyMachineData';

/**
 * Arguments used to create {@link CandyMachine}
 * @category Accounts
 * @category generated
 */
export type CandyMachineArgs = {
  authority: web3.PublicKey;
  wallet: web3.PublicKey;
  tokenMint: beet.COption<web3.PublicKey>;
  config: web3.PublicKey;
  data: CandyMachineData;
  itemsRedeemed: beet.bignum;
  bump: number;
};

const candyMachineDiscriminator = [51, 173, 177, 113, 25, 241, 109, 189];
/**
 * Holds the data for the {@link CandyMachine} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class CandyMachine implements CandyMachineArgs {
  private constructor(
    readonly authority: web3.PublicKey,
    readonly wallet: web3.PublicKey,
    readonly tokenMint: beet.COption<web3.PublicKey>,
    readonly config: web3.PublicKey,
    readonly data: CandyMachineData,
    readonly itemsRedeemed: beet.bignum,
    readonly bump: number,
  ) {}

  /**
   * Creates a {@link CandyMachine} instance from the provided args.
   */
  static fromArgs(args: CandyMachineArgs) {
    return new CandyMachine(
      args.authority,
      args.wallet,
      args.tokenMint,
      args.config,
      args.data,
      args.itemsRedeemed,
      args.bump,
    );
  }

  /**
   * Deserializes the {@link CandyMachine} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0,
  ): [CandyMachine, number] {
    return CandyMachine.deserialize(accountInfo.data, offset);
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link CandyMachine} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
  ): Promise<CandyMachine> {
    const accountInfo = await connection.getAccountInfo(address);
    if (accountInfo == null) {
      throw new Error(`Unable to find CandyMachine account at ${address}`);
    }
    return CandyMachine.fromAccountInfo(accountInfo, 0)[0];
  }

  /**
   * Deserializes the {@link CandyMachine} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [CandyMachine, number] {
    return candyMachineBeet.deserialize(buf, offset);
  }

  /**
   * Serializes the {@link CandyMachine} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return candyMachineBeet.serialize({
      accountDiscriminator: candyMachineDiscriminator,
      ...this,
    });
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link CandyMachine} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args: CandyMachineArgs) {
    const instance = CandyMachine.fromArgs(args);
    return candyMachineBeet.toFixedFromValue({
      accountDiscriminator: candyMachineDiscriminator,
      ...instance,
    }).byteSize;
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link CandyMachine} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    args: CandyMachineArgs,
    connection: web3.Connection,
    commitment?: web3.Commitment,
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(CandyMachine.byteSize(args), commitment);
  }

  /**
   * Returns a readable version of {@link CandyMachine} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      authority: this.authority.toBase58(),
      wallet: this.wallet.toBase58(),
      tokenMint: this.tokenMint,
      config: this.config.toBase58(),
      data: this.data,
      itemsRedeemed: this.itemsRedeemed,
      bump: this.bump,
    };
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const candyMachineBeet = new beet.FixableBeetStruct<
  CandyMachine,
  CandyMachineArgs & {
    accountDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['authority', beetSolana.publicKey],
    ['wallet', beetSolana.publicKey],
    ['tokenMint', beet.coption(beetSolana.publicKey)],
    ['config', beetSolana.publicKey],
    ['data', candyMachineDataBeet],
    ['itemsRedeemed', beet.u64],
    ['bump', beet.u8],
  ],
  CandyMachine.fromArgs,
  'CandyMachine',
);
