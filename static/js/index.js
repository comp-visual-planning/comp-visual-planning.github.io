window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function () { return false; };
  image.oncontextmenu = function () { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function () {
  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function () {
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");

  });

  //// remove useless code of initializing the bulma carousel.
  // var options = {
  // 	slidesToScroll: 1,
  // 	slidesToShow: 3.3,
  // 	loop: true,
  // 	infinite: true,
  // 	autoplay: false,
  // 	autoplaySpeed: 3000,
  // }




})


// switch video in multiple morphology
function update_rm2d_comp_multiH() {
  var num_comp = document.getElementById("rm2d-comp-multi-h-1").value;
  // var inst = document.getElementById("single-menu-instances-single-task-real").value;
  // console.log("gpt", task, inst)

  var predv_video = document.getElementById("lb_qual_nVidEp_predv");
  var r_video = document.getElementById("lb_qual_nVidEp_rollout");

  // r_video.src = "materials/lb-suc-vs-numRollout/rollout_tk71_envSd120_fps60_r" + num_rollouts + ".mp4";
  if (num_comp == 8) {
    r_video.src = "materials/pntM-giant-diff-ncomp/ours_tk1_ncp8_sd75_pIdx0_250205-131131.mp4";
  }
  else if (num_comp == 9) {
    r_video.src = "materials/pntM-giant-diff-ncomp/ours_tk1_ncp9_sd79_pIdx0_250205-123431.mp4";
  }
  else if (num_comp == 10) {
    r_video.src = "materials/pntM-giant-diff-ncomp/ours_tk1_ncp10_sd79_pIdx0_250205-182941.mp4";
  }
  else if (num_comp == 11) {
    r_video.src = "materials/pntM-giant-diff-ncomp/ours_tk1_ncp11_sd47_pIdx0_250205-171732.mp4";
  }

  // video.playbackRate = 2.0;
  r_video.play();
  // playVideosSequentially([predv_video, r_video])

}


// Function for the Calvin qualitative dropdown list
function update_cal_our_qual_list() {
  var tk_name = document.getElementById("cal-our-qual-list").value;

  predv_path = "materials/calvin/ours-turn-on-lightbulb/predv_0_tk1_turn_on_lightbulb_envSd105_fps4.mp4"
  r_path = "materials/calvin/ours-turn-on-lightbulb/rollout_tk1_turn_on_lightbulb_envSd105_fps70.mp4"
  if (tk_name == 'lightbulb') {

  } else if (tk_name == 'led') {
    predv_path = "materials/calvin/ours-turn-on-led/predv_0_tk2_turn_on_led_envSd101_fps4.mp4"
    r_path = "materials/calvin/ours-turn-on-led/rollout_tk2_turn_on_led_envSd101_fps70.mp4"
  }
  else if (tk_name == 'slider') {
    predv_path = "materials/calvin/ours-slide-left/predv_0_tk0_move_slider_left_envSd101_fps4.mp4"
    r_path = "materials/calvin/ours-slide-left/rollout_tk0_move_slider_left_envSd101_fps70.mp4"
  }
  else if (tk_name == 'drawer') {
    predv_path = "materials/calvin/ours-open-drawer/predv_0_tk3_open_drawer_envSd101_fps4.mp4"
    r_path = "materials/calvin/ours-open-drawer/rollout_tk3_open_drawer_envSd101_fps70.mp4"
  }
  r_video = document.getElementById("cal-our-qual-list-rollout");
  r_video.src = r_path
  predv_video = document.getElementById("cal-our-qual-list-predv");
  predv_video.src = predv_path

  predv_video.currentTime = 0;
  r_video.currentTime = 0;
  predv_video.pause();
  r_video.pause();

  // r_video.play();
  // predv_video.play();
  playVideosSequentially([predv_video, r_video])

}


