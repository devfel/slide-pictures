// Class to slide the elements while holding mouse button.

// Parameters
//slide: class or id selector for itens to be slided.
//ie: '.slider' - No default, can't be empty
//wrapper: class or id selector for the section or div wrapper.
//ie: '.wrapper' - No default, can't be empty

export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);

    // Object with the position and movements values
    this.dist = {
      finalPosition: 0,
      startX: 0, // Starting mouse position on X axis
      movement: 0,
    };
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
    // Getting and saving the click starting position
    this.dist.startX = event.clientX;
    this.wrapper.addEventListener("mousemove", this.onMove);
  }

  // Triggered when user stop holding the mouse.
  onEnd(event) {
    this.wrapper.removeEventListener("mousemove", this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
  }

  onMove(event) {
    const finalPosition = this.updatePosition(event.clientX);
    this.moveSlide(finalPosition);
  }

  // Calculating and saving mouse movement done,
  // 1.8 is used to slide quicker than the mouse movement.
  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.8;
    return this.dist.finalPosition - this.dist.movement;
  }

  // Apply the Translate3d css to move the Slide
  moveSlide(distanceX) {
    this.dist.movePosition = distanceX;
    this.slide.style.transform = `translate3d(${distanceX}px, 0, 0)`;
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
