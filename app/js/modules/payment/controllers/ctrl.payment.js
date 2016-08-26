angular.module('payment.controllers')
.controller('paymentCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$timeout',
    '$sce',
    '$filter',
    'paymentHttpService',
    '$cookies',
    'ErrorMessages',
    'Currency',

    function($scope, $state, $stateParams, $timeout, $sce, $filter, paymentHttpService, $cookies, ErrorMessages, Currency) {
      // Scope Variables
      angular.extend($scope, {
        flags: {
          waitingCartDatails: false,
          showDetails: false,
          isClientWidth: true,
        },
        forms: {
          creditForm: {},
          debitForm: {},
          nbForm: {}
        },
        cards: {
          credit: {},
          debit: {}
        },
        nb: {},
        modal: {
          confirm: {
            content: '',
            callback: function(status) {},
            active: false
          },
          alert: {
            content: '',
            callback: function() {},
            active: false
          }
        },
        Currency: Currency,
        cardTypes: {
          'Visa': {
            'CC': 'CC',
            'DC': 'VISA',
            'img': '../images/card-types/visa.svg'
          },
          'MasterCard': {
            'CC': 'CC',
            'DC': 'MAST',
            'img': '../images/card-types/mastercard.svg'
          },
          'American Express': {
            'CC': 'AMEX',
            'DC': 'AMEX',
            'img': '../images/card-types/american-express.svg'
          },
          'Diners Club': {
            'CC': 'DINR',
            'DC': 'DINR',
            'img': '../images/card-types/dinners-club.svg'
          },
          'Maestro': {
            'DC': 'MAES',
            'CC': 'MAES',
            'img': '../images/card-types/maestro.svg'
          },
          'Discover': {
            'DC': '',
            'CC': '',
            'img': '../images/card-types/discover.svg'
          }
        }
      });

      // Scope Methods
      angular.extend($scope, {
        noop: function () {},
        toggleDetails: function() {
          $scope.flags.showDetails = !$scope.flags.showDetails;
          if($scope.flags.showDetails) _satellite.track('view-detail-in-cart');
        },
        getPayments: function() {
          paymentHttpService.getPaymentMethods()
            .success(function(response) {
              $scope.paymentMethods = response.d[0];
              $scope.changeName = $scope.paymentMethods[0].method;
              $scope.pg = 'CC';
              window.paymentMethods = $scope.changeName;
              $scope.paymentMethods.map(function(payment) {
                if (payment.method.toLowerCase() === 'net banking') {
                  $scope.banklist = payment.content;
                }
              })
              if((!$scope.isAndroid) || ($scope.isAndroid && Android.getCurrentScreen && Android.getCurrentScreen() == 1)) $scope.getFinalQuoteDetails();
              else if(typeof Android.getCurrentScreen === 'undefined') $scope.getFinalQuoteDetails();
            })
            .error(function(err) {
              $scope.alert(err.m, function() {
                $state.go('cart');
              });
              return;
            });
        },
        changeSlide: function(obj) {
          $scope.changeName = obj.method;
          window.paymentMethods = $scope.changeName;
          if ($scope.changeName.toLowerCase().indexOf('payu') > -1) {
            $scope.pg = 'Wallet';
          } else {
            $scope.pg = $scope.changeName.split(' ').map(function(_) {
              return _[0]
            }).join('').toUpperCase();
          }
        },
        getBankCode: function (type, pg) {
    			return $scope.cardTypes[type][pg];
    		},
        submitCOD: function() {
          var productId = $scope.finalQuoteData.map(function(_) {
            return _.product_id
          });
          if (typeof dataLayer != "undefined") {
            dataLayer.push({
              'event': 'PrechargedEvent',
              'eventName': 'PrechargedEventName',
              'type': 'PlacedOrder',
              'productInfo': productId,
              'finalAmount': $scope.shippingAmountData.grand_total,
              'type': 'Cash on Delivery'
            });
          }
          if (typeof _satellite != "undefined") {
            _satellite.track('new-checkout-step-2');
            digitalData.transaction = {
              paymentMethod: 'Cash on Delivery',
            }
          }

          var json = {
            quoteId: $scope.quoteId,
            platform: $scope.platform,
            "appVersion": $scope.appVersion || "",
            "imei": $scope.imei || "",
            "customerId": $scope.customerId || ""
          }
          $scope.sendOrder(json);
        },
        submitCreditForm: function(paymentData) {
          var productId = $scope.finalQuoteData.map(function(_) {
            return _.product_id
          });
          if (typeof _satellite != "undefined") {
            _satellite.track('new-checkout-step-2');
            digitalData.transaction = {
              paymentMethod: 'Credit Card',
            }
          }
          if (typeof dataLayer != "undefined") {
            dataLayer.push({
              'event': 'PrechargedEvent',
              'eventName': 'PrechargedEventName',
              'type': 'PlacedOrder',
              'productInfo': productId,
              'finalAmount': $scope.shippingAmountData.grand_total,
              'type': 'Credit Card'
            });
          }

          paymentHttpService.placeOrder(paymentData)
            .success(function(data) {
              $scope.handleDuplicateOrders('submitCreditForm', data, paymentData);
            })
            .error(function(err) {
              $scope.placeOrderLoader = true;
              //console.log(err);
            });
        },
        submitDebitForm: function(paymentData) {
          var productId = $scope.finalQuoteData.map(function(_) {
            return _.product_id
          });
          if (typeof dataLayer != "undefined") {
            dataLayer.push({
              'event': 'PrechargedEvent',
              'eventName': 'PrechargedEventName',
              'type': 'PlacedOrder',
              'productInfo': productId,
              'finalAmount': $scope.shippingAmountData.grand_total,
              'type': 'Debit Card'
            });
          }
          if (typeof _satellite != "undefined") {
            _satellite.track('new-checkout-step-2');
            digitalData.transaction = {
              paymentMethod: 'Debit Card',
            }
          }
          paymentHttpService.placeOrder(paymentData)
            .success(function(data) {
              $scope.handleDuplicateOrders('submitDebitForm', data, paymentData);
            })
            .error(function(err) {
              $scope.placeOrderLoader = true;
              //console.log(err);
            });
        },
        submitNBForm: function(paymentData) {
          var productId = $scope.finalQuoteData.map(function(_) {
            return _.product_id
          });
          if (typeof dataLayer != "undefined") {
            dataLayer.push({
              'event': 'PrechargedEvent',
              'eventName': 'PrechargedEventName',
              'type': 'PlacedOrder',
              'productInfo': productId,
              'finalAmount': $scope.shippingAmountData.grand_total,
              'type': 'Netbanking'
            });
          }
          if (typeof _satellite != "undefined") {
            _satellite.track('new-checkout-step-2');
            digitalData.transaction = {
              paymentMethod: 'Netbanking',
            }
          }

          paymentHttpService.placeOrder(paymentData)
            .success(function(data) {
              $scope.handleDuplicateOrders('submitNBForm', data, paymentData);
            })
            .error(function(err) {
              $scope.placeOrderLoader = true;
              //console.log(err);
            });
        },
        submitPayUForm: function(paymentData) {
          var productId = $scope.finalQuoteData.map(function(_) {
            return _.product_id
          });
          if (typeof dataLayer != "undefined") {
            dataLayer.push({
              'event': 'PrechargedEvent',
              'eventName': 'PrechargedEventName',
              'type': 'PlacedOrder',
              'productInfo': productId,
              'finalAmount': $scope.shippingAmountData.grand_total,
              'type': 'Pay u'
            });
          }
          if (typeof _satellite != "undefined") {
            _satellite.track('new-checkout-step-2');
            digitalData.transaction = {
              paymentMethod: 'payu',
            }
          }
          paymentHttpService.placeOrder(paymentData)
            .success(function(data) {
              $scope.handleDuplicateOrders('submitPayUForm', data, paymentData);
            })
            .error(function(err) {
              $scope.placeOrderLoader = true;
              //console.log(err);
            });
        },
        submitPaypalForm: function(paymentData) {
          paymentHttpService.placeOrder(paymentData)
            .success(function(data) {
              $scope.handleDuplicateOrders('submitPaypalForm', data, paymentData);
            })
            .error(function(err) {
              $scope.placeOrderLoader = true;
              //console.log(err);
            });
        },
        sendOrder: function(json) {
          paymentHttpService.placeOrderCOD(json)
            .success(function(data) {
              if (typeof data.s == 'undefined' || data.s == null) {
                // Older API Support . Executed when  API is is not in desired { s : <<status>> , d : <<data>> , m : <<message>> } format
                // TODO : Remove this IF block when API starts responding in desired format
                window.location = $scope.isAndroid ? '/buy/payment-success/app' : '/buy/payment-success/web';
                if ($scope.isAndroid) {
                  Android.setOrderPrePaid($scope.isPrepaid);
                }
                return;
              }
              if (data.s == 0) {
                //alert(data.m);
                $scope.alert(data.m, function() {
                  $scope.placeOrderLoader = false;
                  $scope.track_multiple_orders('alert-third-order');
                });
                return;
              }
              if (data.s == 1) {
                $scope.track_multiple_orders('alert-second-order');
                if (data.d == 1) {
                  $scope.confirm(data.m, function(status) {
                    if (status) {
                      json.forceKey = 1;
                      $scope.sendOrder(json);
                      $scope.track_multiple_orders('alert-second-order-confirm');
                    } else {
                      $scope.placeOrderLoader = false;
                    }
                  });
                } else {
                  window.location = $scope.isAndroid ? '/buy/payment-success/app' : '/buy/payment-success/web';
                }

                if ($scope.isAndroid)
                  Android.setOrderPrePaid($scope.isPrepaid);

              } else {
                $scope.alert(ErrorMessages.payment.placeOrder, function() {
                  $scope.placeOrderLoader = false;
                  $state.go('payment', {
                    platform: $scope.platform
                  });
                });
              }
            })
            .error(function(error) {
              $scope.placeOrderLoader = false;
              $state.go('payment', {
                error: 2
              });
            });
        },

        handleDuplicateOrders: function(fnHandler, data, paymentData) {
          if (typeof data.s == 'undefined' || data.s == null) {
            // Older API Support . Executed when  API is is not in desired { s : <<status>> , d : <<data>> , m : <<message>> } format
            // TODO : Remove this IF block when API starts responding in desired format
            $scope.placeOrderAPIFallback(data);
            return;
          }
          if (data.s == 0) {
            //alert(data.m);
            $scope.alert(data.m, function() {
              $scope.placeOrderLoader = false;
              $scope.track_multiple_orders('alert-third-order');
            });
            return;
          }

          if (data.s == 1) {
            $scope.track_multiple_orders('alert-second-order');
            if (data.d == 1) {

              $scope.confirm(data.m, function(status) {
                if (status) {
                  paymentData.forceKey = 1;
                  $scope[fnHandler](paymentData);
                  $scope.track_multiple_orders('alert-second-order-confirm');
                } else {
                  $scope.placeOrderLoader = false;
                }
              });
            } else {
              var form = document.createElement("form");
              form.setAttribute("method", 'POST');
              form.setAttribute("action", data.d.url);

              for (var key in data.d.parameter) {
                data.d.parameter[key] = typeof data.d.parameter[key] === typeof {} ? JSON.stringify(data.d.parameter[key]) : data.d.parameter[key];
                if (data.d.parameter.hasOwnProperty(key)) {
                  var hiddenField = document.createElement("input");
                  hiddenField.setAttribute("type", "hidden");
                  hiddenField.setAttribute("name", key);
                  hiddenField.setAttribute("value", data.d.parameter[key]);

                  form.appendChild(hiddenField);
                }
              }

              document.body.appendChild(form);
              form.submit();

              if ($scope.isAndroid)
                Android.setOrderPrePaid($scope.isPrepaid);
            }
          }
        },

        track_multiple_orders: function (eventName) {
          if (typeof _satellite != "undefined" && eventName) {
            _satellite.track(eventName);
          }
        },

        /* TODO : Following function should be removed in future .
			   Following Function is written to support older response of order placing API
			   REMOVE ONCE THE API RESPONSE IS APPROPRIATE
			 */
        placeOrderAPIFallback: function(data) {
          var form = document.createElement("form");
          form.setAttribute("method", 'POST');
          form.setAttribute("action", data.url);

          for (var key in data.parameter) {
            if (data.parameter.hasOwnProperty(key)) {
              var hiddenField = document.createElement("input");
              hiddenField.setAttribute("type", "hidden");
              hiddenField.setAttribute("name", key);
              hiddenField.setAttribute("value", data.parameter[key]);

              form.appendChild(hiddenField);
            }
          }

          document.body.appendChild(form);
          form.submit();

          if ($scope.isAndroid)
            Android.setOrderPrePaid($scope.isPrepaid);
        },


        placeOrder: function() {
          if (!$scope.changeName) return;
          var paymentData = {};
          $scope.placeOrderLoader = true;
          $scope.isPrepaid = true;
          switch ($scope.changeName.toLowerCase()) {
            case 'cash on delivery':
              $scope.submitCOD();
              $scope.isPrepaid = false;
              break;
            case 'credit card':
              if($scope.forms.creditForm.$invalid) { $scope.placeOrderLoader = false; return; }
              paymentData = {
                "pg": $scope.pg,
                "bankcode": $scope.getBankCode($scope.forms.creditForm.cardNumber.$ccType, $scope.pg),
                "ccnum": $scope.cards.credit.cardNumber,
                "ccname": $scope.cards.credit.cardName,
                "ccvv": $scope.cards.credit.cardCvv || '',
                "ccexpmon": $scope.cards.credit.cardMonth ? $scope.cards.credit.cardMonth > 9 ? $scope.cards.credit.cardMonth : '0' + $scope.cards.credit.cardMonth : '',
                "ccexpyr": $scope.cards.credit.cardYear || '',
                "gateway": 'payu',
                "quoteId": $scope.quoteId,
                "platform": $scope.platform,
                "appVersion": $scope.appVersion || "",
                "imei": $scope.imei || "",
                "customerId": $scope.customerId || ""
              };
              $scope.submitCreditForm(paymentData);
              break;
            case 'debit card':
              if($scope.forms.debitForm.$invalid) { $scope.placeOrderLoader = false; return; }
              paymentData = {
                "pg": $scope.pg,
                "bankcode": $scope.getBankCode($scope.forms.debitForm.cardNumber.$ccType, $scope.pg),
                "ccnum": $scope.cards.debit.cardNumber,
                "ccname": $scope.cards.debit.cardName,
                "ccvv": $scope.cards.debit.cardCvv || '',
                "ccexpmon": $scope.cards.debit.cardMonth ? $scope.cards.debit.cardMonth > 9 ? $scope.cards.debit.cardMonth : '0' + $scope.cards.debit.cardMonth : '',
                "ccexpyr": $scope.cards.debit.cardYear || '',
                "gateway": 'payu',
                "quoteId": $scope.quoteId,
                "platform": $scope.platform,
                "appVersion": $scope.appVersion || "",
                "imei": $scope.imei || "",
                "customerId": $scope.customerId || ""
              };
              $scope.submitDebitForm(paymentData);
              break;
            case 'net banking':
              if($scope.forms.nbForm.$invalid) { $scope.placeOrderLoader = false; return; }
              paymentData = {
                "pg": $scope.pg,
                "bankcode": $scope.nb.netbanking,
                "ccnum": '',
                "ccname": '',
                "ccvv": '',
                "ccexpmon": '',
                "ccexpyr": '',
                "gateway": 'payu',
                "quoteId": $scope.quoteId,
                "platform": $scope.platform,
                "appVersion": $scope.appVersion || "",
                "imei": $scope.imei || "",
                "customerId": $scope.customerId || ""
              };
              $scope.submitNBForm(paymentData);
              break;
            case 'payu money':
              paymentData = {
                "pg": 'Wallet',
                "bankcode": 'payuw',
                "ccnum": '',
                "ccname": '',
                "ccvv": '',
                "ccexpmon": '',
                "ccexpyr": '',
                "gateway": 'payu',
                "quoteId": $scope.quoteId,
                "platform": $scope.platform,
                "appVersion": $scope.appVersion || "",
                "imei": $scope.imei || "",
                "customerId": $scope.customerId || ""
              };
              $scope.submitPayUForm(paymentData);
              break;
            case 'paypal':
              paymentData = {
                "pg": '',
                "bankcode": '',
                "ccnum": '',
                "ccname": '',
                "ccvv": '',
                "ccexpmon": '',
                "ccexpyr": '',
                "gateway": 'paypal',
                "quoteId": $scope.quoteId,
                "platform": $scope.platform,
                "appVersion": $scope.appVersion || "",
                "imei": $scope.imei || "",
                "customerId": $scope.customerId || ""
              };
              $scope.submitPaypalForm(paymentData);
              break;
          }
          if ($scope.isAndroid) {
            Android.trackActionPlaceOrder();
          }
        },
        getFinalQuoteDetails: function() {
          var Authorization, XSession, customerId, quoteId, appVersion, imei, json;

          if ($scope.platform !== "web" && $scope.isAndroid) {
            json = JSON.parse(Android.getQuoteDetails());

            Authorization = json.Authorization;

            customerId = json.customerId;
            $scope.customerId = customerId;

            quoteId = json.quoteId;
            $scope.quoteId = quoteId;

            appVersion = json.versionCode;
            $scope.appVersion = appVersion;

            imei = json.IMEI
            $scope.imei = imei;
          }

          $scope.flags.waitingCartDatails = true;
          paymentHttpService.loadFinalQuote($scope.platform, Authorization, XSession, customerId, quoteId, appVersion, imei)
            .success(function(response) {
              if ($scope.isAndroid) {
                if (typeof Android.paymentScreenTrackState === 'function') {
                  Android.paymentScreenTrackState();
                }
              }
              $scope.flags.waitingCartDatails = false;

              if (response.s == 0) {
                $scope.alert(response.m, function() {
                  $state.go('cart');
                });
                return;
              }

              if (response.d.product_list.length === 0) $state.go('cart');
              $scope.finalQuoteData = response.d.product_list;
              $scope.orderCurrency = response.d.currency_code;

              $scope.shippingAdressData = response.d.shippingAddress;
              $scope.shippingAmountData = response.d;

              if ($scope.shippingAmountData.totol_discount > 0)
                $scope.successCoupon = true;

              window.userMobileNo = response.d.shippingAddress.telephone;

              try{
                  !window.gtmInitStarted ? initGTM($scope.GTM_ID, $scope.paymentTracker) : $scope.paymentTracker();
				}catch(e){
                    console.log('Tracking error has occurred: '+e.message);
				}
              $scope.discountPecent = ($scope.shippingAmountData.totol_discount / $scope.shippingAmountData.sub_total) * 100;

              if ($scope.shippingAmountData.showCod == 0) {
                $timeout(function() {
                  if ($scope.paymentMethods) {
                    if (typeof $scope.shippingAmountData.grand_total.int_currency_code === typeof undefined) {
                      $scope.changeName = $scope.paymentMethods[1].method;
                    }
                    //paypal
                    else if ($scope.shippingAmountData.grand_total.int_currency_code === 'INR') {
                      $scope.changeName = $scope.paymentMethods[1].method;
                    }
                  }
                })
              }
            })
            .error(function(err) {
              $scope.flags.waitingCartDatails = false;
              $state.go('cart');
            })
        },
        alert: function(msg, callback) {
          $scope.modal.alert.content = msg;
          $scope.modal.alert.active = true;

          $scope.modal.alert.callback = function() {
            callback && callback();
            $scope.modal.alert.active = false;
          }
        },
        confirm: function(msg, callback) {
          $scope.modal.confirm.content = msg;
          $scope.modal.confirm.active = true;
          $scope.modal.confirm.callback = function(status) {
            callback(status);
            $scope.modal.confirm.active = false;
          }
        },
        removeFromCart: function(product_id, product) {
          if (typeof _satellite != "undefined") {
            _satellite.track("remove-item-payment");
          }
          $scope.confirm('Are you sure you want to delete this Item?', function(status) {
            if (status) {
              product.waitingCartItem = true;
              paymentHttpService.removeQuoteItems([{
                  productID: product_id
                }])
                .success(function(response) {
                  if (response.s == 0) {
                    $scope.alert(ErrorMessages.cart.removeQuoteItems);
                    return;
                  }
                  $scope.getFinalQuoteDetails();
                  if (typeof _satellite != "undefined") {
                    _satellite.track("item-removed");
                  }
                })
                .error(function(error) {
                  product.waitingCartItem = false;
                });
            }
          });
        },
        isEmpty: function(obj) {
          return Object.keys(obj).length === 0;
        },
        isDesktop: function() {
          if (document.body.clientWidth > 992) {
            return $scope.flags.isClientWidth;
          } else if (document.body.clientWidth < 992) {
            return !$scope.flags.isClientWidth;
          }
        },
        getPlaceOrderText: function () {
  				if(!$scope.changeName ||  !$scope.orderCurrency)  return 'LOADING...';
  				switch($scope.changeName.toLowerCase()) {
  					case 'cash on delivery':
  						return 'PLACE ORDER';
  					default:
  						if($scope.shippingAmountData && $scope.shippingAmountData.grand_total.int_currency_code)
  							return $sce.trustAsHtml('PAY <span>'+ Currency($scope.shippingAmountData.grand_total.int_currency_code, 'text') +'	</span>' + $filter('number')($scope.shippingAmountData.grand_total.int_value) + '</span> SECURELY');
  						else
  							return $sce.trustAsHtml('PAY <span>'+ Currency($scope.orderCurrency, 'text') +'	</span>' + $filter('number')($scope.shippingAmountData.grand_total.value) + '</span> SECURELY');
  					}
				},
        getHeight: function() {
          return document.getElementById('payment-tab-content').offsetHeight;
        },
        getTop: function() {
          if($scope.isDesktop() || !$scope.changeName) return 0;
          switch ($scope.changeName.toLowerCase()) {
            case 'cash on delivery':
              return 55 * 1 - 10;
            case 'credit card':
              return 55 * 2;
            case 'debit card':
              return 55 * 3;
            case 'net banking':
              return 55 * 4;
            case 'payu money':
              return 55 * 5;
            default:
              return 50;
          }
        },
        getPaymentError: function () {
  				if($scope.shippingAmountData && $scope.shippingAmountData.showCod == 1)
  					return ErrorMessages.payment.errors.cod;
  				else
  					return ErrorMessages.payment.errors.nonCod;
  			},
        paymentTracker: function() {
          if (typeof _satellite != "undefined") {
            digitalData.page = {
              pageInfo: {
                pageName: "checkout:payment",
              },
              category: {
                pageType: "checkout",
                primaryCategory: "payment",
              },
              device: {
                deviceType: isMobile
              },
              currencycode: {
                currencyCode: $scope.orderCurrency,
              },
            }
            var allProducts = $scope.finalQuoteData;
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
              'title': "Craftsvilla - Payment",
              'userEmailAddress': window.czuser ? window.czuser.email : '',
              'type': 'email',
              'loggedIn': $scope.isLoggedIn,
              'cartValue': allProducts.length,
              'cartItemsCount': allProducts.length
            });
          }
        },

        init: function() {
          if(!$scope.isAndroid) document.querySelector('#common-header').style.display = "block";
          $scope.getPayments();

          $scope.paymentErrorCode = $stateParams.error;

          if($scope.isAndroid) Android.cancelDialog();

          if ($scope.isAndroid && typeof paymentErrorCode === typeof undefined) {
            Android.paymentTrackState(-1);
          } else if ($scope.isAndroid && typeof paymentErrorCode !== typeof undefined) {
            Android.paymentTrackState(0);

            if (typeof _satellite != "undefined") {
              digitalData.page = {
                pageInfo: {
                  pageName: "error:payment",
                },
                category: {
                  pageType: "error",
                  primaryCategory: "error:payment",
                },
                device: {
                  deviceType: isMobile
                },
                currencycode: {
                  currencyCode: $scope.orderCurrency,
                },
              }
              _satellite.track("page-load");
            }
          }

        }
      });

      window.refreshPaymentData = function () {
        $scope.getFinalQuoteDetails();
      }

      $scope.init();
    }
]);
