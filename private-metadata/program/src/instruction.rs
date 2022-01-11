
use {
    crate::{
        transfer_proof::TransferData,
    },
    bytemuck::{Pod, Zeroable},
    num_derive::{FromPrimitive, ToPrimitive},
    num_traits::{FromPrimitive},
    solana_program::{
        program_error::ProgramError,
        pubkey::Pubkey,
    },
    crate::{
        zk_token_elgamal,
    },
};

#[cfg(not(target_arch = "bpf"))]
use {
    crate::equality_proof,
    num_traits::{ToPrimitive},
    solana_program::{
        instruction::{AccountMeta, Instruction},
        sysvar,
        system_instruction,
    },
    solana_sdk::signer::Signer,
    std::convert::TryInto,
};

#[derive(Clone, Copy, Pod, Zeroable)]
#[repr(C)]
pub struct ConfigureMetadataData {
    /// The ElGamal public key associated with the owner public key and this NFT mint.
    /// NB: this is not checked on initialization but should be the canonical one for compatibility
    pub elgamal_pk: zk_token_elgamal::pod::ElGamalPubkey,

    /// AES Cipher key for the encrypted asset. This should already by encrypted with `elgamal_pk`
    ///
    /// This is chunked because the version of ElGamal we're using is slow in decrypting so we must
    /// keep the encrypted values small (<32 bits).
    pub encrypted_cipher_key: zk_token_elgamal::pod::ElGamalCiphertext,

    /// The URI of the encrypted asset
    pub uri: crate::state::URI,
}

#[derive(Clone, Copy, Pod, Zeroable)]
#[repr(C)]
pub struct TransferChunkData {
    /// Transfer Data (proof statement and masking factors)
    pub transfer: TransferData,
}

#[derive(Clone, Copy, Pod, Zeroable)]
#[repr(C)]
pub struct TransferChunkSlowData {
    /// Transfer Data (proof statement and masking factors)
    pub transfer: TransferData,
}

#[derive(Clone, Copy, Debug, FromPrimitive, ToPrimitive)]
#[repr(u8)]
pub enum PrivateMetadataInstruction {
    /// Configures private metadata for an NFT
    ///
    /// Accounts expected by this instruction:
    ///
    ///   0. `[writeable,signer]` Payer
    ///   1. `[]` The SPL Token mint account of the NFT
    ///   2. `[]` The SPL Metadata account. Must be mutable
    ///   3. `[signer]` The update authority for the SPL Metadata
    ///   4. `[writeable]` Private metadata PDA
    ///   5. `[]` Metadata program
    ///   6. `[]` System program
    ///   7. `[]` Rent sysvar
    ///
    /// Data expected by this instruction:
    ///   ConfigureMetadataData
    ///
    ConfigureMetadata,

    /// Initialise transfer state for private metadata
    ///
    /// In the normal workflow, royalties for private-metadata NFTs will be 100% and the
    /// non-creator fees are all sent to the private-metadata account.
    /// In case of sale through marketplace or contract that doesn't handle private metadata,
    /// this instruction allows the seller to claim those lamports by transferring ownership and
    /// claiming on `fini_transfer`
    ///
    /// TODO: there is wonkiness around multiple parties transacting without a proper private
    /// metadata call...
    ///
    /// Accounts expected by this instruction:
    ///
    ///   0. `[writeable,signer]` The owner of the NFT
    ///   1. `[]` The SPL Token mint account of the NFT
    ///   2. `[]` The SPL Token account holding the NFT
    ///   3. `[]` The wallet currently encrypting the cipherkey
    ///   4. `[]` The elgamal pubkey PDA matching private_metadata.elgamal_pk
    ///   5. `[writable]` Private metadata PDA
    ///   6. `[]` Recipient wallet
    ///   7. `[]` Recipient elgamal pubkey PDA
    ///   8. `[writable]` Transfer buffer PDA. Will hold CipherKeyTransferBuffer
    ///   9. `[]` System program
    ///   10. `[]` Rent sysvar
    ///
    /// Data expected by this instruction:
    ///
    InitTransfer,

    /// Finalise transfer state for private metadata and swap cipher texts
    ///
    /// Accounts expected by this instruction:
    ///
    ///   0. `[writeable,signer]` Authority. Must be the authority on the transfer buffer
    ///   1. `[]` Private metadata PDA
    ///   2. `[writable]` Transfer buffer program account
    ///   3. `[]` System program
    ///
    FiniTransfer,

