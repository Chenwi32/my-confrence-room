// to create the functionality to show our own video
const socket = io("/");
const videoGrid = document.querySelector("#video_grid");
const myVideo = document.createElement("video");
myVideo.muted = false;

// Create a peer
var peer = new Peer(/* the first parameter is the id, but we will let peer generate it so we will */ undefined, {
  path: '/peerjs',
  host: '/',
  port: '3010'
});

// This variable will recieve the stream recieved from the navigator mediabelow
let myVideoStream;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    Audio: true,
  })
  .then((stream) => {
    try {
      myVideoStream = stream;
      addVideoStream(myVideo, stream);
    } catch (e) {
      console.error(e);
    }

    peer.on('call', call => {
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })

    // Here we need to then listen to the responds of user connected and then do something
    socket.on("user-connected", (userId) => {
      console.log("Catching user-connected event");
      connectToNewUser(userId, stream);
    });
  }).catch(e => {
    console.log('You Have To Connect You Webcam')
  })

peer.on('open', id => {
  console.log(id);
  // This will then show the person who joined the room in the frontend
socket.emit("join-room", ROOM_ID, id);
})




const connectToNewUser = (userId, stream) => {

  // We call the user that connects like this
  const call = peer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
};

const addVideoStream = (video, stream) => {
  if (!stream) {
    throw 'There Is No Camera Man!'
  }
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};
