
let url_api_v0 = "http://192.168.1.7:8888/api/v0"
let url_api_v1 = "http://192.168.1.7:8888/api/v0/"
let url_api_login = "http://192.168.1.7:8888//api/auth/login"
const apiUrl = "http://192.168.1.7:8888"
const apiUrlCR = "http://192.168.1.7:5500"
let session_id_client = ""
let token = ""
let limit_products = 12

var app = angular.module("myApp", ["ngRoute"])


app.controller("HomeController", function($scope, $http, $sce, $routeParams) {
    $scope.fillter_params = [];
    getSesssion()
    if (localStorage.getItem('avart_url') == undefined || localStorage.getItem('avart_url') == ""){
        document.getElementById('img-profile').setAttribute("hidden","hidden")
    } 
    $scope.carts = new Object();
    $http.get(url_api_v0 + "/fillter/products").then(function(response){
        $scope.fillters = response.data.data
        $scope.fillter_data = response.data.data.fillters
        // console.log(response.data.data.fillters[0])
    }, function(error){
        console.log("Lỗi gọi api fillter products", error)
        alertCustom(error.message)
    } )  
    if ($routeParams.id){
        $http.get(url_api_v0 + "/product-detail/" + $routeParams.id).then(function(response){
            $scope.product = response.data.data
        }, function(error){
            console.log("Lỗi gọi api product detail ", error)
            alertCustom(error.message)
        } )  
    }
    
    $scope.getProductDetail = function(id){
        $http.get(url_api_v0 + "/product-detail/" + id).then(function(response){
            $scope.product = response.data.data
            
        }, function(error){
            console.log("Lỗi gọi api product detail ", error)
            alertCustom(error.message)
        } )  
    }
    $http.get(url_api_v0 + "/products?limit=" + limit_products).then(function(response){
        $scope.products = response.data.data
        $scope.meta_products = response.data.meta.pagination
        $scope.fillter_data = $sce.trustAsHtml(response.data.data.fillters)
        // console.log(response.data.data.fillters[0])
        if ($scope.products.length == 0){
            alertCustom("Không tìm thấy sản phẩm")
        }
    }, function(error){
        console.log("Lỗi gọi api products", error)
        alertCustom(error.message)
    } )  
    $scope.getCart = function(){
        token = localStorage.getItem('access_token')
        $http({
            method: 'GET',
            url: url_api_v0 + "/cart?session_id=" + session_id_client,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function(response) {
            if (response.data.data == undefined){
                
                window.location.href = "#!/"
                console.log(window.location.pathname);
                
                showErrorPopup("Không tìm thấy giỏ hàng")

            }
            $scope.cart = response.data.data
            // $scope.getPromos()
            // alertCustom("Lay ma giam gia")
            // $scope.$apply(); 
            // document.getElementById('div-qty-product-cart').setAttribute("hidden", "hidden")
        },function(error){
            console.log("Lỗi gọi api cart", error)
            alertCustom(error.message)
        }); 
    }
    $scope.getPromotionShowHome = function(){
            // $scope.promotions_show 
            $http({
                method: 'GET',
                url: url_api_v0 + "/promotion_show",
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(function(response) {
                $scope.promotions_show  = response.data.data
            },function(error){
                console.log("Lỗi gọi api product promotion", error)
                alertCustom(error.message)
            }); 
    }
    $scope.getPromotionShowHome()
    $scope.getCart()
    $scope.addProduct = function(product_id){
        $http.get(url_api_v0 + "/product-detail/" + product_id).then(function(response){
            let product = response.data.data
            let body = {
                "product_id": product_id,
                "product_code": product.code,
                "product_name": product.name,
                "price": product.price,
                "qty": 1,
                "session_id": session_id_client
            }
            callApiFetch(url_api_v0 + "/addToCart","POST",body,"addToCart");
            alertCustom("Thêm vào giỏ hàng thành công")
            $scope.getCart()
        }, function(error){
            console.log("Lỗi gọi api products detail", error)
            alertCustom(error.message)
        } )  
        
    }
    $scope.fillterClick = function(){
        let checkbox_inputs = document.querySelectorAll('.fillter_input')
        let body_dt = {}
        let keys = []
        let param = ""
        let rs = ""
        checkbox_inputs.forEach(checkbox => {
            
            let mang = checkbox.value.split("_")
            if (checkbox.checked){
                let key = mang[0]
                let val = mang[1]
                // alert(val)
                key = key.toLowerCase().replace(" ",""); 
                let len = keys.length + 1
                for (let i = 0; i < len; i++){
                    console.log(keys[i],key)
                    if (keys[i] != key){
                        keys[i] = key
                        i = len
                    }
                }
                param = val + "," + param
            }  
        });
        param = param.slice(0,-1)
        keys =  [...new Set(keys)] //xóa các phần tử trùng lập
        for (let i = 0; i < keys.length; i++){
                rs = keys[i] + "=[" + param + "]&" + rs 
        }
        rs = rs.slice(0,-1)
        // param = "?" + param.slice(0,-1)
        // let options = {
        //     method: 'GET', // or 'POST', 'PUT', 'DELETE', etc.
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'Authorization': `Bearer ${token}`
        //     },  
        //     body: `${body_dt}`
        // }
        $http.get(url_api_v0 + "/products?" + rs).then(function(response){
            $scope.products = response.data.data
            $scope.fillter_data = $sce.trustAsHtml(response.data.data.fillters)
            // console.log(response.data.data.fillters[0])
        }, function(error){
            console.log("Lỗi gọi api products params", error)
            alertCustom(error.message)
        } )

        
    }

    //giỏ hàng
    // $scope.carts 

    function getCart(){
        let session_id = localStorage.getItem('session_id')
        session_id_client = session_id;
        // alert(session_id)
        $http.get(url_api_v0 + "/cart?session_id=" + session_id).then(function(response){
            $scope.carts = response.data
            // console.log($scope.carts)
            // console.log(response.data.data.fillters[0])
            
            if ($scope.carts.data.details != undefined){
                document.getElementById('qty-product-cart').innerText = $scope.carts.data.details.length
                document.getElementById('qty-product-cart').removeAttribute("hiiden")
            }else{
                document.getElementById('qty-product-cart').setAttribute("hiiden", "hidden")
            }

        }, function(error){
            console.log("Lỗi gọi api cart", error)
            alertCustom(error.message)
        } )
    }
    $scope.fillterClick = function(key, index){
        let id = key + index
        let value = document.getElementById(id).value
        let index_key = $scope.fillter_params.findIndex(item => item.property == key)
        if (index_key == -1){
            $scope.fillter_params[$scope.fillter_params.length] = {
                "property": key,
                "value": [value]
            }
        }
        if (index_key >= 0){
            let index_value = $scope.fillter_params[index_key].value.findIndex(item => item == value)
            if (index_value >= 0){
                $scope.fillter_params[index_key].value.splice(index_value,1)
                if ($scope.fillter_params[index_key].value.length == 0){
                    $scope.fillter_params.splice(index_key,1)
                }
            }else{
                $scope.fillter_params[index_key].value.push(value)
            }
            
        }
    }
    $scope.fillter_search = function(){
        let rs = ""
       for(let i = 0; i < $scope.fillter_params.length; i++){
            let key = ($scope.fillter_params[i].property).toLowerCase()
            rs = rs + key + "=["
            for (let j = 0; j < $scope.fillter_params[i].value.length; j++){
                
                let valu = $scope.fillter_params[i].value[j]
                rs = rs + valu + ","
                // if (j = $scope.fillter_params[i].value.length - 1){
                //     rs = rs.slice(0,-1)
                // }
            }
            rs = rs + "]&"
       }
       let params = (rs.slice(0,-1)).replaceAll(",]","]")

       let minPrice = document.getElementById("minPrice").value
       let maxPrice = document.getElementById("maxPrice").value
       if(minPrice != "" && !isNaN(minPrice)){
            params = params + "&min_price=" + minPrice
       }
       if(maxPrice != "" && !isNaN(maxPrice)){
        params = params + "&max_price=" + maxPrice
        }
       
       
       $http.get(url_api_v0 + "/products?" + params).then(function(response){
        $scope.products = response.data.data
        $scope.fillter_data = $sce.trustAsHtml(response.data.data.fillters)
        // console.log(response.data.data.fillters[0])
    }, function(error){
        console.log("Lỗi gọi api products params", error)
        alertCustom(error.message)
    } )
    }
    $scope.searchProduct = function(){
        value = document.getElementById("search-input").value
        $http.get(url_api_v0 + "/products?code=" + value + "&name=" + value).then(function(response){
            $scope.products = response.data.data
            $scope.fillter_data = $sce.trustAsHtml(response.data.data.fillters)
            // console.log(response.data.data.fillters[0])
            if($scope.products.length == 0){
                alertCustom("Không tìm thấy sản phẩm")
            }
        }, function(error){
            console.log("Lỗi gọi api products search", error)
            alertCustom(error.message)
        } )
    }
    $scope.productDetail = function(id){
            window.location.href = "/#!/product-detail/" +id
            
    }
    $scope.getProductDetail = function(id){
        $http.get(url_api_v0 + "/product-detail/" + id).then(function(response){
            $scope.product = response.data.data
        }, function(error){
            console.log("Lỗi gọi api product detail ", error)
            alertCustom(error.message)
        } )  
}
    
    $scope.showMoreProduct = function(url){
        $http.get(url + "&limit=" + limit_products).then(function(response){
            $scope.products_more =  response.data.data
            $scope.products = $scope.products.concat($scope.products_more)
            $scope.meta_products_more = response.data.meta.pagination
            $scope.meta_products.count += $scope.meta_products_more.count
            $scope.meta_products.links.next = $scope.meta_products_more.links.next
            $scope.fillter_data = $sce.trustAsHtml(response.data.data.fillters)
            // console.log(response.data.data.fillters[0])
        }, function(error){
            console.log("Lỗi gọi api products", error)
            alertCustom(error.message)
        } )  
    }
    $scope.getTrustedHtml = function(html) {
        return $sce.trustAsHtml(html);
    };
    $scope.showImageSlideShow =  function(image_url){
        let path_image = "/img/"
       document.getElementById("main_image").setAttribute("src", path_image + image_url)
    }

    $scope.showImageSlideShowModel =  function(image_url){
        let path_image = "/img/"
       document.getElementById("main_image1").setAttribute("src", path_image + image_url)
    }
});
    

app.controller("AboutController", function($scope) {
    $scope.message = "This is About Page!";
});

app.controller("ContactController", function($scope) {
    $scope.message = "Contact us at: contact@example.com";
});
app.controller("LoginController", function($scope, $http) {
      // GET request example
       $scope.login = function(){
        let data = {
            "email": $scope.email,
            "password": $scope.password
        }
        // console.log("DATA: ",data)
        $http.post(apiUrl + "/api/auth/login", data)
            .then(function(response) {
            console.log('GET data:', response.data);
            localStorage.setItem('access_token', response.data.access_token)
            localStorage.setItem('expires_in', response.data.expires_in)
            localStorage.setItem('token_type', response.data.token_type)
            localStorage.setItem('time_token_login', new Date())
                session_id_client = "session_id_" + Math.random().toString(36).substr(2, 16);
                data = {
                    "session_id": session_id_client,
                    "device": getBrowserInfo().userAgent
                }
                let header = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + response.data.access_token
                }
            $http.post(url_api_v0 + "/sessions", data, header).then(function(response){
                localStorage.setItem('session_id', session_id_client)
                window.location.href = "/"
            }).catch(function(e){
                console.log("Error call api session post",e)
                alertCustom(e.message)
            });
                        
            })
            .catch(function(error) {
            console.log('GET error:', error);
            showErrorPopup("Tài khoản hoặc mật khẩu không chính xác!")
            });        
            
        }
});
app.controller("CartController", function($scope,$http, $location) {
        getSesssion()
        session_id_client =  localStorage.getItem('session_id')
        $scope.getPromos = function(){
            $scope.promocodes;
            $http.get(url_api_v0 + "/promocodes?session_id=" + session_id_client).then(function(response){
                $scope.promocodes = response.data.data
                   
            }, function(error){
                console.log("Lỗi gọi api cart", error)
            } )
        }
        $scope.getCart = function(){
            token = localStorage.getItem('access_token')
            $http({
                method: 'GET',
                url: url_api_v0 + "/cart?session_id=" + session_id_client,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(function(response) {
                if (response.data.data.id == undefined){
                    window.location.href = "#!/"
                    showErrorPopup("Không tìm thấy giỏ hàng")
                }
                $scope.cart = response.data.data
                // $scope.$apply(); 
               
                document.getElementById('div-qty-product-cart').setAttribute("hidden", "hidden")
            },function(error){
                console.log("Lỗi gọi api cart", error)
                showErrorPopup(error.data.message)
            }); 
            if($location.$$path == "/cart"){
                $scope.getPromos()
            }
        }
        $scope.getCart()

        $scope.addToCart = function(product, qty){
            let body = {
                "product_id": product.id,
                "product_code": product.code,
                "product_name": product.name,
                "price": product.price,
                "qty": qty,
                "session_id": session_id_client
            }
            $http.post(url_api_v0 + "/addToCart",body,{
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token // Gửi token dạng Bearer
                }
        }).then(function(response){    
            $scope.getCart()
            // $scope.cart = response.data.data
        }, function(error){
            console.log("Lỗi gọi api addToCart", error)
        } )
        }

        $scope.updateCartInfo = function(){
                var body = {
                        'username': $scope.cart_username,
                        'phone_number': $scope.cart_phone_number,
                        'address': $scope.cart_address,
                        "session_id": session_id_client
                }
                $http.put(url_api_v0 + "/updateCartInfo", body, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token // Gửi token dạng Bearer
                    }
                }).then(function(response){
                    //    $scope.cart = response.data.data
                    $scope.getCart()
                }).catch(function(e){ console.log("error api updateCartInfo", e)})
                
        }
       
        $scope.showInfoUser = function(){
               user_name = document.getElementById('cart_username').innerText
               phone_number = document.getElementById('cart_phone_number').innerText
               address = document.getElementById('cart_address').innerText
              $scope.cart_username =  user_name.substring(user_name.indexOf(":")+1,user_name.length)
              $scope.cart_phone_number =  phone_number.substring(phone_number.indexOf(":")+1,phone_number.length)
              $scope.cart_address =  address.substring(address.indexOf(":")+1,address.length)
        }
        $scope.applyCoupon = function(){
            let coupon_code_product = ""
            let coupon_code_shipping = ""
            if ($scope.coupon_product_item != undefined){
                coupon_code_product = $scope.coupon_product_item
            }
            if ($scope.coupon_shipping_item != undefined){
                coupon_code_shipping = $scope.coupon_shipping_item
            }
            let data = {
                    "id": $scope.cart.id,
                    "promo_codes": [coupon_code_product,coupon_code_shipping]
            }
            $http.post(url_api_v0 + "/add-promo-codes", data,{
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token // Gửi token dạng Bearer
                }
            })
            .then(function(response) {
                   $scope.getCart()
            }).catch(function(e){
                console.log("Error call api session post",e)
            });
            
        }
        $scope.selectCouponProduct = function(valu){
                $scope.coupon_product_item = valu
                $scope.applyCoupon()
        }
        $scope.selectCouponShipping = function(valu){
            $scope.coupon_shipping_item = valu
            $scope.applyCoupon()
        }
        $scope.confirmOrder = function(cart_id){
            let data = {
                "id": cart_id,
                'username': $scope.cart.username,
                'phone': $scope.cart.phone_number,
                'address': $scope.cart.address,
                'note': $scope.cart.note
        }
        $http.post(url_api_v0 + "/confirm-order", data,{
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token // Gửi token dạng Bearer
            }
        })
        .then(function(response) {
               $scope.order = response.data.data
               localStorage.setItem('order_complete_code', $scope.order.code)
               $scope.message_order_complete = "Bạn có thể theo dõi trạng thái đơn hàng thông qua trang: " + apiUrlCR + "/shipping-order"
               window.location.href = apiUrlCR + "/#!/order-complete"
        }).catch(function(e){
            console.log("Error call api confirm order",e)
            showErrorPopup(e.data.message)
        });
        }
        $scope.updateInfoUserMobile = function(){
            var body = {
                'username': $scope.cart.username,
                'phone_number': $scope.cart.phone_number,
                'address': $scope.cart.address,
                "session_id": session_id_client
        }
        $http.put(url_api_v0 + "/updateCartInfo", body, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token // Gửi token dạng Bearer
            }
        }).then(function(response){
            //    $scope.cart = response.data.data
            $scope.getCart()
            alertCustom("Cập nhật thành công")
        }).catch(function(e){ console.log("error api updateCartInfo", e) 
            showErrorPopup(e.data.message)
        })
        }
});
init()
function init(){
    getSesssion()
    let access_token =  localStorage.getItem('access_token')
    let token = localStorage.getItem('access_token');
    let time_token = localStorage.getItem('time_token_login')
    // console.log(time_token)
    if (time_token != null){
        if ((new Date() - new Date(time_token)) / 1000 > 604800){
            learLocal()
            showErrorPopup("Tài khoản đăng nhập của bạn đã hết hạn!")
            document.getElementById('submit-login').removeAttribute("hidden")
            document.getElementById('img-profile').setAttribute("hidden","hidden")
            document.getElementById('btn-login').removeAttribute("hidden","hidden");
            document.getElementById('btn-logup').removeAttribute("hidden","hidden");
            window.location.href = "/"
        }
    }
    if (access_token != null && access_token != undefined){
        let options = {
            method: 'GET', // or 'POST', 'PUT', 'DELETE', etc.
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },     
        }
       fetch(apiUrl + "/api/auth/profile", options)
        .then(response => response.json()) // Convert response to JSON
        .then(data => {
            document.getElementById('img-profile').setAttribute("src", apiUrlCR + "/img/" + data.avatar) 
            document.getElementById('img-profile').removeAttribute("hidden");
            localStorage.setItem('avart_url', apiUrlCR + "/img/" + data.avatar);  
            document.getElementById('btn-login').setAttribute("hidden","hidden");
            document.getElementById('btn-logup').setAttribute("hidden","hidden");
        })  // Handle the data
        .catch(error => console.error('Error:', error));
        document.getElementById('submit-login').setAttribute("hidden", "hidden")
    }else{

    }
}
function learLocal(){
    localStorage.removeItem('access_token')
    localStorage.removeItem('expires_in')
    localStorage.removeItem('token_type')
    localStorage.removeItem('time_token_login')
}
    
