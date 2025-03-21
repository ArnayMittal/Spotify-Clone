let currentSong = new Audio();
let songs;
let currFolder;

async function getSongs(folder) {
    currFolder = folder ;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(as);
    songs = []
    for (let i = 0; i < as.length; i++) {
        const el = as[i];
        if (el.href.endsWith(".mp3")) {
            // console.log(el) ;
            songs.push(el.href.split(`/${folder}/`)[1]);
        }
    }

    let songUL = document.getElementsByClassName("songs")[0].getElementsByTagName("ul")[0];
    songUL.innerHTML = " ";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img src="img/music.svg" alt="MUSIC" class="invert">
                            <div class="songName">${song.replaceAll("%20", " ").replaceAll("320 Kbps.mp3", " ")}</div>
                            <img src="img/greenplay.svg" alt="PLAY" class="hi">
                        </li>`;
    }

    Array.from(document.querySelector(".songs").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".songName").innerHTML.trim());
            // console.log("arnay"+e.querySelector(".songName").innerHTML.trim());
        })

    })

    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track + "%20320%20Kbps.mp3";

    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track.split("320")[0]);
    document.querySelector(".songtime").innerHTML = "00:00";
}


async function displayAlbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let cardcontainer = document.querySelector(".cardcontainer");
    let anchors = div.getElementsByTagName("a") ;
    let array = Array.from(anchors) ;

    for(let i = 0 ; i < array.length ; i++)
    {
        const e = array[i] ;
        if(e.href.includes("/songs/")){
            console.log(e.href.split("/").slice(-2)[1]);
            let folder = e.href.split("/").slice(-2)[1] ;
            console.log(folder) ;
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();
            console.log(response);
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card"  >
                        <div class="play"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
                            <circle cx="12" cy="12" r="10" fill="limegreen"/> 
                            <polygon points="9,7 17,12 9,17" fill="black"/>
                        </svg>
                        </div>
                        <img src="songs/${folder}/cover.jpeg" style="height: 150px; border-radius: 10px;
    margin-bottom: 10px; object-fit: contain;" alt="Song">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`
        };
    }
    console.log(div);

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click" , async item=>{
            console.log(item.currentTarget.dataset.folder) ;
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0].replaceAll("%20", " ").replaceAll("320 Kbps.mp3", " ").trim());
        })
    })
    
}

async function main() {
    songs = await getSongs("songs/2");
    console.log(songs);
    playMusic(songs[0].replaceAll("%20", " ").replaceAll("320 Kbps.mp3", " ").trim(), true);
    
    displayAlbums() ;

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "img/play.svg";
        }

    })

    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) {
            return "00:00";
        }
        let minutes = Math.floor(seconds / 60);
        let secs = Math.trunc(seconds) % 60;

        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = ((currentSong.currentTime / currentSong.duration) * 100) + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let px = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = px + "%";
        currentSong.currentTime = (px * currentSong.duration) / 100;
    })

    document.querySelector(".add").addEventListener("click", e => {
        // console.log(e);
        document.querySelector(".left").style.left = "0";
    })

    document.querySelector(".close").addEventListener("click", e => {
        // console.log(e);
        document.querySelector(".left").style.left = "-250" + "%";
    })

    document.querySelector("#previous").addEventListener("click", e => {
        let m = currentSong.src;
        console.log(m.split(`${currFolder}/`)[1]);
        let index = songs.indexOf(m.split(`${currFolder}/`)[1]);
        if (index > 0) {
            playMusic(songs[index - 1].replaceAll("%20", " ").replaceAll("320 Kbps.mp3", " ").trim());
        }
    })

    document.querySelector("#next").addEventListener("click", e => {
        let m = currentSong.src;
        console.log(m) ;
        console.log(m.split(`${currFolder}/`)[1]);
        let index = songs.indexOf(m.split(`${currFolder}/`)[1]);
        console.log(index);
        if (index < songs.length - 1) {
            playMusic(songs[index + 1].replaceAll("%20", " ").replaceAll("320 Kbps.mp3", " ").trim());
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {
        currentSong.volume = parseInt(e.target.value)/100;
    })

    document.querySelector(".volume>img").addEventListener("click" , e=>{
        if(e.target.src.includes("img/volume.svg"))
        {
            currentSong.volume = 0 ;
            e.target.src = e.target.src.replace("img/volume.svg" , "img/volumeoff.svg")  ;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;

        }
        else
        {
            currentSong.volume = 0.1 ;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
            e.target.src = e.target.src.replace("img/volumeoff.svg", "img/volume.svg")  ;
        }
    })

    

}

main()

