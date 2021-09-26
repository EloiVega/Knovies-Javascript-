// ---------- HORIZONTAL SLIDING LISTS ---------- //
var slidingLists = document.querySelectorAll(".horizontalSlider");
var slidingList;
var initialX;
var currentX;
var scrollLeft;

var isDown = false;
slidingLists.forEach(element => {
    element.addEventListener("mousedown", (e) => {
        slidingList = element;
        isDown = true;
        initialX = e.clientX;
        scrollLeft = slidingList.scrollLeft;
    });
});

document.addEventListener("mousemove", (e) => {
    if (!isDown) return;

    currentX = e.clientX - initialX;
    slidingList.scrollLeft = scrollLeft - currentX;
})

document.addEventListener("mouseup", () => {
    isDown = false;
})
//----------------------------------------------------------//

// ---------- VERTICAL SLIDING LISTS ---------- //

var slidingLists = document.querySelectorAll(".verticalSlider");
var slidingList;
var initialY;
var currentY;
var scrollTop;

var isDown = false;
slidingLists.forEach(element => {
    element.addEventListener("mousedown", (e) => {
        slidingList = element;
        isDown = true;
        initialY = e.clientY;
        scrollTop = slidingList.scrollTop;
    });
});

document.addEventListener("mousemove", (e) => {
    if (!isDown) return;

    currentY = e.clientY - initialY;
    slidingList.scrollTop = scrollTop - currentY;
})

document.addEventListener("mouseup", () => {
    isDown = false;
})
//----------------------------------------------------------//