function get_html(){
    // alert("get html function")
    console.log("HTML", document.getElementById('code_html').value)
}
function logout(){
    learLocal()
    document.getElementById('img-profile').setAttribute("hidden", "hidden")
    document.getElementById('submit-login').removeAttribute('hidden')
    document.getElementById('btn-login').removeAttribute("hidden","hidden");
            document.getElementById('btn-logup').removeAttribute("hidden","hidden");
}
document.getElementById('logout').addEventListener('click', logout)
document.getElementById('button-cart').addEventListener('click', function(){window.location.href = "#!/cart"})


function getSesssion(){
    let session_id = "session_id_" + Math.random().toString(36).substr(2, 16);

    let options = {
        method: 'GET'
    }
   fetch(url_api_v0 + "/sessions?device=" + getBrowserInfo().userAgent, options)
    .then(response => response.json()) // Convert response to JSON
    .then(data => {
        if (data.data.status_code == 200){
                localStorage.setItem('session_id', data.data.session_id.session)
        }else{
            
            localStorage.setItem('session_id', session_id)
            // let options_post = {
            //     method: 'POST', // or 'POST', 'PUT', 'DELETE', etc.
            //     headers: {
            //       'Content-Type': 'application/json'
            //     },   
            //     body: {
            //         "session_id": session_id,
            //         "device": getBrowserInfo().userAgent
            //     }  
            // }
            // fetch(url_api_v0 + "/sessions", options_post)
            // .then(response => response.json()) // Convert response to JSON
            // .then().catch(e => console.log("Error Api post session", e))
            callApiFetch(url_api_v0 + "/sessions","POST",{
                    "session_id": session_id,
                    "device": getBrowserInfo().userAgent
                },"Post session")
        }
    })  // Handle the data
    .catch(error => console.error('Error:', error));
        session_id_client = localStorage.getItem('session_id')
}
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = "Unknown";

    if (ua.indexOf("Firefox") !== -1) browser = "Firefox";
    else if (ua.indexOf("Chrome") !== -1) browser = "Chrome";
    else if (ua.indexOf("Safari") !== -1) browser = "Safari";
    else if (ua.indexOf("Opera") !== -1 || ua.indexOf("OPR") !== -1) browser = "Opera";
    else if (ua.indexOf("Edg") !== -1) browser = "Edge";
    else if (ua.indexOf("MSIE") !== -1 || ua.indexOf("Trident") !== -1) browser = "Internet Explorer";

    return { browser, userAgent: ua };
}
function callApiXhrFull(url, method, param, body, callback){
    var xhr = new XMLHttpRequest();
    method = method.toUpperCase();
    let rs = new Object();
    if (param != ""){
        url = url + "?" + param
    }
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function (rs) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(null, JSON.parse(xhr.responseText)); // Gọi callback khi thành công
        } else if (xhr.readyState === 4) {
            callback("Error: " + xhr.status, null); // Xử lý lỗi
        }
    };
        xhr.send(body);

}

