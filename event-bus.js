export default class EventBus {
  static elementAdded(element) {
    const broadcast = element.dataset.broadcast;
    if (!broadcast) {
      return;
    }

    const [ elementFrom, elementTo ] = broadcast.split("->");
    elementTo ||= elementFrom;

    element.addEventListener(elementFrom, () => {  
      document.querySelectorAll("[data-receive]").forEach(target => {
        target.dataset.receive.split(" ").forEach(phrase => {
          let [ targetFrom, targetTo ] = phrase.split("->");
          if (targetFrom == elementTo) {
            targetTo ||= targetFrom;
            target[targetTo](element);
          }
        })
      });
    })
  }

  static connect() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(element => {
          this.elementAdded(element);
        });
      })
    });
    observer.observe(document, { subtree: true, childList: true });

    document.querySelectorAll("[data-broadcast]").forEach(element => {
      this.elementAdded(element);
    });
  }
} 

EventBus.connect();