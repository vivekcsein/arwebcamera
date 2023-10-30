
//element
const container = document.getElementsByClassName('container')[0];
const container_video = document.getElementsByClassName('container_video')[0];
const container_world = document.getElementsByClassName('container_world')[0];

//canvas
const video = document.getElementById('camera_video');
const canvas_camera = document.getElementById('camera_canvas');
const canvas_world = document.getElementById('world_canvas');

//Btn
const snapBtn = document.getElementById('snapBtn');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');
const downloadBtn = document.getElementById('downloadBtn');
const editBtn = document.getElementById('editBtn');
const inputField = document.getElementById('inputField');

const worldImg = document.createElement("IMG");
worldImg.src = "./images/framebg.png";
const borderImg = document.createElement("IMG");
borderImg.src = "./images/border.png";
const size = 1024;
canvas_world.width = size;
canvas_world.height = size;
canvas_camera.width = size;
canvas_camera.height = size;


// worldImg.addEventListener("load", () => {
//     canvas_world.getContext('2d').drawImage(worldImg, -0, 0, size, size);
// });

// borderImg.addEventListener("load", (e) => {
//     canvas_world.getContext('2d').drawImage(borderImg, 185, 112, size * 0.25, size * 0.28);
// });

let videoStream; let imageClicked = false; let inputValue = "";
let imgDataURL, localImglink;

const constraints = {
    audio: false,
    video: {
        // width: 1280,
        // height: 720,
        aspectRatio: 1,
        facingMode: 'user'
    }
}

const cameraOpen = async () => {
    try {
        if (videoStream != false) {
            videoStream = await navigator.mediaDevices.getUserMedia(constraints);
            handlesucess(videoStream);
            console.log("camera started");
        } else {
            alert("Camera already in use!");
        }
    }
    catch (error) {
        handleError(error);
    }
}

const cameraStop = async () => {
    if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
        videoStream = false;
        console.log("camera stopped");
    }
    video.srcObject = null;
}

const handlesucess = (stream) => {
    window.stream = stream;
    video.srcObject = stream;
}
const handleError = (error) => {
    console.log(error);
}

const validateInput = () => {

    inputField.addEventListener('keyup', function (event) {
        event.preventDefault();
        let inputString = inputField.value;
        let alphaNumericRegex = /[^a-zA-Z]/g;
        if (inputString.length < 30) {
            if (alphaNumericRegex.test(inputString)) {
                inputString = inputString.replace(alphaNumericRegex, '');
                inputField.value = inputString;
            }
        } else {
            inputField.value = inputField.value.slice(0, 30);
            inputField.setCustomValidity("Name should be less than or equal to 30 characters.");
        }
    });
}

const onSnap = (e) => {
    e.preventDefault();
    if (videoStream) {
        imageClicked = true;
        canvas_camera.getContext('2d').drawImage(video, 0, 0, size, size);
        canvas_world.getContext('2d').drawImage(video, 185, 112, size * 0.25, size * 0.28);
        canvas_world.getContext('2d').drawImage(worldImg, -0, 0, size, size);

        // uncomment to add borderImg
        // canvas_camera.getContext('2d').drawImage(borderImg, 0, 0, size, size);
        // canvas_world.getContext('2d').drawImage(borderImg, 185, 112, size * 0.25, size * 0.28);
        // borderImg.style.display = "none";

        canvas_camera.style.display = "block";
        video.style.display = "none";
        cameraStop();
    }
}

const onCancelBtn = (e) => {
    e.preventDefault();
    if (!videoStream) {
        videoStream = true;
        cameraOpen();
        canvas_camera.style.display = "none";
        video.style.display = "block";
        imageClicked = false;
    }
}

const onSaveBtn = (e) => {
    console.log("saved");
    e.preventDefault();
    if (imageClicked) {
        imgDataURL = canvas_camera.toDataURL("image/png");
        localImglink = document.createElement("a");
        localImglink.href = imgDataURL;
        if (inputField.value != "") {
            localImglink.download = `${inputField.value}.png`;
        } else {
            localImglink.download = 'image.png';
        }
        localImglink.target = "_blank";
        localImglink.click();

    } else {
        alert("Please take a photo first!");
    }
};

const onEditBtn = (e) => {
    e.preventDefault();
    init();
}

const onDownloadBtn = (e) => {
    e.preventDefault();
    console.log("image downloading");
    if (videoStream && container_world.style.display == "block") {
        console.log("downloading your image");
        videoStream = true;
        downloadWorldImage();
    }
    else if (!videoStream) {

        container_video.style.display = "none";
        container_world.style.display = "block";
        if (inputField.value.length < 7) {
            canvas_world.getContext("2d").font = "80px myGoodFont";
        }
        else if (inputField.value.length < 10) {
            canvas_world.getContext("2d").font = "60px myGoodFont";
        }
        else if (inputField.value.length < 20) {
            canvas_world.getContext("2d").font = "48px myGoodFont";
        }
        else if (inputField.value.length < 30) {
            canvas_world.getContext("2d").font = "24px myGoodFont";
        }
        if (inputField.value != "") {
            canvas_world.getContext("2d").fillText(`${inputField.value}`, 510, 250);
        } else {
            canvas_world.getContext("2d").fillText(`Name`, 510, 250);
        }
        videoStream = true;
    }
}

const downloadWorldImage = () => {
    imgDataURL = canvas_world.toDataURL("image/png");
    localImglink = document.createElement("a");
    localImglink.href = imgDataURL;
    if (inputField.value != "") {
        localImglink.download = `${inputField.value}.png`;
    } else {
        localImglink.download = 'image.png';
    }
    localImglink.target = "_blank";
    localImglink.click();
}

const init = () => {
    container_video.style.display = "block";
    container_world.style.display = "none";
    video.style.display = "block";
    canvas_camera.style.display = "none";
    canvas_camera.getContext('2d').clearRect(0, 0, size, size);
    canvas_world.getContext('2d').clearRect(0, 0, size, size);

    if (container_video.style.display == 'block') {
        validateInput();
        cameraOpen();
        snapBtn.addEventListener('click', onSnap);
        cancelBtn.addEventListener('click', onCancelBtn);
        saveBtn.addEventListener('click', onSaveBtn);
        editBtn.addEventListener('click', onEditBtn);
        downloadBtn.addEventListener('click', onDownloadBtn);
    }
}
init();