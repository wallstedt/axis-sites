import Component from './component'
import { saveState, loadState } from '../localStorage';
import Site from './Site'

export default class Sites extends Component {
  constructor(props) {
    super()
    this.history = props.history;
    this.token = props.token;
    this.activeSite = '';
    this.renderSites = props.renderSites 

    // mock data
    this.mockSites = [
      { id: 1, title: 'Demo site 1', owner: 'demouser1' },
      { id: 2, title: 'Demo site 2', owner: 'demouser1' },
      { id: 3, title: 'Demo site 3', owner: 'demouser2' }
    ];

    this.sites = this.mockSites.map(site => new Site(site.title, site.id, (value) => {this.setActiveSite(value)}))
  }

  setActiveSite(site){
    this.activeSite = site
    this.renderSites(this)
  }

  render() {
    return `
    <div>
    <h1 onclick="document.registeredComponents[${
      this._id
    }].showMe()">The user is logged in.</h1>
      <a id="logout" href="/logout" onclick="document.registeredComponents[${
        this._id
      }].logout()">Logout</a>
      ${this.sites.map(site => site.render()).join('')}
      ${this.activeSite}
    </div>
    `;
  }

  logout() {
    // remove the session
    window.localStorage.clear();

    // send the user to the rootpath
    this.history.replace('/');
  }
}