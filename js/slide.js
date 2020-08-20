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
    let moveType;

    // Dektop - Getting and saving the click starting position
    if (event.type === "mousedown") {
      event.preventDefault();
      this.dist.startX = event.clientX;
      moveType = "mousemove";
    }
    // Mobile
    else if (event.type === "touchstart") {
      this.dist.startX = event.changedTouches[0].clientX;
      moveType = "touchmove";
    }

    this.wrapper.addEventListener(moveType, this.onMove);
    this.transition(false);
  }

  // Triggered when user stop holding the button/screen.
  onEnd(event) {
    const moveType = event.type === "mouseup" ? "mousemove" : "touchmove";
    this.wrapper.removeEventListener(moveType, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
    this.transition(true);
    this.changeSlideOnEnd(); //to make sure there is a picture on center;
  }

  // Moves the picture so there is always something on center
  changeSlideOnEnd() {
    // Check if the movement is more than half of image width (positive).
    if (
      this.dist.movement > this.slide.children[0].children[0].width / 2 &&
      this.index.next !== undefined
    ) {
      this.activeNextSlide(); // Go to next slide
    }
    // Check if the movement is more than half of image width (negative).
    else if (
      this.dist.movement < -this.slide.children[0].children[0].width / 2 &&
      this.index.prev !== undefined
    ) {
      this.activePrevSlide(); // Go to previous slide
    }
    // Move to little or exceed number of imgs, center current image.
    else {
      this.changeSlide(this.index.current);
    }
  }

  // Smooth transition only when mouseup/touchend
  // parameter true activate the animation.
  transition(active) {
    this.slide.style.transition = active ? "transform .3s" : "";
  }

  onMove(event) {
    const pointerPosition =
      event.type === "mousemove"
        ? event.clientX
        : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  // Calculating and saving mouse movement done,
  // 1.5 is used to slide quicker than the mouse movement.
  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.5;
    return this.dist.finalPosition - this.dist.movement;
  }

  // Apply the Translate3d css to move the Slide
  moveSlide(distanceX) {
    this.dist.movePosition = distanceX;
    this.slide.style.transform = `translate3d(${distanceX}px, 0, 0)`;
  }

  addSlideEvents() {
    // For desktop
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);

    // For mobile
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("touchend", this.onEnd);
  }

  // Verify the index of each pictures, necessery to know next
  // and previous elements and to not move beyond the borders.
  slidesIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index === 0 ? undefined : index - 1,
      current: index,
      next: index === last ? undefined : index + 1,
    };
  }

  // Calculate the position so the picture is centralized on the screen.
  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }

  // Slides configurations returning each picture elem and the center position.
  slidesConfig() {
    this.slideArray = [...this.slide.children].map((elem) => {
      const position = this.slidePosition(elem);
      return { position, elem };
    });
  }

  // Change the view to centralize the selected picture
  changeSlide(index) {
    const currentSlide = this.slideArray[index];
    this.moveSlide(currentSlide.position);
    this.slidesIndexNav(index);
    this.dist.finalPosition = currentSlide.position; // update position
  }

  // Move to the previous or next image
  activePrevSlide() {
    if (this.index.prev !== undefined) {
      this.changeSlide(this.index.prev);
    }
  }
  activeNextSlide() {
    if (this.index.next !== undefined) {
      this.changeSlide(this.index.next);
    }
  }

  init() {
    this.bindEvents();
    this.transition(true);
    this.addSlideEvents();
    this.slidesConfig();

    return this;
  }
}
