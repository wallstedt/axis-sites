import Component from './component'
import { saveState, loadState } from '../localStorage';

export default class Landing extends Component {
  constructor(history) {
    super();
    this.history = history;

    this.state = {
      loggedIn: ''
    }

    const ls = localStorage.getItem('loggedIn')
    this.state.loggedIn = ls
  }

  loginError(){
    return (this.state.loggedIn === 'error') ? `
    <div>
      <p>Log in failed</p>
    </div>
    ` : ``
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
      <form id="loginform">
        Username:<br>
        <input type="text" name="username" value="">
        <br>
        Password:<br>
        <input type="password" name="password" value="">
        <br><br>
      </form> 
      <button onclick="document.registeredComponents[${this._id}].setBody(this.value)">Klick</button>${this.loginError()}      
    </div>
    `;
  }

  setBody(newBody) {

      let username = document.querySelector('[name="username"]').value;
      let password = document.querySelector('[name="password"]').value; 
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


    localStorage.setItem('loggedIn', 'error')

    const beginAuth = { beginAuth: true, username: 'demouser1', password: '0b14d501a594442a01c6859541bcb3e8164d183d32937b851835442f69d5c94e' };

    // TESTING CHANGES
    // this.history.push('/login', beginAuth)
    this.history.push('/', beginAuth);
    // works
    //this.history.push('/login', { auth: true });
  }
} // end Landing
