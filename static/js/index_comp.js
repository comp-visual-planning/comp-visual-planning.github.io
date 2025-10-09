

// Function for the Calvin qualitative dropdown list
function update_antmaze_explore_qual_list() {
  var tk_name = document.getElementById("antm-explore-qual-list").value;

  antm_me_demo_path = "materials/antmaze-explore/antmaze-medium-explore-v0-r800-250206-223951.mp4"
  antm_lg_demo_path = "materials/antmaze-explore/antmaze-large-explore-v0-r800-250206-232925.mp4"


  demo_path = ""
  r_path = ""

  if (tk_name == 'antm_medium_exp_2d') {
    demo_path = antm_me_demo_path
    r_path = "materials/antmaze-explore/antm-medium-2d/ep10_True.mp4"

  } else if (tk_name == 'antm_medium_exp_15d') {
    demo_path = antm_me_demo_path
    r_path = "materials/antmaze-explore/antm-medium-15d/ep19_True.mp4"
  }
  else if (tk_name == 'antm_medium_exp_29d') {
    demo_path = antm_me_demo_path
    r_path = "materials/antmaze-explore/antm-medium-29d/ep8_True.mp4"
  }
  // Large
  else if (tk_name == 'antm_large_exp_2d') {
    demo_path = antm_lg_demo_path
    r_path = "materials/antmaze-explore/antm-large-2d/0-good/ep9_True.mp4"
  }
  else if (tk_name == 'antm_large_exp_15d') {
    demo_path = antm_lg_demo_path
    r_path = "materials/antmaze-explore/antm-large-15d/ep6_True.mp4"
  }
  else if (tk_name == 'antm_large_exp_29d') {
    demo_path = antm_lg_demo_path
    r_path = "materials/antmaze-explore/antm-large-29d/0-good/ep0_True.mp4"
  }
  

  ////

  demo_video = document.getElementById("antmaze_exp_qual_list_dset");
  demo_video.src = demo_path

  r_video = document.getElementById("antmaze_exp_qual_list_rollout");
  r_video.src = r_path

  demo_video.currentTime = 0;
  r_video.currentTime = 0;
  demo_video.pause();
  r_video.pause();

  r_video.play();
  demo_video.play();
  
  // playVideosSequentially([predv_video, r_video])

}



