import Slide from "./slide.js";

const slide = new Slide(".slide", ".wrapper");
slide.init();

slide.changeSlide(2);
slide.activeNextSlide();
