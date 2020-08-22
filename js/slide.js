import debounce from "./debounce.js";

// Class to slide the elements while holding mouse button.

// Parameters
//slide: class or id selector for itens to be slided.
//ie: '.slider' - No default, can't be empty
//wrapper: class or id selector for the section or div wrapper.
//ie: '.wrapper' - No default, can't be empty

export class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);

    // Object with the position and movements values
    this.dist = {
      finalPosition: 0,
      startX: 0, // Starting mouse position on X axis
      movement: 0,
    };

    // Class name to be added in the current picture.
    this.activeClass = "active";

    // Creating event to track image change for paging highlight
    this.changeEvent = new Event("changeEvent");
  }

  // Binders necessery due to the EventListener Callbacks.
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);

    this.onResize = debounce(this.onResize.bind(this), 100);

    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
    this.eventControl = this.eventControl.bind(this);
    this.activeControlItem = this.activeControlItem.bind(this);
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
    this.changeActiveClass();
    this.wrapper.dispatchEvent(this.changeEvent);
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

  // Add a class name on the current selected picture.
  changeActiveClass() {
    this.slideArray.forEach((item) =>
      item.elem.classList.remove(this.activeClass)
    );
    this.slideArray[this.index.current].elem.classList.add(this.activeClass);
  }

  // Reset and reload configuration if the screen is resized by the user.
  onResize() {
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.current);
    }, 1000);
  }
  addResizeEvent() {
    window.addEventListener("resize", this.onResize);
  }

  init() {
    this.bindEvents();
    this.transition(true);
    this.addSlideEvents();
    this.slidesConfig();
    this.addResizeEvent();
    this.changeSlide(0);

    return this;
  }
}

// Subclass of Slide, handle the navigation with Arrows and Paging.
export default class SlideNav extends Slide {
  addArrow(prev, next) {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);
    this.addArrowEvent();
  }

  addArrowEvent() {
    this.prevElement.addEventListener("click", this.activePrevSlide);
    this.nextElement.addEventListener("click", this.activeNextSlide);
  }

  // Creating the html and css elements for Paging/Pagination.
  createControl() {
    const control = document.createElement("ul");
    control.dataset.control = "slide";

    this.slideArray.forEach((item, index) => {
      control.innerHTML += `
      <li>
        <a href="#slide${index + 1}">${index + 1}</a>
      </li>`;
    });
    this.wrapper.appendChild(control);
    return control;
  }

  // Creating the events to control Paging/Pagination.
  eventControl(item, index) {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      this.changeSlide(index);
    });
    this.wrapper.addEventListener("changeEvent", this.activeControlItem);
  }

  addControl(customControl) {
    this.control =
      document.querySelector(customControl) || this.createControl();
    this.controlArray = [...this.control.children];

    this.activeControlItem();
    this.controlArray.forEach(this.eventControl);
  }

  // Highlight the paging of the current selected picture.
  activeControlItem() {
    this.controlArray.forEach((item) =>
      item.classList.remove(this.activeClass)
    );
    this.controlArray[this.index.current].classList.add(this.activeClass);
  }
}
