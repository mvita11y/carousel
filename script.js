/*
External Js


https://www.w3.org/TR/wai-aria-practices/examples/carousel/js/carouselItem.js

https://www.w3.org/TR/wai-aria-practices/examples/carousel/js/carouselButtons.js

https://www.w3.org/TR/wai-aria-practices/examples/carousel/js/pauseButton.js

*/
/*
 *   File:   Carousel.js
 *
 *   Desc:   Carousel widget that implements ARIA Authoring Practices
 *
 */

/*
 *   @constructor CarouselTablist
 *
 *
 */
var Carousel = function (domNode) {
  this.domNode = domNode;

  this.items = [];

  this.firstItem = null;
  this.lastItem = null;
  this.currentDomNode = null;
  this.liveRegionNode = null;
  this.currentItem = null;
  this.pauseButton = null;

  this.playLabel = "Start automatic slide show";
  this.pauseLabel = "Stop automatic slide show";

  this.rotate = true;
  this.hasFocus = false;
  this.hasHover = false;
  this.isStopped = false;
  this.timeInterval = 5000;
};
selectItem =function (e) {
  Carousel.prototype.setSelected
}
Carousel.prototype.init = function () {
  var elems, elem, button, items, item, imageLinks, i;
  ///class="slick-active"
  this.liveRegionNode = this.domNode.querySelector(".carousel-items");

  items = this.domNode.querySelectorAll(".carousel-item");
  
  var ul = document.createElement("ul");
  ul.setAttribute("class", "slick-dots");
  ul.setAttribute("role", "tablist");
                              document.getElementById("renderDots").appendChild(ul);
  for (i = 0; i < items.length; i++) {
    console.log(items[i])
    var li = document.createElement("li");
    li.setAttribute("aria-selected", "false");
    li.setAttribute("aria-controls", "navigation-" + i);
    li.setAttribute("id", "slick-slide-" + i);

    var button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("data-role", "none");
    button.setAttribute("role", "button");
    button.setAttribute("aria-required", "false");
    button.setAttribute("tabindex", "0");
     button.setAttribute("aria-labelledby", "carousel-label-"+i);
     button.setAttribute("id", "button-carousel-"+i);
    // button.setAttribute("onclick", 'selectItem('+i+')');
    button.innerHTML = i;
    li.appendChild(button);
    ul.appendChild(li);
 

//     onclick = function () {
//   this.selectItem();
// }.blind(this);
    item = new CarouselItem(items[i], this);

    item.init();
    this.items.push(item);

    if (!this.firstItem) {
      this.firstItem = item;
      this.currentDomNode = item.domNode;
    }
    this.lastItem = item;

    imageLinks = items[i].querySelectorAll(".carousel-image a");

    if (imageLinks && imageLinks[0]) {
      imageLinks[0].addEventListener(
        "focus",
        this.handleImageLinkFocus.bind(this)
      );
      imageLinks[0].addEventListener(
        "blur",
        this.handleImageLinkBlur.bind(this)
      );
    }
  }

  // Pause, Next Slide and Previous Slide Buttons

  elems = document.querySelectorAll(".carousel .controls button");

  for (i = 0; i < elems.length; i++) {
    elem = elems[i];

    if (elem.classList.contains("rotation")) {
      button = new PauseButton(elem, this);
      this.pauseButton = elem;
      this.pauseButton.classList.add("pause");
      this.pauseButton.setAttribute("aria-label", this.pauseLabel);
    } else {
      button = new CarouselButton(elem, this);
    }

    button.init();
  }

  //window.console.log( this.items[3].show());
  this.currentItem = this.firstItem;

  li = this.domNode.querySelector("#slick-slide-0");
  li.setAttribute("class", "slick-active");

  this.domNode.addEventListener("mouseover", this.handleMouseOver.bind(this));
  this.domNode.addEventListener("mouseout", this.handleMouseOut.bind(this));

  this.domNode.addEventListener('click', this.handleClick.bind(this));
  // Start rotation
  setTimeout(this.rotateSlides.bind(this), this.timeInterval);
};

Carousel.prototype.setSelected = function (newItem, moveFocus) {
  if (typeof moveFocus != "boolean") {
    moveFocus = false;
  }

  for (var i = 0; i < this.items.length; i++) {
    this.items[i].hide();
  }

  this.currentItem = newItem;
  this.currentItem.show();

  if (moveFocus) {
    this.currentItem.domNode.focus();
  }
};

