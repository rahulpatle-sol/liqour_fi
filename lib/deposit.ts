import { PublicKey, Transaction, Connection, SystemProgram } from '@solana/web3.js'
import { BN, Program, AnchorProvider } from '@coral-xyz/anchor'
import { IDL } from './idl'
import { USDC_MINT, VAULT_TOKEN_ACCOUNT, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from './solana'

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
