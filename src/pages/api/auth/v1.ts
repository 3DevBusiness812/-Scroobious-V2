import { NextApiRequest, NextApiResponse } from 'next'
import { env } from '~/env.mjs';
import { warn, error } from '~/utils/logger';
import { getSessionCookieValue, encodeTokenForUserId } from '~/utils/auth';
import jose from "jose"
import crypto from "crypto"
import futoinHkdf from 'futoin-hkdf'

/**
 * Sign in v1 users into v2:
 *  1. validate POSTed token and parse user data (id)
 *  2. generate valid v2 JWT token
 *  3. sign in into v2 — redirect to a /auth/v1 page in the browser so we actually set the cookie on the client
 * 
 * @param req 
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST')
      throw new Error(`Invalid Request`)

    const { token } = req.body ?? {}
    const returnTo = req.query.returnTo as string ?? (req.body.returnTo ?? "")

    const secret = env.V1_NEXTAUTH_SECRET
    const decoded = await decodeV1Token({ token, secret })
    const { sub: userId } = decoded ?? {}

    if (!userId) {
      throw new Error(`Invalid v1 JWT`)
    }

    const v2Token = await encodeTokenForUserId(userId)

    res.setHeader("Set-Cookie", getSessionCookieValue(v2Token))
    res.redirect(303, `/auth/v1?returnTo=${returnTo}`);
  } catch (err) {
    error(err)
    res.status(401).json({ err })
  }
}

//
// V1's NextAuth@3 — https://github.com/nextauthjs/next-auth/blob/v3/src/lib/jwt.js
//
const DEFAULT_SIGNATURE_ALGORITHM = "HS512"
const DEFAULT_ENCRYPTION_ALGORITHM = "A256GCM"
const DEFAULT_ENCRYPTION_ENABLED = false
const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60 // 30 days

let DERIVED_SIGNING_KEY_WARNING = false
let DERIVED_ENCRYPTION_KEY_WARNING = false

function getDerivedSigningKey(secret: string) {
  if (!DERIVED_SIGNING_KEY_WARNING) {
    DERIVED_SIGNING_KEY_WARNING = true
  }

  const buffer = hkdf(secret, {
    byteLength: 64,
    encryptionInfo: "NextAuth.js Generated Signing Key",
  })
  const key = jose.JWK.asKey(buffer, {
    alg: DEFAULT_SIGNATURE_ALGORITHM,
    use: "sig",
    kid: "nextauth-auto-generated-signing-key",
  })
  return key
}

function getDerivedEncryptionKey(secret: string) {
  if (!DERIVED_ENCRYPTION_KEY_WARNING) {
    DERIVED_ENCRYPTION_KEY_WARNING = true
  }

  const buffer = hkdf(secret, {
    byteLength: 32,
    encryptionInfo: "NextAuth.js Generated Encryption Key",
  })
  const key = jose.JWK.asKey(buffer, {
    alg: DEFAULT_ENCRYPTION_ALGORITHM,
    use: "enc",
    kid: "nextauth-auto-generated-encryption-key",
  })
  return key
}

function hkdf(secret: string, { byteLength, encryptionInfo, digest = "sha256" }: { byteLength: number, encryptionInfo: string, digest?: string }) {
  if (crypto.hkdfSync) {
    return Buffer.from(
      crypto.hkdfSync(
        digest,
        secret,
        Buffer.alloc(0),
        encryptionInfo,
        byteLength
      )
    )
  }
  return futoinHkdf(secret, byteLength, {
    info: encryptionInfo,
    hash: digest,
  })
}

export async function decodeV1Token({
  secret,
  token,
  maxAge = DEFAULT_MAX_AGE,
  signingKey,
  verificationKey = signingKey, // Optional (defaults to encryptionKey)
  verificationOptions = {
    maxTokenAge: `${maxAge}s`,
    algorithms: [DEFAULT_SIGNATURE_ALGORITHM],
  },
  encryptionKey,
  decryptionKey = encryptionKey, // Optional (defaults to encryptionKey)
  decryptionOptions = {
    algorithms: [DEFAULT_ENCRYPTION_ALGORITHM],
  },
  encryption = DEFAULT_ENCRYPTION_ENABLED,
}: {
  secret: string,
  token: string,
  maxAge?: number,
  signingKey?: string,
  verificationKey?: string, // Optional (defaults to encryptionKey)
  verificationOptions?: {
    maxTokenAge: string,
    algorithms: string[],
  },
  encryptionKey?: string,
  decryptionKey?: string, // Optional (defaults to encryptionKey)
  decryptionOptions?: {
    algorithms: string[],
  },
  encryption?: boolean,
}) {
  if (!token) return null

  let tokenToVerify = token

  if (encryption) {
    // Encryption Key
    const _encryptionKey = decryptionKey
      ? jose.JWK.asKey(JSON.parse(decryptionKey))
      : getDerivedEncryptionKey(secret)

    // Decrypt token
    const decryptedToken = jose.JWE.decrypt(
      token,
      _encryptionKey,
      decryptionOptions
    )
    tokenToVerify = decryptedToken.toString("utf8")
  }

  // Signing Key
  const _signingKey = verificationKey
    ? jose.JWK.asKey(JSON.parse(verificationKey))
    : getDerivedSigningKey(secret)

  // Verify token
  return jose.JWT.verify(tokenToVerify, _signingKey, verificationOptions) as { sub: string }
}
