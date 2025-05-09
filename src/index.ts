import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';

interface MyTokenPayload {
  sub: string;
  name: string;
  role: string;
  iat?: number;
  exp?: number;
  iss?: string;
}

const KEY_DIR = path.resolve(__dirname, '..', 'keys');
const PRIVATE_KEY = fs.readFileSync(path.join(KEY_DIR, 'private.pem'), 'utf8');
const PUBLIC_KEY  = fs.readFileSync(path.join(KEY_DIR, 'public.pem'),  'utf8');

const payload: MyTokenPayload = {
  sub: '1234567890',
  name: 'Alice Example',
  role: 'admin',
};

const signOptions: SignOptions = {
  algorithm: 'RS256',
  expiresIn: '1h',
  issuer: 'your-app.com',
};

const verifyOptions: VerifyOptions = {
  algorithms: ['RS256'],
  issuer: 'your-app.com',
};

try {
  const fips = crypto.getFips();
  console.log(`FIPS mode: ${fips === 1 ? 'enabled' : 'disabled'}`);
} catch (err) {
  console.error('Failed to check FIPS mode:', err);
}

const token = jwt.sign(payload, PRIVATE_KEY, signOptions);
console.log('Generated JWT:\n', token);
try {
  const decoded = jwt.verify(token, PUBLIC_KEY, verifyOptions) as MyTokenPayload;
  console.log('\nDecoded payload:\n', decoded);
} catch (err) {
  console.error('Token verification failed:', err);
}
