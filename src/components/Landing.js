import Component from './component'
import { saveState, loadState } from '../localStorage';
import * as connectionHelpers from '../lib/connectionHelpers';
import '../style/style.css'
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
    <div id="flexContainer">
      <h1>Login</h1>
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

  async setBody(newBody) {

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


    try {
      const u = await connectionHelpers.getUser({
        username: 'demouser1',
        password: '0b14d501a594442a01c6859541bcb3e8164d183d32937b851835442f69d5c94e'
      });
      localStorage.setItem('loggedIn', '');
    
      // save user to localstorage here

      const token = u.data.userid;

      saveState({
        auth: {
          id: u.data.userid, 
          username: u.data.username, 
          token: 'secret'
        }
      })

      console.log(u);
      this.history.push('/', { authed: true, token })
      /* sites = new Sites({ history, token, renderSites });
      return { content: sites }; */
    } catch (err) {
      localStorage.setItem('loggedIn', 'error');
      this.history.push('/', { authed: false })
    }



   // localStorage.setItem('loggedIn', 'error')

    // const beginAuth = { beginAuth: true, username: 'demouser1', password: '0b14d501a594442a01c6859541bcb3e8164d183d32937b851835442f69d5c94e' };

    // TESTING CHANGES
    // this.history.push('/login', beginAuth)
    // this.history.push('/', beginAuth);
    // works
    //this.history.push('/login', { auth: true });
  }
} // end Landing
