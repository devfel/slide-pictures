import SlideNav from "./slide.js";

const slide = new SlideNav(".slide", ".wrapper");
slide.init();
slide.addArrow(".prev", ".next");

//slide.addControl(); //for a non customized control.
slide.addControl(".custom-controls");
