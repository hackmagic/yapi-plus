import test from 'ava';

const yapi = require('../../server/yapi.js');
const tokenUtils = require('../../server/utils/token.js');

test.beforeEach(() => {
  delete process.env.YAPI_TOKEN_PASSSALT;
  yapi.WEBCONFIG = Object.assign({}, yapi.WEBCONFIG, {
    passsalt: 'test-passsalt-1234567890'
  });
});

test.afterEach(() => {
  delete process.env.YAPI_TOKEN_PASSSALT;
});

test('getToken and parseToken support new cipheriv format', t => {
  const encoded = tokenUtils.getToken('project-token', 101);
  const parsed = tokenUtils.parseToken(encoded);

  t.true(encoded.startsWith('v2:'));
  t.deepEqual(parsed, {
    uid: '101',
    projectToken: 'project-token'
  });
});

test('parseToken keeps legacy token compatibility when passsalt matches', t => {
  const legacyToken = (() => {
    const crypto = require('crypto');
    const password = Buffer.from(yapi.WEBCONFIG.passsalt, 'utf8');
    let derived = Buffer.alloc(0);
    let block = Buffer.alloc(0);

    while (derived.length < 40) {
      const hash = crypto.createHash('md5');
      hash.update(block);
      hash.update(password);
      block = hash.digest();
      derived = Buffer.concat([derived, block]);
    }

    const key = derived.subarray(0, 24);
    const iv = derived.subarray(24, 40);
    const cipher = crypto.createCipheriv('aes-192-cbc', key, iv);
    const encrypted = Buffer.concat([
      cipher.update('202|legacy-project-token', 'utf8'),
      cipher.final()
    ]);
    return encrypted.toString('hex');
  })();

  const parsed = tokenUtils.parseToken(legacyToken);
  t.deepEqual(parsed, {
    uid: '202',
    projectToken: 'legacy-project-token'
  });
});

test('getToken returns raw project token when uid is missing', t => {
  t.is(tokenUtils.getToken('project-token'), 'project-token');
});

test('token helpers reject missing or default passsalt', t => {
  yapi.WEBCONFIG = Object.assign({}, yapi.WEBCONFIG, {
    passsalt: 'abcde'
  });

  const error = t.throws(() => tokenUtils.getToken('project-token', 1));
  t.true(error.message.includes('passsalt'));
});
