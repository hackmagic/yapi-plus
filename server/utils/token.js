const yapi = require('../yapi')

const crypto = require('crypto');

const defaultSalt = 'abcde';
const TOKEN_PREFIX = 'v2';
const TOKEN_KEY_LEN = 32;
const TOKEN_IV_LEN = 16;
const TOKEN_ALGORITHM = 'aes-256-cbc';
const TOKEN_KDF_SALT = 'yapi-plus:token:v2';

function resolvePasssalt() {
  const passsalt = process.env.YAPI_TOKEN_PASSSALT || yapi.WEBCONFIG.passsalt;
  if (!passsalt || passsalt === defaultSalt) {
    throw new Error('token 加密配置缺失，请在 config.json 或环境变量 YAPI_TOKEN_PASSSALT 中设置非默认 passsalt');
  }
  if (process.env.YAPI_TOKEN_PASSSALT && yapi.WEBCONFIG.passsalt !== process.env.YAPI_TOKEN_PASSSALT) {
    yapi.WEBCONFIG.passsalt = process.env.YAPI_TOKEN_PASSSALT;
  }
  return passsalt;
}

function deriveKey(passsalt) {
  return crypto.pbkdf2Sync(passsalt, TOKEN_KDF_SALT, 100000, TOKEN_KEY_LEN, 'sha256');
}

function encodeTokenPayload(payload, passsalt) {
  const iv = crypto.randomBytes(TOKEN_IV_LEN);
  const key = deriveKey(passsalt);
  const cipher = crypto.createCipheriv(TOKEN_ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), 'utf8'),
    cipher.final()
  ]);
  return [TOKEN_PREFIX, iv.toString('hex'), encrypted.toString('hex')].join(':');
}

function decodeTokenPayload(token, passsalt) {
  const parts = token.split(':');
  if (parts.length !== 3 || parts[0] !== TOKEN_PREFIX) {
    return null;
  }

  const iv = Buffer.from(parts[1], 'hex');
  const encrypted = Buffer.from(parts[2], 'hex');
  const key = deriveKey(passsalt);
  const decipher = crypto.createDecipheriv(TOKEN_ALGORITHM, key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ]).toString('utf8');
  return JSON.parse(decrypted);
}

function evpBytesToKey(password, keyLen, ivLen) {
  const passwordBuffer = Buffer.isBuffer(password) ? password : Buffer.from(String(password), 'utf8');
  let derived = Buffer.alloc(0);
  let block = Buffer.alloc(0);

  while (derived.length < keyLen + ivLen) {
    const hash = crypto.createHash('md5');
    hash.update(block);
    hash.update(passwordBuffer);
    block = hash.digest();
    derived = Buffer.concat([derived, block]);
  }

  return {
    key: derived.subarray(0, keyLen),
    iv: derived.subarray(keyLen, keyLen + ivLen)
  };
}

function decodeLegacyToken(token, passsalt) {
  const { key, iv } = evpBytesToKey(passsalt, 24, 16);
  const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv);
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(token, 'hex')),
    decipher.final()
  ]);
  return decrypted.toString('utf8');
}

exports.getToken = function getToken(token, uid){
  if(!token)throw new Error('token 不能为空')
  if (uid === undefined || uid === null || uid === '') {
    return token;
  }
  const passsalt = resolvePasssalt();
  return encodeTokenPayload({ uid: String(uid), projectToken: token }, passsalt);
}

exports.parseToken = function parseToken(token){
  if(!token)throw new Error('token 不能为空')
  const passsalt = resolvePasssalt();
  try{
    const parsed = decodeTokenPayload(token, passsalt);
    if (parsed && parsed.uid && parsed.projectToken) {
      return parsed;
    }
  }catch(e){}

  let tokens;
  try{
    tokens = decodeLegacyToken(token, passsalt)
  }catch(e){}
  if(tokens && typeof tokens === 'string' && tokens.indexOf('|') > 0){
    tokens = tokens.split('|')
    return {
      uid: tokens[0],
      projectToken: tokens[1]
    }
  }
  return false;
  
}

