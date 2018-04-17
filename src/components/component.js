/**
 * Root component for other components - adds components to the registeredComponents list to 
 * be able to track events  
 */
export default class Component {
  constructor() {
    this._id = ++document.nextId;
    document.registeredComponents[this._id] = this;
  }
}
