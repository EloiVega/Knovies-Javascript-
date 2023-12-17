const request_options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNmY1NDYxN2QzMzEzYWJjYWUwMzBmZDU1Nzc0MjhhZiIsInN1YiI6IjYyZjYwM2U1ZjkxODNhMDA3YTUwMzVhZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-cVbysrbO3Lj0W3VNMB7SG29Mh5E92yNkzIDQCZVtJ4'
    }
};

//URL data Extraction
const mediaId = location.search.slice(1).split("&");

//MAIN VARIABLES
var banner = document.querySelector(".banner");
var cast = document.querySelector(".cast");
var media = document.querySelector(".media");
var mediaLists = [
    {
        element: document.querySelector(".media .videos"),
        size: 5,
        width: 360,
        link: ""
    },
    {
        element: document.querySelector(".media .posters"),
        size: 5,
        width: 150,
        link: ""
    },
    {
        element: document.querySelector(".media .backdrops"),
        size: 5,
        width: 360,
        link: ""
    }
];

//Initialization function calls
ApiCall(mediaId[1], mediaId[0], null, "constructBanner");
ApiCall(mediaId[1], mediaId[0], "credits", "constructCast");
ApiCall(mediaId[1], mediaId[0], "videos,images", "constructMedia");


// ---------- CAST TOGGLE ---------- //

var toggle = document.querySelector(".toggle");
var toggledList = document.querySelector(".cast");
var shade = document.querySelector(".darken");
// console.log(shade);

toggle.addEventListener("click", () =>{
    toggle.style = "transform: translateX(100%); opacity: 0;";
    toggledList.style = "transform: translateX(0%)";
    shade.style = "z-index: 3; opacity: 1;";
    // console.log(toggle, toggledList, shade);
});

document.addEventListener("click", (e) => {
    if (parseInt(e.clientX) >= toggledList.offsetLeft) return;
    toggle.style = "transition: 0.3s 0.3s ease-out";
    toggledList.style = "transform: translateX(100%);";
    
    setTimeout(()=>{
        document.querySelector(".cast .container").scrollTop = 0;
    }, 500)
    
});

//----------------------------------------------------------//

// ---------- MEDIA CONFIGURATION ---------- //
var selectedOption = 0;
var isExtended = false;
var optionList = document.querySelector(".media .optionList");
var options = document.querySelectorAll(".media .optionList h2");
var dropDownArrow = document.querySelector(".media .optionList span");

// optionList.addEventListener("scroll", ()=>{// console.log(optionList.scrollTop)})

options.forEach(element => {
    element.addEventListener("click", () => {
        if(!isExtended){
            isExtended = true;
            
            //Extend Option List
            optionList.style = "height: 135px";
            
            return;
        }
        
        collapseOptionList(element, optionList);
        updateListSize(element);
        

        isExtended = false;
    });
});

function collapseOptionList(element, optionList){
    optionList.style = "";
    
    //Setting the scroll to where it was before list expansion
    setTimeout(() => {
        optionList.scrollTop = selectedOption * 45;
        selectedOption = parseInt(element.id);
    }, 85);

    //Readjusting to the expected position
    setTimeout(() => {
        optionList.style = "scroll-behavior: smooth";
        optionList.scrollTop = selectedOption * 45;
        optionList.style = "";
        // console.log(optionList.scrollTop);
        dropDownArrow.style = "top: " + (selectedOption * 45 + 20) + "px;";
    }, 100);
}

function updateListSize(element){
    mediaLists[0].element.style = mediaLists[1].element.style = mediaLists[2].element.style = "display: none";
    mediaLists[parseInt(element.id)].element.style = "grid-template-columns: repeat(" + Math.min(mediaLists[parseInt(element.id)].size, 12) + ", "+ mediaLists[parseInt(element.id)].width +"px) 150px;";
}

//----------------------------------------------------------//

//\\ ========== DATA CONFIGURATION ========== //\\

//API Call
function sendRequest(request){
    // console.log(request);
    return fetch(request).then(result => result.json()).then(data => data)
}

