var chai   = require('chai');
var expect = chai.expect;

var validParams = require('../lib/index');

describe('validParams', function() {
  // Arguments missing
  describe('with no arguments', function() {
    it("should return an empty object", function() {
      expect( validParams() ).to.eql({});
    });
  });

  describe('with only one argument', function() {
    it("should return an empty objet", function() {
      expect( validParams({ firstName: "Antoine" }) ).to.eql({});
    });
  });

  // Base cases
  describe('with an empty model', function() {
    it("should return an empty objet", function() {
      expect( validParams({ firstName: "Antoine" }, {}) ).to.eql({});
    });
  });

  describe('with an empty model and an empty params object', function() {
    it("should return an empty objet", function() {
      expect( validParams({}, {}) ).to.eql({});
    });
  });

  describe('with an empty params object', function() {
    it("should assign the value \"undefined\" to all the keys in the model", function() {
      var params = {};
      var tests  = [{
        model:  { firstName: function(params) { return params.firstName; } },
        result: { firstName: undefined }
      }, {
        model:  {
          firstName: function(params) { return params.firstName; },
          phoneNumber: function(params) { return params.phoneNumber.replace(/\D/g, ""); }
        },
        result: { firstName: undefined, phoneNumber: undefined }
      }];

      tests.forEach(function(test) {
        expect( validParams(params, test.model) ).to.eql(test.result);
      });
    });
  });
});