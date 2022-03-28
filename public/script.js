// to create the functionality to show our own video

const videoGrid = document.querySelector("#video_grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

// This variable will recieve the stream recieved from the navigator mediabelow
let myVideoStream;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    Audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
  });

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};
