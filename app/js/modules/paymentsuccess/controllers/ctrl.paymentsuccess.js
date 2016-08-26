angular.module('paymentsuccess.controllers')
  .controller('paymentSuccessCtrl', [
    '$scope',
    '$state',
    'paymentsuccessHttpService',
    'Currency',
    '$cookies',

    function($scope, $state, paymentsuccessHttpService, Currency, $cookies) {
      $scope.norecommendation = false;
      $scope.waitingOrderDatails = true;
      $scope.Currency = Currency;
      var cartValues = [];

      $scope.onSuccessDetails = function() {
        paymentsuccessHttpService.getOrderDetails()
          .success(function(response) {
            if ($scope.isAndroid) {
              Android.trackStateOrderConfirmationScreen(response.d.Order_number);
            }

            if (response.s == 0) {
              $state.go('cart');
              return;
            }

            $scope.waitingOrderDatails = false;
            //console.log(response.d.product_list);
            $scope.orderDetails = response.d.product_list;
            $scope.order = response.d;
            $scope.orderNo = response.d.Order_number;
            $scope.shippingDetails = $scope.order.shippingAddress;
            $scope.subTotal = $scope.order.sub_total;
            $scope.grandTotal = $scope.order.grand_total;
            $scope.couponCode = $scope.order.coupon_code;
            $scope.shippingAmount = $scope.order.shipping_amount;
            $scope.totalPayable = $scope.subTotal - $scope.couponCode + $scope.shippingAmount;
            $scope.currencyCode = response.d.currency_code;
            try {
              !window.gtmInitStarted ? initGTM($scope.GTM_ID, function() {
                $scope.orderDetailsTracker($scope.orderDetails, $scope.order.shippingAddress.email);
              }) : $scope.orderDetailsTracker($scope.orderDetails, $scope.order.shippingAddress.email);
            } catch (e) {
              console.log('Tracking error has occurred: ' + e.message);
            }
            $scope.sendAffiliateData();
            response.d.prepaid == 1 && $scope.availOffer(response); // Avail offer only for the prepaid order
          })
          .error(function(err) {
            throw new Error(err);
          })
      };

      $scope.getSubTotal = function() {
        $scope.subTotal = 0;
        for (var i = 0; i < $scope.orderDetails.length; i++) {
          var product = $scope.orderDetails[i];
          $scope.subTotal += parseInt(product.product_price);
        }
        //console.log($scope.subTotal);
        return $scope.subTotal;

      }
      $scope.orderDetailsTracker = function(orderDetails, email) {
        if (typeof _satellite != "undefined" && !$scope.isAndroid) {
          digitalData.page = {
            pageInfo: {
              pageName: "order complete",
            },
            category: {
              pageType: "order complete",
              primaryCategory: "order complete",
            },
            device: {
              deviceType: isMobile
            },
            currencycode: {
              currencyCode: 'INR',
            },
          }

          var detail = orderDetails.map(function(_) {
            return {
              "quantity": _.product_qty,
              "price": {
                "basePrice": _.product_qty * _.product_price
              },
              "productInfo": {
                "productID": _.product_id,
                "subCategory0": _.categories[_.categories.length - 2] || null,
                "subCategory1": _.categories[_.categories.length - 1] || null,
                "subCategory2": _.categories[1] || null,
              }
            }
          });

          //alert(JSON.stringify(tempItem));
          digitalData.transaction = {
            purchaseID: $scope.orderNo,
            paymentMethod: window.paymentMethods,
            totalOrderValue: $scope.grandTotal,
            orderEmail: window.userEmail,
            mobileNo: window.userMobileNo,
            item: detail,
          }
          digitalData.totalOrderValue = $scope.grandTotal;
          _satellite.track("page-load");
          _satellite.track("purchase");
        }

        if (typeof MSDtrack != "undefined") {
          MSDtrack({
            'event': 'buy',
            'sourceProdID': orderDetails.map(function(_) {
              return _.product_id
            }),
            'prodPrice': orderDetails.map(function(_) {
              return _.product_price
            }),
            'prodQty': orderDetails.map(function(_) {
              return _.product_qty
            })
          });
        }
        if (typeof dataLayer != "undefined") {
          dataLayer.push({
            'pageLink': window.czURL,
            'title': "Craftsvilla - Success",
            'userEmailAddress': email,
            'type': 'email',
            'loggedIn': $scope.isLoggedIn,
            'cartValue': orderDetails.map(function(_) {
              return _.product_qty
            }).toString(),
            'cartItemsCount': orderDetails.length,
            'products': JSON.stringify((function() {
              return orderDetails.map(function(_) {
                return {
                  'prodName': _.product_name,
                  'prodURL': _.url,
                  'imageURL': _.product_image,
                  'prodPrice': _.product_price,
                  'prodQty': _.product_qty,
                  'category': _.categories[_.categories.length - 2],
                  'subCategory': _.categories[_.categories.length - 1],
                  'subSubCategory': _.categories[_.categories.length - 3],
                }
              })
            })()),
            'chargedId': $scope.orderNo,
            'chargedAmount': $scope.subTotal,
            'totalCartAmount': $scope.grandTotal,
            'cartProductIDs': '[' + orderDetails.map(function(_) {
              return _.product_id
            }).toString() + ']',
            'email': window.czuser ? window.czuser.email : '',
            'pageType': 'new',
            'event': 'AngPageView'
          });
        }
      }

      $scope.sendAffiliateData = function() {

        Number.prototype.padLeft = function(base, chr) {
          var len = (String(base || 10).length - String(this).length) + 1;
          return len > 0 ? new Array(len).join(chr || '0') + this : this;
        };

        var d = new Date,
          dformat = [
            d.getFullYear(),
            (d.getMonth() + 1).padLeft(),
            d.getDate().padLeft()
          ].join('-') +
          ' ' + [d.getHours().padLeft(),
            d.getMinutes().padLeft(),
            d.getSeconds().padLeft()
          ].join(':');

        var affiliateName = '';
        var utmMedium = '';
        if ($cookies.get('Affiliate')) {
          affiliateName = $cookies.get('Affiliate');
        }
        if ($cookies.get('utm_medium')) {
          utmMedium = $cookies.get('utm_medium');
        }
        paymentsuccessHttpService.sendAffiliateData(dformat, affiliateName, $scope.orderNo, $scope.grandTotal, utmMedium)
          .success(function(response) {
            //console.log(response);
          })
          .error(function(err) {
            throw new Error(err);
          });
      }

      $scope.showHomeScreen = function() {
        if ($scope.isAndroid) {
          Android.showHomeScreen();
        }
      }

      $scope.getTailorvillaDetails = function(encodedData) {
        paymentsuccessHttpService.getTailorvillaDetails(encodedData)
          .success(function(response) {
            response.s == 1 && ($scope.tailorvillaDetails = response.d);
          })
      }

      $scope.initPaymentSuccess = function() {
        if (!$scope.isAndroid) document.querySelector('#common-header').style.display = "block";

        $scope.scrollToTop();

        if ($scope.isAndroid) {
          Android.paymentTrackState(1);
        }
      };

      $scope.availOffer = function(response) {
        response || (response = {});
        var encodedResponse = $scope.toBase64(JSON.stringify(response));
        $scope.getTailorvillaDetails(encodedResponse);
      }

      $scope.toBase64 = function(string) {
        string || (string = '');
        return btoa(encodeURIComponent(string).replace(/%([0-9A-F]{2})/g, function(match, p1) {
          return String.fromCharCode('0x' + p1);
        }));
      }
      $scope.initPaymentSuccess();

    }
  ]);
