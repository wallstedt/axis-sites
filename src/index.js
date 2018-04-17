import UniversalRouter from 'universal-router'
import createHistory from 'history/createBrowserHistory'
import { saveState, loadState } from './localStorage';

import Landing from './components/Landing';
import Sites from './components/Sites';

import * as connectionHelpers from './lib/connectionHelpers'

document.registeredComponents = {}
document.nextId = 0


const app = () => {
  const history = createHistory();

  const landing = new Landing(history);
  /* const login = new Login(history); */
  let sites = null;

  const state = loadState();

  console.log(state);
  const router = new UniversalRouter([
    /* { path: '/', action: () => landing }, */
    {
      path: '/',
      async action(ctx) {
        console.log('context: ', ctx);
        console.log('state', state);
        if (!ctx.auth) {
          return { content: landing };
        }
        if (ctx.auth.authed) {
          const token = ctx.auth.token;
          sites = new Sites({ history, username: ctx.auth.username, token: ctx.auth.token, renderSites });
          return { content: sites };
        } /* else if (ctx.beginAuth) {
          try {
            const u = await connectionHelpers.getUser({
              username: ctx.beginAuth.username,
              password: ctx.beginAuth.password
            });

            // save user to localstorage here

            const token = u.id;

            sites = new Sites({ history, token, renderSites });
            return { content: sites };
          } catch (err) {
            throw new Error();
          }
        }  */ else {
          return { content: landing };
        }
      }
    }
  ]);

  /**
   *  Used by the router object to render views by resolving path and context arguments
   */

  async function render(location) {
    let page = await router.resolve({
      pathname: location.pathname,
      auth: location.state,
      beginAuth: location.state
    });

    if (page.content) {
      page = page.content;
    }

    document.querySelector('body').innerHTML = await page.render();
  }

  /**
   * a cb sent to a component to trigger a rerender
   * @param {*} page - page component
   */
  async function renderSites(page) {
    document.querySelector('body').innerHTML = await page.render();
  }

  // first render
  render(history.location);

  // listen for changes to navigate user
  history.listen((location, action) => {
    render(location);
  });

  window.addEventListener('click', event => {
    if (event.target.tagName === 'A') {
      event.preventDefault();
    }
  });
}

window.onload= () => {
  app()
}



