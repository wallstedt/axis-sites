import * as connectionHelpers from '../lib/connectionHelpers'
import * as util from './helpers/pageHelpers'
import Sites from './Sites'
import '../style/style.css';

const Login = async container => {
  
  // Get the nodes for the login from the template
  const template = document.querySelectorAll('#loginForm template')[0];
  const form = document.importNode(template.content.firstElementChild, true);
  const usernameField = form.firstElementChild.firstElementChild;
  const passwordField =
    form.firstElementChild.firstElementChild.nextElementSibling;
  const button = form.firstElementChild.lastElementChild;
  

  let page = util.Page();
  page.firstElementChild.firstElementChild.appendChild(
    document.createTextNode('Login!')
  );
  page.firstElementChild.nextElementSibling.appendChild(form);

  container.appendChild(page);

  console.log(page);

  button.addEventListener('click', async function(e) {
    e.preventDefault();

    const username = usernameField.value;
    const password = passwordField.value;

    console.log('username', username);
    console.log('password', password);

    // add logic for login here
    try {
      const result = await connectionHelpers.getUser({
        username: username,
        password: password
      });
      /* const result = await connectionHelpers.getUser({
        username: 'demouser1',
        password: '0b14d501a594442a01c6859541bcb3e8164d183d32937b851835442f69d5c94e'
      }); */

    const user = {
      username: result.data.username,
      userid: result.data.userid,
      token: result.data.token
    };

    window.localStorage.setItem('state', JSON.stringify(user));

    await util.renderPage(Sites, container);
    } catch(e) {

      let p = document.createElement('p')
      p.appendChild(document.createTextNode('login failed...'));
      p.setAttribute('id', 'errorP')
      document.querySelector('.page').appendChild(p)
    }
    
  });

  return page
};

export default Login