// Function for the Calvin qualitative dropdown list
function update_antmaze_high_dim_agv_qual_list() {
  var tk_name = document.getElementById("antmaze_high_dim_list").value;

  predv_path = ""
  r_path = ""
  if (tk_name == 'antmaze_15d_large_tk1') {
    img_path = "materials/vis_web_agv/antmaze-large-stitch-v0/ours_tk1_ncp5_sd85_back_luo_v3_250205-231630.png"
    predv_path = "materials/vis_web_agv/antmaze-large-stitch-v0/ours_tk1_ncp5_sd85_back_luo_v3_250205-231630.mp4"
  } else if (tk_name == 'antmaze_29d_large_tk1') {
    img_path = "materials/vis_web_agv/antmaze-large-stitch-v0/ours_o29d_tk1_ncp5_sd73_back_luo_v3_250206-002406.png"
    predv_path = "materials/vis_web_agv/antmaze-large-stitch-v0/ours_o29d_tk1_ncp5_sd73_back_luo_v3_250206-002406.mp4"
  }
  else if (tk_name == 'antmaze_15d_medium_tk1') {
    img_path = "materials/vis_web_agv/antmaze-medium-stitch-v0/ours_o15d_tk1_ncp3_sd41_back_luo_v3_250206-115850.png"
    predv_path = "materials/vis_web_agv/antmaze-medium-stitch-v0/ours_o15d_tk1_ncp3_sd41_back_luo_v3_250206-115850.mp4"
  }
  else if (tk_name == 'antmaze_29d_medium_tk1') {
    img_path = "materials/vis_web_agv/antmaze-medium-stitch-v0/ours_o29d_tk1_ncp3_sd25_back_luo_v3_250206-014340.png"
    predv_path = "materials/vis_web_agv/antmaze-medium-stitch-v0/ours_o29d_tk1_ncp3_sd25_back_luo_v3_250206-014340.mp4"
  }

  img_td = document.getElementById("antmaze_high_dim_topdown");
  img_td.src = img_path

  predv_video = document.getElementById("antmaze_high_dim_agv_video");
  predv_video.src = predv_path

  predv_video.currentTime = 0;
  predv_video.pause();
  predv_video.play();

}


function _seqOrder(vs) {
  const rank = v =>
    /(-sv-|predv)/.test(v.id) ? 0 :
      /(-pr-|rollout)/.test(v.id) ? 1 : 2;
  return Array.from(vs).sort((a, b) => rank(a) - rank(b));
}

function _whenMetadata(v) {
  return new Promise((res) => {
    if (v.readyState >= 1 && Number.isFinite(v.duration)) return res();
    v.addEventListener('loadedmetadata', () => res(), { once: true });
  });
}

function _reset(vs) {
  vs.forEach(v => {
    try {
      v.loop = false;
      v.autoplay = false;
      v.muted = true;
      v.pause();
      v.currentTime = 0;
      if (v.src) v.load();
    } catch (_) { }
  });
}

const _restartTimers = new Map();
const _playAbort = new Map();

function restartSVPR(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;


  const prev = _playAbort.get(containerId);
  if (prev) prev.abort();


  const slide = el.closest('.splide__slide') || el;
  const allInSlide = slide.querySelectorAll('video');
  allInSlide.forEach(v => { try { v.pause(); v.currentTime = 0; } catch (_) { } });


  const controller = new AbortController();
  _playAbort.set(containerId, controller);


  clearTimeout(_restartTimers.get(containerId));
  _restartTimers.set(containerId, setTimeout(async () => {

    const vids = Array.from(el.querySelectorAll('video'));
    _reset(vids);
    await Promise.race([
      Promise.all(vids.map(_whenMetadata)),
      new Promise(res => controller.signal.addEventListener('abort', res, { once: true }))
    ]);
    if (controller.signal.aborted) return;

    await playSVThenPRInDiv(el, controller.signal);
  }, 0));
}

async function _playGroupParallel(vs, signal) {
  if (!vs || vs.length === 0) return;


  await Promise.race([
    Promise.all(vs.map(_whenMetadata)),
    signal ? new Promise(res => signal.addEventListener('abort', res, { once: true })) : Promise.resolve()
  ]);
  if (signal?.aborted) return;

  const maxDur = Math.max(...vs.map(v => Number.isFinite(v.duration) ? v.duration : 0)) || 8;

  const endedAll = Promise.all(
    vs.map(v => new Promise(res => v.addEventListener('ended', res, { once: true })))
  );


  vs.forEach(v => { try { v.play().catch(() => { }); } catch (_) { } });


  await Promise.race([
    endedAll,
    new Promise(res => setTimeout(res, Math.ceil(maxDur * 1000 + 300))),
    signal ? new Promise(res => signal.addEventListener('abort', res, { once: true })) : Promise.resolve()
  ]);


  if (signal?.aborted) {
    vs.forEach(v => { try { v.pause(); v.currentTime = 0; } catch (_) { } });
  }
}

