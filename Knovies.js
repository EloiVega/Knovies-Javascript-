const request_options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNmY1NDYxN2QzMzEzYWJjYWUwMzBmZDU1Nzc0MjhhZiIsInN1YiI6IjYyZjYwM2U1ZjkxODNhMDA3YTUwMzVhZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-cVbysrbO3Lj0W3VNMB7SG29Mh5E92yNkzIDQCZVtJ4'
    }
};

// // ---------- UPDATE REROUTING IN HTML ---------- // This Is A Deployment Fix!
// const pathname = location.pathname.split('/')[1];
// const repo = pathname === 'Knovies-Javascript-'? pathname + '/': '';

// // Movie button routing fix
// var header = document.getElementById('header_movie');
// var href = header.getAttribute('href');
// header.setAttribute('href', repo+href);
// // console.log(header, href);

// // tv button routing fix
// header = document.getElementById('header_tv');
// href = header.getAttribute('href');
// header.setAttribute('href', repo+href);
// // console.log(header, href);

// // person button routing fix
// header = document.getElementById('header_person');
// href = header.getAttribute('href');
// header.setAttribute('href', repo+href);
// // console.log(header, href);

// // login button routing fix
// header = document.getElementById('header_login');
// href = header.getAttribute('href');
// header.setAttribute('href', repo+href);
// // console.log(header, href);


// ---------- DEFAULT FUNCTION CALLS ---------- //
var targetList = document.querySelectorAll(".partition .list");
constructList(targetList[0], "trending", "movie", "day");
constructList(targetList[1], "popular", "movie", "day");
constructList(targetList[2], "trending", "tv", "day");
constructList(targetList[3], "popular", "tv", "day");
//----------------------------------------------------------//

// ---------- TRENDING BUTTONS CONFIGURATION ---------- //
var toggleButtons = document.querySelectorAll(".partition .toggle");
var toggleSelectedBackground = document.querySelectorAll(".partition .toggle .selected");
var toggleOptions = document.querySelectorAll(".partition .toggle span");


var isDay = [true, true];

toggleButtons.forEach(element => {
    element.addEventListener("click", () => {

        var idx = 0;
        while (idx < toggleButtons.length) {
            if (toggleButtons[idx] == element) break;
            idx++;
        }

        //console.log(toggleSelectedBackground[idx]);
        if (isDay[idx]) {
            toggleSelectedBackground[idx].style = "transform: translateX(100%);";
            toggleOptions[idx * 2 + 1].style = "";
            toggleOptions[idx * 2 + 0].style = "color: #c0b68c";
        } else {
            toggleSelectedBackground[idx].style = "transform: translateX(0);";
            toggleOptions[idx * 2 + 0].style = "";
            toggleOptions[idx * 2 + 1].style = "color: #c0b68c";
        }

        isDay[idx] = !isDay[idx];

        //Construct data to send to the API
        var list, type, category, timeSpan;

        list = idx ? document.querySelectorAll(".partition .list")[2] : document.querySelectorAll(".partition .list")[0];
        category = "top_rated";
        type = idx ? "tv" : "movie";
        timeSpan = isDay[idx] ? "day" : "week";

        constructList(list, category, type, timeSpan);
    });
});
//----------------------------------------------------------//

// ---------- RETREIVING DATA ---------- //
//API Call
function sendRequest(request) {
    console.log("fetching data from ... \n "+ request);
    return fetch(request).then(result => result.json()).then(data => data)
}

//Constructing the request to call the api
async function constructRequest(partition, type, timeSpan) {
    // var request;
    // var addedData;

    // addedData = partition == "trending" ? partition + "/" + type + "/" + timeSpan : type + "/" + partition;
    // request = "https://api.themoviedb.org/3/" + addedData + "?api_key=06f54617d3313abcae030fd5577428af";
    // console.log(request);

    // return await sendRequest(request);

    const data = await fetch(`https://api.themoviedb.org/3/movie/${partition === 'top_rated' ? partition: 'popular'}?language=en-US&page=1`, request_options)
  .then(response => response.json())
  .then(data => data)
  .catch(err => console.error(err));

  return data;

}

//Construct data Trending List
async function constructList(list, partition, type, timeSpan) {
    //console.log(list, partition, type, timeSpan);
    const data = await constructRequest(partition, type, timeSpan);

    buildTrendingList(data, list);
    MakePostersClickable(list.children, type);
}

//Constructing Trending list
function buildTrendingList(data, list) {
    // //console.log(data.results);
    const results = data.results;
    var divEl = list;
    divEl.textContent = "";

    for (const i in results) {
        var element = document.createElement("div");
        var first, second, third;

        first = document.createElement("div");
        first.className = "poster";

        second = document.createElement("img");
        if (results[i].poster_path || results[i].backdrop_path) {
            second.src = "https://www.themoviedb.org/t/p/w220_and_h330_face" + (results[i].poster_path ? results[i].poster_path : results[i].backdrop_path);
            first.appendChild(second);
        }

        element.appendChild(first);
        /////////////////////////////////////////////////////////////////////////////////
        first = document.createElement("div");
        first.className = "rating";

        second = document.createElement("span");
        second.innerText = parseInt(results[i].vote_average * 10) + "%";
        first.appendChild(second);

        second = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        third = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        third.classList.add("progress-ring_circle");
        third.setAttribute("stroke-width", 3.5);
        third.setAttribute("fill", "#030303");
        third.setAttribute("r", 20);
        third.setAttribute("cx", 5);
        third.setAttribute("cy", 140);

        //Configuring the SVG circle (Rating circle)
        var radius = third.r.baseVal.value;
        var circumference = radius * 2 * Math.PI;

        third.style.strokeDasharray = circumference + " " + circumference;
        third.style.strokeDashoffset = circumference + "";

        const offset = circumference - (results[i].vote_average * 10) / 100 * circumference;
        third.style.strokeDashoffset = offset;

        if (results[i].vote_average >= 6.5) third.setAttribute("stroke", "hsl(120, 95%, 35%)");
        else if (results[i].vote_average >= 4) third.setAttribute("stroke", "hsl(45, 90%, 65%)");
        else third.setAttribute("stroke", "hsl(0, 95%, 60%)");


        second.appendChild(third);
        first.appendChild(second);
        element.appendChild(first);
        element.id = results[i].id;
        // console.log(element.id);
        divEl.appendChild(element);
    }
}

function MakePostersClickable(list, type) {
    var startX;
    for (const element of list) {
        element.addEventListener("mousedown", (e) => {
            startX = e.clientX;
        })
        element.addEventListener("click", (e) => {
            if (e.clientX == startX) {
                // console.log(type + "&" + element.id);    
                const pathname = location.pathname.split('/')[1];
                const repo = pathname === 'Knovies-Javascript-'? pathname + '/': '';
                location.href = `${location.origin}/${repo}Info.html?${type}&${element.id}`;
                // location.href = location.origin + "/Info.html?" + type + "&" + element.id;
                // console.log(location.origin + "/Info.html?" + type + "&" + element.id);
            }
        });
    }
}

// function f(q) {
//     return fetch(q)
//         .then(res => res.json()).then(data => data)
// }

// async function setApi() {
//     api = await f("http://api.openweathermap.org/data/2.5/weather?id=2172797&appid=57da0d9bdac1e96961310c4f44a302e0");
//     return api;
// }

// async function getTemp(object){
//     var a = await setApi();
//     object.placeholder = a.main.temp;
// }

// getTemp(searchbar);