//Request Construction
async function constructRequest(ID, media_type, additions){
    // var request;
    // var addedData;

    // addedData = media_type + "/" + ID;

    // request = "https://api.themoviedb.org/3/" + addedData + "?api_key=df3b5f4967782c690e9e21861634f917";
    // if(additions) request += "&append_to_response=" + additions;
    // console.log(request);

    const data = await fetch(`https://api.themoviedb.org/3/${media_type}/${ID}?language=en-US${additions? '&append_to_response=' + additions: ''}`, request_options)
    .then(response => response.json())
    .then(data => data)
    console.log(data);
    return data;
    // return await sendRequest(request);
}

async function ApiCall(ID, media_type, additions, constructFunctionName){
    const data = await constructRequest(ID, media_type, additions);

    // console.log(constructFunctionName);
    window[constructFunctionName](data);
}


// ---------- BANNER ---------- //
function constructBanner(data){
    // console.log(data);
    var stchild, ndchild, rdchild;

    const poster = document.createElement("div");
    poster.className = "poster";
        stchild = document.createElement("img");
        stchild.src = "https://www.themoviedb.org/t/p/w220_and_h330_face" + (data.poster_path ? data.poster_path : data.backdrop_path);
        stchild.alt = "("+ data.original_title + ")'s poster";
    poster.appendChild(stchild);
    banner.append(poster);
    //\\ ----------------------- //\\
    const info = document.createElement("div");
    info.className = "info";
    
        stchild = document.createElement("h2");
        stchild.className = "title";
        stchild.innerText = mediaId[0] == "movie"? data.title : data.name;
    info.appendChild(stchild);
    
        stchild = document.createElement("p");
        stchild.className = "genres";
        for(var i = 0 ; i < data.genres.length ; ++i)
            if(i == data.genres.length - 1) stchild.innerText += data.genres[i].name;
            else stchild.innerText += data.genres[i].name + ", ";
    info.appendChild(stchild);

        stchild = document.createElement("div");
        stchild.className = "icons";
            ndchild = document.createElement("a");
                rdchild = document.createElement("i");
                rdchild.className = "fab fa-facebook-f";
            ndchild.appendChild(rdchild);
        stchild.appendChild(ndchild);

            ndchild = document.createElement("a");
                rdchild = document.createElement("i");
                rdchild.className = "fab fa-instagram";
            ndchild.appendChild(rdchild);
        stchild.appendChild(ndchild);

            ndchild = document.createElement("a");
                rdchild = document.createElement("i");
                rdchild.className = "fab fa-twitter";
            ndchild.appendChild(rdchild);
        stchild.appendChild(ndchild);
    info.appendChild(stchild);

        stchild = document.createElement("h3");
        stchild.textContent = "Overview";
    info.appendChild(stchild);

        stchild = document.createElement("p");
        stchild.className = "overView";
        stchild.textContent = data.overview;
    info.appendChild(stchild);
    banner.append(info);
    //\\ ----------------------- //\\
    checkOnMedia(mediaId[0], mediaId[1]);
}

async function checkOnMedia(type, id){
    const data = await sendRequest("https://api.themoviedb.org/3/" + type + "/" + id + "/external_ids?api_key=df3b5f4967782c690e9e21861634f917");
    // console.log(data);

    const element = document.querySelectorAll(".banner .info .icons a");

    // console.log(element)

    if(!data.facebook_id)
        element[0].style = "display: none";
    else{
        element[0].href = "http://www.facebook.com/" + data.facebook_id;
        element[0].target = "_blank";
    }

    if(!data.instagram_id)
        element[1].style = "display: none";
    else{
        element[1].href = "http://www.instagram.com/" + data.instagram_id;
        element[1].target = "_blank";
    }

    if(!data.twitter_id)
        element[2].style = "display: none";
    else{
        element[2].href = "http://www.twitter.com/" + data.twitter_id;
        element[2].target = "_blank";
    }
}

