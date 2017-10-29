import domain from './domain';

let urls = {
  rank: `${domain}app/main/rank.do`,
  config: '${domain}/app/main/config.do',
};

if (process.env.NODE_ENV === 'development') {
  urls = require('./urls_mock');
}

export default urls;
