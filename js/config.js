app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "pages/client/home.html",
            controller: "HomeController"
        })
        .when("/about", {
            templateUrl: "pages/client/about.html",
            controller: "AboutController"
        })
        .when("/contact", {
            templateUrl: "pages/client/contact.html",
            controller: "ContactController"
        })
        .when("/login", {
            templateUrl: "pages/client/login.html",
            controller: "LoginController"
        })
        .when("/cart", {
            templateUrl: "pages/client/cart.html",
            controller: "CartController"
        })
        .when("/product-promotion", {
            templateUrl: "pages/client/product-promotion.html",
            controller: "HomeController"
        })
        .when("/product-detail/:id", {
            templateUrl: "pages/client/product_detail.html",
            controller: "HomeController"
        })
        .when("/order-complete/", {
            templateUrl: "pages/client/complete_order.html",
            controller: "OrderController"
        })
        .when("/shipping-order/", {
            templateUrl: "pages/client/check-status-order.html",
            controller: "OrderController"
        })
        
        .otherwise({
            redirectTo: "/"
        });
});

