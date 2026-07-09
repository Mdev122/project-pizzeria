/* global select, settings */
'use strict';

class AmountWidget { // eslint-disable-line no-unused-vars
  constructor(element) {
    const thisWidget = this;

    thisWidget.getElements(element);

    thisWidget.setValue(thisWidget.input && thisWidget.input.value ? thisWidget.input.value : settings.amountWidget.defaultValue);

    thisWidget.initActions();
  }

  getElements(element){
    const thisWidget = this;

    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value) {
    const thisWidget = this;

    const newValue = parseInt(value);

    if (
      thisWidget.value !== newValue &&
      !isNaN(newValue) &&
      newValue >= settings.amountWidget.defaultMin &&
      newValue <= settings.amountWidget.defaultMax
    ) {
      thisWidget.value = newValue;
      thisWidget.announce();
    }

    if (thisWidget.input) {
      thisWidget.input.value = thisWidget.value;
    }
  }

  initActions() {
    const thisWidget = this;

    if (thisWidget.input) {
      thisWidget.input.addEventListener('change', function() {
        thisWidget.setValue(thisWidget.input.value);
      });
    }

    if (thisWidget.linkDecrease) {
      thisWidget.linkDecrease.addEventListener('click', function(event) {
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
      });
    }

    if (thisWidget.linkIncrease) {
      thisWidget.linkIncrease.addEventListener('click', function(event) {
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      });
    }
  }

  announce() {
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });

    thisWidget.element.dispatchEvent(event);
  }
}
