const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class ProductsList {
    constructor(container = '.products'){
        this.container = container;
        this.goods = [];//массив товаров из JSON документа
        this._getProducts()
            .then(data => { //data - объект js
                 this.goods = data;
                 this.render()
            });
    }

    _getProducts(){
        return fetch(`${API}/catalogData.json`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            });
    }
    calcSum(){
        return this.allProducts.reduce((accum, item) => accum += item.price, 0);
    }
    render(){
        const block = document.querySelector(this.container);
        for (let product of this.goods){
            const productObj = new ProductItem(product);
//            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }

    }
}

class ProductItem {
    constructor(product, img = 'https://via.placeholder.com/200x150'){
        this.title = product.product_name;
        this.price = product.price;
        this.id = product.id_product;
        this.img = img;
    }
    render(){
        return `<div class="product-item" data-id="${this.id}">
                <img src="${this.img}" alt="Some img">
                <div class="desc">
                    <h3>${this.title}</h3>
                    <p>${this.price} $</p>
                    <button class="buy-btn">Купить</button>
                </div>
            </div>`
    }
}

let list = new ProductsList();
// console.log(list.allProducts);

class Basket {
    constructor(container = '.cart-block') {
        this.container = container;
        this.goods = [];

        this._clickBasket();
        this._getBasketItem()
            .then(data => {
                this.goods = data.contents;
                this.render();
            });
    }

    _getBasketItem() {
        return fetch(`${API}/getBasket.json`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const productObj = new BasketItem();

            block.insertAdjacentHTML('beforeend', productObj.render(product));
        }
    }

    _clickBasket() {
        document.querySelector(".btn-cart").addEventListener('click', () => {
            document.querySelector(this.container).classList.toggle('invisible');
        })
    }
}

class BasketItem {
    render(product, img = 'https://via.placeholder.com/50x100') {
        return `<div class="cart-item" data-id="${product.id_product}">
                <div class="product-bio">
                <img src="${img}" alt="some image">
                <div class="product-desc">
                <p class="product-title">${product.product_name}</p>
                <p class="product-quantity">Quantity: ${product.quantity}</p>
                <p class="product-single-price">${product.price} each</p>
                </div>
                </div>
                <div class="right-block">
                <p class="product-price">${product.quantity * product.price}</p>
            <button class="del-btn" data-id="${product.id_product}">x</button>
        </div>
    </div>`
    }
}

let obj = new Basket();


















//===================Пробный вариант решения из урока=========================

// class List {
//     constructor(url, container, list = list2) {
//         this.container = container;
//         this.list = list;
//         this.url = url;
//         this.goods = [];
//         this.allProducts = [];
//         this._init();
//     }

//     getJson(url) {
//         return fetch(url ?url : `${API + this.url}`)
//             .then(result => result.json())
//             .catch (error => {
//                 console.log(error);
//             })
//     }
//     handleData(data) {
//         this.goods = data;
//         this.render();
//     }

//     calcSum(){
//         return this.allProducts.reduce((accum, item) => accum += item.price, 0);
//     }

//     render(){ //вывод всех товаров
//         console.log(this.constructor.name);//имя класса из которого вызывается метод
//         const block = document.querySelector(this.container);
//         for (let product of this.goods){
//             const productObj = new this.list[this.constructor.name](product);
//             console.log(productObj);
//             this.allProducts.push(productObj);
//             block.insertAdjacentHTML('beforeend', productObj.render());
//         }

//     }
// }

// class Item{
//     constructor(el, img = 'https://via.placeholder.com/200x150'){
//         this.product_name = el.product_name;
//         this.price = el.price;
//         this.id =el.id_product;
//         this.img = img;
//     }
//         render(){//генерация товаров для каталога товаров
//         return `<div class="product-item" data-id="${this.id_product}">
//                 <img src="${this.img}" alt="Some img">
//                 <div class="desc">
//                     <h3>${this.product_name}</h3>
//                     <p>${this.price} $</p>
//                     <button class="buy-btn"
//                     data-id="${this.id_product}"
//                     data-name="${this.product_name}"
//                     data-price="${this.price}">Купить</button>
//                 </div>
//             </div>`
//     }
// }

// class ProductsList extends List{
//     constructor(cart, container = '.products', url = "/catalogData.json"){
//         super(url, container);
//         this.cart = cart;
//         this.getJson()
//             .then(data => this.handleData(data));
//     }

//     _init(){
//         document.querySelector(this.container).addEventListener('click', e => {
//             if(e.target.classList.contains('buy-btn')){
//                 this.cart.addProduct(e.target);
//             }
//         });
//     }
// }

// class ProductItem extends Item {}

// class Cart extends List {
//     constructor(container = ".cart-block", url = "/getBasket.json"){
//         super(url, container);
//         this.getJson()
//             then(data => {
//                 this.handleData(data.contents);//вывод всех товаров в корзину
//             });
//     }

//     addProduct(element){
//         this.getJson(`${API}/addToBasket.json`)
//             .then(data => {
//                 if(data.result === 1){
//                     let productId = +element.dataset['id'];
//                     let find = this.addProduct.find(product => product.id_product === productId);
//                     if(find){
//                         find.quantity++;
//                         this._updateCart(find);
//                     } else {
//                         let product = {
//                             id_product: productId,
//                             price: +element.dataset['price'],
//                             product_name: element.dataset['name'],
//                             quantity: 1,
//                         };
//                         this.goods = [product];
//                         this.render();
//                     }
//                 } else {
//                     alert('Доступ запрещен');
//                 }
//             })
//     }

//     removeProduct(element){
//         this.getJson(`${API}/deleteFromBasket.json`)
//             .then(data => {
//                 if(data.result === 1){
//                     let productId = +element.data['id'];
//                     let find = this.allProducts.find(product => id_product === productId);
//                     if(find.quantity > 1){
//                         find.quantity--;
//                         this._updateCart(find);
//                     } else {
//                         this.allProducts.splice(this.allProducts.indexOf(find), 1);
//                         document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
//                     }
//                 } else {
//                     alert('error');
//                 }
//             });
//     }

//     _updateCart(product){
//         let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);
//         block.querySelector('.product-quantity').textContent = `Quantity: ${product.quantity}`;
//         block.querySelector('.product-price').textContent = `${product.quantity*product.price}$`;
//     }

//     _init(){
//         document.querySelector('.btn-cart').addEventListener('click', () => {
//             document.querySelector(this.container).classList.toggle('invisible');
//         });
//         document.querySelector(this.container).addEventListener('click', () => {
//             if(e.target.classList.contains('del-btn')){
//                 this.removeProduct(e.target);
//             }
//         })
//     }
// }

// class CartItem extends Item{
//     constructor(el, img = 'https://via.placeholder.com/50x100'){
//         super(el, img);
//         this.quantity = el.quantity;
//     }

//     render(){
//         return `<div class="cart-item" data-id="${this.id_product}">
//                 <div class="product-bio">
//                 <img src="${this.img}" alt="some image">
//                 <div class="product-desc">
//                 <p class="product-title">${this.product_name}</p>
//                 <p class="product-quantity">Quantity: ${this.quantity}</p>
//                 <p class="product-single-price">${this.price} each</p>
//                 </div>
//                 </div>
//                 <div class="right-block">
//                 <p class="product-price">${this.quantity * this.price}</p>
//             <button class="del-btn" data-id="${this.id_product}">x</button>
//             </div>
//         </div>`
//     }
// }

// const list2 = {
//     ProductsList: ProductItem,
//     Cart: CartItem
// };



