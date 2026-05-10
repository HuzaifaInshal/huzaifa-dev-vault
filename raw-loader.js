const fs = require("fs");

module.exports = function rawLoader() {
  const source = fs.readFileSync(this.resourcePath, "utf-8");
  this.addDependency(this.resourcePath);
  return `export default ${JSON.stringify(source)}`;
};
