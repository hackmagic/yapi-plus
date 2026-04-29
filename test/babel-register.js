process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

require('babel-register')({
  babelrc: false,
  presets: [
    ['es2015', { modules: 'commonjs' }],
    'es2017',
    'stage-0'
  ],
  plugins: ['transform-runtime'],
  ignore: /node_modules/
});
