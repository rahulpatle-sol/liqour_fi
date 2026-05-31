import { PublicKey, Transaction, Connection, SystemProgram } from '@solana/web3.js'
import { BN, Program, AnchorProvider } from '@coral-xyz/anchor'
import { IDL } from './idl'

const USDC_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU')
const VAULT_TOKEN_ACCOUNT = new PublicKey('8PF5cjyr9Kumoh2PmxWnvig6L8aJojZdnp23TATkaEdG')
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xr25ix9sJ5qwTtK6')

function getAssociatedTokenAddress(wallet: PublicKey, mint: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  )[0]
}

export async function depositUSDC(
  connection: Connection,
  wallet: { publicKey: PublicKey; signTransaction: (tx: Transaction) => Promise<Transaction> },
  amount: number
): Promise<string> {
  const provider = new AnchorProvider(connection, wallet as any, {})
  const program = new Program(IDL as any, provider)

  const userUsdcAta = getAssociatedTokenAddress(wallet.publicKey, USDC_MINT)
  const [vaultConfig] = PublicKey.findProgramAddressSync(
    [Buffer.from('vault_config')],
    program.programId
  )
  const [userVault] = PublicKey.findProgramAddressSync(
    [Buffer.from('user_vault'), wallet.publicKey.toBuffer()],
    program.programId
  )

  const tx = await program.methods
    .deposit(new BN(Math.round(amount * 1_000_000)))
    .accounts({
      user: wallet.publicKey,
      userUsdc: userUsdcAta,
      vaultTokenAccount: VAULT_TOKEN_ACCOUNT,
      vaultConfig,
      userVault,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: new PublicKey('SysvarRent111111111111111111111111111111111'),
    } as any)
    .transaction()

  tx.feePayer = wallet.publicKey
  const blockhash = (await connection.getLatestBlockhash()).blockhash
  tx.recentBlockhash = blockhash

  const signedTx = await wallet.signTransaction(tx)
  const sig = await connection.sendRawTransaction(signedTx.serialize())
  await connection.confirmTransaction(sig, 'confirmed')

  return sig
}
