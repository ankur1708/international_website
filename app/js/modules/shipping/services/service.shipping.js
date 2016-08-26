angular.module('shipping.services')
  .service('shippingHttpService', ['$http', function($http) {
    return {
      getAddress: function() {
        return $http.get( HOST + '/checkoutService/index/getAddress' );
      },
      getAddressFromPincode: function(pincode) {
        return $http.post( HOST + '/checkoutService/index/getAddressFromPincode', {
          "Pincode": pincode
        });
      },
      assignAddressToQuote: function(billingId, shippingId) {
        return $http.post( HOST + '/checkoutService/index/assignAddressToQuote', {
          "billingId": billingId,
          "shippingId": shippingId
        });
      },
      updateAddress: function(json) {
        return $http.post( HOST + '/checkoutService/index/updateAddress', {
          "firstName": json.firstname,
          "lastName": json.lastname,
          "address1": json.street,
          "city": json.city,
          "state": json.region,
          "pincode": json.postcode,
          "country": json.country_obj.country_name,
          "phoneNo": json.telephone,
          "addressId": json.entity_id
        });
      },
      getCountry: function() {
        return $http.get( HOST + '/checkoutService/index/getCountry');
      },
      addAddress: function(shipping, billing, isSame) {
        return $http.post( HOST + '/checkoutService/index/addAddress', {
          "shippingAddreess": {
            "firstName": shipping.firstname,
            "lastName": shipping.lastname,
            "address1": shipping.street,
            "city": shipping.city,
            "state": shipping.state,
            "pincode": shipping.postcode,
            "country": shipping.country_obj.country_name,
            "isSame": isSame,
            "phoneNo": shipping.telephone
          },
          "billingAddreess": {
            "firstName": billing.firstname,
            "lastName": billing.lastname,
            "address1": billing.street,
            "city": billing.city,
            "state": billing.state,
            "pincode": billing.postcode,
            "country": billing.country_obj.country_name,
            "isSame": isSame,
            "phoneNo": billing.telephone
          }
        });
      }
    }
  }]);
