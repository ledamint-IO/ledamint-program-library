/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@j0nnyboi/beet';
export type AmountArgs = {
  amount: beet.bignum;
};

/**
 * @category userTypes
 * @category generated
 */
export const amountArgsBeet = new beet.BeetArgsStruct<AmountArgs>(
  [['amount', beet.u64]],
  'AmountArgs',
);
