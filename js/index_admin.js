const host = "http://192.168.1.7:8888";
const apiUrl = host + "/api/v1/"
const apiUrlV0 = host + "/api/v0/"
const apiUrlLogin = host + "/api/auth/login"
let token = "";
var appAdmin = angular.module("myAppAdmin", ["ngRoute"])


appAdmin.controller("HomeAdminController", function($scope, $http, $sce) {
        
    
    $scope.init = function(){
        token = localStorage.getItem("access_token_admin")
        let time_token = localStorage.getItem('time_token_login_admin')
        if(token == undefined || token == "undefined"){
            window.location.href= "/admin/#!/login-admin"
        }

        
        if (time_token != null){
            if ((new Date() - new Date(time_token)) / 1000 > 604800){
                learLocal()
                showErrorPopup("Tài khoản đăng nhập của bạn đã hết hạn!")
                window.location.href = "/admin/#!/login-admin"
            }
        }
        // $scope.entries = [
        //     { date: '10/02/2025', amount: 1000000 },
        //     { date: '11/02/2025', amount: 1100000 },
        //     { date: '12/02/2025', amount: 2000000 },
        //     { date: '13/02/2025', amount: 13000000 }
        //   ];
        //   $scope.updateChart()
        $scope.profile()
        // $scope.charOrders()
        $scope.getOrders()
        $scope.params = ""
        window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
    }
    $scope.profile = function(){
        $http({
            method: 'GET',
            url: apiUrl + "profile",
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function (response) {
            $scope.user = response.data.data
            if ($scope.user.role_code != "SUPERADMIN"){
                showErrorPopup("Vui lòng đăng nhập bằng tài khoản admin")
                $scope.logout()
            }
            document.getElementById("dropdownMenuButton").setAttribute("src", "/img/" + $scope.user.avatar)
            document.getElementById("avatar_name").innerText = $scope.user.username
        }
        ).catch(function(error){
            console.log("Error call api profile")
            showErrorPopup(error.message)
        })
    }
    $scope.getOrders = function(params = ""){
        $scope.params = params
        $http({
            method: 'GET',
            url: apiUrl + "orders?" + $scope.params,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function (response) {
            $scope.orders = response.data.data
            $scope.meta_orders = response.data.meta
        }).catch(function(e){
            console.log("error call api orders",e);
        })
    }
    $scope.searchOrders = function(){
            let params = "";
            if ($scope.order_code_params != undefined){
                params = params +  "code=" +  $scope.order_code_params + "&"
            }
            if ($scope.username_params != undefined){
                params = params +  "username=" +  $scope.username_params + "&"
            }
            if ($scope.status_order_params != undefined){
                params = params +  "status=" +  $scope.status_order_params + "&"
            }
            if ($scope.start_time_params != undefined){
                params = params +  "start_time=" +  formatDateTime(new Date($scope.start_time_params))+ "&"
            }
            if ($scope.end_time_params != undefined){
                params = params +  "end_time=" +   formatDateTime(new Date($scope.end_time_params)) + "&"
            }
            $scope.getOrders(params)
    }
    $scope.getOrderByLink = function(link){
       
            if (link == undefined){
                link = "1"
            }
          
            if (link.length <= 10){
                link = apiUrl + "orders?" + $scope.params +  "limit=10&page=" + link
            }
           link = link.replace("?page", "?" + $scope.params + "page")
        $http({
            method: 'GET',
            url: link,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function (response) {
            $scope.orders = response.data.data
            $scope.meta_orders = response.data.meta
        }).catch(function(e){
            console.log("error call api orders",e);
        })
    }
    $scope.logout = function(){
        logout()
        window.location.href = "admin/#!/"
    }
    $scope.setChart = function() {
        $timeout(function() {
            $scope.myChart = document.getElementById('myChart'); // Lưu vào $scope
            if ($scope.myChart) {
                var ctx = $scope.myChart.getContext('2d');
                // console.log(ctx); // Kiểm tra nếu ctx có giá trị
            }
        });
    };
    $scope.updateChart = function() {
        // console.log($scope.myChart)
        if (!$scope.myChart) return; // Kiểm tra xem canvas có tồn tại không

        var ctx = $scope.myChart.getContext('2d'); // Lấy context từ ng-ref

        if ($scope.chart) {
            $scope.chart.destroy(); // Xóa biểu đồ cũ
        }

        $scope.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: $scope.entries.map(e => e.date),
                datasets: [{
                    label: 'Số Tiền',
                    data: $scope.entries.map(e => e.amount),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: 'Ngày' } },
                    y: { title: { display: true, text: 'Số Tiền' }, beginAtZero: true }
                }
            }
        });
    };
    $scope.detailOrderClick = function(id){
        Redirect("order-detail/" + id)
    }
    $scope.init()
    
})
appAdmin.controller("PromotionController", function($scope, $http, $sce) {
    $scope.getPromotions = function(){
           $http({
                method: 'GET',
                url: apiUrl + "promotions",
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(function(response) {
                $scope.promotions = response.data.data
            },function(error){
                console.log("Lỗi gọi api promotions by admin", error)
            }); 
        }

    $scope.init = function(){
        token = localStorage.getItem("access_token_admin")
        let time_token = localStorage.getItem('time_token_login_admin')

        


        if(token == undefined || token == "undefined"){
            window.location.href= "/admin/#!/login-admin"
        }

        
        if (time_token != null){
            if ((new Date() - new Date(time_token)) / 1000 > 604800){
                learLocal()
                showErrorPopup("Tài khoản đăng nhập của bạn đã hết hạn!")
                window.location.href = "/admin/#!/login-admin"
            }
        }
        $scope.promotion = JSON.parse(localStorage.getItem('promotion'))
        
        if ($scope.promotion != undefined){
            if (($scope.promotion.conditions) != null){
                $scope.conditions = $scope.promotion.conditions
            }
            if (($scope.promotion.gifts) != null){
                $scope.gifts = $scope.promotion.gifts
            }
            $scope.promotion.start_time = new Date($scope.promotion.start_time)
            $scope.promotion.end_time = new Date($scope.promotion.end_time)
        }
        $scope.getPromotions()
        
    }
    $scope.getProductsPromotion = function(id, product_index, param){
        $scope.id_input_product_promotion_item = "product-condition-item" + id
        $scope.product_index = product_index
        if (param == undefined){
            param = ""
        }
        $http({
            method: 'GET',
            url: host + "/api/v1/promotion-products?code="+param+"&name="+param,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function(response) {
            $scope.products_promotion = response.data.data
        },function(error){
            console.log("Lỗi gọi api products promotion by admin", error)
        }); 
    } 
    $scope.getProductsGiftPromotion = function(id, product_index, param){
        $scope.id_input_gift_promotion_item = "product-gift-item" + id
        $scope.gift_index = product_index
        if (param == undefined){
            param = ""
        }
        $http({
            method: 'GET',
            url: host + "/api/v1/promotion-products?code="+param+"&name="+param,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function(response) {
            $scope.products_promotion = response.data.data
        },function(error){
            console.log("Lỗi gọi api products promotion by admin", error)
        }); 
    } 
    $scope.getProductsPromotionInPopup = function(id){
        param = document.getElementById(id).value
        if (param == undefined){
            param = ""
        }
        $http({
            method: 'GET',
            url: host + "/api/v1/promotion-products?code="+param+"&name="+param,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function(response) {
            $scope.products_promotion = response.data.data
        },function(error){
            console.log("Lỗi gọi api products promotion popup by admin", error)
        }); 
    }
    $scope.addProductsPromotion = function(){
        
        let data_product =  (document.getElementById('value-product-promotion-item').value).split(",")
        let code_product = data_product[0]
        let name_product = data_product[1]
        let index = ($scope.id_input_product_promotion_item).replace("product-condition-item","")
        
        let condition_type = document.getElementById("condition_type_condition-item" + index + "." + $scope.product_index).value
        let condition = document.getElementById("condition-condition-item" + index + "." + $scope.product_index).value
        let number = document.getElementById("number-condition-item" + index + "." + $scope.product_index).value

        document.getElementById($scope.id_input_product_promotion_item + "." + $scope.product_index).value = code_product
        document.getElementById($scope.id_input_product_promotion_item + "name." + $scope.product_index).value = name_product

        $scope.conditions[index].condition_data[$scope.product_index].product_code = code_product
        $scope.conditions[index].condition_data[$scope.product_index].product_name = name_product
        $scope.conditions[index].condition_data[$scope.product_index].condition_type = condition_type
        $scope.conditions[index].condition_data[$scope.product_index].condition = condition
        $scope.conditions[index].condition_data[$scope.product_index].number = number
        $scope.promotion.conditions = $scope.conditions
    }
    
    
    $scope.changeNumberCondition = function(value, condition_index, product_index){
        let index = condition_index
        if (product_index == undefined){
            index = ($scope.id_input_product_promotion_item).replace("product-condition-item","")
        }
        if (product_index != undefined){
            $scope.product_index =  product_index
        }
        
        // $scope.product_index
        
       
        $scope.conditions[index].condition_data[$scope.product_index].number = value
        $scope.promotion.conditions = $scope.conditions

    }
    $scope.changeConditionCondition = function(value,condition_index, product_index){
        let index = condition_index
        if (product_index == undefined){
            index = ($scope.id_input_product_promotion_item).replace("product-condition-item","")
        }
        if (product_index != undefined){
            $scope.product_index =  product_index
        }
        // $scope.product_index
        $scope.conditions[index].condition_data[$scope.product_index].condition = value 
        $scope.promotion.conditions = $scope.conditions
    }
    $scope.changeConditionTypeCondition = function(value,condition_index, product_index){
        let index = condition_index
        if (product_index == undefined){
            index = ($scope.id_input_product_promotion_item).replace("product-condition-item","")
        }
        if (product_index != undefined){
            $scope.product_index =  product_index
        }
        // $scope.product_index
        $scope.conditions[index].condition_data[$scope.product_index].condition_type = value
        $scope.promotion.conditions = $scope.conditions
    }
    $scope.addProductConditionPromotion = function(index, product_index){
        $scope.conditions[index].condition_data[product_index + 1] = {
                "product_code": "",
                "product_name": "",
                "condition": ">",
                "number": 1,
                "condition_type": "price",
                "product_index": product_index + 1
        } 
    }

    // $scope.addProductsPromotion2 = function(){
    //     $scope.product_index
    //     let data_product =  (document.getElementById('value-product-promotion-item').value).split(",")
    //     let code_product = data_product[0]
    //     let name_product = data_product[1]
    //     let index = ($scope.id_input_product_promotion_item).replace("product-condition-item","")
        
    //     let condition_type = document.getElementById("condition_type_condition-item" + index).value
    //     let condition = document.getElementById("condition-condition-item" + index).value
    //     let number = document.getElementById("number-condition-item" + index).value
        
    //     document.getElementById($scope.id_input_product_promotion_item).value = code_product
    //     document.getElementById($scope.id_input_product_promotion_item + "name").value = name_product
        
    //     // $scope.conditions[index].condition_data[].product_code = code_product
    //     $scope.conditions[index].product_name = name_product
    //     $scope.conditions[index].condition_type = condition_type
    //     $scope.conditions[index].condition = condition
    //     $scope.conditions[index].number = number
    //     console.log($scope.conditions)
    // } 
    $scope.showConditionProduct = function(value, index){
           $scope.conditions[index].type = value
    }
    $scope.conditionTab = function(){
        if ($scope.promotion == null){
            $scope.promotion = {
                "code": "",
                "name": "",
                "start_time": "",
                "end_time": "",
                "conditions": null,
                "gifts": null,
                "condition_apply": "TOGETHER"
           }
        }
            if ($scope.promotion.conditions == null){
                $scope.conditions = [
                    {
                        "type": "ANY_PRODUCT",
                        "apply_product": "ALL_PRODUCT",
                        "appy_condition": "TOGETHER",
                        "condition_data": [{
                            "product_code": "",
                            "product_name": "",
                            "condition": "=",
                            "number": 1,
                            "condition_type": "price",
                            "product_index": 0
                        }],
                        "index": 0
                    } 
                ]
            }
        
        
        
    
    }

    $scope.addProductsGiftPromotion = function(){
        
        let data_product =  (document.getElementById('value-gift-promotion-item').value).split(",")
        let code_product = data_product[0]
        let name_product = data_product[1]
        let index = ($scope.id_input_gift_promotion_item).replace("product-gift-item","")
        
        document.getElementById($scope.id_input_gift_promotion_item + "." + $scope.gift_index).value = code_product
        document.getElementById($scope.id_input_gift_promotion_item + "name." + $scope.gift_index).value = name_product

        $scope.gifts[index].gifts[$scope.gift_index].product_code = code_product
        $scope.gifts[index].gifts[$scope.gift_index].product_name = name_product
        $scope.promotion.gifts = $scope.gifts
    }
    $scope.addProductGiftPromotion = function(index, product_index){
        $scope.gifts[index].gifts[product_index + 1] = {
            "product_code": "",
            "product_name": "",
            "qty": 1,
            "product_index": product_index + 1
        } 
    }

    $scope.giftTab = function(){
        if ($scope.promotion == null){
           $scope.promotion = {
                "code": "",
                "name": "",
                "start_time": "",
                "end_time": "",
                "conditions": null,
                "gifts": null
           }
        }
       
            if ($scope.promotion.gifts == null){
                $scope.gifts = [
                    {
                        "type": "DIRECT_GIFT",
                        "gifts": [{
                            "product_code": "",
                            "product_name": "",
                            "qty": 1,
                            "product_index": 0
                        }],
                        "index": 0
                    } 
                ]
            }
        
        
    
    }

    
        $scope.addCondition = function(){
            $scope.conditions[$scope.conditions.length] =
                {
                    "type": "ANY_PRODUCT",
                    "condition_data": [{
                    "product_code": "",
                        "product_name": "",
                        "condition": "=",
                        "number": 1,
                        "condition_type": "price",
                        "product_index": 0
                    }],
                    "index": $scope.conditions.length
                }
        } 
        $scope.savePromotion = function(){
             let options = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
             }

             $scope.promotion.img = (document.getElementById('promotion_img').value).replace("C:\\fakepath\\","") 
             let body = {
                "id": $scope.promotion.id??null,
                "code": $scope.promotion.code,
                "name": $scope.promotion.name,
                "start_time": $scope.promotion.start_time,
                "end_time": $scope.promotion.end_time,
                "status": $scope.promotion.status,
                "conditions": $scope.conditions,
                "gifts": $scope.gifts,
                "show_web": $scope.promotion.show_web,
                "img": $scope.promotion.img
            }
             $http.post(host + "/api/v1/promotion",body, options).then(function(response) {
                
                $scope.promotions = response.data.data
                window.location.href = "/admin/#!/promotion-list"

            },function(error){
                console.log("Lỗi gọi api create promotion by admin", error)
            });  
             
         }
         $scope.editPromotion = function(id){
            
            $http({
                method: 'GET',
                url: host + "/api/v1/promotion/" + id,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }).then(function(response) {
                
                $scope.promotion = response.data.data
                let day_start_time = $scope.promotion
                $scope.promotion.start_time = (day_start_time.start_time).replace(" ","T").slice(0,-3) 
                $scope.promotion.end_time = (day_start_time.end_time).replace(" ","T").slice(0,-3)
                localStorage.setItem('promotion',JSON.stringify($scope.promotion))
                window.location.href = "/admin/#!/promotion-create"

            },function(error){
                console.log("Lỗi gọi api detail promotion by admin", error)
            }); 

         }
         $scope.removeConditionPromotion = function(condition_index, index){
            // $scope.promotion.conditions.splice(index,1);
            $scope.conditions[condition_index].condition_data.splice(index,1)
            alertCustom(condition_index)
            if ($scope.conditions[condition_index].condition_data.length == 0 && condition_index > 0 ){
                $scope.conditions.splice(condition_index,1);
            }
            if ($scope.conditions[condition_index].condition_data.length == 0 && condition_index == 0){
                $scope.conditions[condition_index].condition_data[0] = {
                    "type": "PRODUCT_ON_CART", "index": 0, "apply_product": "SOME_PRODUCT", "appy_condition": "TOGETHER", "condition_data": [{"number": "1", "condition": "=", "product_code": "", "product_name": "", "product_index": "0", "condition_type": "number"} ]
                 }
            }
             
         }
         $scope.removeGiftPromotion = function(gift_index, index){
            // $scope.promotion.conditions.splice(index,1);
            if ($scope.gifts[gift_index].gifts.length == 0 && gift_index > 1 ){
                $scope.gifts.splice(gift_index,1);
            }
            $scope.gifts[gift_index].gifts.splice(index,1)
            if ($scope.gifts[gift_index].gifts.length == 0){
                $scope.gifts[0] = {
                    "type": "DISCOUNT_PRICE",
                    "gifts": [{"qty": 0, "value": 0, "product_code": "", "product_name": "", "product_index": "0", "type_discount": "percent"}], "index": 0
                }
            }
         }
    
    $scope.init()
})  

appAdmin.controller("LoginAdminController", function($scope, $http, $sce) {
    $scope.loginAdmin = function(){
        let data = {
            "email": $scope.email,
            "password": $scope.password
        }
        $http.post(apiUrlLogin, data)
            .then(function(response) {
                localStorage.setItem('access_token_admin', response.data.access_token)
                localStorage.setItem('expires_in_admin', response.data.expires_in)
                localStorage.setItem('token_type_admin', response.data.token_type)
                localStorage.setItem('time_token_login_admin', new Date())
                window.location.href = "#!/"
                        
            })
            .catch(function(error) {
            console.log('GET error:', error);
            showErrorPopup("Tài khoản hoặc mật khẩu không chính xác!")
            });        
            
        }

})

appAdmin.controller("ProductController", function($scope, $http, $sce, $routeParams, $location) {
    let info_long;
    // let info_short;
    
    $scope.product_create;
    $scope.init = function(){
        $scope.getProductDetailById($routeParams.id)
        let product_create_id = localStorage.getItem('product_create_id')
        if ($location.$$path == "/product-create" &&  product_create_id != undefined){
            $http({
                method: 'GET',
                url: apiUrl + "product-detail/" + product_create_id,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(function (response) {
                $scope.product_create = response.data.data
                
                info_long.root.innerHTML = $scope.product_create.infomation_long
                // info_short.root.innerHTML = $scope.product_create.infomation_short
                $scope.varians = $scope.product_create.varians  

                
            }).catch(function(e){
                console.log("Error call api get product detail", e)
                showErrorPopup("Lôi gọi api detail product")
            })
            
        }else{
            $scope.product_create = new Object()
            $scope.product_create.varians = []
            $scope.product_create.images = []
        }
        info_long = new Quill('#info_long', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, false] }], // Tiêu đề H1, H2
                    ['bold', 'italic', 'underline'], // Chữ đậm, nghiêng, gạch chân
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }], // Danh sách
                    ['link', 'image'], // Chèn link, ảnh
                    ['clean'] // Xóa format
                ]
            }
        });
        
        // info_short = new Quill('#info_short', {
        //     theme: 'snow',
        //     modules: {
        //         toolbar: [
        //             [{ 'header': [1, 2, false] }], // Tiêu đề H1, H2
        //             ['bold', 'italic', 'underline'], // Chữ đậm, nghiêng, gạch chân
        //             [{ 'list': 'ordered'}, { 'list': 'bullet' }], // Danh sách
        //             ['link', 'image'], // Chèn link, ảnh
        //             ['clean'] // Xóa format
        //         ]
        //     }
        // });
    }
    $scope.saveProduct = function(){
        $scope.product_create.infomation_long  = info_long.root.innerHTML
        // $scope.product_create.infomation_short  = info_short.root.innerHTML
        let options = {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }
        $scope.product_create.image_url =  $scope.product_create.images[0]
        $http.post(apiUrl + "product",$scope.product_create,options).then(function (response) {
            $scope.product_create = {}
            localStorage.setItem('product_create', JSON.stringify($scope.product_create))
            alertCustom("Tạo sản phẩm thành công!")
        }).catch(function(e){
            console.log("Error call api save product", e)
            showErrorPopup("Lỗi gọi api lưu sản phẩm")
        })
    }
    $scope.addProperty = function(value){
        alert(value)
        $scope.product_create.varians[$scope.product_create.varians.length] = value
        console.log($scope.product_create)
    }
    $scope.getProductDetailById = function(){
        $http({
            method: 'GET',
            url: apiUrl + "products",
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function (response) {
            $scope.products = response.data.data
        }).catch(function(e){
            console.log("Error call api get products", e)
            showErrorPopup("Lỗi gọi api xem chi tiết sản phẩm")
        })
    }
    $scope.redirectProductVarian = function(product_id){
        window.location.href = "#!/varian/" + product_id
    }
    $scope.clickCreateProduct = function(){
            // $scope.product = new Object()
            $scope.product.varians = {
                "data": []
            }
    }
    // $scope.editProduct = function(id){
    //     $http({
    //         method: 'GET',
    //         url: apiUrl + "product-detail/" + id,
    //         headers: {
    //             'Authorization': 'Bearer ' + token
    //         }
    //     }).then(function (response) {
    //         Redirect("product-create")
    //         $scope.product = response.data.data
            
            
    //         console.log($scope.product)
    //     }).catch(function(e){
    //         console.log("Error call api get product detail", e)
    //         showErrorPopup("Lôi gọi api detail product")
    //     })
    // }
    $scope.clickCreateProduct = function(){
        // $scope.product = new Object()
        // $scope.product.varians = {
        //     "data": []
        // }
        
}
$scope.editProduct = function(id){
    localStorage.removeItem('product_create')
    localStorage.setItem('product_create_id',id)
    window.location.href = "#!/product-create"
    
}
$scope.addImageProductDetail = function(){
        // $scope.product_create.images[$scope.product_create.images.length] = (document.getElementById("add_product_image").value).replace("C:\\fakepath\\","") 
        let files = document.getElementById("add_product_image").files
        let fileNames = [];

        for (let i = 0; i < files.length; i++) {
            $scope.product_create.images.push(files[i].name);
        }
        console.log($scope.product_create.images)
}
$scope.removeImageProductDetail = function(index){
    $scope.product_create.images.splice(index,1)
}

    $scope.init()
})
appAdmin.controller("CouponController", function($scope, $http, $sce, $location) {
    $scope.getCoupons = function(){
           $http({
                method: 'GET',
                url: apiUrl + "promocodes",
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(function(response) {
                $scope.coupons = response.data.data
            },function(error){
                console.log("Lỗi gọi api coupons by admin", error)
            }); 
        }

    $scope.init = function(){
        token = localStorage.getItem("access_token_admin")
        let time_token = localStorage.getItem('time_token_login_admin')

        


        if(token == undefined || token == "undefined"){
            window.location.href= "/admin/#!/login-admin"
        }

        
        if (time_token != null){
            if ((new Date() - new Date(time_token)) / 1000 > 604800){
                learLocal()
                showErrorPopup("Tài khoản đăng nhập của bạn đã hết hạn!")
                window.location.href = "/admin/#!/login-admin"
            }
        }

        $scope.coupon_id = localStorage.getItem("coupon_id")
        if ($location.$$path == "/coupon-create" && $scope.coupon_id != undefined){
            $scope.couponDetail($scope.coupon_id)
        }
        if ($location.$$path == "/coupon-create" && $scope.coupon_id == undefined){
            $scope.coupon = {
                "condition_data": [{
                    "type_condition": "cart",
                    "product_code": "",
                    "product_name": "",
                    "condition_apply": "price",
                    "condition": ">=",
                    "number_cart": 0,
                    "number_product": 0,
                    "all_condition_apply": "ANY"
                }],
                "discount": [
                    {
                        "type_apply": "cart",
                        "product_code": "",
                        "product_name": "",
                        "discount_type": "price",
                        "discount_price_limit": 10000,
                        "number_cart": 0,
                        "number_product": 0
                    }
                ]
            }
        }
        $scope.getCoupons()
        
    }
    $scope.all_condition_apply_change = function(value){
        $scope.coupon.condition_data[0].all_condition_apply = value;
    }
    $scope.getProductsCoupon = function(id, product_index, param){
        $scope.id_input_product_promotion_item = "product-condition-item" + id
        $scope.product_index = product_index
        if (param == undefined){
            param = ""
        }
        $http({
            method: 'GET',
            url: host + "/api/v1/promotion-products?code="+param+"&name="+param,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function(response) {
            $scope.products_promotion = response.data.data
        },function(error){
            console.log("Lỗi gọi api products promotion by admin", error)
        }); 
    } 
    $scope.getProductsDiscountCoupon = function(product_index, param){
        $scope.discount_index = product_index
        if (param == undefined){
            param = ""
        }
        $scope.coupon_index = product_index;
        $http({
            method: 'GET',
            url: host + "/api/v1/promotion-products?code="+param+"&name="+param,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function(response) {
            $scope.products_coupons = response.data.data
        },function(error){
            console.log("Lỗi gọi api products coupon by admin", error)
        }); 
       
    } 
    $scope.getProductsCouponInPopup = function(id){
        param = document.getElementById(id).value
        if (param == undefined){
            param = ""
        }
        $http({
            method: 'GET',
            url: host + "/api/v1/promotion-products?code="+param+"&name="+param,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function(response) {
            $scope.products_coupons = response.data.data
        },function(error){
            console.log("Lỗi gọi api products promotion popup by admin", error)
        }); 
    }
    

    $scope.showConditionProduct = function(value, index){
           $scope.conditions[index].type = value
    }

    $scope.addProductsDiscountCoupon = function(){
        let product = (document.getElementById("value-discount-coupon-item").value).split(",")
        if (product != undefined){
            let product_code = product[0]
            let product_name = product[1]
            $scope.coupon.discount[$scope.discount_index].product_code = product_code
            $scope.coupon.discount[$scope.discount_index].product_name = product_name
        }        
    }
    $scope.addProductsConditionCoupon = function(){
        let product = (document.getElementById("value-condition-coupon-item").value).split(",")
        if (product != undefined){
            let product_code = product[0]
            let product_name = product[1]
            $scope.coupon.condition_data[$scope.discount_index].product_code = product_code
            $scope.coupon.condition_data[$scope.discount_index].product_name = product_name
        }        
    }

        $scope.saveCoupon = function(){
             let options = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
             }
             $scope.coupon.condition_data[0].all_condition_apply = $scope.all_condition_apply
             console.log($scope.coupon)
             $http.post(host + "/api/v1/coupon", $scope.coupon, options).then(function(response) {
                
                $scope.promotions = response.data.data
                window.location.href = "/admin/#!/promotion-list"

            },function(error){
                console.log("Lỗi gọi api create promotion by admin", error)
            });  
             
         }
         $scope.editCoupon= function(id){
                localStorage.setItem("coupon_id", id)
                Redirect("coupon-create")

         }
         $scope.couponDetail = function (id){
            $http({
                method: 'GET',
                url: host + "/api/v1/promo-detail/" + id,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }).then(function(response) {
                
                $scope.coupon = response.data.data
                $scope.coupon.start_date = new Date($scope.coupon.start_date)
                $scope.coupon.end_date= new Date($scope.coupon.end_date)
                console.log($scope.coupon)
            },function(error){
                console.log("Lỗi gọi api detail coupon by admin", error)
            }); 
         }
         $scope.updateStatusCoupon = function(coupon_id, current_status){
            if (current_status == 0){
                current_status = 1
            }else{
                current_status = 0
            }
            $http.put(apiUrl + "coupon", { "id": coupon_id, "status": current_status}, {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }}).then(function(response){
                alertCustom("Cập nhật trạng thái thành công")
                $scope.getCoupons()
            }, function(e){
                console.log("Error call api put coupon", e)
                showErrorPopup(e.data.message)
            })
         }
         
    
    $scope.init()
})  

appAdmin.controller("OrderController", function($scope, $http, $sce, $routeParams, $location) {
        $scope.init = function(){
            if(!isNaN($routeParams.id)){
                    $http.get(apiUrl + "order-detail/" + $routeParams.id, {
                        headers: {
                        'Authorization': 'Bearer ' + token
                    }}).then(function(response){
                        $scope.order_detail = response.data.data
                    }).catch(function(e){
                        console.log("Error call api order detail",e)
                        showErrorPopup(e.data.message)
                    })
            }
         
            if ($location.$$path == "/order-approved"){
                $scope.orders = $scope.getOrders("status=APPROVED");
            }
            if ($location.$$path == "/order-shipping"){
                $scope.orders = $scope.getOrders("status=SHIPPING");
            }
            if ($location.$$path == "/order-shipped"){
                $scope.orders = $scope.getOrders("status=SHIPPED");
            }
            if ($location.$$path == "/order-completed"){
                $scope.orders = $scope.getOrders("status=COMPLETED");
            }
            if ($location.$$path == "/order-cancel"){
                $scope.orders = $scope.getOrders("status=CANCEL");
            }
        }
        $scope.getOrders = function(params = ""){
            $scope.params = params
            $http({
                method: 'GET',
                url: apiUrl + "orders?" + $scope.params,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(function (response) {
                $scope.orders = response.data.data
                $scope.meta_orders = response.data.meta
            }).catch(function(e){
                console.log("error call api orders",e);
            })
        }
        $scope.searchOrders = function(){
                let params = "";
                if ($scope.order_code_params != undefined){
                    params = params +  "code=" +  $scope.order_code_params + "&"
                }
                if ($scope.username_params != undefined){
                    params = params +  "username=" +  $scope.username_params + "&"
                }
                if ($scope.status_order_params != undefined){
                    params = params +  "status=" +  $scope.status_order_params + "&"
                }
                if ($scope.start_time_params != undefined){
                    params = params +  "start_time=" +  formatDateTime(new Date($scope.start_time_params))+ "&"
                }
                if ($scope.end_time_params != undefined){
                    params = params +  "end_time=" +   formatDateTime(new Date($scope.end_time_params)) + "&"
                }
                $scope.getOrders(params)
        }
        $scope.changeStatusOrder = function(index){
                if (index == 1 && $scope.order_detail.status == "PENDING"){
                    $scope.order_detail.status = "APPROVED"
                }
                if (index == 2 && $scope.order_detail.status == "APPROVED"){
                    $scope.order_detail.status = "SHIPPING"
                }
                if (index == 3 && $scope.order_detail.status == "SHIPPING"){
                    $scope.order_detail.status = "SHIPPED"
                }
                if (index == 4 && $scope.order_detail.status == "SHIPPED"){
                    $scope.order_detail.status = "COMPLETED"
                }
                if (index == 5 && $scope.order_detail.status == "PENDING"){
                    $scope.order_detail.status = "CANCEL"
                }
                let options = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                }}

                $http.put(apiUrl + "order-update", $scope.order_detail,options).then(function(response){
                    // $scope.order_detail = response.data.data

                    alertCustom(response.data.message)
                }).catch(function(e){
                    console.log("Error call api order detail",e)
                    showErrorPopup(e.data.message)
                })
        }
        $scope.changeStatusOrderById = function(index, id){
            let options = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
            }}
            $http.get(apiUrl + "order-status/" + id,options).then(function(response){
                $scope.order_status = response.data.message.status
                let status = ""
                if ($scope.order_status){
                    if (index == 1 && $scope.order_status == "PENDING"){
                        status = "APPROVED"
                     }
                     if (index == 2 && $scope.order_status == "APPROVED"){
                         status = "SHIPPING"
                     }
                     if (index == 3 && $scope.order_status == "SHIPPING"){
                         status = "SHIPPED"
                     }
                     if (index == 4 && $scope.order_status == "SHIPPED"){
                         status = "COMPLETED"
                     }
                     if (index == 5 && $scope.order_status == "PENDING"){
                         status = "CANCEL"
                     }
                     $http.put(apiUrl + "order-update", { "id": id, "status": status},options).then(function(response){
                         // $scope.order_detail = response.data.data

                         alertCustom(response.data.message)
                         Redirect($location.$$path.slice(1,$location.$$path.length))
                     }).catch(function(e){
                         console.log("Error call api order update",e)
                         showErrorPopup(e.data.message)
                     })
                }

            }).catch(function(e){
                console.log("Error call api order detail",e)
                showErrorPopup(e.data.message)
            })
            
            
    }
        $scope.init()
})

appAdmin.controller("WarehouseController", function($scope, $http, $sce, $routeParams, $location) {
    $scope.getWarehouses = function(){
        $scope.warehouses = []
        let params = "?"
        if ($scope.warehouse_search_code != undefined){
            params = params + "code="+ $scope.warehouse_search_code  
        }
        if ($scope.warehouse_search_name != undefined){
            params = params + "name="+ $scope.warehouse_search_name 
        }
        if ($scope.warehouse_search_address != undefined){
            params = params + "address="+ $scope.warehouse_search_address  
        }
        if ($scope.warehouse_search_product_code != undefined){
            params = params + "product_code="+ $scope.warehouse_search_product_code  
        }
        if ($scope.warehouse_search_product_name != undefined){
            params = params + "product_name="+ $scope.warehouse_search_product_name  
        }
            $http({
                method: 'GET',
                url: apiUrl  + "warehouses" + params,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(function (response) {
                $scope.warehouses = response.data.data
            }
            ).catch(function(error){
                console.log("Error call api warehouse", error)
                showErrorPopup(error.message)
            })
    }
    $scope.getWarehouseDetail = function(id){
        id = localStorage.getItem("warehouse_redirect_id")
        let params = ""
        if ($scope.warehouse_dt_warehouse != undefined){
            params = params + "warehouse=" + $scope.warehouse_dt_warehouse  + "&"
        }
        if ($scope.warehouse_dt_product != undefined){
            params = params + "product=" + $scope.warehouse_dt_product + "&"
        }
        $http({
            method: 'GET',
            url: apiUrl  + "warehouse-detail-by-warehouse-id/" + id + "?" + params,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function (response) {
            $scope.warehouse_details = response.data.data
            if($scope.warehouse_details.length == 0){
                $scope.warehouse_details[0]= {"product": {"name": "Hiện tại kho chưa có sản phẩm muốn thêm sản phẩm vui lòng click vào CHI TIẾT XUẤT/NHẬP màu VÀNG bên phải"}}
            }
        }
        ).catch(function(error){
            console.log("Error call api warehouse detail", error)
            showErrorPopup(error.data.message)
        })
    }
    $scope.getWarehouseProductDetail = function(id){
        let params = ""
        if ($scope.warehouse_product_warehouse_param != undefined){
            params = params + "warehouse=" + $scope.warehouse_product_warehouse_param + "&"
        }
        if ($scope.warehouse_product_product_param != undefined){
            params = params + "product=" + $scope.warehouse_product_product_param + "&"
        }
        if ($scope.warehouse_product_status_param != undefined){
            params = params + "status=" + $scope.warehouse_product_status_param + "&"
        }
        if ($scope.warehouse_product_warehouse_param != undefined){
            params = params + "createdby=" + $scope.warehouse_product_person_param + "&"
        }
        id = localStorage.getItem("warehouse_id")
        $http({
            method: 'GET',
            url: apiUrl  + "warehouse-product-detail-by-warehouse-id/" + id + "?" + params,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function (response) {
            $scope.warehouse_product_details = response.data.data
        }
        ).catch(function(error){
            console.log("Error call api warehouse product detail", error)
            showErrorPopup(error.data.message)
        })
    }
    $scope.saveWarehouseProductDetail = function(){
        let qty = document.getElementById("warehouse_product_qty_input").value
        let warehouse_id = localStorage.getItem('warehouse_id')

        if (warehouse_id == "undefined"){
            warehouse_id = null
        }
        let body= {
            "id": $scope.warehouse_product_warehouse_detail_id_input,
            "warehouse_id": warehouse_id,
            "product_code": $scope.warehouse_product_product_input,
            "status": $scope.warehouse_product_status_input,
            "qty": qty
        }
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
         }
                $http.post(apiUrl  + "warehouse-product-detail", body, options).then(function (response) {
                // $scope.warehouse_product_details = response.data.data
                alertCustom("Đã tạo thành công")
                $scope.getWarehouseProductDetail()
            }
            ).catch(function(error){
                console.log("Error call api save warehouse product detail", error)
                showErrorPopup(error.data.message)
            })
    }

    $scope.getAllProduct = function(){
        let params = ""
        if ($scope.found_product != undefined){
            params = params + "code=" + $scope.found_product + "&name=" + $scope.found_product + "&"
        }
        $http({
            method: 'GET',
            url: apiUrl  + "products"  + "?" + params,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function (response) {
            $scope.products = response.data.data
        }
        ).catch(function(error){
            console.log("Error call api  products warehouse", error)
            showErrorPopup(error.data.message)
        })
    }
    $scope.init = function(){
                $scope.getWarehouses()
                let warehouse_redirect_id = localStorage.getItem("warehouse_redirect_id");
                if (warehouse_redirect_id != undefined){
                    $scope.getAllProduct()
                    $scope.getWarehouseDetail(warehouse_redirect_id);
                }
                let warehouse_detail_product_redirect_id = localStorage.getItem("warehouse_detail_product_redirect_id")
                if (warehouse_detail_product_redirect_id != undefined){
                    $scope.getAllProduct()
                    $scope.getWarehouseProductDetail(warehouse_detail_product_redirect_id);
                }    
        }
        $scope.init()
        
        $scope.getLocation = function(){
            if ($scope.location.address.length - ($scope.location.address.replace(",","")).length > 0){
                let array_address = $scope.location.address.split(",")
                let city = array_address[array_address.length - 1]
                let district = array_address[array_address.length - 2]
                $http.get(apiUrlV0 + "get-location?city=" + city + "&district=" + district).then(function(response){
                    
                    alertCustom("Đã lấy vị trí " + $scope.location.address + " thành công!")
                    $scope.location = response.data.data
                }).catch(function(e){
                    showErrorPopup("Lỗi lấy vị trí")
                })
            }else{
                showErrorPopup("Vui lòng nhập đủ quận, thành phố")
            }
            
        }
        $scope.addProductForProductDetail = function(value){
            $scope.warehouse_product_product_input = value
        }
        $scope.addWarehouseForProductDetail = function(value){
            $scope.warehouse_product_warehouse_input = value
        }

        $scope.redirectWarehouseDetail = function(id){
            if (id != undefined){
                localStorage.setItem('warehouse_id', id)
            }
            
            window.location.href = "#!/warehouse-detail"
            
        }
        $scope.saveWarehouse = function(){
            let body= {
                "id": $scope.warehouse_create_id,
                "code": $scope.warehouse_create_code,
                "name": $scope.warehouse_create_name,
                "address": $scope.warehouse_create_address,
                "lat": $scope.warehouse_create_lat,
                "lon": $scope.warehouse_create_lon
            }
            let options = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
             }
                    $http.post(apiUrl  + "warehouse", body, options).then(function (response) {
                    // $scope.warehouse_product_details = response.data.data
                    alertCustom("Đã lưu thành công")
                    Redirect("warehouse-lists")
                    Redirect("warehouse-list")
                }
                ).catch(function(error){
                    console.log("Error call api save warehouse", error)
                    showErrorPopup(error.data.message)
                })
        }
        $scope.editWarehouse = function(index){
            console.log($scope.warehouses[index].id)
            $scope.warehouse_create_id =  $scope.warehouses[index].id
            $scope.warehouse_create_code =  $scope.warehouses[index].code
            $scope.warehouse_create_name =  $scope.warehouses[index].name
            $scope.warehouse_create_address =  $scope.warehouses[index].address
            $scope.warehouse_create_lat  =  $scope.warehouses[index].lat
            $scope.warehouse_create_lon =  $scope.warehouses[index].lon
        }
        $scope.redirectWarehouseProductDetail = function(id){
            if (id != undefined){
                localStorage.setItem('warehouseDetail_id', id)
            }
            window.location.href = "#!/warehouse-product-detail"
        }
        $scope.redirectWarehouses = function(){
            window.location.href = "#!/warehouse-list"
        }

})




    
function learLocal(){
    localStorage.removeItem('access_token_admin')
    localStorage.removeItem('expires_in_admin')
    localStorage.removeItem('token_type_admin')
    localStorage.removeItem('time_token_login_admin')
}
function newPromotion(){
    localStorage.removeItem("promotion")
}
function newCoupon(){
    localStorage.removeItem("coupon_id")
}
function indexPage(){
    window.location.href = "/admin/"
}
function logout(){
    learLocal()
    document.getElementById('img-profile').setAttribute("hidden", "hidden")
    document.getElementById('submit-login').removeAttribute('hidden')
}
function Redirect(uri) {
    window.location.href = "#!/" + uri;
 }
 function formatDateTime(date){
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
 }
 function formatDate(dateString) {
    let [day, month, year, time] = dateString.split(/[-\s]/);
    return `${day}-${month}-${year} ${time}`;
}