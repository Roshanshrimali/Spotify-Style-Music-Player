console.log("Roshan Here");

let currentSong = new Audio();
let songs;
let currfolder;
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const minutesStr = (minutes < 10 ? "0" : "") + minutes;
  const secondsStr = (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
  return minutesStr + ":" + secondsStr;
}

async function getSongs(folder) {
  currfolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><img class="invert" src="/svg/music.svg" alt="Music">
      <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <div>Roshan</div>
      </div>
      <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="/svg/play.svg" alt="Play">
      </div></li>`;
  }

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  return songs
}
const playMusic = (track, pause = false) => {
  currentSong.src = `/${currfolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "/svg/Paused.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer")
  let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").splice(-1)[0];
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML = cardContainer.innerHTML + `                    <div data-folder="${folder}" class="card p-1 rounded">
      <div class="circular-box">
          <svg xmlns="http://www.w3.org/2000/svg" data-encore-id="icon" role="img" aria-hidden="true"
              viewBox="0 0 24 24" class="Svg-sc-ytk21e-0 bneLcE">
              <path
                  d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
              </path>
          </svg>
      </div>
      <img src="/songs/${folder}/cover.jpg" alt="">
      <h4 class="m-top">${response.title}</h4>
      <p class="m-top">${response.description}</p>
  </div>`
    }
  }
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0])
    });
  });
}

async function main() {
  await getSongs("songs/Lofi");
  playMusic(songs[0], true);

  displayAlbums();

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "/svg/Paused.svg";
    } else {
      currentSong.pause();
      play.src = "/svg/play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  previous.addEventListener("click", () => {
    console.log("Previous Click");
    let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  forward.addEventListener("click", () => {
    currentSong.pause();
    console.log("Forward Click");

    let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0]);
    if (index + 1 < songs.length - 1) {
      playMusic(songs[index + 1]);
    }
  });

    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
      console.log("Setting volume to", e.target.value, "/100");
      currentSong.volume = parseInt(e.target.value) / 100
      if (currentSong.volume >0){
        document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
      }
  
    })


    document.querySelector(".volume>img").addEventListener("click", e=>{
      if(e.target.src.includes("/svg/volume.svg")){
        e.target.src = e.target.src.replace( "/svg/volume.svg", "/svg/mute.svg")
        currentSong.volume = 0;
        document.querySelector(".volume").getElementsByTagName("input")[0].value = 0;
      }
      else{
        e.target.src = e.target.src.replace("/svg/mute.svg", "/svg/volume.svg")
        currentSong.volume = .10;
        document.querySelector(".volume").getElementsByTagName("input")[0].value = 10;
      }

    })

}

main();
