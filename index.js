const axios = require('axios');
const cwait = require('cwait');
const TaskQueue = cwait.TaskQueue;
const initData = require('./init-data');
const MAX_SIMULTANEOUS_DOWNLOADS = 3;

exports.working = false;

let requestNum = 0;

exports.bulkRequest = async () => {
  return new Promise(async resolve => {
    exports.working = true;

    const queue = new TaskQueue(Promise, MAX_SIMULTANEOUS_DOWNLOADS);
    const results = await Promise.all(initData.urls.map(queue.wrap(async url => {
      console.log(`request #${requestNum++}`);
      return await axios.get(url);
    })));

    exports.working = false;
    resolve(results);
  });
};
