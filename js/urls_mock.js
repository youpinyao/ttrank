import domain from './domain';

const urls = {
  rank: `json/rank.json`,
  config: `json/config.json`,
};

Object.keys(urls).forEach(key => {
  urls[key] = `${domain}${urls[key]}`;
});

module.exports = urls;
