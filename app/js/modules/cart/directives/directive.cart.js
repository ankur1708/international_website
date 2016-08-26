angular.module('cart.directives')
.directive('cvCartProduct', [ function() {
  return {
    restrict: 'A',
    template: '<div class="cart-items-cont"> <div class="cart-img-cont"> <a target="_self" ng-href="{{product.url}}"><img ng-src="{{imghost}}/thumb/216x216{{product.product_image}}" class="img-responsive"></a> </div><div class="cart-details-cont"> <a href="javascript:void(0)" class="cart-details-close" ng-click="onitemremoved({product_id: product.product_id, data: product})"> <i class="sprite sprite-grey-cross"></i> </a> <div class="col-xs-12 nopadding c-itm-name">{{product.product_name}}</div><div class="col-xs-12 nopadding margin-top-5-px minimum-height-15px"> <div ng-if="product.variant" ng-bind-html="getProductMetaData(product.variant,{\'key\': \'Size\', \'name\': \'Size\'},{\'key\': \'Color\', \'name\': \'Color\'})"></div></div><div class="col-xs-6 nopadding c-itm-qty"> <div class="text">Qty:</div><select ng-init="initializeQuantity(product)" ng-model="product.quantity" class="form-control width-auto" ng-options="opt as opt.id for opt in quantityOptions" ng-change="onquantityupdated({quantity: product.quantity, product_id: product.product_id, data: product})"></select> </div><div class="col-xs-6 nopadding c-itm-price pull-right"> <div style="float:right;">{{product.product_price | number: 0}}</div><span class="currency-code" ng-bind-html="Currency(currency)"></span> </div><div class="col-xs-12 nomargin nopadding seller-note hidden-xs" ng-click="showNoteToSeller(product)" ng-if="!product.seller_note">add a note to seller</div></div></div><div class="cart-seller-cont"> <div class="text hidden-lg" ng-click="showNoteToSeller(product)" ng-if="!product.seller_note">add a note to seller</div><div class="open-cont" ng-show="product.showFormNote"> <form name="sellerForm" ng-submit="onnoteadded({index: $index, product_id: product.product_id, comment: product.sellernote, data: product})" novalidate> <div ng-class="{\'error\' : (sellerForm.sellernote.$invalid && !sellerForm.sellernote.$pristine) || (sellerForm.$submitted && sellerForm.sellernote.$error.required)}"> <p> Add note to seller </p><textarea class="seller-texta" ng-model="product.sellernote" name="sellernote" placeholder="Add a note here" ng-minlength="5" required></textarea> <div ng-show="sellerForm.$submitted || sellerForm.sellernote.$touched"> <span ng-show="sellerForm.sellernote.$error.required" class="error">Seller note required.</span> </div></div><button type="submit" class="buttons b-border t-m-10">save</button> </form> <span class="buttons l-m-20 t-m-10 m-right-20" ng-click="hideNoteToSeller(product)">cancel</span> </div><div class="open-cont" ng-if="!!product.seller_note" ng-hide="product.showFormNote"> <p>{{product.seller_note}}</p><button class="buttons b-border t-m-10" ng-click="onnoteupdated({data: product, note: product.seller_note})">edit</button> <a href="javascript:void(0)" class="buttons l-m-20 t-m-10 m-left-20" ng-click="onnoteremoved({data: product})">remove</a> </div></div><div class="overlay-out-stock" ng-show="product.waitingCartItem"> <div cv-loader class="loader-cartitem"></div></div>',
    scope: {
      product: '=',
      imghost: '=',
      onquantityupdated: '&',
      onitemremoved: '&',
      onnoteadded: '&',
      onnoteremoved: '&',
      onnoteupdated: '&',
      currency: '='
    },
    controller: 'ctrl.cvCartProduct',
  };
}]);
