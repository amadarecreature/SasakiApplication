import axios from 'axios';
import { GoStoneManager } from './GoStoneManager';

/**
 * 対局のデータ同期を管理
 */
export class GoPlayStatsuManager {

    private apiUrl: string = "https://localhost:5001/api/GoGameRecord/";
    private key: string
    private playRecord: string = "";
    constructor(key: string, url: string) {
        this.key = key;
        this.apiUrl = url + "api/GoGameRecord/";
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
        axios.post(this.apiUrl + "update", args)
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

    public isLoop: boolean = false;
    public async syncLoop(interval: number, goishiManager: GoStoneManager) {
        if (this.isLoop) {
            console.log("syncLoop起動中");
            return;
        }
        this.isLoop = true;
        while (this.isLoop) {
            const now = performance.now();
            const kifu = await this.sync();
            goishiManager.roadFromKifu(kifu);
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
        await axios.post(this.apiUrl + "select", args)
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

