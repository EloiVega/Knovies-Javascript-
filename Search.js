const searchQuery = location.search.slice(7);
var pageNumber = 1;
var currentList;
var currentType;
// // console.log(searchQuery);

var tv;
var movies;
var people;
var collections;

//Search Elements
const searchInput = document.querySelector(".searchBar form input");
var containsText = false;
var searchTimer;

//main Container Elements
const list = document.querySelector(".content");
var mediaTriggers = document.querySelectorAll(".mainContainer .optionList>span");

controlResults();

//I control the search result
async function controlResults(){
    tv = await constructRequest("tv", searchQuery);
    // // console.log(tv);
    movies = await constructRequest("movie", searchQuery);
    // // console.log(movies);
    people = await constructRequest("person", searchQuery);
    // // console.log(people);
    collections = await constructRequest("collection", searchQuery);
    // // console.log(collections);

    var topList;
    
    if(tv.results.length && movies.results.length) topList = tv.results[0].vote_average > movies.results[0].vote_average? "tv" : "movies";
    else topList = tv.results.length? "tv" : "movies";

    constructOptionList(topList, 
        [
            {name: "TV Shows", number: tv.total_results, list: tv}, 
            {name: "Movies", number: movies.total_results, list: movies}, 
            {name: "People", number: people.total_results, list: people}, 
            {name: "Collections", number: collections.total_results, list: collections}
        ]);

    if(topList == "tv") {
        currentList = tv;
        currentType = "TV Shows";
        controlContentList("TV Shows");
    }
    else {
        currentList = movies;
        currentType = "Movies";
        controlContentList("Movies");
    }
}

//----------------- OPTION LIST MANAGEMENT ----------------//
//I construct the Option List
function constructOptionList(topList, args){
    if(topList == "movies") {
        args = [args[1], args[0], args[2], args[3]];
    }
    
    var i = 0;
    for(let trigger of mediaTriggers){
        trigger.textContent = "";
        trigger.className = "";
        trigger.id = i;
        trigger.textContent = args[i].name + " ";
        const innerSpanEl = document.createElement("span");
        innerSpanEl.textContent = args[i].number;
        trigger.appendChild(innerSpanEl);
        ++i;
        
        trigger.addEventListener("click", ()=>{
            mediaTriggers.forEach(element =>{element.className = ""}); //I clear the classes for the all the options
            trigger.className = "selected";
            pageNumber = 1;
            currentList = args[trigger.id].list;
            currentType = args[trigger.id].name;
            controlContentList(currentType);
        })
    }
    
    mediaTriggers[0].className = "selected";
}

//----------------- CONTENT LIST MANAGEMENT ----------------//
//I construct the Content List
function controlContentList(type){

    if(type == "People"){
        if(people.results.length) constructProfileList(people);
    }
    else{
        switch(type){
            case "TV Shows": if(tv.results.length) constructContentList(tv, "tv"); break;
            case "Movies": if(movies.results.length) constructContentList(movies, "movie"); break;
            case "Collections": if(collections.results.length) constructContentList(collections); break;
        }
    }

    if(currentList.total_pages > 1) updatePageNumbers();
}

