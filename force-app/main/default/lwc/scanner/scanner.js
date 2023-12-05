import { LightningElement } from 'lwc';

export default class Scanner extends LightningElement {
    currentStream; currentDeviceID; cameraLoading = false;buttonDisabled = false;
    listViews = [];
    getCameraDevices() {
        let rowLocal = [];
        if ('mediaDevices' in navigator) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then((stream) => {
                    this.currentStream = stream;
                    const getCameraSelection = async () => {
                        const devices = await navigator.mediaDevices.enumerateDevices();
                        const videoDevices = devices.filter(device => device.kind === 'videoinput');
                        videoDevices.map(videoDevice => {
                            let valueList = {};
                            valueList.key = videoDevice.deviceId;
                            valueList.value = videoDevice.label;
                            rowLocal.push(valueList);
                        });
                        this.listViews = rowLocal;
                        //stopCamera();
                        if (this.listViews.length === 0) {
                            alert("Sorry, your device does not have a camera.");
                        } else{
                           // this.template.querySelector(".btnStartCamera").prop("disabled", true);
                           this.buttonDisabled = true;
                           this.currentDeviceID = this.listViews[0].key;
                           //this.startCamera();
                           this.startCameraStream(this.currentDeviceID);
                        }
                    };
                    getCameraSelection();
                })
                .catch(function (err) {
                    console.log("An error occurred: " + err);
                });
        } else {
            alert("Browser does not support mediaDevices API.");
        }
    }
    fetchCameraValue(event)
    {
        this.cameraLoading = false;
        this.currentDeviceID = event.target.value;
        this.startCameraStream(this.currentDeviceID);
    }

    startCameraStream(deviceID) {
        alert('scs'+deviceID);
        if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
            console.log('inside medica device 62');
            if (this.cameraLoading === true) return;
            this.cameraLoading = true;
            // build a constraint
            let constraints = {
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },

                    deviceId: {
                        exact: deviceID
                    }
                }
            };
            console.log('constraints-->'+JSON.stringify(constraints));
            // stop current stream if there is one
           // stopCamera();

            //this.setVideoAttr();
             var video = this.template.querySelector('.cameraDisplay');
            // console.log('video-->'+video);
            this.template.querySelector('.cameraDisplay').setAttribute('autoplay', '');
            this.template.querySelector('.cameraDisplay').setAttribute('muted', '');
            this.template.querySelector('.cameraDisplay').setAttribute('playsinline', '');
            // delay the stream for a bit to prevent browser bugging out when switching camera
            setTimeout( () => {
                alert('84:::'+this.template.querySelector('.cameraDisplay'));
                navigator.mediaDevices.getUserMedia(constraints).then( (mediastream) => {
                    console.log('inside 91');
                    this.currentStream = mediastream;
                    console.log('currentStream-->'+this.currentStream);
                    // show the camera stream inside our video element
                    video.srcObject = mediastream;
                    //this.cameraLoading = false;
                  //  this.template.querySelector('.btnCapture').prop("disabled", false);
                }).catch(function (err) {
                    //this.cameraLoading = false;
                    alert("Camera Error!"+err);
                });

            }, 100);
        }
    }
    setVideoAttr(){
        alert('99');
        this.template.querySelector('.cameraDisplay')[0].setAttribute('autoplay', '');
        this.template.querySelector('.cameraDisplay')[0].setAttribute('muted', '');
        this.template.querySelector('.cameraDisplay')[0].setAttribute('playsinline', '');
        alert('102');
    }

    captureImage() {
        alert('capture');
        // Copy the video frame to canvas
        let documentcanvas; 
        documentcanvas.width = this.template.querySelector('cameraDisplay')[0].videoWidth;
        documentcanvas.height = this.template.querySelector('cameraDisplay')[0].videoHeight;
        documentctx.drawImage(this.template.querySelector('cameraDisplay')[0], 0, 0, documentcanvas.width, documentcanvas.height, 0, 0, documentcanvas.width, documentcanvas.height);

        // convert canvas content to base64 image
        let imageBase64 = documentcanvas.toDataURL("image/jpeg");

        // send the base64 content to Core API
        // CoreAPIScan(imageBase64);
    }
}