class MainProcess {

    readonly dropZone1 = <HTMLDivElement>document.getElementById("drop-zone1");
    readonly videoFile2 = <HTMLInputElement>document.getElementById("videoFile2");

    readonly btnForward1 = <HTMLLabelElement>document.getElementById("btnForward1");

    readonly videoMgr1;

    private isButton1On: boolean = false;

    constructor() {
        // const seekBar1 = <HTMLInputElement>document.getElementById("seekBar1");
        const video1 = <HTMLVideoElement>document.getElementById("video1");
        const sPanCurrentTime1 = <HTMLSpanElement>document.getElementById("currentTime1");
        const nagasa1 = <HTMLSpanElement>document.getElementById("nagasa1");
        const message1 = <HTMLSpanElement>document.getElementById("kanryou1");

        this.videoMgr1 = new VideoControllerManager(video1, sPanCurrentTime1, message1, nagasa1);

        this.init();
    }

    private initButton2() {
        if (this.isButton2On) {
            return;
        }
        this.btnForward2.addEventListener("click", (e: Event) => {
            const interval = Number(this.interval2.value);
            this.videoMgr2.clickUpVolume(interval);
        });
        this.btnBack2.addEventListener("click", (e: Event) => {
            const interval = Number(this.interval2.value);
            this.videoMgr2.clickDownVolume(interval);
        });
    }

    private initButton1() {
        if (this.isButton1On) {
            return;
        }
        this.btnForward1.addEventListener("click", (e: Event) => {
            const interval = Number(this.interval1.value);
            this.videoMgr1.clickUpVolume(interval);
        });
        // this.btnForward1.removeEventListener("click", this.btnForward1Click);
        // this.btnForward1.addEventListener("click", this.btnForward1Click);
        this.btnBack1.addEventListener("click", (e: Event) => {
            const interval = Number(this.interval1.value);
            this.videoMgr1.clickDownVolume(interval);
        });
    }
    private init() {

        this.videoFile1.addEventListener("change", (e: Event) => {
            const fileList = this.videoFile1.files;
            this.updateVideo(fileList, this.videoMgr1);
            this.initButton1();
        });

        this.dropZone1.addEventListener("dragover", (e: Event) => {
            this.dropZoneOnDragover(e, this.dropZone1);
        }, false);

        this.dropZone1.addEventListener('dragleave', (e: Event) => {
            this.dropZoneOnDragLeave(this.dropZone1, e);
        }, false);

        this.dropZone1.addEventListener('drop', (e: DragEvent) => {
            this.dropZoneOnDrop(this.dropZone1, e, this.videoFile1, this.videoMgr1);
            this.initButton1();

        }, false);



        // 2個目
        this.videoFile2.addEventListener("change", (e: Event) => {
            const fileList = this.videoFile2.files;
            this.updateVideo(fileList, this.videoMgr2);

            this.initButton2();
        });

        this.dropZone2.addEventListener("dragover", (e: Event) => {
            this.dropZoneOnDragover(e, this.dropZone2);
        }, false);

        this.dropZone2.addEventListener('dragleave', (e: Event) => {
            this.dropZoneOnDragLeave(this.dropZone2, e);
        }, false);

        this.dropZone2.addEventListener('drop', (e: DragEvent) => {
            this.dropZoneOnDrop(this.dropZone2, e, this.videoFile2, this.videoMgr2);
            this.initButton2();

        }, false);

    }
    private dropZoneOnDragover(e: Event, dropZone: HTMLDivElement) {
        e.stopPropagation();
        e.preventDefault();
        dropZone.style.background = '#e1e7f0';
        console.info("dragover");
    }

    private dropZoneOnDragLeave(dropZone: HTMLDivElement, e: Event) {
        e.stopPropagation();
        e.preventDefault();

        dropZone.style.background = '#ffffff';
        console.info("dragleave");
    }

    private dropZoneOnDrop(dropZone: HTMLDivElement, e: DragEvent, videoFile: HTMLInputElement, videoMgr: VideoControllerManager) {
        e.stopPropagation();
        e.preventDefault();
        dropZone.style.background = '#ffffff'; //背景色を白に戻す
        const transData = e.dataTransfer; //ドロップしたファイルを取得
        const files = (transData == null) ? new FileList() : transData.files;
        if (files.length > 1) {
            alert('アップロードできるファイルは1つだけです。');
        } else {
            videoFile.files = files; //inputのvalueをドラッグしたファイルに置き換える。
            this.updateVideo(files, videoMgr);
            console.info("drop");
        }
    }

