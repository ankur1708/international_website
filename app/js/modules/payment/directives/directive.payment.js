angular.module('payment.directives')
.directive('paymentMethodOne', [function() {
  return {
    restrict: 'A',
    template: '<div class="col-xs-12 cashondelivery"> <h3 ng-if="mode.toLowerCase()===\'cash on delivery\' && codavailable && isDesktop()">Pay Using {{mode}}</h3> <p ng-if="mode.toLowerCase()===\'cash on delivery\' && codavailable">Please keep a total of <span ng-bind-html="Currency(currency)"></span> {{(amount || 0) | number: 0}} to pay on delivery</p><p ng-if="mode.toLowerCase() !==\'cash on delivery\'">You will be redirected to{{mode}}to complete the order.</p><p ng-if="mode.toLowerCase()===\'cash on delivery\' && !codavailable">Your order is not eligible for Cash On Delivery. Please pay Online.</p><div class="col-xs-12 col-sm-7 nopadding place-order-button" ng-if="(mode.toLowerCase()===\'cash on delivery\' && codavailable) || (mode.toLowerCase() !==\'cash on delivery\')"> <button class="btn btn-newStyle bg-green" ng-click="onorderplaced()" ng-class="{\'no-events\': loader}" id="placeOrderCODDesktopBtn"> <span ng-show="!loader" ng-bind-html="getPlaceOrderText()"></span> <div ng-show="loader" cv-loader class="small-loader"></div> </button> </div></div>',
    scope: {
      mode: '=',
      amount: '=',
      currency: '=',
      codavailable: '=',
      onorderplaced: '&',
      loader: '=',
      isdesktop: '='
    },
    controller: 'ctrl.cvPaymentMethodOne'
  };
}])
.directive('paymentMethodTwo', [function() {
  return {
    restrict: 'A',
    template: '<div class="col-xs-12 col-sm-8 creditcard"> <form name="formname" ng-submit="onorderplaced()" novalidate> <div class="col-xs-12 nopadding"> <fieldset class="form-group" ng-class="{\'error\' : validate(\'cardNumber\', formname)}"> <label>{{mode}}Number</label> <input class="form-control" type="text" name="cardNumber" ng-change="validateMaestro()" ng-model="cardobj.cardNumber" required cc-number cc-format cc-type="cardType" cc-eager-type placeholder="Card Number" autocomplete="off" ng-blur="formname.cardNumber.$xblur=true" ng-focus="formname.cardNumber.$xblur=false"> <p ng-if="validate(\'cardNumber\', formname)">Invalid {{mode}}</p><span class="card-type" ng-if="formname.cardNumber.$viewValue.length > 0"><img ng-src="{{getCCTypeImage(formname.cardNumber.$ccEagerType)}}"/></span> </fieldset> </div><div class="col-xs-12 nopadding"> <fieldset class="form-group" ng-class="{\'error\' : validate(\'cardName\', formname)}"> <label>Name on Card</label> <input type="text" placeholder="Name on Card" class="form-control" ng-model="cardobj.cardName" required name="cardName" autocomplete="off" ng-blur="formname.cardName.$xblur=true" ng-focus="formname.cardName.$xblur=false"> <p ng-if="validate(\'cardName\', formname)">Please enter name</p></fieldset> </div><div class="col-xs-12 nopadding"> <div class="col-xs-12 col-sm-7 valid-upto"> <fieldset class="form-group" ng-class="{\'error\' : validate(\'cardExp\', formname)}"> <label>Valid Upto<x ng-if="oldCreditMaestroDetected"> (Optional)</x> </label> <input ng-model="cardobj.cardMonth" cc-exp-month class="form-control pull-left" placeholder="MM" name="cardM" autocomplete="off" ng-blur="formname.cardM.$xblur=true" ng-focus="formname.cardM.$xblur=false" required/> <span role="division">/</span> <input ng-model="cardobj.cardYear" cc-exp-year class="form-control pull-right" placeholder="YY" name="cardY" ng-blur="formname.cardY.$xblur=true" ng-focus="formname.cardY.$xblur=false" autocomplete="off" required/> <p ng-if="validate(\'cardExp\', formname)">Invalid date</p></fieldset> </div><div class="col-xs-5 cvv-code"> <fieldset class="form-group" ng-class="{\'error\' : validate(\'cardCVC\', formname)}"> <label>CVV<x ng-if="oldCreditMaestroDetected"> (Optional)</x> </label> <input type="password" class="form-control" id="cc_cvc" cc-cvc cc-type="formname.cardNumber.$ccType" name="cardCVC" ng-model="cardobj.cardCvv" ng-blur="formname.cardCVC.$xblur=true" ng-focus="formname.cardCVC.$xblur=false" required autocomplete="off" placeholder="CVV"/> <i class="sprite sprite-cvv cvv-code-sprite"></i> </fieldset> </div><div ng-if="formname.$submitted && formname.$invalid && !oldCreditMaestroDetected" class="col-xs-12"> <span class="error">Please provide correct payment information</span> </div></div><div class="col-xs-12 nopadding place-order-button" ng-class="{\'no-events\': formname.$invalid}"> <button class="btn btn-newStyle bg-green" type="submit" ng-class="{\'no-events\': loader}"> <span ng-show="!loader" ng-bind-html="getPlaceOrderText()"></span> <div ng-show="loader" cv-loader class="small-loader"></div> </button> </div></form></div>',
    scope: {
      mode: '=',
      amount: '=',
      onorderplaced: '&',
      formname: '=',
      cardobj: '=',
      currency: '=',
      cardtypes: '=',
      loader: '='
    },
    controller: 'ctrl.cvPaymentMethodTwo'
  };
}])
.directive('paymentMethodThree', [function() {
  return {
    restrict: 'A',
    template: '<form class="col-xs-12 NetBanking" name="formname" novalidate ng-submit="onorderplaced()"> <ul role="nasted-list"> <li ng-repeat="bank in banklist.priority"> <input id="{{bank.bank_code}}" type="radio" name="bank" value="{{bank.bank_code}}" ng-model="xmodel.netbanking" required> <label for="{{bank.bank_code}}"> <span></span><img ng-src="/images/{{bank.logo_url}}" alt="{{bank.bank_name}}"/></label> </li></ul> <div class="col-xs-12 nopadding"> <span class="pull-left or">OR</span> <div class="select-style"> <select ng-model="xmodel.netbanking" name="bank" ng-options="item.bank_code as item.bank_name for item in banklist.others" required></select> <i class="sprite sprite-down-arrow select-sprite-payment"></i> </div><div ng-if="formname.$submitted && formname.$invalid" class="col-xs-12"> <span class="error">Please provide correct payment information</span> </div></div><div class="col-xs-12 col-sm-8 nopadding place-order-button" ng-class="{\'no-events\': formname.$invalid}"> <button class="btn btn-newStyle bg-green" type="submit" ng-class="{\'no-events\': loader}" ng-click="placeOrder()" id="placeOrderNBDesktopBtn"> <span ng-show="!loader" ng-bind-html="getPlaceOrderText()"></span> <div ng-show="loader" cv-loader class="small-loader"></div> </button> </div></div></form>',
    scope: {
      mode: '=',
      amount: '=',
      onorderplaced: '&',
      currency: '=',
      banklist: '=',
      xmodel: '=',
      loader: '=',
      formname: '='
    },
    controller: 'ctrl.cvPaymentMethodThree'
  };
}])
.directive('paymentSummaryBox', [function() {
  return {
    restrict: 'A',
    template: '<div class="nopadding col-xs-12 order-summary"><div class="nopadding col-xs-12 border-bottom"><h5>ORDER SUMMARY</h5></div><div class="nopadding col-xs-12 border-bottom order-summary-details"><div class="nopadding col-xs-12"><div class="nopadding col-xs-8 text-left"><p>Sub Total</div><div class="nopadding col-xs-4 text-right"><div class="ord-amt pull-right"ng-show=!flags.waitingCartDatails><span class=currency-code-summary ng-bind-html=Currency(orderCurrency)></span><div class=pull-right>{{ shippingAmountData.sub_total | number: 0 }}</div></div><div class=ord-amt ng-show=flags.waitingCartDatails><div class=textloading cv-text-loader></div></div></div></div><div class="nopadding col-xs-12"><div class="nopadding col-xs-8 text-left"><p ng-show="shippingAmountData.totol_discount > 0">Coupon Applied ({{ shippingAmountData.coupon_code }})</div><div class="nopadding col-xs-4 text-right"><div class="ord-amt pull-right"ng-show="successCoupon && !flags.waitingCartDatails"><span class=pull-left>- </span><span class=currency-code-summary ng-bind-html=Currency(orderCurrency)></span> {{ shippingAmountData.totol_discount | number: 0 }}</div><div class=ord-amt ng-show="flags.waitingCartDatails && successCoupon"><div class=textloading cv-text-loader></div></div></div></div><div class="nopadding col-xs-12"><p ng-show="shippingAmountData.totol_discount > 0"class=green>You saved {{ discountPecent | number: 0}}%</div><div class="nopadding col-xs-12"><div class="nopadding col-xs-8 text-left"><p>Shipping</div><div class="nopadding col-xs-4 text-right"><div class="ord-amt pull-right"ng-show=!flags.waitingCartDatails><span class=currency-code-summary ng-bind-html=Currency(orderCurrency)></span> {{ shippingAdressData.shipping_amount | number: 0 }}</div><div class=ord-amt ng-show=flags.waitingCartDatails><div class=textloading cv-text-loader></div></div></div></div></div><div class="nopadding col-xs-12"><div class="nopadding col-xs-8 text-left"><h5>Total Payable</h5></div><div class="nopadding col-xs-4 text-right"><div class="ord-amt pull-right total"ng-show=!flags.waitingCartDatails><span class=currency-code-summary ng-bind-html=Currency(orderCurrency)></span> {{ shippingAmountData.grand_total.value | number: 0 }}</div><div class=ord-amt ng-show=flags.waitingCartDatails><div class=textloading cv-text-loader></div></div></div></div></div>',
    replace: true
  };
}]);
