const paths = ['/', '/index', '/prd', '/prd/', '/api/test', '/test/path'];
const regex = /^\/(?!api)[a-zA-Z0-9\/\-_]*$/;

for (const p of paths) {
  console.log(p, '->', regex.test(p));
}