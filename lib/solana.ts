import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'

export const PROGRAM_ID = new PublicKey('FGJS4S51o9rSvxeomGrqacdwPFnZbBuU6p9KzhRHUx3b')
export const USDC_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU')
export const VAULT_TOKEN_ACCOUNT = new PublicKey('8PF5cjyr9Kumoh2PmxWnvig6L8aJojZdnp23TATkaEdG')
export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xr25ix9sJ5qwTtK6')
export const SYSTEM_PROGRAM_ID = PublicKey.default
export const RENT_PROGRAM_ID = new PublicKey('SysvarRent111111111111111111111111111111111')

export function getConnection(): Connection {
  const rpc = process.env.NEXT_PUBLIC_RPC_URL
  if (rpc) return new Connection(rpc)
  return new Connection(clusterApiUrl('devnet'))
}

export function getAssociatedTokenAddress(wallet: PublicKey, mint: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  )[0]
}
