class ImClient {
    constructor(options) {
        const rawHeaderLen = 16;
        const packetOffset = 0;
        const headerOffset = 4;
        const verOffset = 6;
        const opOffset = 8;
        const seqOffset = 12;

        const defaultOptions = {
            wsUrl: "",
            maxRetryTime: 3,
            delay: 1500,
            platform: "",
            token: "",
            userInfo: {
                mid: 1,
                room_id: "room1",
                platform: "kf-backend",
                accepts: [],
            },
            debug: false,
            onMessage: () => {},
            onClose: () => {},
            onError: () => {},
            onAuthSuccess: () => {},
        };

        this.options = { ...defaultOptions, ...options };
        this.maxRetry = this.options.maxRetryTime;
        this.delay = this.options.delay;
        this.rawHeaderLen = rawHeaderLen;
        this.packetOffset = packetOffset;
        this.headerOffset = headerOffset;
        this.verOffset = verOffset;
        this.opOffset = opOffset;
        this.seqOffset = seqOffset;
        this.heartbeatInterval = null;

        this.createConnect(this.maxRetry, this.delay);
    }

    createConnect(max, delay) {
        if (max === 0) return;
        this.connect(max, delay);
    }

    connect(max, delay) {
        const options = this.options;
        const textDecoder = new TextDecoder();
        const textEncoder = new TextEncoder();
        const wsUrl = `${options.wsUrl}?token=${options.token}&platform=${options.platform}`;
        const ws = new WebSocket(wsUrl);
        ws.binaryType = 'arraybuffer';

        ws.onopen = () => this.auth(ws, textEncoder);
        ws.onerror = (err) => this.handleError(err);
        ws.onmessage = (evt) => this.handleMessage(evt, textDecoder);
        ws.onclose = () => this.handleClose(max, delay);

        this.ws = ws;
    }

    handleError(err) {
        if (this.options.debug) console.log("onError->", err);
        this.options.onError && this.options.onError(err);
    }

    handleMessage(evt, textDecoder) {
        const data = evt.data;
        const dataView = new DataView(data);
        const packetLen = dataView.getInt32(this.packetOffset);
        const headerLen = dataView.getInt16(this.headerOffset);
        const op = dataView.getInt32(this.opOffset);

        switch (op) {
            case 8:
                this.startHeartbeat();
                this.options.onAuthSuccess && this.options.onAuthSuccess();
                break;
            case 3:
                if (this.options.debug) console.log("receive server heartBeat");
                break;
            case 9:
                this.handleBatchMessage(data, textDecoder);
                break;
            default:
                const msgBody = textDecoder.decode(data.slice(headerLen, packetLen));
                if (this.options.debug) console.log("receive-Single->Message--->", msgBody);
                this.options.onMessage && this.options.onMessage(msgBody);
        }
    }

    handleBatchMessage(data, textDecoder) {
        for (let offset = this.rawHeaderLen; offset < data.byteLength; offset += this.packetLen) {
            const dataView = new DataView(data, offset);
            const headerLen = dataView.getInt16(this.headerOffset);
            const packetLen = dataView.getInt32(this.packetOffset);
            const msgBody = textDecoder.decode(data.slice(offset + headerLen, offset + packetLen));
            if (this.options.debug) console.log("receive-Multiple->Message--->", msgBody);
            this.options.onMessage && this.options.onMessage(msgBody);
        }
    }

    handleClose(max, delay) {
        if (this.options.debug) console.log("onCloseEvent");
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
        setTimeout(() => this.createConnect(--max, delay * 2), delay);
    }

    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => this.heartbeat(), 30 * 1000);
    }

    heartbeat() {
        const headerBuf = new ArrayBuffer(this.rawHeaderLen);
        const headerView = new DataView(headerBuf);
        headerView.setInt32(this.packetOffset, this.rawHeaderLen);
        headerView.setInt16(this.headerOffset, this.rawHeaderLen);
        headerView.setInt16(this.verOffset, 1);
        headerView.setInt32(this.opOffset, 2);
        headerView.setInt32(this.seqOffset, 1);
        this.ws.send(headerBuf);
        if (this.options.debug) console.log("send: heartbeat");
    }

    auth(ws, textEncoder) {
        const token = JSON.stringify(this.options.userInfo);
        const headerBuf = new ArrayBuffer(this.rawHeaderLen);
        const headerView = new DataView(headerBuf);
        const bodyBuf = textEncoder.encode(token);
        headerView.setInt32(this.packetOffset, this.rawHeaderLen + bodyBuf.byteLength);
        headerView.setInt16(this.headerOffset, this.rawHeaderLen);
        headerView.setInt16(this.verOffset, 1);
        headerView.setInt32(this.opOffset, 7);
        headerView.setInt32(this.seqOffset, 1);
        ws.send(this.mergeArrayBuffer(headerBuf, bodyBuf));
        if (this.options.debug) console.log("send: auth info", this.options.userInfo);
    }

    mergeArrayBuffer(ab1, ab2) {
        const u81 = new Uint8Array(ab1);
        const u82 = new Uint8Array(ab2);
        const res = new Uint8Array(ab1.byteLength + ab2.byteLength);
        res.set(u81, 0);
        res.set(u82, ab1.byteLength);
        return res.buffer;
    }

    sendMsg(object) {
        const msg = JSON.stringify(object);
        const textEncoder = new TextEncoder();
        const headerBuf = new ArrayBuffer(this.rawHeaderLen);
        const headerView = new DataView(headerBuf);
        const bodyBuf = textEncoder.encode(msg);
        headerView.setInt32(this.packetOffset, this.rawHeaderLen + bodyBuf.byteLength);
        headerView.setInt16(this.headerOffset, this.rawHeaderLen);
        headerView.setInt16(this.verOffset, 1);
        headerView.setInt32(this.opOffset, 4);
        headerView.setInt32(this.seqOffset, 1);
        this.ws.send(this.mergeArrayBuffer(headerBuf, bodyBuf));
        if (this.options.debug) console.log("sendMsg: ", object);
    }
}

window.ImClient = ImClient;
