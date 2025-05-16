import path from 'path';

const rootPath = __dirname;

const config = {
    rootPath,
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    publicPath: path.join(rootPath, 'public'),
    db: 'mongodb://localhost/shop-js-27'
};

export default config;