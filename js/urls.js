import domain from './domain';

let urls = {
  rank: `screen/main/rank.do`,
  config: `screen/main/config.do`,
};

Object.keys(urls).forEach(key => {
  urls[key] = `${domain}${urls[key]}`;
});

if (process.env.NODE_ENV === 'development') {
  urls = require('./urls_mock');
}

export default urls;
