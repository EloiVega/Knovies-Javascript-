// ---------- UPDATE REROUTING IN HTML ---------- // This Is A Deployment Fix!
const pathname = location.pathname.split('/')[1];
const repo = pathname === 'Knovies-Javascript-'? pathname: '';

// Movie button routing fix
var header = document.getElementById('header_movie');
var href = header.getAttribute('href');
header.setAttribute('href', repo+href);
// console.log(header, href);

// tv button routing fix
header = document.getElementById('header_tv');
href = header.getAttribute('href');
header.setAttribute('href', repo+href);
// console.log(header, href);

// person button routing fix
header = document.getElementById('header_person');
href = header.getAttribute('href');
header.setAttribute('href', repo+href);
// console.log(header, href);

// login button routing fix
header = document.getElementById('header_login');
href = header.getAttribute('href');
header.setAttribute('href', repo+href);
// console.log(header, href);


//Main Variables
const mediaType = location.search.slice(1); //Responsible for holding the media type {movies, tv or people}

var pageNumber; //Responsible for displaying which page fetched from the database
var optionList; //Responsible for displaying the options from which the user can choose the query (upcoming, popular, etc)
var currentDisplay; //Responsible for indicating which data should be displaying
var displayList; //The element that display the data
var apiData; //Responsible for holding data needed to construct the displayed list
var queryOptions; //Responsible of holding each query option possible as index for easier access (index is sorted according to the optionList)

pageInit();

async function pageInit(){
    pageNumber = 1;
    optionList = document.querySelectorAll(".mainContainer .optionList span");
    currentDisplay = "popular";
    displayList = document.querySelector(".mainContainer .content");
    queryOptions = mediaType == "movie"? ["popular", "now_playing", "upcoming", "top_rated"]: ["popular", "airing_today", "on_the_air", "top_rated"];
    configureOptionList();
    configureDisplayList();
}

//Responsible for configuring all actions related to the OptionList
function configureOptionList(){
    for(let i = 0 ; i < 4 ; ++i){ 
        optionList[i].id = i; 
        optionList[i].textContent = queryOptions[i].split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    }

    optionList.forEach(option => {
        option.addEventListener("click", ()=>{
            optionList.forEach(element => {element.className = ""});
            option.className = ".selected";

            pageNumber = 1;
            currentDisplay = queryOptions[option.id];
            configureDisplayList();
        });
    });

}

//Responsible of getting the data from the api and sending it to the construction function of the display list which shows content in the page
async function configureDisplayList(){
    await setData();
    constructList();
}

//Responsible for constructing the list from the data fetched from the api and pushing it to the displayList which will show them on the page
function constructList(){
    const dataList = apiData.results;
    displayList.textContent = "";

    for(let i = 0 ; i < dataList.length ; ++i){
        const item = document.createElement("div");
        item.className = "item"; if(mediaType == "people") item.className += " profile";
        item.id = i;
        
        //Adds a poster or a filler to the poster
        if(dataList[i].poster_path){
            const imgEl = document.createElement("img");
            imgEl.src = "https://www.themoviedb.org/t/p/w94_and_h141_bestv2/" + dataList[i].poster_path;
            item.appendChild(imgEl);
        } else {
            const divEl = document.createElement("div");
            divEl.className = "imageFill";
                var spanEl = document.createElement("span");
                spanEl.textContent = "Image";
                divEl.appendChild(spanEl);

                spanEl = document.createElement("span");
                spanEl.textContent = "Not Found";
                divEl.appendChild(spanEl);

            item.appendChild(divEl);
        }
        const divEl = document.createElement("div");
            divEl.className = "itemInfo";
                const h2El = document.createElement("h2");
                h2El.className = "title";
                h2El.textContent = dataList[i].name? dataList[i].name : dataList[i].title;
                divEl.appendChild(h2El);

                var pEl = document.createElement("p");
                if(dataList[i].release_date) pEl.textContent = "Released: " + dataList[i].release_date.split("-").join("/");
                if(dataList[i].first_air_date) pEl.textContent = "First Aired: " + dataList[i].first_air_date.split("-").join("/");
                divEl.appendChild(pEl);

                pEl = document.createElement("p");
                pEl.textContent = dataList[i].overview.slice(0, 130) + "...";
                divEl.appendChild(pEl);
            item.appendChild(divEl);

            item.addEventListener("click", ()=>{
                const pathname = location.pathname.split('/')[1];
                const repo = pathname === 'Knovies-Javascript-'? pathname + '/': '';
                location.href = `${location.origin}/${repo}Info.html?${mediaType}&${dataList[item.id].id}`;
                // location.href = location.origin + "/Info.html?" + mediaType + "&" + dataList[item.id].id;
                // console.log("pressing");
            })

    displayList.appendChild(item);
    }
    updatePageNumbers();
}

