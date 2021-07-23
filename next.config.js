const path = require('path');

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['picsum.photos'],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};
