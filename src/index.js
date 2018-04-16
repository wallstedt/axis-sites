import UniversalRouter from 'universal-router'
import createHistory from 'history/createBrowserHistory'
import { saveState, loadState } from './localStorage';

import Landing from './components/Landing';
import Sites from './components/Sites';

import * as connectionHelpers from './lib/connectionHelpers'

document.registeredComponents = {}
document.nextId = 0

class Component {
  constructor() {
    this._id = ++document.nextId;
    document.registeredComponents[this._id] = this;
  }
}

class Login extends Component {
  constructor(history){
    super()
    this.history = history

    console.log(document.registeredComponents[this._id]);
  }
  render(){
    return `
    <div>
      <p>THe player is logged in now</p>
      <a id="logout" href="/logout" onclick="document.registeredComponents[${this._id}].logout()">Logout</a>
    </div>
    `;
  }
    logout(){
    // remove the session
    window.localStorage.clear();

    // send the user to the rootpath
    this.history.replace('/')
  }
} // end Login

class Landing_old extends Component {
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
    saveState({
      auth: {
        // get these from the request
        id: '1',
        username: 'demouser1',
        token: 'madeup'
      }
    });

    this.history.push('/login', { auth: true });

    /* const obj = { path: '/login' }
    history.pushState(obj, 'doctitle', '/login') */
  }
} // end Landing

window.onload = () => {
  const history = createHistory()

  const landing = new Landing(history)
  const login = new Login(history)
  let sites = null  

  const state = loadState()

  const router = new UniversalRouter([
    { path: '/', action: () => landing },
    { path: '/login', async action(ctx) {
      console.log('context: ', ctx)

      if(ctx.beginAuth) {

        try {
          const u = await connectionHelpers.getUser({
            username: ctx.beginAuth.username,
            password: ctx.beginAuth.password 
          })

          // save user to localstorage here
          
          const token = u.id;

          sites = new Sites({ history, token, renderSites });
          return { content: sites };
        }
        catch(err) {
          throw new Error()
        }

        
      } else {
        console.log('beginAuth not set');
      }

      return {
        content: login
      }
    }}
  ]); 

  async function render(location) {
    let page = await router.resolve({pathname: location.pathname, auth: location.state, beginAuth: location.state })
    console.log(page);

    if (page.content) {
      page = page.content 
    }

    document.querySelector('body').innerHTML = page.render()
  }

  /**
   * a cb sent to a component to trigger a rerender
   * @param {*} page - page component
   */
  function renderSites(page){
    document.querySelector('body').innerHTML = page.render();
  }

  // first render
  render(history.location)

  // listen for changes
  history.listen((location, action) => {
    render(location)
  })

  window.addEventListener('click', event => {
    if (event.target.tagName === 'A') {
      event.preventDefault();
    }
  });
}