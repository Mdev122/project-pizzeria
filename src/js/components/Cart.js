/* global select, classNames, settings, templates, utils, CartProduct */
'use strict';

class Cart{ // eslint-disable-line no-unused-vars
  constructor(element){
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
  }

  initActions(){
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function(event){
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct){
    const thisCart = this;

    /* generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct);

    /* create element using utils.createDOMFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    /* add element to cart product list */
    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));

    thisCart.update();
  }

  update(){
    const thisCart = this;

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for(let product of thisCart.products){
      thisCart.totalNumber += product.amount;
      thisCart.subtotalPrice += product.price;
    }

    if(thisCart.totalNumber > 0){
      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    } else {
      thisCart.totalPrice = 0;
      thisCart.deliveryFee = 0;
    }

    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;

    for(let totalPriceElem of thisCart.dom.totalPrice){
      totalPriceElem.innerHTML = thisCart.totalPrice;
    }
  }

  remove(cartProduct){
    const thisCart = this;

    /* remove DOM element */
    cartProduct.dom.wrapper.remove();

    /* remove from thisCart.products */
    const index = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(index, 1);

    /* update cart totals */
    thisCart.update();
  }

  sendOrder(){
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.orders;

    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };

    for(let prod of thisCart.products){
      payload.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options);
  }
}
