// to create the functionality to show our own video
const socket = io("/");
const videoGrid = document.querySelector("#video_grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

// Create a peer
var peer = new Peer(
  /* the first parameter is the id, but we will let peer generate it so we will */ undefined,
  {
    path: "/peerjs",
    host: "/",
    port: "443",
  }
);

// This variable will recieve the stream recieved from the navigator mediabelow
let myVideoStream;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    try {
      myVideoStream = stream;
      addVideoStream(myVideo, stream);
    } catch (e) {
      console.error(e);
    }

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    // Here we need to then listen to the responds of user connected and then do something
    socket.on("user-connected", (userId) => {
      console.log("Catching user-connected event");
      connectToNewUser(userId, stream);
    });
  })
  .catch((e) => {
    console.log("You Have To Connect You Webcam");
  });

peer.on("open", (id) => {
  console.log(id);
  // This will then show the person who joined the room in the frontend
  socket.emit("join-room", ROOM_ID, id);
});

const connectToNewUser = (userId, stream) => {
  // We call the user that connects like this
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  if (!stream) {
    throw "There Is No Camera Man!";
  }
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

/* Start of chat functionality */

let msg = $("#message");

/* this is for enter key press to send message */
$("html").keydown((e) => {
  if (
    e.which === 13 &&
    msg.val().length !== 0 /* 13 is the code for the enter key */
  ) {
    socket.emit("message", msg.val());
    msg.val("");
  }
});

$("#send").click(() => {
  if (msg.val().length !== 0) {
    socket.emit("message", msg.val());
    msg.val("");
  }
});

/* we want to recieve the message sent back from the server and show in the chats*/
socket.on("createMessage", (message) => {
  $("#messages_in").append(
    `<li class="message_in"><b>Sender</b><br>${message}</li>`
  );
  scrollToBottom();
});

/* to solve scroling issues in the chat */

const scrollToBottom = () => {
  let messageContainer = $("#messages");
  messageContainer.animate({
    scrollTop: messageContainer.prop("scrollHeight"),
  });
};

// Mute functionallity

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setUnmuteButton = () => {
  const html = `
  <i class="unmute fas fa-microphone-slash"></i>
               <span>Unmute</span>
  `;
  document.querySelector(".initial_mute_button").innerHTML = html;
};

const setMuteButton = () => {
  const html = `
  <i class=" fas fa-microphone"></i>
               <span>Mute</span>
  `;
  document.querySelector(".initial_mute_button").innerHTML = html;
};

const playStop = () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    setStopVideo();
  }
};

const setPlayVideo = () => {
  const html = `
  <i class='unmute fas fa-video-slash'></i>
<span>Stop Video</span>
  `
  document.querySelector(".main_video_button").innerHTML = html;
};

const setStopVideo = () => {
  const html = `
  <i class='fas fa-video'></i>
<span>Stop Video</span>
  `
  document.querySelector(".main_video_button").innerHTML = html;
};
