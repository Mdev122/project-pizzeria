class Carousel {
  constructor(element){
    const thisCarousel = this;

    thisCarousel.render(element);
    thisCarousel.initPlugin();
  }

  render(element){
    const thisCarousel = this;

    thisCarousel.dom = {};
    thisCarousel.dom.wrapper = element;
  }

  initPlugin(){
    const thisCarousel = this;

    // eslint-disable-next-line no-undef
    thisCarousel.glide = new Glide(thisCarousel.dom.wrapper, {
      type: 'carousel',
      startAt: 0,
      perView: 1,
      gap: 0,
      autoplay: 3000,
      hoverpause: false,
      animationDuration: 600,
    });

    thisCarousel.glide.mount();
  }
}

export default Carousel;
