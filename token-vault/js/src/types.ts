import { Keypair, PublicKey, Signer, TransactionInstruction } from '@safecoin/web3.js';
import { bignum as beetBignum } from '@j0nnyboi/beet';

export type InstructionsWithAccounts<T extends Record<string, PublicKey | Keypair>> = [
  TransactionInstruction[],
  Signer[],
  T,
];

// TODO(thlorenz): ideally we would not need this nor the related casts
// safe-token is overly specific when limiting the type to `bigint` as from a JS
// perspective `number`s work too.
// At a minimum beet.bignum should be the below, but the casts can only be fixed by
// adapting safe-token types.
export type bignum = beetBignum | bigint;
