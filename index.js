const axios = require('axios');
const initData = require('./init-data');
const utils = require('./utils');

const REQUESTS_PER_MINUTE = 30;
const RETRIES_QUANTITY = 2;

exports.working = false;

exports.bulkRequest = async () => {
  return new Promise(resolve => {
    exports.working = true;

    const descriptors = initData.getRequestDescriptors(initData.settings);
    const chunks = utils.chunk(descriptors, REQUESTS_PER_MINUTE);
    const out = [];

    let timeout;

    const processTick = () => {
      const chunk = chunks.pop();

      axios.all(chunk.map(desc => utils.processRequest(desc))).then(result => {
        const failedDescriptors = [];

        for (const response of result) {
          if (response.error && response.descriptor.retries < RETRIES_QUANTITY) {
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
          // todo: optimize this logic
          if (utils.totalChunksCount(chunks) > REQUESTS_PER_MINUTE) {
            clearTimeout(timeout);
            timeout = setTimeout(processTick, 1000 * 60);
          } else {
            processTick();
          }
        } else if (chunks.length <= 0) {
          exports.working = false;
          clearTimeout(timeout);
          resolve(out);
        } else {
          clearTimeout(timeout);
          timeout = setTimeout(processTick, 1000 * 60);
        }
      });
    };


    processTick();
  });
};
