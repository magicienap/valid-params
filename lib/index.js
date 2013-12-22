var _ = require('lodash');

var validParams = function(params, model) {
  if (!model || _.isEmpty(model)) {
    return {};
  }

  var finalParams = _.mapValues(model, function(value) {
    if (_.isFunction(value)) {
      return value(this)
    } else {
      return this[value];
    }
  }, params);
  return finalParams;
}

module.exports = validParams;