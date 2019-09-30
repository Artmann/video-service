const fetch = require('node-fetch');
const { parse } = require('node-html-parser');

const cache = {};

let numberOfRequests = 0;
let numberOfRequestsServedFromCache = 0;

async function fetchId(title, artists) {
  const query = `${title} - ${ artists.length > 0 ? artists[0] : 'Official' }`;
  const url = `https://www.youtube.com/results?search_query=${query}`;

  const response = await fetch(url);
  const html = await response.text();
  const document = parse(html);

  const ids = document.querySelectorAll('.yt-uix-tile-link')
    .map(element => element.attributes.href)
    .filter(path => path.indexOf('/watch?v=') === 0)
    .filter(path => !path.includes('list'))
    .map(path => path.replace('/watch?v=', ''));

  if (ids.length === 0) {
    throw new Error('Not Found.');
  }

  return ids[0];
}

async function getId(title, artists) {
  const cacheKey = [title, ...artists].join(', ');

  if (cache.hasOwnProperty(cacheKey)) {
    numberOfRequestsServedFromCache += 1;

    return cache[cacheKey];
  }

  const id = await fetchId(title, artists);

  cache[cacheKey] = id;

  return id;
}

module.exports = async function findVideo(request) {
  const [title, ...artists] = request;

  numberOfRequests += 1;

  if (!title) {
    throw new Error('title is required.');
  }

  const id = await getId(title, artists);

  return {
    video: {
      id
    },
    stats: {
      cacheHitRatio: numberOfRequests > 0 ? (numberOfRequestsServedFromCache / numberOfRequests) : 0,
      numberOfRequests
    }
  }
}
