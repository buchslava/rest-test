const axios = require('axios');
const initData = require('./init-data');
const utils = require('./utils');
const descriptors = initData.getRequestDescriptors(initData.settings);

const REQUESTS_PER_MINUTE = 30;
const RETRIES_QUANTITY = 2;

const chunks = utils.chunk(descriptors, REQUESTS_PER_MINUTE);
const out = [];

let interval;

const getResult = () => {
  console.log(JSON.stringify(out, null, 2));
};

const processTick = () => {
  if (chunks.length <= 0) {
    clearInterval(interval);
    getResult();
    return;
  }

  const chunk = chunks.pop();

  axios.all(chunk.map(desc => utils.processRequest(desc))).then(result => {
    const failedDescriptors = [];

    for (const response of result) {
      if (response.error && response.descriptor.retries < RETRIES_QUANTITY) {
        console.warn(`retry ${response.descriptor.url}`);
        response.descriptor.retries++;
        failedDescriptors.push(response.descriptor);
      } else if (response.error && response.descriptor.retries >= RETRIES_QUANTITY) {
        out.push({
          url: response.descriptor.url,
          Status: 'Failed',
          response: {
          }
        });
      } else {
        out.push({
          url: response.config.url,
          Status: 'Success',
          response: response.data
        });
      }
    }

    if (failedDescriptors.length > 0) {
      chunks.push(...utils.chunk(failedDescriptors, REQUESTS_PER_MINUTE));
      processTick();
    }
  });
};

processTick();
interval = setInterval(processTick, 1000 * 10);

