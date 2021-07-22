const path = require('path');

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['loremflickr.com'],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};
