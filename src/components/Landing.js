import Component from './component'
import { saveState, loadState } from '../localStorage';

export default class Landing extends Component {
  constructor(history) {
    super();
    this.history = history;
  }
  render() {
    return `
    <div>
      <p>The user logs in by pressing the button</p>
      <p>The button below symbolizes the complete logging in process and will be replaced by:</p>
      <ul>
        <li>A form</li>
        <li>setBody() will be replaced by a function consuming utility functions for logging in</li>
      </ul>
      <p>In addition, upon loading the app, localstorage state will be loaded, and injected (NOT IMPOTANT, BUT NICE)</p>
      <button onclick="document.registeredComponents[${
        this._id
      }].setBody(this.value)">Klick</button>      
    </div>
    `;
  }

  setBody(newBody) {
    // save state, then push
    // TODO: double check necessity of this 
    saveState({
      auth: {
        // get these from the request
        id: '1',
        username: 'demouser1',
        token: 'madeup'
      }
    });

    const beginAuth = { beginAuth: true, username: 'demouser1' }

    this.history.push('/login', beginAuth)
    // works
    //this.history.push('/login', { auth: true });
  }
} // end Landing
