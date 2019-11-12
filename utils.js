const axios = require('axios');

exports.processRequest = descriptor => {
  if (descriptor.method === 'GET') {
    return axios.get(descriptor.url)
      .catch(function () { return { error: true, descriptor } });
  }

  if (descriptor.method === 'POST') {
    return axios.post(descriptor.url, descriptor.bodyParameters)
      .catch(function () { return { error: true, descriptor } });
  }

  return null;
}

exports.chunk = (arr, len) => {
  const chunks = [];
  const n = arr.length;
  let i = 0;

  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }

  return chunks;
}
