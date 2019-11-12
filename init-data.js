exports.settings = {
  commands: [
    {
      verb: 'GET',
      url: 'http://www.mocky.io/v2/5d9c2d4931000055002fc3e5/param1',
      params: [
        {
          param1: 'avi'
        }
      ]
    },
    {
      verb: 'GET',
      url: 'http://www.mocky.io/v2/5d99a2893100005d0097d991/param1',
      params: [
        {
          'param1': '55',
        },
        {
          'param1': '56',
        },
      ]
    },
    {
      verb: 'POST',
      url: 'http://www.mocky.io/v2/5d99a2c6310000550097d992/param1',
      params: [
        {
          'param1': '55',
        },
        {
          'param1': '56',
          'param2': 't'
        },
        {
          'param1': '57',
        }
      ]
    }
  ]
};

exports.getRequestDescriptors = function(settings) {
  const result = [];
  for (const item of settings.commands) {
    for (const paramRecord of item.params) {
      let url = item.url;

      const bodyParameters = {};
      for (const paramKey of Object.keys(paramRecord)) {
        if (paramKey === 'param1') {
          url = url.replace('param1', paramRecord[paramKey]);
        } else {
          if (item.verb !== 'POST') {
            console.error('POST method expected', JSON.stringify(item, null, 2));
          } else {
            bodyParameters[paramKey] = paramRecord[paramKey];
          }
        }
      }

      result.push({url, method: item.verb, bodyParameters, retries: 0});
    }
  }
  return result;
}
