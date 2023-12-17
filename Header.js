// ---------- NAVBAR LIST RESPONSIVE CONFIGURATION ---------- //
var dropDownIcon = document.querySelector(".header .container .icon");
var dropDownList = document.querySelector(".header .container .sidebar");
var darkWindow = document.querySelector(".darken");

// console.log(document.querySelector(".header .logo"));
document.querySelector(".header .logo").addEventListener("click", () => {
    const pathname = location.pathname.split('/')[1];
    const repo = pathname === 'Knovies-Javascript-/'? pathname: '';
    location.href = `${location.origin}/${repo}index.html`;
});

dropDownIcon.addEventListener("click", () => {
    dropDownList.style = "transform: translateX(0) ; opacity: 1";
    
    darkWindow.style = "z-index: 3; opacity: 1; ";
    // console.log(dropDownList);
});

document.body.addEventListener("click", (e) => {
    if (parseInt(e.clientX) <= dropDownList.clientWidth) return;
    dropDownList.style = "transform: translateX(-100%) ; opacity: 0";
    darkWindow.style = "z-index: -100; opacity: 0 ; ";
})

var searchbar = document.querySelector(".search input");
var api;
//----------------------------------------------------------//