function callApiFetch(url, method, bodys = {}, name_api = url){
    let rs = []
    let token = localStorage.getItem('access_token');
    let options = {
        method: method, // or 'POST', 'PUT', 'DELETE', etc.
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bodys)
    }
    fetch(url, options)
        .then(response => response.json()) // Convert response to JSON
        .then(data => {
            // console.log(data)
        }).catch(error => {
            console.error('Error api ' + name_api + ":", error) 
            showErrorPopup("Lỗi gọi api " + name_api)});
    }

    app.controller("ProductDetailController", function($scope, $http, $routeParams) {
            $scope.init = function(){
                $http.get(url_api_v0 + "/product-varian/" + $routeParams.id).then(function(response){
                    $scope.product = response.data.data
                }, function(error){
                    console.log("Lỗi gọi api product detail ", error)
                    alertCustom(error.message)
                } )  
            }
            $scope.init();
    })

    app.controller("OrderController", function($scope, $http, $routeParams) {

        $scope.init = function(){
            let order_code = localStorage.getItem('order_complete_code')
                if (order_code != undefined){
                    $scope.order_code = order_code
                    $scope.message_order_complete = "Theo dõi trạng thái đơn hàng tại " + apiUrlCR + "#!/shipping-order"
                    localStorage.removeItem('order_complete_code')
                }
                $scope.message_not_found_order = "Bạn có thể kiểm tra đơn hàng tại trang " + apiUrlCR + "#!/shipping-order"

        }
        $scope.getOrderDetailByCode = function(code, phone){
            // $scope.order = 
            $http.get(url_api_v0 + "/order-detail/" + phone + "/" + code).then(function(response){
                $scope.order = response.data.data
                if($scope.order.length == 0){
                    showErrorPopup("Không tìm thấy đơn hàng. Vui lòng kiểm tra lại thông tin")
                }
            }, function(error){
                console.log("Lỗi gọi api product detail ", error)
                showErrorPopup("Vui lòng kiểm tra lại thông tin")
            } )  
        }            
        $scope.init()
    })
    const formatter = new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });