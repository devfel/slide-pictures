export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
  }

  // Binders necessery due to the EventListener Callbacks.
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  // Triggered when the user "mouse down".
  onStart(event) {
    event.preventDefault();
    this.wrapper.addEventListener("mousemove", this.onMove);
    console.log("start"); //Test
  }

  // Triggered when user stop holding the mouse.
  onEnd(event) {
    this.wrapper.removeEventListener("mousemove", this.onMove);
    console.log("ends"); //Test
  }

  onMove(event) {
    console.log("move"); //Test
  }

  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
  }

  init() {
    this.bindEvents();
    this.addSlideEvents();
    return this;
  }
}
