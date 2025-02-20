appAdmin.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "../pages/admin/home.html",
            controller: "HomeAdminController"
        })
        .when("/promotion-list", {
            templateUrl: "../pages/admin/promotion_list.html",
            controller: "PromotionController"
        }).when("/promotion-create", {
            templateUrl: "../pages/admin/promotion_create.html",
            controller: "PromotionController"
        }).when("/promotion-create/admin/#!/#tab1", {
            templateUrl: "../pages/admin/promotion_create.html",
            controller: "PromotionController"
        }).when("/promotion-create/tab/admin/#!/#tab2", {
            templateUrl: "../pages/admin/promotion_create.html",
            controller: "PromotionController"
        }).when("/promotion-create/admin/#!/#tab3", {
            templateUrl: "../pages/admin/promotion_create.html",
            controller: "PromotionController"
        }).when("/products", {
            templateUrl: "../pages/admin/products.html",
            controller: "ProductController"
        }).when("/varian/:id", {
            templateUrl: "../pages/admin/product_varians.html",
            controller: "ProductVarianController"
        }).when("/login-admin", {
            templateUrl: "../pages/admin/login.html",
            controller: "LoginAdminController"
        }).when("/product-create", {
            templateUrl: "../pages/admin/product_create.html",
            controller: "ProductController"
        })
        .when("/order-detail/:id", {
            templateUrl: "../pages/admin/order-detail.html",
            controller: "OrderController"
        })
        .when("/order-approved", {
            templateUrl: "../pages/admin/order-approved.html",
            controller: "OrderController"
        })
        .when("/order-shipping", {
            templateUrl: "../pages/admin/order-shipping.html",
            controller: "OrderController"
        })
        .when("/order-shipped", {
            templateUrl: "../pages/admin/order-shipped.html",
            controller: "OrderController"
        })
        .when("/order-completed", {
            templateUrl: "../pages/admin/order-completed.html",
            controller: "OrderController"
        })
        .when("/order-cancel", {
            templateUrl: "../pages/admin/order-cancel.html",
            controller: "OrderController"
        })
        .when("/coupon-create", {
            templateUrl: "../pages/admin/coupon_create.html",
            controller: "CouponController"
        })
        .when("/coupon-list", {
            templateUrl: "../pages/admin/coupon_list.html",
            controller: "CouponController"
        })
        .when("/warehouse-list", {
            templateUrl: "../pages/admin/warehouse_list.html",
            controller: "WarehouseController"
        })
        .when("/warehouse-detail", {
            templateUrl: "../pages/admin/warehouse_detail.html",
            controller: "WarehouseController"
        })
        .when("/warehouse-product-detail", {
            templateUrl: "../pages/admin/warehouse_product_detail_status.html",
            controller: "WarehouseController"
        })
        .when("/submenu-order", {
            templateUrl: "../pages/admin/home.html",
            controller: "HomeAdminController"
        })
        .when("/submenu-products", {
            templateUrl: "../pages/admin/products.html",
            controller: "WarehouseController"
        })
        .when("/submenu-promotion", {
            templateUrl: "../pages/admin/promotion_list.html",
            controller: "PromotionController"
        })
        // .when("/warehouse-product-detail", {
        //     templateUrl: "../pages/admin/warehouse_product_detail_status.html",
        //     controller: "WarehouseController"
        // })
        // .when("/warehouse-product-detail", {
        //     templateUrl: "../pages/admin/warehouse_product_detail_status.html",
        //     controller: "WarehouseController"
        // })
        // .when("/warehouse-product-detail", {
        //     templateUrl: "../pages/admin/warehouse_product_detail_status.html",
        //     controller: "WarehouseController"
        // })
        // .when("/warehouse-product-detail", {
        //     templateUrl: "../pages/admin/warehouse_product_detail_status.html",
        //     controller: "WarehouseController"
        // })

        // .when("/coupon-create/tab/admin/#!/#tab1", {
        //     templateUrl: "../pages/admin/coupon_create.html",
        //     controller: "CouponController"
        // })
        // .when("/coupon-create/tab/admin/#!/#tab2", {
        //     templateUrl: "../pages/admin/coupon_create.html",
        //     controller: "CouponController"
        // })
        // .when("/coupon-create/tab/admin/#!/#tab3", {
        //     templateUrl: "../pages/admin/coupon_create.html",
        //     controller: "CouponController"
        // })
        
        .otherwise({
            redirectTo: "/"
        });
});

