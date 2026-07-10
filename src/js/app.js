import { select, settings, classNames } from './settings.js';
import { Product } from './components/Product.js';
import { Cart } from './components/Cart.js';
import { Booking } from './components/Booking.js';
import { Home } from './components/Home.js';

export const app = {
  initMenu: function(){
    const thisApp = this;

    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function(){
    const thisApp = this;

    thisApp.data = {};

    const url = settings.db.url + '/' + settings.db.products;

    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);

        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;

        /* execute initMenu method */
        thisApp.initMenu();
      });

    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);

    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function(event){
      thisApp.cart.add(event.detail.product);
    });
  },

  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = idFromHash;
        break;
      }
    }

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* run thisApp.activatePage with that id */
        thisApp.activatePage(id);
      });
    }

    /* any other link to a page id (e.g. the CTA boxes on the home page)
       navigates natively, we just react to the resulting hash change */
    window.addEventListener('hashchange', function(){
      const id = window.location.hash.replace('#', '');

      thisApp.activatePage(id);
    });

    thisApp.activatePage(pageMatchingHash);
  },

  activatePage: function(pageId){
    const thisApp = this;

    /* update address bar to reflect the current page */
    window.location.hash = '#' + pageId;

    /* add class active to matching pages, remove from non-matching */
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    /* add class active to matching links, remove from non-matching */
    for(let link of thisApp.navLinks){
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
    }
  },

  initBooking: function(){
    const thisApp = this;

    const bookingContainer = document.querySelector(select.containerOf.booking);

    thisApp.booking = new Booking(bookingContainer);
  },

  initHome: function(){
    const thisApp = this;

    const homeContainer = document.querySelector(select.containerOf.home);

    thisApp.home = new Home(homeContainer);
  },

  init: function(){
    const thisApp = this;

    thisApp.initData();
    thisApp.initCart();
    /* initPages first so #home already has the .active/display:block class
       before Home mounts its Glide carousel - Glide can't measure a
       display:none container correctly */
    thisApp.initPages();
    thisApp.initHome();
    thisApp.initBooking();
  }
};

app.init();
