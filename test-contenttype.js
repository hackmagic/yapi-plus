const { contentType } = require("mime-types");
const paths = ["test.html", "manifest.js", "test.css", "index.abc"];

for (const p of paths) {
  console.log(p, "->", contentType(p));
}