async function playSVThenPRInDiv(div, signal) {
  const vids = Array.from(div.querySelectorAll('video'));
  const sv = vids.filter(v => /(-sv-|predv)/.test(v.id));
  const pr = vids.filter(v => /(-pr-|rollout)/.test(v.id));

  _reset(vids);
  await _playGroupParallel(sv, signal);
  if (signal?.aborted) return;
  await _playGroupParallel(pr, signal);
}


async function playVideosSequentially(listOrNodeList) {
  const vids = _seqOrder(listOrNodeList);
  if (vids.length === 0) return;
  _reset(vids);

  for (const v of vids) {
    await _whenMetadata(v);
    try { await v.play(); } catch (_) { }
    await new Promise(res => v.addEventListener('ended', res, { once: true }));
  }
}


// function playVideosSequentially(videoList) {
//   // const videoPlayer = document.getElementById('videoPlayer');
//   let currentVideoIndex = 0;

//   // Function to play the next video
//   function playNextVideo() {
//     if (currentVideoIndex < videoList.length) {
//       videoList[currentVideoIndex].play();
//       currentVideoIndex++;
//     } else {
//       // All videos have been played
//       console.log('All videos have been played.');
//       // Optionally, remove the event listener if no longer needed
//       // videoPlayer.removeEventListener('ended', playNextVideo);
//     }
//   }

//   // Event listener for when the current video ends
//   videoPlayer.addEventListener('ended', playNextVideo);

//   // Start playing the first video
//   playNextVideo();
// }


// ===========================
// Nov 5
// ===========================

// document.addEventListener('DOMContentLoaded', () => {
//   // Select all replay buttons
//   const replayButtons = document.querySelectorAll('.replay-button');

//   // Attach click event listeners to each button
//   replayButtons.forEach(button => {
//     button.addEventListener('click', () => {
//       const sectionId = button.getAttribute('data-section');
//       replayVideosInDiv(sectionId);
//     });
//   });
// });

// document.addEventListener('DOMContentLoaded', () => {
//   // Select all replay buttons
//   // const replayButtons = document.querySelectorAll('.replay');
//   // const replayButtons = document.querySelectorAll('.replay, .replay_lb_suc');
//   replayButtons = document.querySelectorAll('.replay, .replay_lb_suc, .replay_v2',);
//   // replayButtons = document.querySelectorAll('.replay_lb_suc');

//   rm_id = 'btn_cal_replay'
//   replayButtons = Array.from(replayButtons).filter(button => button.id !== rm_id);

//   // replayButtons.concat(replayButtons_2)
//   // const array1 = Array.from(replayButtons);
//   // const array2 = Array.from(replayButtons_2);
//   // Concatenate the arrays
//   // replayButtons = array1.concat(array2);
//   console.log('replayButtons', replayButtons)

//   // Attach click event listeners to each button
//   replayButtons.forEach(button => {
//     button.addEventListener('click', () => {
//       const sectionId = button.getAttribute('video_section');
//       replayVideosInDiv(sectionId, 'parallel');
//     });
//   });

//   btn_2 = document.getElementById('btn_cal_replay');
//   // btn_2.removeEventListener('click');
//   console.log(`btn_2: ${btn_2}`)

//   btn_2.addEventListener('click', () => {
//     const sectionId = btn_2.getAttribute('video_section');
//     replayVideosInDiv(sectionId, 'seq');
//   });

//   // replayButtons_2
//   // replayButtons_2.forEach(button => {
//   //   btn_2.removeEventListener('click');
//   //   // button.addEventListener('click', () => {
//   //   //   const sectionId = button.getAttribute('video_section');
//   //   //   replayVideosInDiv(sectionId, 'seq');
//   //   // });
//   // });

// });
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.replay, .replay_lb_suc, .replay_v2, #btn_cal_replay');
  if (!btn) return;

  const sectionId = btn.getAttribute('video_section');
  if (!sectionId) {
    console.warn('Replay button missing video_section attribute:', btn);
    return;
  }

  const mode = btn.id === 'btn_cal_replay' ? 'seq' : 'parallel';
  replayVideosInDiv(sectionId, mode);
});

/**
 * Replays all video elements within a specified div.
 * @param {string} divId - The ID of the div containing the videos to replay.
 */
