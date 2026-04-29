const dns = require('dns').promises;
const net = require('net');
const axios = require('axios').default || require('axios');

const PRIVATE_IPV4_RANGES = [
  ['10.0.0.0', '10.255.255.255'],
  ['127.0.0.0', '127.255.255.255'],
  ['169.254.0.0', '169.254.255.255'],
  ['172.16.0.0', '172.31.255.255'],
  ['192.168.0.0', '192.168.255.255'],
  ['0.0.0.0', '0.255.255.255']
];

const METADATA_HOSTS = new Set([
  'metadata.google.internal',
  'metadata',
  '169.254.169.254'
]);

function ipv4ToInt(ip) {
  const segments = ip.split('.').map(Number);
  if (segments.length !== 4 || segments.some(part => Number.isNaN(part) || part < 0 || part > 255)) {
    return null;
  }
  return ((segments[0] << 24) >>> 0) + ((segments[1] << 16) >>> 0) + ((segments[2] << 8) >>> 0) + segments[3];
}

function isPrivateIpv4(ip) {
  const value = ipv4ToInt(ip);
  if (value === null) {
    return true;
  }

  return PRIVATE_IPV4_RANGES.some(([start, end]) => {
    const startVal = ipv4ToInt(start);
    const endVal = ipv4ToInt(end);
    return value >= startVal && value <= endVal;
  });
}

function isPrivateIpv6(ip) {
  const normalized = ip.toLowerCase();
  return (
    normalized === '::1' ||
    normalized === '::' ||
    normalized.startsWith('fe80:') ||
    normalized.startsWith('fc') ||
    normalized.startsWith('fd') ||
    normalized.startsWith('::ffff:127.') ||
    normalized.startsWith('::ffff:10.') ||
    normalized.startsWith('::ffff:192.168.') ||
    normalized.startsWith('::ffff:169.254.')
  );
}

function isUnsafeIp(ip) {
  const family = net.isIP(ip);
  if (!family) {
    return true;
  }
  if (family === 4) {
    return isPrivateIpv4(ip);
  }
  return isPrivateIpv6(ip);
}

async function assertSafeExternalUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch (err) {
    throw new Error('URL 格式不正确');
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('仅允许 http/https 协议');
  }

  const hostname = (parsed.hostname || '').toLowerCase();
  if (!hostname) {
    throw new Error('URL 主机名不能为空');
  }
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local')) {
    throw new Error('不允许访问本地地址');
  }
  if (METADATA_HOSTS.has(hostname)) {
    throw new Error('不允许访问 metadata 地址');
  }

  if (net.isIP(hostname)) {
    if (isUnsafeIp(hostname)) {
      throw new Error('不允许访问内网或本地 IP');
    }
    return parsed;
  }

  let resolved;
  try {
    resolved = await dns.lookup(hostname, { all: true });
  } catch (err) {
    throw new Error('域名解析失败');
  }

  if (!resolved || resolved.length === 0) {
    throw new Error('域名未解析到有效地址');
  }

  if (resolved.some(record => isUnsafeIp(record.address))) {
    throw new Error('不允许访问内网或本地地址');
  }

  return parsed;
}

async function fetchSafeJson(rawUrl, options = {}) {
  const {
    timeout = 5000,
    maxBytes = 1024 * 1024,
    maxRedirects = 2
  } = options;

  const parsed = await assertSafeExternalUrl(rawUrl);
  const response = await axios.get(parsed.toString(), {
    timeout,
    maxRedirects,
    maxContentLength: maxBytes,
    responseType: 'text',
    transformResponse: [data => data],
    validateStatus: status => status >= 200 && status < 300
  });

  if (Buffer.byteLength(response.data || '', 'utf8') > maxBytes) {
    throw new Error('响应体过大');
  }

  let json;
  try {
    json = JSON.parse(response.data);
  } catch (err) {
    throw new Error('返回数据格式不是 JSON');
  }

  if (json == null || typeof json !== 'object') {
    throw new Error('返回数据格式不是 JSON');
  }

  return json;
}

module.exports = {
  assertSafeExternalUrl,
  fetchSafeJson
};
