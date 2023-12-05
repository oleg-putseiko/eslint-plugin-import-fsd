const plugin = {
  rules: {
    'no-denied-layers': require('./rules/no-denied-layers'),
    'no-unknown-layers': require('./rules/no-unknown-layers'),
  },
};

export default plugin;
