const prod = {
  apiBaseUrl: 'https://maidentiedot-backend.ahojukka5.com/api',
};

const dev = {
  apiBaseUrl: 'http://localhost:3003/api',
};

const config = process.env.NODE_ENV === 'development' ? dev : prod;

export default config;
