const defaultConfig = require('@stacks/prettier-config');

module.exports = {
  ...defaultConfig,
  importOrder: [
    '^react',
    '<THIRD_PARTY_MODULES>',
    '^@(assets|components|constants|crypto|hooks|utils)/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