function replayVideosInDiv(divId, replay_type) {
  const div = document.getElementById(divId);
  console.log(`divId: ${divId}, ${div} `);
  if (!div) {
    console.warn(`Div with ID '${divId}' not found.`);
    return;
  }

  const videos = div.querySelectorAll('video');
  console.log(`video elements found within div '${divId}': ${videos.length}.`);
  if (videos.length === 0) {
    console.warn(`No video elements found within div '${divId}'.`);
    return;
  }

  const hasSV = Array.from(videos).some(v => /(-sv-|predv)/.test(v.id));
  const hasPR = Array.from(videos).some(v => /(-pr-|rollout)/.test(v.id));
  if (hasSV || hasPR) {
    restartSVPR(divId);
    return;
  }

  if (replay_type === 'parallel') {
    videos.forEach(video => {
      video.pause();
      video.currentTime = 0;
      video.play();
    });
  } else if (replay_type === 'seq') {
    playVideosSequentially(videos);
  } else {
    console.error("Not Implemented.");
  }

  console.log(`${divId}: ${videos[0].currentSrc}, ${videos[0].currentTime}.`);
}


function setupSVThenPROnView(containerId, threshold = 0.75) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const obs = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) {
      restartSVPR(containerId);
    }
  }, { threshold });
  obs.observe(el);
}

// sequentially play the video
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the sequential video playback
  setupSequentialVideos({
    containerId: 'div_cal_our_qual',
    videoIds: ['cal-our-qual-list-predv', 'cal-our-qual-list-rollout'],
    threshold: 0.99, // The fraction of the container that must be visible to trigger playback
    unmuteOnInteraction: true, // Unmute videos after user interaction (click)
  });

  setupSequentialVideos({
    containerId: 'div_lb_qual_rout',
    videoIds: ['lb_qual_nVidEp_predv', 'lb_qual_nVidEp_rollout'],
    threshold: 0.99, // The fraction of the container that must be visible to trigger playback
    unmuteOnInteraction: true, // Unmute videos after user interaction (click)
  });

});



/**
 * Sets up videos to play sequentially when their container scrolls into view.
 *
 * @param {Object} options - Configuration options.
 * @param {string} options.containerId - The ID of the video container element.
 * @param {string[]} options.videoIds - An array of video element IDs in the order they should play.
 * @param {number} [options.threshold=0.5] - Visibility threshold (0 to 1) to trigger playback.
 * @param {boolean} [options.unmuteOnInteraction=false] - Whether to unmute videos after user interaction.
 */
function setupSequentialVideos(options) {
  const {
    containerId,
    videoIds,
    threshold = 0.5,
    unmuteOnInteraction = false,
  } = options;

  const videoContainer = document.getElementById(containerId);
  if (!videoContainer) {
    console.error(`Container with ID "${containerId}" not found.`);
    return;
  }

  const videos = videoIds.map(id => {
    const video = document.getElementById(id);
    if (!video) {
      console.error(`Video element with ID "${id}" not found.`);
    }
    return video;
  }).filter(video => video !== undefined);

  if (videos.length === 0) {
    console.error('No valid video elements found.');
    return;
  }

  let videosPlayed = false;

  /**
   * Plays the videos sequentially.
   */
  function playVideosSequentially() {
    if (videosPlayed) return;
    videosPlayed = true;

    let currentIndex = 0;

    /**
     * Plays the next video in the sequence.
     */
    function playNextVideo() {
      if (currentIndex >= videos.length) {
        // All videos have been played
        return;
      }
      const currentVideo = videos[currentIndex];
      currentVideo.play();

      currentVideo.addEventListener('ended', function onVideoEnded() {
        currentVideo.removeEventListener('ended', onVideoEnded);
        currentIndex++;
        playNextVideo();
      });
    }

    playNextVideo();
  }

  // Set up Intersection Observer to detect when the container is in view
  const observerOptions = {
    root: null,
    threshold: threshold,
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        playVideosSequentially();
        observerInstance.disconnect(); // Stop observing after playback starts
      }
    });
  }, observerOptions);

  // observer.observe(videoContainer);
  observer.observe(videos[0]); // Nov 7 Luo


  // Optional: Unmute videos after user interaction
  if (unmuteOnInteraction) {
    function unmuteVideos() {
      videos.forEach(video => {
        video.muted = false;
      });
      document.removeEventListener('click', unmuteVideos);
    }
    document.addEventListener('click', unmuteVideos);
  }
}
