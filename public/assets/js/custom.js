const shoppingCart= (function () {
    cart = [];

    function Item(name, price, count) {
        this.name = name;
        this.price = price;
        this.count= count;
    }

    function saveCart(){
        localStorage.setItem('shoppingCart', JSON.stringify(cart))
    }

    function loadCart () {
     cart = 
     JSON.parse(localStorage.getItem('shoppingCart'))
    }
    if (!localStorage.getItem("shoppingCart")) {
        loadCart()
    }

    // add item to cart
    const obj = {};
    obj.addItemToCart = function (name, price, count) {
        for (const item in cart) {
            if(cart[item].name === name) {
                cart[item].count ++;
                saveCart();
                return;
            }
        }
        const item = new item(name, price, count);
        cart.push(item);
        saveCart();
    }

    //set count from item
    obj.setCountForItem = function (name, count) {
        for (const i in cart){
            if (cart[i].name === name) {
                cart[i].count = count;
                break;
            }
        }
    };
//remove item from cart 
    obj.removeItemFromCart = function (name) {
        for (const item in cart) {
            if(cart[item].name === name) {
                cart[item].count--;
                if (cart[item].count === 0){
                    cart.splice(item, 1);
                }
                break;
            }
        }
        saveCart()
    }

    //Remove all item from cart
    obj.removeItemFromCart = function (name) {
        for (const item in cart) {
            if (cart[item].name === name){
                cart.splice(item, 1)
                break
            }
        }
        saveCart()
    }

    // clear cart
    obj.clearCart =function () {
        cart = [];
        saveCart();
    }

    //count cart

    obj.totalCount = function () {
        const totalCount = 0;
        for (const item in cart) {
            totalCount += cart[item].count;
        }
        return totalCount;
    }

    // Total count

    obj.totalCart = function () {
        const totalCart = 0;
    for (const item in cart){
        totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
    }


    // List cart
    obj.listCart = function () {
        const cartCopy = [];
        for (i in cart) {
          item = cart[i];
          itemCopy = {};
          for (p in item) {
            itemCopy[p] = item[p];
          }
          itemCopy.total = Number(item.price * item.count).toFixed(2);
          cartCopy.push(itemCopy)
        }
        return cartCopy;
      }
      return obj;


})


$('.default-btn').click(function (event) {
    // alert('working');
    event.preventDefault();
    var name = $(this).data('name');
    var price = Number($(this).data('price'));
    shoppingCart.addItemToCart(name, price, 1);
    displayCart();
  });