    /// Validate encrypted cipher key chunk. NB: this will not run within compute limits without
    /// syscall support for crypto instructions.
    ///
    /// Accounts expected by this instruction:
    ///
    ///   0. `[writeable,signer]` Authority. Must be the authority on the transfer buffer
    ///   1. `[]` Private metadata PDA
    ///   2. `[writable]` Transfer buffer program account
    ///   3. `[]` System program
    ///
    /// Data expected by this instruction:
    ///   TransferChunkData
    ///
    TransferChunk,

    /// Validate encrypted cipher key chunk through a manual DSL cranked instruction.
    ///
    /// Accounts expected by this instruction:
    ///
    ///   0. `[writeable,signer]` Authority. Must be the authority on the transfer buffer
    ///   1. `[]` Private metadata PDA
    ///   2. `[writable]` Transfer buffer program account
    ///   3. `[]` Instruction buffer. Must match Header + equality_proof::DSL_INSTRUCTION_BYTES
    ///   4. `[]` Input buffer. Must have the appropriate proof points and scalars
    ///   5. `[]` Compute buffer. Must match the instruction + input buffers and have been cranked
    ///      for all DSL instructions
    ///   6. `[]` System program
    ///
    /// Data expected by this instruction:
    ///   TransferChunkSlowData
    ///
    TransferChunkSlow,

    /// Write an elgamal pubkey into the associated buffer for this wallet and mint
    ///
    /// Accounts expected by this instruction:
    ///
    ///   0. `[writeable,signer]` Wallet to publish for
    ///   1. `[]` The SPL Token mint account of the NFT
    ///   2. `[writable]` The elgamal pubkey PDA
    ///   3. `[]` System program
    ///   4. `[]` Rent sysvar
    ///
    /// Data expected by this instruction:
    ///   elgamal_pk: The recipients elgamal public-key
    ///
    PublishElgamalPubkey,

    /// Close the associated elgamal pubkey buffer for this wallet and mint
    ///
    /// Accounts expected by this instruction:
    ///
    ///   0. `[writeable,signer]` Wallet to close buffer for
    ///   1. `[]` The SPL Token mint account of the NFT
    ///   2. `[writable]` The elgamal pubkey PDA
    ///   3. `[]` System program
    ///
    /// Data expected by this instruction:
    ///
    CloseElgamalPubkey,
}

pub fn decode_instruction_type(
    input: &[u8]
) -> Result<PrivateMetadataInstruction, ProgramError> {
    if input.is_empty() {
        Err(ProgramError::InvalidInstructionData)
    } else {
        FromPrimitive::from_u8(input[0]).ok_or(ProgramError::InvalidInstructionData)
    }
}

pub fn decode_instruction_data<T: Pod>(
    input: &[u8]
) -> Result<&T, ProgramError> {
    if input.len() < 2 {
        Err(ProgramError::InvalidInstructionData)
    } else {
        pod_from_bytes(&input[1..]).ok_or(ProgramError::InvalidArgument)
    }
}

/// Convert a slice into a `Pod` (zero copy)
pub fn pod_from_bytes<T: Pod>(bytes: &[u8]) -> Option<&T> {
    bytemuck::try_from_bytes(bytes).ok()
}

pub fn get_metadata_address(mint: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            mpl_token_metadata::state::PREFIX.as_bytes(),
            mpl_token_metadata::ID.as_ref(),
            mint.as_ref(),
        ],
        &mpl_token_metadata::ID,
    )
}

pub fn get_private_metadata_address(mint: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            crate::state::PREFIX.as_bytes(),
            mint.as_ref(),
        ],
        &crate::ID,
    )
}

pub fn get_elgamal_pubkey_address(
    wallet: &Pubkey,
    mint: &Pubkey,
) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            crate::state::PREFIX.as_bytes(),
            wallet.as_ref(),
            mint.as_ref(),
        ],
        &crate::ID,
    )
}

pub fn get_transfer_buffer_address(
    wallet: &Pubkey,
    mint: &Pubkey,
) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            crate::state::TRANSFER.as_bytes(),
            wallet.as_ref(),
            mint.as_ref(),
        ],
        &crate::ID,
    )
}

#[cfg(not(target_arch = "bpf"))]
pub fn encode_instruction<T: Pod>(
    accounts: Vec<AccountMeta>,
    instruction_type: PrivateMetadataInstruction,
    instruction_data: &T,
) -> Instruction {
    let mut data = vec![ToPrimitive::to_u8(&instruction_type).unwrap()];
    data.extend_from_slice(bytemuck::bytes_of(instruction_data));
    Instruction {
        program_id: crate::ID,
        accounts,
        data,
    }
}

#[cfg(not(target_arch = "bpf"))]
pub fn configure_metadata(
    payer: Pubkey,
    mint: Pubkey,
    elgamal_pk: zk_token_elgamal::pod::ElGamalPubkey,
    encrypted_cipher_key: &zk_token_elgamal::pod::ElGamalCiphertext,
    uri: &[u8],
) -> Instruction {
    let accounts = vec![
        AccountMeta::new(payer, true),
        AccountMeta::new_readonly(mint, false),
        AccountMeta::new_readonly(get_metadata_address(&mint).0, false),
        AccountMeta::new_readonly(payer, true),
        AccountMeta::new(get_private_metadata_address(&mint).0, false),
        AccountMeta::new_readonly(mpl_token_metadata::id(), false),
        AccountMeta::new_readonly(solana_program::system_program::id(), false),
        AccountMeta::new_readonly(sysvar::rent::id(), false),
    ];

    let mut data = ConfigureMetadataData::zeroed();
    data.elgamal_pk = elgamal_pk;
    data.encrypted_cipher_key = *encrypted_cipher_key;
    data.uri.0[..uri.len()].copy_from_slice(uri);

    encode_instruction(
        accounts,
        PrivateMetadataInstruction::ConfigureMetadata,
        &data,
    )
}

#[cfg(not(target_arch = "bpf"))]
pub fn init_transfer(
    payer: &Pubkey,
    mint: &Pubkey,
    recipient: &Pubkey,
    current: &Pubkey,
) -> Instruction {
    let accounts = vec![
        AccountMeta::new(*payer, true),
        AccountMeta::new_readonly(*mint, false),
        AccountMeta::new_readonly(
            spl_associated_token_account::get_associated_token_address(payer, mint),
            false,
        ),
        AccountMeta::new_readonly(*current, false),
        AccountMeta::new_readonly(get_elgamal_pubkey_address(current, mint).0, false),
        AccountMeta::new(get_private_metadata_address(mint).0, false),
        AccountMeta::new_readonly(*recipient, false),
        AccountMeta::new_readonly(get_elgamal_pubkey_address(recipient, mint).0, false),
        AccountMeta::new(get_transfer_buffer_address(recipient, mint).0, false),
        AccountMeta::new_readonly(solana_program::system_program::id(), false),
        AccountMeta::new_readonly(sysvar::rent::id(), false),
    ];

    encode_instruction(
        accounts,
        PrivateMetadataInstruction::InitTransfer,
        &(),
    )
}

#[cfg(not(target_arch = "bpf"))]
pub fn fini_transfer(
    payer: Pubkey,
    mint: Pubkey,
    transfer_buffer: Pubkey,
) -> Instruction {
    let accounts = vec![
        AccountMeta::new(payer, true),
        AccountMeta::new(get_private_metadata_address(&mint).0, false),
        AccountMeta::new(transfer_buffer, false),
        AccountMeta::new_readonly(solana_program::system_program::id(), false),
    ];

    encode_instruction(
        accounts,
        PrivateMetadataInstruction::FiniTransfer,
        &(),
    )
}

#[cfg(not(target_arch = "bpf"))]
pub fn transfer_chunk(
    payer: Pubkey,
    mint: Pubkey,
    transfer_buffer: Pubkey,
    data: TransferChunkData,
) -> Instruction {
    let accounts = vec![
        AccountMeta::new(payer, true),
        AccountMeta::new_readonly(get_private_metadata_address(&mint).0, false),
        AccountMeta::new(transfer_buffer, false),
        AccountMeta::new_readonly(solana_program::system_program::id(), false),
    ];

    encode_instruction(
        accounts,
        PrivateMetadataInstruction::TransferChunk,
        &data,
    )
}

#[cfg(not(target_arch = "bpf"))]
pub fn transfer_chunk_slow(
    payer: Pubkey,
    mint: Pubkey,
    transfer_buffer: Pubkey,
    instruction_buffer: Pubkey,
    input_buffer: Pubkey,
    compute_buffer: Pubkey,
    data: TransferChunkSlowData,
) -> Instruction {
    let accounts = vec![
        AccountMeta::new(payer, true),
        AccountMeta::new_readonly(get_private_metadata_address(&mint).0, false),
        AccountMeta::new(transfer_buffer, false),
        AccountMeta::new_readonly(instruction_buffer, false),
        AccountMeta::new_readonly(input_buffer, false),
        AccountMeta::new_readonly(compute_buffer, false),
        AccountMeta::new_readonly(solana_program::system_program::id(), false),
    ];

    encode_instruction(
        accounts,
        PrivateMetadataInstruction::TransferChunkSlow,
        &data,
    )
}