function constructProfileList(data){
    // console.log("constructProfileList");
    // console.log(data);
    const results = data.results;
    list.textContent = "";
    for(let i = 0 ; i < results.length ; ++i){
        const item = document.createElement("div");
        item.className = "item profile";
            if(results[i].profile_path){
                const imgEl = document.createElement("img");
                imgEl.src = "https://www.themoviedb.org/t/p/w90_and_h90_bestv2" + results[i].profile_path;
                item.appendChild(imgEl);
            } else {
                const divEl = document.createElement("div");
                divEl.className = "imageFill";
                    var iEl = document.createElement("i");
                    iEl.className = "fas fa-user";
                    divEl.appendChild(iEl);

                item.appendChild(divEl);
            }
        
            const divEl = document.createElement("div");
            divEl.className = "itemInfo";
                const h2El = document.createElement("h2");
                h2El.className = "title";
                h2El.textContent = results[i].name;
                divEl.appendChild(h2El);

                var pEl = document.createElement("p");
                
                var knownFor = "";
                // if(results[i].known_for[0].title) knownFor += results[i].known_for[0].title;
                // else knownFor += "," + results[i].known_for[0].name;

                // // console.log(results);
                
                for(let j = 0 ; j < Math.min(results[i].known_for.length, 3) ; ++j){
                    if(j) knownFor += ",";

                    if(results[i].known_for[j].title) knownFor += results[i].known_for[j].title;
                    else knownFor +=results[i].known_for[j].name;
                    // // console.log(j, knownFor);
                }

                pEl.textContent = results[i].known_for_department + "• " + knownFor;
                divEl.appendChild(pEl);
            item.appendChild(divEl);
        list.appendChild(item);
    }
}

function constructContentList(data, type){
    // console.log("constructContentList");
    // console.log(data);
    const results = data.results;
    list.textContent = "";
    for(let i = 0 ; i < results.length ; ++i){
        const item = document.createElement("div");
        item.className = "item";
        item.id = i;
            if(results[i].poster_path){
                const imgEl = document.createElement("img");
                imgEl.src = "https://www.themoviedb.org/t/p/w94_and_h141_bestv2/" + results[i].poster_path;
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
                h2El.textContent = results[i].name? results[i].name : results[i].title;
                divEl.appendChild(h2El);

                var pEl = document.createElement("p");
                if(results[i].release_date) pEl.textContent = "Released: " + results[i].release_date.split("-").join("/");
                if(results[i].first_air_date) pEl.textContent = "First Aired: " + results[i].first_air_date.split("-").join("/");
                divEl.appendChild(pEl);

                pEl = document.createElement("p");
                pEl.textContent = results[i].overview.slice(0, 130) + "...";
                divEl.appendChild(pEl);
            item.appendChild(divEl);

            item.addEventListener("click", ()=>{
                const pathname = location.pathname.split('/')[1];
                const repo = pathname === 'Knovies-Javascript-/'? pathname: '';
                location.href = `${location.origin}/${repo}Info.html?${type}&${results[item.id].id}`;
                // location.href = location.origin + "/Info.html?" + type + "&" + results[item.id].id;
                // console.log("pressing");
            })

        list.appendChild(item);
    }
}

function updatePageNumbers(){
    console.log(currentList);
    const left = Math.max(parseInt(pageNumber)-2, 1);
    const right = Math.min(parseInt(pageNumber)+3, currentList.total_pages);
    constructPageNumbers(left, right);
}

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
        await updateData();
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
            console.log(pageNumber);
            await updateData();
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
    if(pageNumber < currentList.total_pages) numberContainer.appendChild(next);

    next.addEventListener("click", async () => {
        pageNumber++;
        await updateData();
        sendUserToTop();
    });

    list.appendChild(numberContainer);
}

function sendUserToTop(){
    scroll({top:0, behavior: "smooth"});
}

//----------------- API CALL MANAGEMENT ----------------//

//I construct the request needed to fetch the data from the api
async function constructRequest(type, query){
    queryStr = "https://api.themoviedb.org/3/search/" + type + "?api_key=df3b5f4967782c690e9e21861634f917&query=" + query + "&page=" + pageNumber;
    // console.log(queryStr);
    return await sendRequst(queryStr);
}

//I fetch the data from the api  
async function sendRequst(str){
    return fetch(str).then(result => result.json()).then(data => data);
}

async function updateData(){
    switch(currentType){
        case "TV Shows": tv = await constructRequest("tv", searchQuery); currentList = tv;  break;
        case "Movies": movies = await constructRequest("movie", searchQuery); currentList = movies;  break;
        case "Collections": collections = await constructRequest("collection", searchQuery); currentList = collections;  break;
        case "People": people = await constructRequest("person", searchQuery); currentList = people;  break;
    }

    controlContentList(currentType);
}