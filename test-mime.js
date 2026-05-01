const mime = require("mime");
const files = ["index.html", "test.css", "test.js", "manifest.js"];

for (const f of files) {
  console.log(f, "->", mime.lookup(f));
}
