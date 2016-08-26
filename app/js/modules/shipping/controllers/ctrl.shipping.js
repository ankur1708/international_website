angular.module('shipping.controllers')
.controller('shippingCtrl', [
    '$scope',
    '$state',
    '$timeout',
    'coreHttpService',
    'shippingHttpService',
    'ErrorMessages',

    function($scope, $state, $timeout, coreHttpService, shippingHttpService, ErrorMessages) {
      // Scope Variables
      angular.extend($scope, {
        flags: {
          showEditAddressPopup: false,
          isBillingAddressSame: true,
          bothAddressSelected: true,
          addNewAddressMobile: false,
          isNewBillingAddressSame: true,
          shippingSaveAndContinueLoader: false,
          billingSaveAndContinueLoader: false,
          editSaveAndContinueLoader: false,
        },
        forms: {
          newShippingAddress: {},
          newBillingAddress: {}
        },
        newShippingAddress: {},
        newBillingAddress: {}
      })

      // Scope methods
      angular.extend($scope, {
        noop: function () {},
        getSavedAddresses: function() {
          shippingHttpService.getAddress()
            .success(function(response) {
              if (response.s == 1) {
                $scope.addresses = response.d;
                $scope.shippingID = $scope.addresses[0].entity_id;
                $scope.billingID = $scope.addresses[0].entity_id;
              } else {
                $scope.flags.showAddNewAddressMobile = true;
                $scope.flags.noresponse = true;
              }
            });
        },
        getCountries: function() {
          shippingHttpService.getCountry()
            .success(function(response) {
              if (response.s == 0) {
                alert(ErrorMessages.shipping.getCountry);
                return;
              }
              $scope.countries = response.d;
              $scope.newShippingAddress.country_obj = angular.copy($scope.countries[0]);
              $scope.newBillingAddress.country_obj = angular.copy($scope.countries[0]);
            })
        },
        selectShippingAddress: function(id) {
          $scope.shippingID = id;

          if ($scope.flags.isBillingAddressSame)
            $scope.selectBillingAddress(id);
        },
        selectBillingAddress: function(id) {
          $scope.billingID = id;

          if ($scope.shippingID && $scope.billingID) {
            $scope.flags.bothAddressSelected = true;
          }
        },
        showEditAddressPopup: function(address) {
          $scope.flags.showEditAddressPopup = true;

          $scope.activeAddress = angular.copy(address);
          $scope.activeAddress.postcode = isNaN(parseInt($scope.activeAddress.postcode)) ? $scope.activeAddress.postcode : +$scope.activeAddress.postcode;
          $scope.activeAddress.telephone = +$scope.activeAddress.telephone;

          $scope.countries.map(function(country) {
            country.country_name = country.country_name || '';
            if (country.country_name.toLowerCase() === $scope.activeAddress.country.toLowerCase()) {
              $scope.activeAddress.country_obj = country;
            }
          });

          $scope.activeAddress.country_obj = $scope.activeAddress.country_obj || angular.copy($scope.countries[0]);
        },
        hideEditAddressPopup: function() {
          $scope.flags.showEditAddressPopup = false;
        },
        editAddress: function(address) {
          shippingHttpService.updateAddress(address)
            .success(function(response) {
              if (response.s == 0) {
                alert(ErrorMessages.shipping.updateAddress);
                return;
              } else {
                $scope.hideEditAddressPopup();
                $scope.getSavedAddresses();
              }
            })
            .error(function(error) {
              //console.log('Error');
            });

        },
        billingShippingCheckboxToggled: function() {
            $timeout(function () {
                if ($scope.flags.isBillingAddressSame === true) {
                  $scope.billingID = $scope.shippingID;
                } else {
                  $scope.billingID = undefined;
                }
                console.log($scope.shippingID, $scope.billingID)
            })
        },
        proceed: function() {
          if (typeof dataLayer != "undefined") {
            dataLayer.push({
              'event': 'TappedButtonEvent',
              'eventName': 'TappedButton',
              'type': 'ConfirmedAnAddress'
            });
          }
          if (typeof _satellite != "undefined") {
            _satellite.track('new-checkout-step-1');
          }
          $scope.flags.bothAddressSelected = $scope.billingID && $scope.shippingID ? true : false;
          if ($scope.flags.bothAddressSelected) {
            $scope.proceedToPaymentLoader = true;
            $scope.deliverToAddress = true;
            shippingHttpService.assignAddressToQuote($scope.billingID, $scope.shippingID)
              .success(function(response) {
                $scope.deliverToAddress = false;
                $scope.proceedToPaymentLoader = false;
                if($scope.billingID != $scope.shippingID){
                    if (typeof _satellite != "undefined") {
                      _satellite.track("address-different");
                    }
                  }
                if (response.s == 1) {
                  $state.go('payment', {
                    platform: 'web'
                  });
                }
                if (response.s == 0) {
                  alert(response.m);
                  return;
                }
              })
              .error(function(error) {
                $scope.proceedToPaymentLoader = false;
                $scope.deliverToAddress = false;
              });
          } else {
            $scope.scrollToTop();
          }
        },
        addNewAddress: function(type) {
          var address_1, address_2;
          if (typeof dataLayer != "undefined") {
            dataLayer.push({
              'event': 'TappedButtonEvent',
              'eventName': 'TappedButton',
              'type': 'ConfirmedAnAddress'
            });
          }
          if (typeof _satellite != "undefined") {
            _satellite.track('new-checkout-step-1');
          }
          var isSame = false;
          if (type === 'billing') {
            if (typeof _satellite != "undefined") {
              _satellite.track("address-different");
            }
            $scope.forms.newShippingAddress.$submitted = true;
            $scope.forms.newBillingAddress.$submitted = true;
            address_1 = $scope.newShippingAddress;
            address_2 = $scope.newBillingAddress;
            if($scope.forms.newShippingAddress.$valid && $scope.forms.newBillingAddress.$valid) $scope.flags.billingSaveAndContinueLoader = true;
          } else {
            $scope.forms.newShippingAddress.$submitted = true;
            address_1 = $scope.newShippingAddress;
            address_2 = $scope.newShippingAddress;
            isSame = true;
            if($scope.forms.newShippingAddress.$valid) $scope.flags.shippingSaveAndContinueLoader = true;
          }
          if (!$scope.forms.newShippingAddress.$valid)
            return;

          shippingHttpService.addAddress(address_1, address_2, isSame)
            .success(function(response) {
              $scope.flags.shippingSaveAndContinueLoader = false;
              $scope.flags.billingSaveAndContinueLoader = false;
              if (response.s == 1) {
                $scope.proceedToPayment();
              }
              if (response.s == 0) {
                alert(ErrorMessages.shipping.addAddress)
                return;
              }
            })
            .error(function(error) {
              $scope.flags.shippingSaveAndContinueLoader = false;
              $scope.flags.billingSaveAndContinueLoader = false;
            });
        },
        proceedToPayment: function() {
          $state.go('payment', {
            platform: 'web'
          });
        },
        showAddNewAddressMobile: function() {
          $scope.flags.showAddNewAddressMobile = !$scope.flags.showAddNewAddressMobile
        },
        addressTracker: function() {
            $scope.$on('cartDetails', function() {
              var allProducts = $scope.cartDetails.product_list;
              if (typeof _satellite != "undefined") {
                console.log("view");
                digitalData.page = {
                  pageInfo: {
                    pageName: "checkout:shipping",
                  },
                  category: {
                    pageType: "checkout",
                    primaryCategory: "shipping",

                  },
                  device: {
                    deviceType: isMobile
                  },
                  currencycode: {
                    currencyCode: 'INR',
                  },
                }
                var detail = allProducts.map(function (_) {
                	return {
                    "productInfo": {
                      "productID": _.product_id,
                      "subCategory0": _.categories[_.categories.length - 2] || null,
                      "subCategory1": _.categories[_.categories.length - 1] || null,
                      "subCategory2": _.categories[1] || null,
                    }
                  }
                });
                digitalData.cart = {
                  item: detail
                }
                _satellite.track("page-load");

              }
              if (typeof dataLayer != "undefined") {
                dataLayer.push({
                  'pageLink': window.czURL,
                  'title': "Craftsvilla - shipping",
                  'userEmailAddress': window.czuser ? window.czuser.email : '',
                  'type': 'email',
                  'loggedIn': $scope.isLoggedIn,
                  'cartValue': $scope.cartDetails.total_qty,
                  'cartItemsCount': $scope.cartDetails.total_items
                });
                dataLayer.push({
                  'numberOfProductsInCart': $scope.cartDetails.total_qty,
                  'countOfItemsInCart': $scope.cartDetails.total_items,
                  'totalAmountOfProducts': $scope.cartDetails.grand_total,
                  'totalCartAmount': $scope.cartDetails.grand_total,
                  'cartProductIDs': "[" + allProducts.map(function (_) { return _.product_id}).toString() + "]",
                  'event': 'AngPageView',
                  'shippingAndHandlingCharges': $scope.cartDetails.shipping_amount
                });
              }

            });
            if(window.getCartDetailsVal) {
                $scope.cartDetails = window.getCartDetailsVal;
                if ($scope.cartDetails.product_list.length === 0) $state.go('cart');
                $scope.$emit('cartDetails');
            }
            else {
                coreHttpService.loadQuote()
                  .success(function(response) {
                    $scope.cartDetails = response.d;
                    if ($scope.cartDetails.product_list.length === 0) $state.go('cart');
                    $scope.$emit('cartDetails');
                  })
                  .error(function(err) {
                    $state.go('cart');
                  });
            }
        },
        init: function() {
          document.querySelector('#common-header').style.display = "block";
          $scope.getSavedAddresses();
          $scope.getCountries();
          $scope.scrollToTop();
          try{
            !window.gtmInitStarted ? initGTM($scope.GTM_ID, $scope.addressTracker) : $scope.addressTracker();
          }catch(e){
            console.log('Tracking error has occurred: '+e.message);
          }
        }
      })

      $scope.init();
    }
]);
