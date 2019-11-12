const axios = require('axios');
const initData = require('./init-data');
const descriptors = initData.getRequestDescriptors(initData.settings);

const processRequest = descriptor => {
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

axios.all(descriptors.map(desc => processRequest(desc))).then(result => {
  const out = result.map(response => response.error ? ({
    url: response.descriptor.url,
    Status: 'Failed',
    response: {
    }
  }) : ({
    url: response.config.url,
    Status: 'Success',
    response: response.data
  }));
  console.log(out);
});

/*(async () => {
  while (descriptors.length > 0) {
    const desc = descriptors.pop();

    try {
      if (desc.method === 'GET') {
        const r = await axios.get(desc.url);
        console.log(r.data);
      }
    } catch (e) {
      console.log(e, desc);
    }
  }
})();
*/
