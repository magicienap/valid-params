# valid-params

This library is used to extract values from an objet and return them with some
transformations. It can be used to valid the parameters received from a web
application.

# Usage

```javascript
var validParams = require('valid-params');

var params = {
  firstName:   "Antoine",
  lastName:    "Proulx",
  phoneNumber: "123 456-7890",
  admin:       true
};

// The model defines what will be the object returned by validParams. The value
// of the key is a function that takes an argument representing the parameters
// to valid. This function should extract the required parameter(s) from it,
// transform it/them (if needed) and return the value.
var model  = {
  firstName:   function(params) { return params.firstName; },
  lastName:    function(params) { return params.lastName; },
  phoneNumber: function(params) { return params.phoneNumber.replace(/\D/g, ""); }
};

validParams(params, model);
// Result
// { firstName: "Antoine", lastName: "Proulx", phoneNumber: "1234567890" }
```