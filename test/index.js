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
        model:  { firstName: 'firstName' },
        result: { firstName: undefined }
      }, {
        model:  {
          firstName: 'firstName',
          phoneNumber: function(params) { return params.phoneNumber ? params.phoneNumber.replace(/\D/g, "") : undefined; }
        },
        result: { firstName: undefined, phoneNumber: undefined }
      }];

      tests.forEach(function(test) {
        expect( validParams(params, test.model) ).to.eql(test.result);
      });
    });
  });



  // Non-empty parameters object and model
  describe('with the same keys in the params object and in the model', function() {
    describe('and only literal values (strings)', function() {
      it("should report the value from the params object to the object returned", function() {
        var tests = [{
          params: { firstName: 'Antoine' },
          model:  { firstName: 'firstName' },
          result: { firstName: 'Antoine' }
        }, {
          params: { firstName: 'Antoine', lastName: 'Proulx' },
          model:  { firstName: 'firstName', lastName: 'lastName' },
          result: { firstName: 'Antoine', lastName: 'Proulx' }
        }];

        tests.forEach(function(test) {
          expect( validParams(test.params, test.model) ).to.eql(test.result);
        });
      });
    });

    describe('and only transformation rules (functions)', function() {
      it("should report the transformed value from the params object to the object returned", function() {
        var tests = [{
          params: { phoneNumber: "123 456-7890" },
          model:  { phoneNumber: function(params) { return params.phoneNumber.replace(/\D/g, ""); } },
          result: { phoneNumber: "1234567890" }
        }, {
          params: { phoneNumber: "123 456-7890", firstName: "Antoine" },
          model:  {
            phoneNumber: function(params) { return params.phoneNumber.replace(/\D/g, ""); },
            firstName:   function(params) { return params.firstName; }
          },
          result: { phoneNumber: "1234567890", firstName: "Antoine" }
        }];

        tests.forEach(function(test) {
          expect( validParams(test.params, test.model) ).to.eql(test.result);
        });
      });
    });

    describe('and a mix of literal values and transformation rules', function() {
      it("should report the literal value or the transformed value, depending if a string or a function was given", function() {
        var tests = [{
          params: { phoneNumber: "123 456-7890", firstName: "Antoine" },
          model:  {
            phoneNumber: function(params) { return params.phoneNumber.replace(/\D/g, ""); },
            firstName:   'firstName'
          },
          result: { phoneNumber: "1234567890", firstName: "Antoine" }
        }];

        tests.forEach(function(test) {
          expect( validParams(test.params, test.model) ).to.eql(test.result);
        });
      });
    });
  });


  describe('with keys present in the params object, but not in the model', function() {
    describe('and only literal values (strings)', function() {
      it("should report the value from the params object to the object returned if they are in the model", function() {
        var tests = [{
          params: { firstName: 'Antoine', lastName: 'Proulx' },
          model:  { firstName: 'firstName' },
          result: { firstName: 'Antoine' }
        }, {
          params: { firstName: 'Antoine', lastName: 'Proulx', phoneNumber: "123 456-7890" },
          model:  { firstName: 'firstName', lastName: 'lastName' },
          result: { firstName: 'Antoine', lastName: 'Proulx' }
        }];

        tests.forEach(function(test) {
          expect( validParams(test.params, test.model) ).to.eql(test.result);
        });
      });
    });

    describe('and only transformation rules (functions)', function() {
      it("should report the transformed value from the params object to the object returned if they are in the model", function() {
        var tests = [{
          params: { phoneNumber: "123 456-7890", firstName: "Antoine" },
          model:  { phoneNumber: function(params) { return params.phoneNumber.replace(/\D/g, ""); } },
          result: { phoneNumber: "1234567890" }
        }, {
          params: { phoneNumber: "123 456-7890", firstName: "Antoine", lastName: "Proulx" },
          model:  {
            phoneNumber: function(params) { return params.phoneNumber.replace(/\D/g, ""); },
            firstName:   function(params) { return params.firstName; }
          },
          result: { phoneNumber: "1234567890", firstName: "Antoine" }
        }];

        tests.forEach(function(test) {
          expect( validParams(test.params, test.model) ).to.eql(test.result);
        });
      });
    });

    describe('and a mix of literal values and transformation rules', function() {
      it("should report the literal value or the transformed value, depending if a string or a function was given if they are in the model", function() {
        var tests = [{
          params: { phoneNumber: "123 456-7890", firstName: "Antoine", lastName: "Proulx" },
          model:  {
            phoneNumber: function(params) { return params.phoneNumber.replace(/\D/g, ""); },
            firstName:   'firstName'
          },
          result: { phoneNumber: "1234567890", firstName: "Antoine" }
        }];

        tests.forEach(function(test) {
          expect( validParams(test.params, test.model) ).to.eql(test.result);
        });
      });
    });
  });


  describe('with keys present in the model object, but not in the params', function() {
    it("should report the value from the params object to the object returned or undefined if the key is not in the params object for literal values", function() {
      var tests = [{
        params: { firstName: 'Antoine' },
        model:  { firstName: 'firstName', lastName: 'lastName' },
        result: { firstName: 'Antoine', lastName: undefined }
      }];

      tests.forEach(function(test) {
        expect( validParams(test.params, test.model) ).to.eql(test.result);
      });
    });

    // The transformation rules need to handle the case where a key is "undefined" in the params object.
  });
});