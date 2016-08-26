angular.module('cart.controllers')
.controller('checkoutCartCtrl', [
    '$scope',
    'coreHttpService',
    'cartHttpService',
    '$state',
    '$sce',
    '$timeout',
    'ErrorMessages',
    'Currency',

    function($scope, coreHttpService, cartHttpService, $state, $sce, $timeout, ErrorMessages, Currency) {

      function updateTotals(response) {
        $scope.grandTotal = response.d.grand_total;
        $scope.subTotal = response.d.sub_total;
        $scope.totalDiscount = response.d.totol_discount;
        $scope.shippingAmount = response.d.shipping_amount;
        if (response.d.coupon_code && response.d.coupon_code.length) {
          $scope.flags.successCoupon = true;
          $scope.couponCode = response.d.coupon_code;
          $scope.discount = ($scope.totalDiscount / $scope.subTotal) * 100;
        }
      }

      // Scope Variables
      angular.extend($scope, {
        flags: {
          isInStockNotCod: false,
          isOutOfStockProducts: false,
          itemRemoved: false,
          waitingCartDatails: false,
          successCouponDetails: false,
          couponCodeHeader: false,
          couponWait: false,
          successCoupon: false,
          proceedToCheckoutLoader: false
        },
        coupon: {},
        Currency: Currency,
        searchEndPoint: $sce.trustAsResourceUrl($scope.HOST + '/searchresults')
      });

      // Scope methods
      angular.extend($scope, {
      noop: function () {},
      isCartEmpty: function () {
        return $scope.getCartDetailsVal ? $scope.getCartDetailsVal.product_list.length === 0 : false;
      },

      showAccountDrop: function() {
        $timeout(function() {
          $scope.showAccountDropdown = true;
        });
      },

      hideAccountDrop: function() {
        $scope.showAccountDropdown = false;
      },

      loadAutoComplete: function(keyword) {
        if (!keyword) return;

        cartHttpService.loadAutoComplete(keyword)
          .success(function(response) {
            $scope.autoCompleteData = response.data || [];
          })
          .error(function(err) {
            console.log(err);
          })
      },

      showLearnMoreModal: function() {
        $timeout(function() {
          $scope.learnMoreModal = true;
        })
      },

      hideLearnMoreModal: function() {
        $scope.learnMoreModal = false;
      },
        getCartDetails: function() {
          $scope.flags.waitingCartDatails = true;

          coreHttpService.loadQuote()
            .success(function(response) {
                if(response.s == 0) {
                    $scope.getCartDetailsVal = window.getCartDetailsVal = {
                        product_list: []
                    }
                    return;
                }
              $scope.flags.waitingCartDatails = false;

              $scope.getCartDetailsVal = response.d;
              window.getCartDetailsVal = response.d;
              $scope.currencyCode = $scope.getCartDetailsVal.currency_code;
              try {
                  !window.gtmInitStarted ? initGTM($scope.GTM_ID, $scope.cartTracking) : $scope.cartTracking();
              } catch (e) {
                console.log('Tracking error has occurred: ' + e.message);
              }
              updateTotals(response);
            })
            .error(function() {
              $scope.flags.waitingCartDatails = false;
            })
        },
        updateQuantity: function(quantity, product_id, data) {
          var oldCartSnapshot = angular.copy($scope.getCartDetailsVal);
          data.waitingCartItem = true;
          $scope.flags.waitingCartDatails = true;

          cartHttpService.updateQty(product_id, quantity.id)
            .success(function(response) {
              data.waitingCartItem = false;
              $scope.flags.waitingCartDatails = false;
              if (response.s == 0) {
                alert(ErrorMessages.cart.updateQty)
                $scope.getCartDetailsVal = oldCartSnapshot;
                return;
              } else {
                document.body.scrollTop = 0;
                if (response.d.product_list.length == 0) {
                  $scope.getCartDetailsVal.product_list = [];
                  return;
                }
              }
              $scope.getCartDetailsVal = response.d;
              $scope.currencyCode = $scope.getCartDetailsVal.currency_code;
              $scope.getCartDetailsVal.product_list = response.d.product_list;

              try {
                $scope.cartTracking();
              } catch (e) {
                console.log('Tracking error has occurred: ' + e.message);
              }
              updateTotals(response);
            })
            .error(function(error) {
              data.waitingCartItem = true;
              throw new Error(error);
            });
        },
        addNoteToSeller: function(index, product_id, comment, data) {
          data.showFormNote = false;
          data.waitingCartItem = true;
          cartHttpService.addNoteToSeller(product_id, comment)
            .success(function(response) {
              data.waitingCartItem = false;
              if (response.s == 0) {
                // alert(response.m);
                alert(ErrorMessages.cart.addNoteToSeller)
                return;
              }
              $scope.getCartDetails();
              if (typeof _satellite != "undefined") {
                _satellite.track("seller note");
              }
            })
            .error(function(error) {
              data.waitingCartItem = false;
            });
        },
        removeNoteToSeller: function(data) {
          if (!data) return;

          cartHttpService.removeNoteToSeller(data.product_id)
            .success(function(response) {
              if (response.s == 0) {
                // alert(response.m);
                alert(ErrorMessages.cart.removeNoteToSeller)
                return;
              }
              data.seller_note = null;
              data.showFormNote = false;
            })
            .error(function(error) {
              //console.log(error);
            });
        },
        updateNoteToSeller: function(data, note) {
          data.showFormNote = true;
          data.sellernote = note;
        },
        continueShopping: function() {
          if (typeof _satellite != "undefined") {
            _satellite.track("continue shopping");
          }
          window.location.href = $scope.NSHOST;
        },
        removeAllProducts: function(kind) {
          var productIds = $scope.getCartDetailsVal.product_list.map(function(item) {
              if (kind === "outofstock") {
                if (typeof _satellite != "undefined") {
                    _satellite.track("remove-item-from-cart");
                }
                if (!item.IsInStock) {
                  return {
                    productID: item.product_id
                  };
                }
              } else if (kind === "noncod") {
                if (typeof _satellite != "undefined") {
                  _satellite.track("remove-noncod-item-from-cart");
                }
                if (!item.cod_available) {
                  return {
                    productID: item.product_id
                  };
                }
              }
            })
            .filter(function(item) {
              return item !== undefined
            });
          cartHttpService.removeQuoteItems(productIds)
            .success(function(response) {
              if (response.s == 0) {
                alert(ErrorMessages.cart.removeQuoteItems)
                return;
              }
              $scope.getCartDetailsVal = response.d;
              $scope.currencyCode = $scope.getCartDetailsVal.currency_code;
              $scope.getCartDetailsVal.product_list = response.d.product_list || [];
              if (kind === "outofstock")
                $scope.flags.isOutOfStockProducts = false;
              else if (kind === "noncod")
                $scope.flags.isInStockNotCod = false;

              updateTotals(response);
            })
            .error(function(error) {
              //console.log(error);
            });
        },
        cartTracking: function() {
          var allProductsList = $scope.getCartDetailsVal.product_list;
          var couponCode = document.getElementById('couponCodeTextBox') ? document.getElementById('couponCodeTextBox').value : 'NA';
          var couponCodeApplied = couponCode === 'NA' ? 'no' : 'yes';
          if (typeof _satellite != "undefined") {
            digitalData.page = {
              pageInfo: {
                pageName: "cart",
              },
              category: {
                pageType: "cart",
                primaryCategory: "cart",
              },
              device: {
                deviceType: isMobile
              },
              currencycode: {
                currencyCode: 'INR',
              },
            }
            var detail = allProductsList.map(function (_) {
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
            _satellite.track("cart-view");

          }
          if (typeof dataLayer != "undefined") {
            dataLayer.push({
              'numberOfProductsInCart': $scope.getCartDetailsVal.total_items,
              'countOfItemsInCart': $scope.getCartDetailsVal.total_qty,
              'totalAmountOfProducts': $scope.getCartDetailsVal.grand_total,
              'totalCartAmount': $scope.getCartDetailsVal.grand_total,
              'couponCode': couponCode,
              'cartProductIDs': "[" + allProductsList.map(function (_) { return _.product_id}).toString() + "]",
              'couponCodeApplied': couponCodeApplied,
              'cartItems': $scope.getCartDetailsVal.total_items,
              'pageLink': window.czURL,
              'title': 'Craftsvilla - Shopping Cart',
              'userEmailAddress': window.czuser ? window.czuser.email : '',
              'type': 'email',
              'loggedIn': $scope.isLoggedIn,
              'cartValue': $scope.getCartDetailsVal.total_items,
              'cartItemsCount': JSON.stringify((function () {
                  return allProductsList.map(function (_) {
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
              'event': 'AngPageView'
            });
          }

        },
        removeProductFromCart: function(product_id, data) {
          data.waitingCartItem = true;
          cartHttpService.removeQuoteItems([{
              productID: product_id
            }])
            .success(function(response) {
              data.waitingCartItem = false;

              if (response.s == 0) {
                alert(ErrorMessages.cart.removeQuoteItems)
                return;
              }

              $scope.getCartDetailsVal = response.d;
              $scope.currencyCode = $scope.getCartDetailsVal.currency_code;
              $scope.getCartDetailsVal.product_list = response.d.product_list;
              $scope.flags.itemRemoved = true;
              $scope.latestRemovedItem = product_id;
              updateTotals(response);

              document.body.scrollTop = 0;
            })
            .error(function(error) {
              data.waitingCartItem = false;
              throw new Error(error);
            });
            if (typeof _satellite != "undefined") {
              _satellite.track("remove-item-from-cart");
            }
        },
        addToCart: function() {
          cartHttpService.addToQuote($scope.latestRemovedItem, 1)
            .success(function(response) {
              if (response.s == 0) {
                alert(ErrorMessages.cart.addToQuote)
                return;
              }

              $scope.getCartDetailsVal = response.d;
              $scope.currencyCode = $scope.getCartDetailsVal.currency_code;
              $scope.getCartDetailsVal.product_list = response.d.product_list || [];
              updateTotals(response);
              $scope.latestRemovedItem = null;
              $scope.flags.itemRemoved = false;
            })
            .error(function(error) {
              //console.log(error);
            });
        },
        showCouponCont: function() {
          $scope.flags.successCouponDetails = true;
          $scope.flags.couponCodeHeader = true;
        },
        applyCoupon: function() {
          if(!($scope.coupon.couponcode && $scope.coupon.couponcode.trim().length > 0)) {
            $scope.coupon.couponcode = '';
            $scope.couponMessage = 'Coupon code is not valid';
            return;
          }
          else {
            $scope.couponMessage = '';
          }
          $scope.flags.couponWait = true;
          cartHttpService.applyCoupon($scope.coupon.couponcode)
            .success(function(response) {
              $scope.flags.couponWait = false;
              if (response.s == 1) {
                $scope.flags.successCoupon = true;
                $scope.couponCode = response.d.coupon_code;
                $scope.couponMessage = response.m;
                updateTotals(response);
              } else {
                $scope.couponMessage = response.m;
              }
            })
            .error(function(err) {
              throw new Error(err);
            });
        },
        removeCoupon: function() {
          cartHttpService.removeCoupon($scope.coupon.couponcode)
            .success(function(response) {
              $scope.flags.successCoupon = false;
              $scope.flags.successCouponDetails = false;
              $scope.flags.couponCodeHeader = false;
              $scope.couponMessage = response.m;
              $scope.coupon = {};
              updateTotals(response);
            })
            .error(function(err) {
              throw new Error(err);
            })
        },
        proceedToCheckout: function() {
          if ($scope.flags.isOutOfStockProducts) {
            alert(ErrorMessages.cart.proceedToCheckout);
            return;
          }
          $scope.flags.proceedToCheckoutLoader = true;
          var productIds = [];
          var productName = [];
          angular.forEach($scope.getCartDetailsVal.product_list, function(product) {
            productIds.push(product.product_id);
            productName.push(product.product_name);
          });
          if (typeof dataLayer != "undefined") {
            dataLayer.push({
              'event': 'CheckedOutEvent',
              'eventName': 'CheckedOut',
              'eventAction': $scope.getCartDetailsVal.total_items,
              'itemsCount': $scope.getCartDetailsVal.total_items
            });
            dataLayer.push({
              'event': 'TappedButtonEvent',
              'eventName': 'TappedButton',
              'type': 'ProceededToPayment',
              'productInfo': productName,
              'finalAmount': $scope.getCartDetailsVal.sub_total
            });

          }

          if (typeof MSDtrack != "undefined") {
            MSDtrack({
              'event': 'placeOrder',
              'sourceProdID': productIds,
              'prodPrice': $scope.getCartDetailsVal.sub_total,
              'prodQty': $scope.getCartDetailsVal.total_qty
            });
          }

          if (typeof _satellite != "undefined") {
            _satellite.track('checkout-initiation');
          }

          coreHttpService.loginCheck()
            .success(function(response) {
              if (response.s == 0) {
                $state.go('login');
                $scope.flags.proceedToCheckoutLoader = false;
              } else {
                $state.go('shipping');
              }
            })
            .error(function(err) {
              throw new Error(err);
              $scope.flags.proceedToCheckoutLoader = false;
            })
        },
        init: function() {
          $scope.checkLogin();
          $scope.getCartDetails();
          $scope.scrollToTop();
          document.querySelector('#common-header').style.display = "none";
        }
      })

      $scope.init();
    }
]);
