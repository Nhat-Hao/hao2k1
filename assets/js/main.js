const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// const Player_Store_Key = "Store"

const player = $(".musicplayer");
// const cd = $(".cd")
const heading = $(".musicplayer__items-title h5");
const cdThumb = $(".musicplayer__items-img img");
const audio = $("audio");
const singer = $(".musicplayer__items-title p");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist__lists");
// const option = $(".option")
const progressduration = $(".progress__duration");
const progresscurrent = $(".progress__current");
// audio.volume = 1;

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: {},
  // (1/2) line below to use localStorage
  // config: JSON.parse(localStorage.getItem(Play_Store_Key)) || {} ,
  setConfig: function (key, value) {
    this.config[key] = value;
    // (2/2) Uncomment the line below to use localStorage
    // localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      name: "Arcadia",
      singer: "TheFatRat",
      path: "./assets/music/Arcadia.mp3",
      image: "./assets/images/music/TheFatRat.jpg",
    },
    {
      name: "August",
      singer: "Intelligency",
      path: "./assets/music/August.mp3",
      image: "./assets/images/music/Augusst.jfif",
    },
    {
      name: "Baby One More Time",
      singer: "The Marías",
      path: "./assets/music/BabyOneMoreTime_1.mp3",
      image: "./assets/images/music/TheMarias.jpg",
    },
    {
      name: "Dynasty",
      singer: "MIIA",
      path: "./assets/music/Dynasty.mp3",
      image: "./assets/images/music/Miia.jpg",
    },
    {
      name: "Impossible",
      singer: "I Am King",
      path: "./assets/music/Impossible.mp3",
      image: "./assets/images/music/Poosible.jpg",
    },
    {
      name: "Leave",
      singer: "Eric Lam",
      path: "./assets/music/Leave.mp3",
      image: "./assets/images/music/EricLam.jpg",
    },
    {
      name: "Maps",
      singer: "Maroon 5",
      path: "./assets/music/Maps.mp3",
      image: "./assets/images/music/Maps.jpg",
    },
    {
      name: "Never Go Away",
      singer: "C-Bool",
      path: "./assets/music/NeverGoAway.mp3",
      image: "./assets/images/music/NeverGoAway.jpg",
    },
    {
      name: "UM PEDIDO",
      singer: "Hungria Hip Hop",
      path: "./assets/music/UMPEDIDO.mp3",
      image: "./assets/images/music/HungriaHipHop.jpg",
    },
    {
      name: "Waiting For Love",
      singer: "Aviicii",
      path: "./assets/music/WaitingForLove.mp3",
      image: "./assets/images/music/WaittingForLove.jpg",
    },
    {
      name: "What Are Words",
      singer: "Chris Medina",
      path: "./assets/music/WhatAreWords.mp3",
      image: "./assets/images/music/WhatAreWorld.jpg",
    },

    // {
    //   name: '',
    //   singer: '',
    //   path: './',
    //   image: './',
    // },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="playlist__lists-music ${
          index === this.currentIndex ? "active" : ""
        }" data-index="${index}">
          <div class="playlist__music-item">
              <img src="${song.image}" alt="">
              <div class="playlist__music-title">
                  <p class="strong">${song.name}</p>
                  <a href="">${song.singer}</a>
              </div>
          </div>
          <div class="playlist__music-icon">
              <span>
                  <i class="ti-heart"></i>
              </span>
              <span>
                  <i class="ti-more-alt"></i>
              </span>
          </div>
      </div>
      `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    //const cdWidth = cd.offsetWidth
    // //xử lý CD quay
    const cdThumAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumAnimate.pause();
    //xử lý phóng to / thu nhỏ  CD
    // document.onscroll = function () {
    //   const scrollTop = window.scrollY || document.documentElement.scrollTop
    //   const newCdWidth = cdWidth - scrollTop

    //   cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0
    //   cd.style.opacity = newCdWidth / cdWidth
    // }
    //xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    //xử lý khi bài hát được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumAnimate.play();
    };
    //xử lý khi bài hát bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
      _this.timeCurrent();
      _this.timeDuration();
    };

    // Xử lý khi tua song
    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };
    //xử lý khi next bài hát
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    //xử lý khi prev bài hát
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    //xử lý khi bật/tắt random bài hát
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };
    //xử lý khi lặp lại một bài hát
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isReapt);
    };
    //xử lý next bài hát khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    // lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".playlist__lists-music:not(.active)");

      if (songNode || e.target.closest(".option")) {
        //xử lý khi click vào bài hát
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
        //xử lý khi click vào option bài hát
        // if (e.target.closest(".option")) {
        //   //chưa code
        //   document.querySelector(".option").addEventListener("click", function () {
        //     document.querySelector(".option").style.display = "block"
        //   })
        // }
      }
    };
  },
  //   scrollToActiveSong: function () {
  //     setTimeout(() => {
  //       if (this.currentIndex <= 2) {
  //         $('.song.active').scrollIntoView({
  //           behavior: 'smooth',
  //           block: 'end',
  //         });
  //       } else {
  //         $('.song.active').scrollIntoView({
  //           behavior: 'smooth',
  //           block: 'center',
  //         });
  //       }
  //     }, 300)
  //   },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    singer.textContent = this.currentSong.singer;
    cdThumb.src = `${this.currentSong.image}`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    //   this.isRandom = this.config.isRandom
    this.isReapet = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  formatTime: function (sec_num) {
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - hours * 3600) / 60);
    let seconds = Math.floor(sec_num - hours * 3600 - minutes * 60);

    hours = hours < 10 ? (hours > 0 ? "0" + hours : 0) : hours;

    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return (hours !== 0 ? hours + ":" : "") + minutes + ":" + seconds;
  },
  // hiển thị thời gian bài hát hiện tại
  timeCurrent: function () {
    setInterval(() => {
      let cur = this.formatTime(audio.currentTime);
      progresscurrent.textContent = `${cur}`;
    }, 100);
  },
  //hiển thị thời gian bài hát
  timeDuration: function () {
    if (audio.duration) {
      let dur = this.formatTime(audio.duration);
      progressduration.textContent = `${dur}`;
    }
  },
  start: function () {
    //gán cấu hình từ config vào ứng dụng
    this.loadConfig();
    this.defineProperties();
    this.handleEvents();
    this.loadCurrentSong();
    // render playlist
    this.render();
    // hiển thị trạng thái ban đầu của button repeat và random
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();

/*const dragArea = document.querySelector(".song");
new Sortable(dragArea, {
  animation: 350
});*/