    private updateVideo(f: FileList | null, videoMgr: VideoControllerManager) {
        const files = (f == null) ? new FileList() : f;
        videoMgr.updateVideo(files[0]);
        console.info("change");
    }

    private forwardTime(video: HTMLVideoElement, interval: number, positionDom: HTMLSpanElement) {
        video.currentTime = video.currentTime + Number(interval);
        positionDom.innerHTML = video.currentTime.toString();

    }

    private backwardTime(viedo: HTMLVideoElement, interval: number, positionDom: HTMLSpanElement) {
        viedo.currentTime = viedo.currentTime - Number(interval);
        positionDom.innerHTML = viedo.currentTime.toString();

    }

}


class VideoControllerManager {
    readonly _video: HTMLVideoElement;
    // readonly _seekbar;
    readonly _sPanCurrentTime;
    readonly _spanMessage;
    readonly _nagasa;
    // readonly kanryou = ;

    constructor(video: HTMLVideoElement, sPanCurrentTime: HTMLSpanElement, spanMessage: HTMLSpanElement, nagasa: HTMLSpanElement) {
        this._video = video;
        // this._seekbar = seekBar;
        this._sPanCurrentTime = sPanCurrentTime;
        this._spanMessage = spanMessage;
        this._nagasa = nagasa;
        this.init();

    }
    private init() {
        // this._seekbar.value = "0";
        this._nagasa.innerHTML = "-";
        this._sPanCurrentTime.innerHTML = "-";
        // this._seekbar.min = "0";
        // this._seekbar.max = "0";
        // this._seekbar.step = "0";

        this._video.addEventListener("loadedmetadata", (e) => {
            // if (isNaN(this._video.duration)) {
            // this._seekbar.value = (current * 1000).toString();
            // }
            const duration = (isNaN(this._video.duration)) ? Math.round(this._video.duration) : 0;
            this._nagasa.innerHTML = (duration).toString();
            // this._seekbar.min = "0";
            // this._seekbar.max = (duration * 1000).toString();
            // this._seekbar.step = "1";
            // this._sPanCurrentTime.innerHTML = current.toString();
        })


        this._video.addEventListener("timeupdate", (e) => {
            const current = Math.floor(this._video.currentTime)
            const duration = Math.round(this._video.duration)
            this.updateCurrentTimeInfo(duration, current);
        })
    }
    private updateCurrentTimeInfo(duration: number, current: number) {
        // if (!isNaN(duration)) {
        //     this._seekbar.value = (current * 1000).toString();
        // }
        this._sPanCurrentTime.innerHTML = current.toString();
    }

    public playVideo() {
        //再生完了の表示をクリア
        this._spanMessage.innerHTML = "";
        //動画を再生
        this._video.play();
        //現在の再生位置（秒）を表示
        this._video.addEventListener("timeupdate", (e: Event) => {
            this._sPanCurrentTime.innerHTML = this._video.currentTime.toString();
        }, false);
        //再生完了を知らせる
        this._video.addEventListener("ended", (e: Event) => {
            this._spanMessage.innerHTML = "動画の再生が完了しました。";
        }, false);
    }
    public updateVideo(f: File) {
        // const files = (f == null) ? new FileList() : f;
        var movie_url = URL.createObjectURL(f);


        this._video.src = movie_url;
        //動画の長さ（秒）を表示
        this._video.load();

        this.playVideo();
    }

    public pauseVideo() {
        //動画を一時停止
        this._video.pause();
    }

    public clickUpVolume(interval: number) {
        this._forwardTime(this._video, interval, this._sPanCurrentTime);
    }
    public clickDownVolume(interval: number) {
        this._backwardTime(this._video, interval, this._sPanCurrentTime);
    }

    private _forwardTime(video: HTMLVideoElement, interval: number, positionDom: HTMLSpanElement) {
        video.currentTime = video.currentTime + Number(interval);
        positionDom.innerHTML = video.currentTime.toString();

    }

    private _backwardTime(viedo: HTMLVideoElement, interval: number, positionDom: HTMLSpanElement) {
        viedo.currentTime = viedo.currentTime - Number(interval);
        positionDom.innerHTML = viedo.currentTime.toString();

    }
}


// Mainクラスを実行する。
window.addEventListener("load", () => new MainProcess());

