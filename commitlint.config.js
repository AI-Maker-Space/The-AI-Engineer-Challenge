module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-empty': [0],                // Allow commits without a scope
    'body-max-line-length': [2, 'always', 100],  // Limit body lines to 100 chars
    'header-max-length': [2, 'always', 72],      // Limit header to 72 chars (Git standard)
    'subject-case': [0]                // No restriction on casing
  }
};