// ---------- CAST ---------- //
function constructCast(data){
    const cast = data.credits.cast;
    const crew = data.credits.crew;
    // console.log(cast);
    // console.log(crew);
    
    if(!cast.length && !crew.length){
        document.querySelector(".cast").style = "display: none";
        return;
    }

    if(cast.length){
        buildCreditsList(cast, "Cast", document.querySelector(".actors"));
    }

    if(crew.length){
        buildCreditsList(crew, "Crew", document.querySelector(".crew"));
    }

}

function buildCreditsList(list, title, target){
    var child1, child2, child3;

    const element = document.createElement("div");
    element.className = "list";
    
        child1 = document.createElement("div");
        child1.className = "title";
        child1.innerText = title;
    element.appendChild(child1);
    
    for(var i = 0 ; i < list.length ; ++i){
        if(i && list[i].id == list[i-1].id) continue;

        child1 = document.createElement("div");
        child1.className = "item";
            child2 = document.createElement("div");
            child2.className = "picture";
                if(list[i].profile_path){
                    child3 = document.createElement("img");
                    child3.setAttribute("draggable", false);
                    child3.src = "https://www.themoviedb.org/t/p/w66_and_h66_face" + list[i].profile_path;
                }
                else{
                    child3 = document.createElement("i");
                    child3.className = "fas fa-user";
                }
            child2.appendChild(child3);
        child1.appendChild(child2);

            child2 = document.createElement("div");
            child2.className = "name";
            child2.innerText = list[i].name;
        child1.appendChild(child2);
        element.appendChild(child1);
    }

    target.appendChild(element);
}

// ---------- MEDIA ---------- //
function constructMedia(data){
    // console.log(data.images.posters.length);

    mediaLists[0].size = data.videos.results.length;
    buildMediaList(data, mediaLists[0], "videos,results", true, 0);
    MakeMediaClickable(document.querySelector(".media .horizontalSlider").children, "https://www.youtube.com/watch?v=", data);

    mediaLists[1].size = data.images.posters.length;
    buildMediaList(data, mediaLists[1], "images,posters", false, 1);

    mediaLists[2].size = data.images.backdrops.length;
    buildMediaList(data, mediaLists[2], "images,backdrops", false, 2);

    updateListSize(options[0]);

    // console.log(mediaLists);
}

function buildMediaList(data, list, query, includeAnchors, targetIdx){
    const targets = document.querySelectorAll(".media .horizontalSlider");
    query = query.split(",");

    var item, img, a;
    const sz = Math.min(list.size, 12);
    for(var i = 0 ; i < sz ; ++i){
        item = document.createElement("div");
        item.className = "item";
        // console.log(data[query[0]][query[1]][i]);
            img = document.createElement("img");
            img.setAttribute("draggable", false);
            if(includeAnchors == true){
                img.src = "https://img.youtube.com/vi/"+ data[query[0]][query[1]][i].key +"/maxresdefault.jpg";
            item.appendChild(img);
            }
            else{
                // console.log(query[0]);
                img.src = "https://www.themoviedb.org/t/p/original/" + data[query[0]][query[1]][i].file_path;
                item.appendChild(img);
            }
        item.id = i;
        targets[targetIdx].appendChild(item);
    }
    
    setTimeout(()=>{
        var spanEl = document.createElement("span");
        spanEl.className = "viewMore";
        spanEl.textContent = "View More";
    
        spanEl.addEventListener("click", () => {
            const pathname = location.pathname.split('/')[1];
            const repo = pathname === 'Knovies-Javascript-'? pathname + '/': '';
            location.href = `${location.origin}/${repo}Media.html?${mediaId[0]}&${mediaId[1]}`;
            // location.href = location.origin + "/Media.html?" + mediaId[0] + "&" + mediaId[1];
        });
    
        targets[targetIdx].appendChild(spanEl);
    }, 10);

}

function MakeMediaClickable(list, link, data){
    var startX;
    console.log(list);
    for(const element of list){
        element.addEventListener("mousedown", (e) => {startX = e.clientX;})
        element.addEventListener("click", (e) => {
            if(e.clientX == startX){
                console.log(element);
                window.open(link + data.videos.results[element.id].key, "_blank");
                console.log(link + data.videos.results[element.id].key);
            }
        });
    }
}
//----------------------------------------------------------//