#[cfg(not(target_arch = "bpf"))]
pub fn publish_elgamal_pubkey(
    payer: &Pubkey,
    mint: &Pubkey,
    elgamal_pk: zk_token_elgamal::pod::ElGamalPubkey,
) -> Instruction {
    let accounts = vec![
        AccountMeta::new(*payer, true),
        AccountMeta::new_readonly(*mint, false),
        AccountMeta::new(get_elgamal_pubkey_address(&payer, &mint).0, false),
        AccountMeta::new_readonly(solana_program::system_program::id(), false),
        AccountMeta::new_readonly(sysvar::rent::id(), false),
    ];

    encode_instruction(
        accounts,
        PrivateMetadataInstruction::PublishElgamalPubkey,
        &elgamal_pk,
    )
}

#[cfg(not(target_arch = "bpf"))]
pub fn close_elgamal_pubkey(
    payer: &Pubkey,
    mint: &Pubkey,
) -> Instruction {
    let accounts = vec![
        AccountMeta::new(*payer, true),
        AccountMeta::new_readonly(*mint, false),
        AccountMeta::new(get_elgamal_pubkey_address(&payer, &mint).0, false),
        AccountMeta::new_readonly(solana_program::system_program::id(), false),
    ];

    encode_instruction(
        accounts,
        PrivateMetadataInstruction::CloseElgamalPubkey,
        &(),
    )
}

#[cfg(not(target_arch = "bpf"))]
pub struct InstructionsAndSigners<'a> {
    pub instructions: Vec<Instruction>,
    pub signers: Vec<&'a dyn Signer>,
}

#[cfg(not(target_arch = "bpf"))]
pub fn populate_transfer_proof_dsl<'a, F>(
    payer: &'a dyn Signer,
    instruction_buffer: &'a dyn Signer,
    minimum_rent_balance: F,
) -> Vec<InstructionsAndSigners<'a>>
    where F: Fn(usize) -> u64,
{
    use curve25519_dalek_onchain::instruction as dalek;

    let dsl_len = equality_proof::DSL_INSTRUCTION_BYTES.len();
    let instruction_buffer_len = dalek::HEADER_SIZE + dsl_len;

    let mut ret = vec![];

    ret.push(InstructionsAndSigners{
        instructions: vec![
            system_instruction::create_account(
                &payer.pubkey(),
                &instruction_buffer.pubkey(),
                minimum_rent_balance(instruction_buffer_len),
                instruction_buffer_len as u64,
                &curve25519_dalek_onchain::id(),
            ),
            dalek::initialize_buffer(
                instruction_buffer.pubkey(),
                payer.pubkey(),
                dalek::Key::InstructionBufferV1,
                vec![],
            ),
        ],
        signers: vec![payer, instruction_buffer],
    });

    // write the instructions
    let mut dsl_idx = 0;
    let dsl_chunk = 800;
    loop {
        let mut instructions = vec![];
        let end = (dsl_idx+dsl_chunk).min(dsl_len);
        let done = end == dsl_len;
        instructions.push(
            dalek::write_bytes(
                instruction_buffer.pubkey(),
                payer.pubkey(),
                (dalek::HEADER_SIZE + dsl_idx).try_into().unwrap(),
                done,
                &equality_proof::DSL_INSTRUCTION_BYTES[dsl_idx..end],
            )
        );
        ret.push(InstructionsAndSigners{
            instructions,
            signers: vec![payer],
        });
        if done {
            break;
        } else {
            dsl_idx = end;
        }
    }

    ret
}

#[cfg(not(target_arch = "bpf"))]
#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct InstructionsAndSignerPubkeys {
    pub instructions: Vec<Instruction>,
    pub signers: Vec<Pubkey>,
}

