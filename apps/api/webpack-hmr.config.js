/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = function (options, webpack) {
  return {
    ...options,
    externals: [
      ...options.externals,
      '@prisma/client',
      '@adagio/database',
      '@adagio/auth',
      '@adagio/theory',
      '@adagio/types',
    ],
    output: {
      ...options.output,
      library: {
        type: 'commonjs',
      },
    },
  };
};
