module.exports = ({ file, options, env }) => ({
  plugins: {
    'postcss-import': { root: file.dirname },
    'autoprefixer': "last 100 versions"
  }
})