//I am responsible of configuring the page numbers at the bottom of the page
function updatePageNumbers(){
    // console.log(displayList);
    const left = Math.max(parseInt(pageNumber)-2, 1);
    const right = Math.min(parseInt(pageNumber)+3, apiData.total_pages);
    constructPageNumbers(left, right);
}

//I am responsible of constructing the page number at the bottom of the page and giving them functionalities
function constructPageNumbers(left, right){
    // console.log(left, right);
    const numberContainer = document.createElement("div");
    numberContainer.className = "pageNumbers";
    numberContainer.textContent = "";

    //I construct the previous button
    const previous = document.createElement("span");
    previous.id = "previous";
    previous.className = "number";
        const leftArrow = document.createElement("i");
        leftArrow.className = "fas fa-angle-left";
        leftArrow.style = "transform: translateY(8%);"
        previous.appendChild(leftArrow);
    previous.append(" previous");

    previous.addEventListener("click", async () => {
        pageNumber--;
        await configureDisplayList();
        sendUserToTop();
    });

    if(pageNumber > 1) numberContainer.appendChild(previous);
    
    
    for(let i = left ; i <= right ; ++i){
        const spanEl = document.createElement("span");
        spanEl.className = i == pageNumber? "number selected" : "number";
        spanEl.textContent = i;
        spanEl.id = i;

        spanEl.addEventListener("click", async () => {
            pageNumber = spanEl.id;
            // console.log(pageNumber);
            await configureDisplayList();
            sendUserToTop();
        })

        numberContainer.appendChild(spanEl);
    }

    //I construct the next button
    const next = document.createElement("span");
    next.id = "next";
    next.className = "number";
    next.textContent = "next ";
        const rightArrow = document.createElement("i");
        rightArrow.className = "fas fa-angle-right";
        rightArrow.style = "transform: translateY(8%);"
        next.appendChild(rightArrow)
    if(pageNumber < apiData.total_pages) numberContainer.appendChild(next);

    next.addEventListener("click", async () => {
        pageNumber++;
        await configureDisplayList();
        sendUserToTop();
    });

    displayList.appendChild(numberContainer);
}

//I am responsible for sending the user all the way to the top of the page
function sendUserToTop(){
    scroll({top:0, behavior: "smooth"});
}

//responsible for sending information to construct request and assign the api data to the variable apiData
async function setData(){
    apiData = await constructrequest(mediaType, currentDisplay);
    // console.log(apiData);
}

//responsible for constructing the query string that will be needed for the api call then calling the api and returning the data coming from it
async function constructrequest(media_type, list_type){
    query = "https://api.themoviedb.org/3/"+ media_type + "/" + list_type + "?api_key=df3b5f4967782c690e9e21861634f917&page=" + pageNumber;
    return await sendRequest(query);
}

//responsible for solely calling the API and returning the raw data from the call results
async function sendRequest(request){
    return fetch(request).then(result => result.json()).then(data => data);
}