// Returns a list of transaction instructions that can be sent to build the zk proof state used in
// a `transfer_chunk_slow`. These instructions assume that the instruction DSL has already been
// populated with `populate_transfer_proof_dsl`
#[cfg(not(target_arch = "bpf"))]
pub fn transfer_chunk_slow_proof<F>(
    payer: &Pubkey,
    instruction_buffer: &Pubkey,
    input_buffer: &Pubkey,
    compute_buffer: &Pubkey,
    transfer: &TransferData,
    minimum_rent_balance: F,
) -> Result<Vec<InstructionsAndSignerPubkeys>, Box<dyn std::error::Error>>
    where F: Fn(usize) -> u64,
{
    use crate::transcript::TranscriptProtocol;
    use crate::transfer_proof::TransferProof;
    use curve25519_dalek::scalar::Scalar;
    use curve25519_dalek_onchain::instruction as dalek;
    use curve25519_dalek_onchain::scalar::Scalar as OScalar;

    let equality_proof = equality_proof::EqualityProof::from_bytes(
        &transfer.proof.equality_proof.0)?;

    let points = [
        // statement inputs
        transfer.transfer_public_keys.src_pubkey.0,
        equality_proof::COMPRESSED_H,
        equality_proof.Y_0.0,

        transfer.transfer_public_keys.dst_pubkey.0,
        transfer.dst_cipher_key_chunk_ct.0[32..].try_into()?,
        equality_proof.Y_1.0,

        transfer.dst_cipher_key_chunk_ct.0[..32].try_into()?,
        transfer.src_cipher_key_chunk_ct.0[..32].try_into()?,
        transfer.src_cipher_key_chunk_ct.0[32..].try_into()?,
        equality_proof::COMPRESSED_H,
        equality_proof.Y_2.0,
    ];

    let mut transcript = TransferProof::transcript_new();
    TransferProof::build_transcript(
        &transfer.src_cipher_key_chunk_ct,
        &transfer.dst_cipher_key_chunk_ct,
        &transfer.transfer_public_keys,
        &mut transcript,
    )?;

    equality_proof::EqualityProof::build_transcript(
        &equality_proof,
        &mut transcript,
    )?;

    let challenge_c = transcript.challenge_scalar(b"c");

    // the equality_proof points are normal 'Scalar' but the DSL crank expects it's version of the
    // type
    let scalars = vec![
         equality_proof.sh_1,
         -challenge_c,
         -Scalar::one(),

         equality_proof.rh_2,
         -challenge_c,
         -Scalar::one(),

         challenge_c,
         -challenge_c,
         equality_proof.sh_1,
         -equality_proof.rh_2,
         -Scalar::one(),
    ]
        .iter()
        .map(|s| OScalar::from_canonical_bytes(s.bytes))
        .collect::<Option<Vec<_>>>()
        .ok_or("failed to canonicalise equality proof scalars")?;

    assert_eq!(points.len(), scalars.len());

    let input_buffer_len = dalek::HEADER_SIZE + points.len() * 32 * 2 + 128;

    let compute_buffer_len =
        dalek::HEADER_SIZE
        + 3 * 32 * 4                 // 3 proof groups
        + 32 * 12                    // decompression space
        + 32 * scalars.len()         // scalars
        + 32 * 4 * 8 * points.len()  // point lookup tables
        ;

    let mut ret = vec![];

    ret.push(InstructionsAndSignerPubkeys{
        instructions: vec![
            system_instruction::create_account(
                payer,
                input_buffer,
                minimum_rent_balance(input_buffer_len),
                input_buffer_len as u64,
                &curve25519_dalek_onchain::id(),
            ),
            system_instruction::create_account(
                payer,
                compute_buffer,
                minimum_rent_balance(compute_buffer_len),
                compute_buffer_len as u64,
                &curve25519_dalek_onchain::id(),
            ),
            dalek::initialize_buffer(
                *input_buffer,
                *payer,
                dalek::Key::InputBufferV1,
                vec![],
            ),
            dalek::initialize_buffer(
                *compute_buffer,
                *payer,
                dalek::Key::ComputeBufferV1,
                vec![*instruction_buffer, *input_buffer],
            ),
        ],
        signers: vec![*payer, *input_buffer, *compute_buffer],
    });

    ret.push(InstructionsAndSignerPubkeys{
        instructions: dalek::write_input_buffer(
            *input_buffer,
            *payer,
            &points,
            scalars.as_slice(),
        ),
        signers: vec![*payer],
    });

    let instructions_per_tx = 32;
    let num_cranks = equality_proof::DSL_INSTRUCTION_COUNT;
    let mut current = 0;
    let mut crank_transactions = 0;
    while current < num_cranks {
        let mut instructions = vec![];
        for j in 0..instructions_per_tx {
            if current >= num_cranks {
                break;
            }
            instructions.push(
                if crank_transactions == j {
                    dalek::noop()
                } else {
                    current += 1;
                    dalek::crank_compute(
                        *instruction_buffer,
                        *input_buffer,
                        *compute_buffer,
                    )
                },
            );
        }
        ret.push(InstructionsAndSignerPubkeys{
            instructions,
            signers: vec![*payer],
        });
        crank_transactions += 1;
    }

    Ok(ret)
}
