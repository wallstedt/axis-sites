import * as connectionHelpers from './lib/connectionHelpers'
import Login from './Components/Login'
import Sites from './Components/Sites'


export const app = () => {
  const container = document.querySelector('#content');
  const login = Login(container);
};


window.onload = () => {
  app();
};


