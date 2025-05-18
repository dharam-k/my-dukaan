module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "script",  // important for CommonJS
  },
  ignorePatterns: ["node_modules/"],
};