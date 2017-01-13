import {CancellableUpload} from "./resumable";
import {ProgressHelper} from "./progress.hack";
import {Http, BrowserXhr} from "@angular/http";
import {DemoServer} from "../demo/app/server";

export class ProgressBrowserXhr implements BrowserXhr {
    constructor(private origXhr: BrowserXhr, private buildCallback: Function) {
    }

    build(): any {
        let xhr = this.origXhr.build();
        this.buildCallback(xhr);
        return <any>(xhr);
    }
}

export class Uploader extends CancellableUpload {
    private progressFn;
    private xhrFn;
    constructor(private http: Http){
        if (http._backend && http._backend._browserXHR) {
            if (http._backend._browserXHR instanceof ProgressBrowserXhr) return http;
            http._backend._browserXHR = new ProgressBrowserXhr(http._backend._browserXHR, this.xhr);
        }
    }
    xhr(xhr) {
        xhr.upload.addEventListener('progress', (e: any) => {
            if (this.progressFn) {
                e.percent = Math.floor(100.0 * e.loaded / e.total);
                this.progressFn(e);
            }
        }, false);
        this.xhrFn(xhr);
    }

    upload(file, data, options)  {
        this.http.post()
    }
}
this.progress = 0;
this.result = '';
var http = ProgressHelper.progressEnabled(this.http);
http.post(DemoServer.url, formData)
    .progress((e) => this.progress = e.percent)
    .subscribe(
        (res: Response) => this.result = res.json(),
        (err: Error) => this.err = err.name);
