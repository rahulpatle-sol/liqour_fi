export const IDL = {
  "address": "FGJS4S51o9rSvxeomGrqacdwPFnZbBuU6p9KzhRHUx3b",
  "metadata": {
    "name": "liqour_defi",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "deposit",
      "discriminator": [242, 35, 198, 137, 82, 225, 242, 182],
      "accounts": [
        { "name": "user", "writable": true, "signer": true },
        { "name": "user_usdc", "writable": true },
        { "name": "vault_token_account", "writable": true },
        { "name": "vault_config", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [118,97,117,108,116,95,99,111,110,102,105,103] }] } },
        { "name": "user_vault", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [117,115,101,114,95,118,97,117,108,116] }, { "kind": "account", "path": "user" }] } },
        { "name": "token_program" },
        { "name": "system_program", "address": "11111111111111111111111111111111" },
        { "name": "rent", "address": "SysvarRent111111111111111111111111111111111" }
      ],
      "args": [{ "name": "amount", "type": "u64" }]
    },
    {
      "name": "initialize",
      "discriminator": [175, 175, 109, 31, 13, 152, 155, 237],
      "accounts": [
        { "name": "authority", "writable": true, "signer": true },
        { "name": "usdc_mint" },
        { "name": "vault_token_account", "writable": true, "signer": true },
        { "name": "vault_config", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [118,97,117,108,116,95,99,111,110,102,105,103] }] } },
        { "name": "token_program" },
        { "name": "system_program", "address": "11111111111111111111111111111111" },
        { "name": "rent", "address": "SysvarRent111111111111111111111111111111111" }
      ],
      "args": []
    },
    {
      "name": "withdraw",
      "discriminator": [183, 18, 70, 156, 148, 109, 161, 34],
      "accounts": [
        { "name": "authority", "signer": true },
        { "name": "user_usdc", "writable": true },
        { "name": "vault_token_account", "writable": true },
        { "name": "vault_config", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [118,97,117,108,116,95,99,111,110,102,105,103] }] } },
        { "name": "user_vault", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [117,115,101,114,95,118,97,117,108,116] }, { "kind": "account", "path": "user_usdc.owner" }] } },
        { "name": "token_program" }
      ],
      "args": [{ "name": "amount", "type": "u64" }]
    }
  ],
  "accounts": [
    { "name": "UserVault", "discriminator": [23, 76, 96, 159, 210, 10, 5, 22] },
    { "name": "VaultConfig", "discriminator": [99, 86, 43, 216, 184, 102, 119, 77] }
  ],
  "errors": [
    { "code": 6000, "name": "ZeroAmount", "msg": "Amount must be greater than zero" },
    { "code": 6001, "name": "InsufficientVaultBalance", "msg": "Insufficient vault balance" },
    { "code": 6002, "name": "Unauthorized", "msg": "Unauthorized" },
    { "code": 6003, "name": "Overflow", "msg": "Math overflow" }
  ],
  "types": [
    {
      "name": "UserVault",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "owner", "type": "pubkey" },
          { "name": "deposited", "type": "u64" },
          { "name": "withdrawn", "type": "u64" },
          { "name": "bump", "type": "u8" }
        ]
      }
    },
    {
      "name": "VaultConfig",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "authority", "type": "pubkey" },
          { "name": "usdc_mint", "type": "pubkey" },
          { "name": "vault_token_account", "type": "pubkey" },
          { "name": "total_deposited", "type": "u64" },
          { "name": "bump", "type": "u8" }
        ]
      }
    }
  ]
} as const
