export default class Component {
  constructor() {
    this._id = ++document.nextId;
    document.registeredComponents[this._id] = this;
  }
}