Carousel.prototype.setSelectedToPreviousItem = function (
  currentItem,
  moveFocus
) {
  if (typeof moveFocus != "boolean") {
    moveFocus = false;
  }

  var index;

  if (typeof currentItem !== "object") {
    currentItem = this.currentItem;
  }

  items = this.domNode.querySelectorAll(".carousel-item");
  for (i = 0; i < items.length; i++) {
    li = this.domNode.querySelector("#slick-slide-" + i);
    li.setAttribute("class", "");
  }

  if (currentItem === this.firstItem) {
    index = this.items.indexOf(this.lastItem);
    li = this.domNode.querySelector("#slick-slide-" + index);
    li.setAttribute("class", "slick-active");
    this.setSelected(this.lastItem, moveFocus);
  } else {
    index = this.items.indexOf(currentItem);
    li = this.domNode.querySelector("#slick-slide-" + (index - 1));
    li.setAttribute("class", "slick-active");
    this.setSelected(this.items[index - 1], moveFocus);
  }
};

Carousel.prototype.setSelectedToNextItem = function (currentItem, moveFocus) {
  if (typeof moveFocus != "boolean") {
    moveFocus = false;
  }

  var index;

  if (typeof currentItem !== "object") {
    currentItem = this.currentItem;
  }

  items = this.domNode.querySelectorAll(".carousel-item");
  for (i = 0; i < items.length; i++) {
    li = this.domNode.querySelector("#slick-slide-" + i);
    li.setAttribute("class", "");
  }

  if (currentItem === this.lastItem) {
    index = this.items.indexOf(this.firstItem);
    li = this.domNode.querySelector("#slick-slide-" + index);
    li.setAttribute("class", "slick-active");
    this.setSelected(this.firstItem, moveFocus);
  } else {
    index = this.items.indexOf(currentItem);
    li = this.domNode.querySelector("#slick-slide-" + (index + 1));
    li.setAttribute("class", "slick-active");
    this.setSelected(this.items[index + 1], moveFocus);
  }
};

Carousel.prototype.rotateSlides = function () {
  if (this.rotate) {
    this.setSelectedToNextItem();
  }
  setTimeout(this.rotateSlides.bind(this), this.timeInterval);
};

Carousel.prototype.updateRotation = function () {
  if (!this.hasHover && !this.hasFocus && !this.isStopped) {
    this.rotate = true;
    this.liveRegionNode.setAttribute("aria-live", "off");
  } else {
    this.rotate = false;
    this.liveRegionNode.setAttribute("aria-live", "polite");
  }

  if (this.isStopped) {
    this.pauseButton.setAttribute("aria-label", this.playLabel);
    this.pauseButton.classList.remove("pause");
    this.pauseButton.classList.add("play");
  } else {
    this.pauseButton.setAttribute("aria-label", this.pauseLabel);
    this.pauseButton.classList.remove("play");
    this.pauseButton.classList.add("pause");
  }
};

Carousel.prototype.toggleRotation = function () {
  if (this.isStopped) {
    if (!this.hasHover && !this.hasFocus) {
      this.isStopped = false;
    }
  } else {
    this.isStopped = true;
  }

  this.updateRotation();
};

Carousel.prototype.handleImageLinkFocus = function () {
  this.liveRegionNode.classList.add("focus");
};

Carousel.prototype.handleImageLinkBlur = function () {
  this.liveRegionNode.classList.remove("focus");
};

Carousel.prototype.handleMouseOver = function (event) {
  if (!this.pauseButton.contains(event.target)) {
    this.hasHover = true;
  }
  this.updateRotation();
};

Carousel.prototype.handleMouseOut = function () {
  this.hasHover = false;
  this.updateRotation();
};

Carousel.prototype.handleClick = function (event) {
   var id = 'button-carousel-'+event.target.innerHTML;
  if(id ==event.target.id ){
     items = this.domNode.querySelectorAll(".carousel-item");
  for (i = 0; i < items.length; i++) {
    li = this.domNode.querySelector("#slick-slide-" + i);
    li.setAttribute("class", "");
  }
    
      this.setSelected(this.items[event.target.innerHTML], null);
    window.console.log(event.target.id,id);
  }
  
};

/* Initialize Carousel Tablists */

window.addEventListener(
  "load",
  function () {
    var carousels = document.querySelectorAll(".carousel");

    for (var i = 0; i < carousels.length; i++) {
      var carousel = new Carousel(carousels[i]);
      carousel.init();
    }
  },
  false
);