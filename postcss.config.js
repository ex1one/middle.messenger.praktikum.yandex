import postcssNested from 'postcss-nested';
import postcssMixins from 'postcss-mixins';
import postcssPresetEnv from 'postcss-preset-env';

export default {
  css: {
    postcss: './postcss.config.js',
  },
  plugins: [postcssNested(), postcssMixins(), postcssPresetEnv()],
};
