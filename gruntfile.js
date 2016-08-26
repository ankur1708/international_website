module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            scripts: {
                files: ['./app/js/**/*.js', '!./app/js/*.min.js', '!./app/js/*.min.*.js'],
                tasks: ['clean:js', 'uglify']
            },
            styles: {
                files: ['./app/css/sprite.css', './app/css/style.css' ],
                tasks: ['clean:css', 'cssmin']
            }
        },
        sass: {
            options: {
                style: 'compressed'
            },
            prod: {
                src: './app/css/style.scss',
                dest: './app/css/style.min.css'
            }
        },
        clean: {
            js: ['app/js/*.min.js', 'app/js/*.min.*.js', 'app/js/dist/*.js'],
            html: ['app/partials/*.html', '!app/partials/checkout-cart.html', '!app/partials/login.html', '!app/partials/shipping.html', '!app/partials/payment.html', '!app/partials/payment-success.html'],
            css: ['app/css/main.min.css', 'app/css/main.min.*.css'],
        },
        cssmin: {
          options: {
            shorthandCompacting: false,
            roundingPrecision: -1
          },
          target: {
            files: {
            //   'app/css/main.min.css': ['app/bower_components/bootstrap/dist/css/bootstrap.min.css','app/css/custom.css',  './app/css/sprite.css', 'app/css/style.css']
                'app/css/main.min.css': ['app/css/custom-bootstrap.min.css','app/css/header.css',  './app/css/sprite.css', 'app/css/style.css']
            }
          }
      },
      uglify: {
        options: {
          mangle: false,
          compress: {
            drop_console: true
          }
        },
        core: {
            files: {
                "./app/js/dist/core.min.js": [
                    "./app/bower_components/angular/angular.min.js",
                    "./app/bower_components/oclazyload/dist/ocLazyLoad.min.js",
                    "./app/bower_components/angular-ui-router/release/angular-ui-router.min.js",
                    "./app/js/core/app.js",
                    "./app/js/core/core.config.js",
                    "./app/js/core/core.routes.js",
                    "./app/js/core/core.controller.js",
                    "./app/js/core/core.directive.js",
                    "./app/js/core/core.filter.js",
                    "./app/js/core/core.service.js",
                ]
            },
        },
        cart: {
            files: {
                "./app/js/dist/cart.min.js": [
                    // Cart
                    "./app/js/modules/cart/module.cart.js",

                    "./app/js/modules/cart/services/service.cart.js",

                    "./app/js/modules/cart/controllers/ctrl.cart.js",
                    "./app/js/modules/cart/controllers/ctrl.cvCartProduct.js",

                    "./app/js/modules/cart/directives/directive.cart.js",
                    // Login
                    "./app/bower_components/satellizer/satellizer.min.js",
                    "./app/js/modules/login/module.login.js",

                    "./app/js/modules/login/config.login.js",

                    "./app/js/modules/login/services/service.login.js",

                    "./app/js/modules/login/controllers/ctrl.login.js",
                    // Shipping
                    "./app/js/modules/shipping/module.shipping.js",

                    "./app/js/modules/shipping/services/service.shipping.js",

                    "./app/js/modules/shipping/controllers/ctrl.shipping.js",
                    "./app/js/modules/shipping/controllers/ctrl.cvAddressForm.js",

                    "./app/js/modules/shipping/directives/directive.shipping.js",
                ],
            }
        },
        payment: {
            files: {
                "./app/js/dist/payment.min.js": [
                    "./app/bower_components/angular-cookies/angular-cookies.min.js",
                    "./app/bower_components/angular-credit-cards/release/angular-credit-cards.js",

                    "./app/js/modules/payment/module.payment.js",

                    "./app/js/modules/payment/services/service.payment.js",

                    "./app/js/modules/payment/controllers/ctrl.payment.js",
                    "./app/js/modules/payment/controllers/ctrl.cvPaymentMethodOne.js",
                    "./app/js/modules/payment/controllers/ctrl.cvPaymentMethodTwo.js",
                    "./app/js/modules/payment/controllers/ctrl.cvPaymentMethodThree.js",

                    "./app/js/modules/payment/directives/directive.payment.js",
                ],
            }
        },
        paymentsuccess: {
            files: {
                "./app/js/dist/payment-success.min.js": [
                    "./app/bower_components/angular-cookies/angular-cookies.min.js",

                    "./app/js/modules/paymentsuccess/module.paymentsuccess.js",

                    "./app/js/modules/paymentsuccess/services/service.paymentsuccess.js",

                    "./app/js/modules/paymentsuccess/controllers/ctrl.paymentsuccess.js"
                ]
            }
        }
      },
      cacheBust: {
        css: {
            options: {
                baseDir: 'app/',
                assets: ['css/main.min.css']
            },
            src: ['app/index.html', 'app/requirements.html', 'app/assets.json']
        },
        js: {
            options: {
                baseDir: 'app/',
                assets: ['js/dist/core.min.js']
            },
            src: ['app/index.html', 'app/requirements.html', 'app/assets.json']
        },
        partials: {
            options: {
                baseDir: 'app/',
                assets: ['partials/checkout-cart.html', 'partials/login.html', 'partials/shipping.html', 'partials/payment.html', 'partials/payment-success.html']
            },
            src: ['app/js/core/core.routes.js', 'app/assets.json', 'app/requirements.html']
        },
        noncore: {
            options: {
                baseDir: 'app/',
                assets: ['js/dist/cart.min.js', 'js/dist/login.min.js', 'js/dist/shipping.min.js', 'js/dist/payment.min.js', 'js/dist/payment-success.min.js']
            },
            src: ['app/js/core/core.routes.js', 'app/assets.json', 'app/requirements.html']
        }
    },

    htmlmin: {                                     // Task
        dist: {                                      // Target
            options: {                                 // Target options
                removeComments: true,
                collapseWhitespace: true
            },
            files: [{
                expand: true,     // Enable dynamic expansion.
                cwd: 'app/partials/',      // Src matches are relative to this path.
                src: ['**/*.html'], // Actual pattern(s) to match.
                dest: 'app/partials/',   // Destination path prefix.
            }, {
                expand: true,     // Enable dynamic expansion.
                cwd: 'app/',      // Src matches are relative to this path.
                src: ['index.html', 'requirements.html'], // Actual pattern(s) to match.
                dest: 'app/',   // Destination path prefix.
            }],
        }
      }

    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    grunt.registerTask('default', ['clean', 'cssmin', 'uglify', 'watch']);
    grunt.registerTask('production', ['clean', 'cssmin', 'cacheBust:partials', 'uglify:cart', 'uglify:payment', 'uglify:paymentsuccess', 'cacheBust:noncore', 'uglify:core', 'cacheBust:css', 'cacheBust:js', 'htmlmin']);

};
