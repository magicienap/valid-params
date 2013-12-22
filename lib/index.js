var _ = require('lodash');

var validParams = function(params, model) {
  if (!model || _.isEmpty(model)) {
    return {};
  }

  if (_.isEmpty(params)) {
    var finalParams = _.mapValues(model, function(value) {
      return undefined;
    });
    return finalParams;
  }
}

module.exports = validParams;