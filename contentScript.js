class highlightClickableObject {
  constructor() {
    this.render();
  }
  render() {
    console.log("page is rendering");
    this.delete();
    this.create();
  }

  delete() {
    document
      .querySelectorAll(".clickableObject_CO")
      .forEach((el) => el.remove());
  }
  create() {
    // Let's create a floating border on top of these elements that will always be visible
    this.getClickableObject().forEach(function (item) {
      item.element.addEventListener("mouseover", (e) => {
          e.target.classList.add("accessibleTextSize");
      });
      item.element.addEventListener("mouseleave", (e) => {
          e.target.classList.remove("accessibleTextSize"); 
      });

      //adding highlights and borders to clickable objects
      let newElement = document.createElement("div");
      newElement.style.outline = "2px dashed rgba(255,0,0,.75)";
      newElement.style.position = "absolute";
      newElement.style.left = item.rect.left + "px";
      newElement.style.top = item.rect.top + "px";
      newElement.style.width = item.rect.right - item.rect.left + "px";
      newElement.style.height = item.rect.bottom - item.rect.top + "px";
      newElement.style.pointerEvents = "none";
      newElement.style.boxSizering = "border-box";
      newElement.style.zIndex = 2147483647;
      newElement.classList.add("clickableObject_CO");
      document.body.appendChild(newElement);
    });
  }

  //returns an array of all elements (buttons and clickable places) on the page
  getClickableObject() {
    var bodyRect = document.body.getBoundingClientRect();

    var items = Array.prototype.slice
      .call(document.querySelectorAll("*"))
      .map(function (element) {
        var rect = element.getBoundingClientRect();
        return {
          element: element,
          include:
            element.tagName === "BUTTON" ||
            element.tagName === "A" ||
            element.onclick != null ||
            window.getComputedStyle(element).cursor == "pointer",
          rect: {
            left: Math.max(rect.left - bodyRect.x, 0),
            top: Math.max(rect.top - bodyRect.y, 0),
            right: Math.min(rect.right - bodyRect.x, document.body.clientWidth),
            bottom: Math.min(
              rect.bottom - bodyRect.y,
              document.body.clientHeight
            ),
          },
          text: element.textContent.trim().replace(/\s{2,}/g, " "),
        };
      })
      // checks if clickable elements are inside the page
      .filter(
        (item) =>
          item.include &&
          (item.rect.right - item.rect.left) *
            (item.rect.bottom - item.rect.top) >=
            20
      );

    // Only keep inner clickable items
    items = items.filter(
      (x) => !items.some((y) => x.element.contains(y.element) && !(x == y))
    );
    return items;
  }
}

  //function that works when the page is first loaded
(() => {
  //the first place to add red borders
  const clickableObects = new highlightClickableObject();

  //when the page is resised or the page is scrolled, the red areas reappear
  const debouncedResizeHandler = debounce(() => {
    clickableObects.render();
  }, 100);
  window.addEventListener("resize", debouncedResizeHandler);
  window.addEventListener("scroll", debouncedResizeHandler);


  function debounce(func, delay) {
    let timeoutId;
    return function () {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(func, delay);
    };
  }
})();
