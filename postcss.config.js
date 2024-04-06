import postcssSimpleVars from 'postcss-simple-vars';
import postcssNested from 'postcss-nested';
import postcssMixins from 'postcss-mixins';
import postcssPresetEnv from 'postcss-preset-env';

import colors from './src/styles/colors.js';

export default {
  plugins: [
    postcssSimpleVars({ silent: true, variables: colors }),
    postcssNested(),
    postcssMixins(),
    postcssPresetEnv(),
  ],
};
