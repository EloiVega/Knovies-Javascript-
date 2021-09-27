//Main Variables
const mediaType = location.search.slice(1); //Responsible for holding the media type {movies, tv or people}

var pageNumber; //Responsible for displaying which page fetched from the database
var currentDisplay; //Responsible for indicating which data should be displaying
var displayList; //The element that display the data
var apiData; //Responsible for holding data needed to construct the displayed list

pageInit();

async function pageInit(){
    pageNumber = 1;
    currentDisplay = "popular";
    displayList = document.querySelector(".mainContainer .content");

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
                location.href = location.origin + "/Info.html?" + mediaType + "&" + dataList[item.id].id;
                // console.log("pressing");
            })

    displayList.appendChild(item);
    }
}

//responsible for sending information to construct request and assign the api data to the variable apiData
async function setData(){
    apiData = await constructrequest(mediaType, currentDisplay);
    console.log(apiData);
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