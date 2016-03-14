class Response {
  constructor({ ok, status, statusText, type, url, body, headers }, text) {
    this.ok = ok;
    this.status = status;
    this.statusText = statusText;
    this.type = type;
    this.url = url;
    this.body = body;
    this.headers = headers;
    this.text = text;
  }

  get json() {
    this._json = this._json || JSON.parse(this.text);
    return this._json;
  }
}

export default Response;
