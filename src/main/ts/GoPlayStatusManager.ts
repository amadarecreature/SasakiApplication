import axios from 'axios';
import { GoStoneManager } from './GoStoneManager';

/**
 * 対局のデータ同期を管理
 */
export class GoPlayStatsuManager {

    private _apiUrl: string = "https://localhost:5001/api/GoGameRecord/api/GoGameRecord/";
    private key: string

    private _goStoneManager: GoStoneManager;
    constructor(goStoneManager: GoStoneManager, key: string, apiUrl: string) {
        this.key = key;
        this._apiUrl = apiUrl;
        this._goStoneManager = goStoneManager;
        // axios.defaults.baseURL = 'http://localhost:5001';
        // axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    }

    private async sleep(interval: number) {
        await new Promise(resolve => setTimeout(resolve, interval));
    }

    public update(value: string) {
        var args = {
            Key: this.key, Talken: "123456", Value: value,
            headers: { "Content-Type": "application/json" }
        }

        var rtn = "";
        axios.post(this._apiUrl + "update", args)
            .then(function (response) {
                console.log(response.data)
                rtn = response.data.value;
            })
            .catch(function (error) {
                console.log(error)
            })
            .then(function () {
                console.log("*** 終了 ***")
            })
        return rtn;

    }

    public get isLoop(): boolean {
        return this._isLoop;
    }

    public stopSync() {
        this._isLoop = false;
    }
    private _isLoop: boolean = false;



    public async startSync(interval: number) {
        if (this._isLoop) {
            console.log("syncLoop起動中");
            return;
        }
        this._isLoop = true;

        // 停止フラグが立つまでループ
        while (this._isLoop) {
            const now = performance.now();
            const kifu = await this.sync();
            this._goStoneManager.roadFromKifu(kifu);
            console.log("loop:" + kifu);
            await this.sleep(interval);
            const end = performance.now();
            console.log("loop_progress=" + (end - now));
        }
    }

    public async sync() {

        var args = {
            Key: this.key, Talken: "123456", Value: "",
            headers: { "Content-Type": "application/json" }
        }
        var rtn = "";
        await axios.post(this._apiUrl + "select", args)
            .then(function (response) {
                console.log("data:" + response.data)
                rtn = response.data.value;
            })
            .catch(function (error) {
                console.log(error)
            })
            .then(function () {
                console.log("syncEnd")
            })
        return Promise.resolve(rtn);

    }
}

