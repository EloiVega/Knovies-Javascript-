//URL data Extraction
const mediaId = location.search.slice(1).split("&");
// console.log(mediaId);

const list = document.querySelector(".contentDisplay");
var mediaTriggers = document.querySelectorAll(".mainContainer .optionList span");
mediaTriggers = [
    {index: 0, element: mediaTriggers[0]}, 
    {index: 1, element: mediaTriggers[1]}, 
    {index: 2, element: mediaTriggers[2]}]

    
var currentTriggerIdx = 0;
// console.log(list);
    
contsructList(0);

//I control the ability to go back to the mediaInfo page
document.getElementById("back").addEventListener("click", () => { 
    const pathname = location.pathname.split('/')[1];
    const repo = pathname === 'Knovies-Javascript-/'? pathname: '';
    location.href = `${location.origin}/${repo}Info.html?${mediaId[0]}&${mediaId[1]}`;
    // location.href = location.origin + "/Info.html?" + mediaId[0] + "&" + mediaId[1]
})


// I control the clicking event for (the option list)
mediaTriggers.forEach(element => {
    element.element.addEventListener("click", () =>{
        contsructList(element.index);

        mediaTriggers[currentTriggerIdx].element.className = "";
        mediaTriggers[element.index].element.className = "selected";

        currentTriggerIdx = element.index;
    });
});

function sendRequest(request){
    return fetch(request).then(result => result.json()).then(data => data);
}


async function constructRequest(ID, media_type){
    var request;
    var addedData;
    addedData = media_type + "/" + ID;

    request = "https://api.themoviedb.org/3/" + addedData + "?api_key=df3b5f4967782c690e9e21861634f917&append_to_response=videos,images";
    // console.log(request);

    return await sendRequest(request);
}

var data;
async function contsructList(index){
    if(data == null){
        data = await constructRequest(mediaId[1], mediaId[0]);
        console.log("awaiting data");
    }
    
    switch(index){
        case 0:
            generateVideoList(data.videos.results);
            break;
        case 1:
            generatePosterList(data.images.posters);
            break;
        case 2:
            generateBackdropList(data.images.backdrops);
            break;
    }
}

function generateVideoList(data){
    list.textContent = "";
    for(let item of data){
        const element = document.createElement("div");
        element.className = "item";

        constructElement(element, item.key, item.name, item.published_at, "video");
        
        element.addEventListener("click", ()=>{ window.open("https://www.youtube.com/watch?v=" + item.key, "_blank"); })
        list.appendChild(element);
    }
}

function generatePosterList(data){
    list.textContent = "";
    // var count = 0;
    for(let item of data){
        // if(count++ > 50) break;
        const element = document.createElement("div");
        element.className = "item picture";

        const vote = "Rating: " + item.vote_average + "/10";
        const Rect = item.width + "x" + item.height;
        constructElement(element, item.file_path, vote, Rect, "poster");
        
        element.addEventListener("click", ()=>{ window.open("https://www.themoviedb.org/t/p/w220_and_h330_face/" + item.file_path, "_blank"); })

        list.appendChild(element);
    }
}

function generateBackdropList(data){
    list.textContent = "";
    // var count = 0;
    for(let item of data){
        // if(count++ > 50) break;
        const element = document.createElement("div");
        element.className = "item";

        const vote = "Rating: " + item.vote_average + "/10";
        const Rect = item.width + "x" + item.height;
        constructElement(element, item.file_path, vote, Rect, "backdrop");
        
        element.addEventListener("click", ()=>{ window.open("https://www.themoviedb.org/t/p/original/" + item.file_path, "_blank"); })
        list.appendChild(element);
    }
}


function constructElement(element, key, name, published_at, type){ 
    var child1 = document.createElement("img");
    child1.src = type == "video"? "https://img.youtube.com/vi/" + key + "/maxresdefault.jpg" : type == "poster"? "https://www.themoviedb.org/t/p/w220_and_h330_face/"+ key : "https://www.themoviedb.org/t/p/original/"+ key;
    child1.alt = name;
    child1.setAttribute("draggable", false);
    element.appendChild(child1);

    child1 = document.createElement("h2");
    child1.textContent = name;
    element.appendChild(child1);
    
    child1 = document.createElement("p");
    //Converts the default format YYYY-MM-DDTHH:MM:SS.unwantedinfo tp YYYY-MM-DD HH:MM:SS
    child1.textContent = published_at.split("T").join(" ").split(".").splice(0,1).join(" ");
    element.appendChild(child1);
}