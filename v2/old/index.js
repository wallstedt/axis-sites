import * as connectionHelpers from './lib/connectionHelpers'
import Login from './Components/Login'
import Sites from './Components/Sites'


const app = () => {
  const container = document.querySelector('#loginForm');
  const login = Login(container);

  // Sites(container)
};

const getScreen = () => {
  const tpl = document.querySelectorAll("#screen template")[0]
  const div = document.importNode(tpl.content.firstElementChild, false);
  return div;
}

// remove element trees
const renderElement =(target, element) => {
  while (target.firstChild) {
    target.removeChild(target.firstChild)
  }

  target.appendChild(element)
}

const renderPage = async (page, target) => {
  const rootElement = await page()
  renderElement(target, rootElement)
}

const Page = container => {
  const template = document.querySelectorAll('#page template')[0]
  const content = document.importNode(template.content.firstElementChild, true)
  return content 
}

const Sites = async container => {

  const createSite = (props) => {
    const obj = [props]
    return obj
  }

  const getSites = async () => {
    const user = JSON.parse(localStorage.getItem('state')) 
  
    // get sites for user
    const sites = await connectionHelpers.getSites({username: user.username, token: user.token})
    
    // make a list of devices
    const deviceList = {}

    // get devices
    const devices = await Promise.all(sites.map (async site => {
      // get devices for a site 
      const device = await connectionHelpers.getDevices({siteId: site.id, token: user.token })
      // create object entry for the site
      deviceList[site.id] = device // changed this from []
      // populate the devicelist for this site
      /* const sitesDevices = device.map(d => {
        return d
      }) */
      // add the array of devices to the array entry for devices on this site
      //deviceList[site.id].push(device)
      console.log(deviceList)
    }))

    const siteComponents = sites.map(site => {
        return {
          title: site.title, 
          id: site.id, 
          deviceList: deviceList[site.id]
        }
    })
      
      return siteComponents
  } // end getSites

  /**
   * 
   * @param {*} site - object
   */
   const createRows = site => {
      const rows = site.deviceList.map(d => {
        const tr = document.createElement('tr');
        // let tr = tableDiv.firstElementChild.lastElementChild.firstElementChild.cloneNode(false);
        Object.keys(d).forEach(key => {
          if (typeof d[key] != "function" && key != '_id') {
            const td = document.createElement('td');
            // let td = tableDiv.firstElementChild.firstElementChild.lastElementChild.firstElementChild.cloneNode(false);

            // loop arrays 
            if (Array.isArray(d[key])) {
              d[key].forEach(elem => {
                Object.keys(elem).forEach(key => {
                  td.appendChild(document.createTextNode(`${elem[key]} `));
                })
              }) 
            } else {
              td.appendChild(document.createTextNode(d[key]));
            }

            
            tr.appendChild(td)    
          }
        })

        return tr 
      })

      return rows
   };

   const getHeaders = site => {
     console.log(site[0].deviceList[0])
     let o = site[0].deviceList[0];

     const tr = document.createElement('tr')
     // const tr = tableDiv.firstElementChild.lastElementChild.firstElementChild.cloneNode(false);
     Object.keys(o).forEach(item => {
       const th = document.createElement('th')
       // const th = tableDiv.firstElementChild.lastElementChild.firstElementChild.firstElementChild.cloneNode(false);
       th.appendChild(document.createTextNode(item));
       tr.appendChild(th)
     })

     return tr
   }
   // renders the table for a site
   const renderTable = async site => {
   
      let target = tableDiv.firstElementChild

      while(target.firstElementChild) {
        target.removeChild(target.firstChild)
      }

    // get the table headers
    const headers = getHeaders(site)
    tableDiv.firstElementChild.appendChild(headers)
    const rows = site.map(device => createRows(device));

     rows[0].forEach(row => {
       tableDiv.firstElementChild.appendChild(row)
     })
     
   };

  // All DOM-retrieving stuff here
  const template = document.querySelectorAll("#screen template")[0]
  const sitesContainer = document.importNode(template.content.firstElementChild, true)
  const linksDiv = sitesContainer.firstElementChild;
  const tableDiv = sitesContainer.lastElementChild;


  let page = Page()
  page.firstElementChild.firstElementChild.appendChild(document.createTextNode('Sites'));  
  page.firstElementChild.nextElementSibling.appendChild(sitesContainer)
  // End retrieving DOM 

  const sites = await getSites()
  console.log(sites)

  sites.forEach(site => {
    let node = linksDiv.firstElementChild.cloneNode(false)
    node.appendChild(document.createTextNode(site.title));
    let url = site.title.replace(/\s/g, '-');
    node.setAttribute('href', `#!${url}`)
    node.setAttribute('id', `site-${site.id}`)
    node.classList.add('site-selector')
    linksDiv.appendChild(node)
  })

  // get a list of all the links to sites
  const siteSelectors = linksDiv.getElementsByClassName('site-selector')
  
  for (let i = 0; i < siteSelectors.length; i++) {
    siteSelectors[i].addEventListener('click', function(e) {
      e.preventDefault()

      const siteId = siteSelectors[i].getAttribute('id')
      const id = siteId.split('-').pop()
      console.log(id)

      let site = sites.filter(s => s.id == id)
      renderTable(site)
    })
  }



  return page; 
  // renderElement(container, page)

  // container.appendChild(page)
}

const Login2 = async container => {

  // Get the nodes for the login from the template
  const template = document.querySelectorAll('#loginForm template')[0];
  const form = document.importNode(template.content.firstElementChild, true);
  const usernameField = form.firstElementChild.firstElementChild;
  const passwordField = form.firstElementChild.firstElementChild.nextElementSibling;
  const button = form.firstElementChild.lastElementChild;

  // container.appendChild(form);


  let page = Page()
  page.firstElementChild.firstElementChild.appendChild(document.createTextNode('Login!'));
  page.firstElementChild.nextElementSibling.appendChild(form)

  container.appendChild(page)

  console.log(page);

  // Add listener for clicks on the button.  
  button.addEventListener('click', function(e) {
    e.preventDefault()

    const username = usernameField.value
    const password = passwordField.value 

    console.log('username', username)
    console.log('password', password );

    // add logic for login here

    connectionHelpers.getUser({
      username: 'demouser1',
      password: '0b14d501a594442a01c6859541bcb3e8164d183d32937b851835442f69d5c94e'
    })
    .then(result => {
      
      const user = {
        username: result.data.username, 
        userid: result.data.userid,
        token: result.data.token 
      }
      
      window.localStorage.setItem('state', JSON.stringify(user))
      
      
      renderPage(Sites, container)
    })
    .catch(() => form.appendChild(document.createTextNode('Login failed')))
    
    
  })

};

const Login = async container => {
  // Get the nodes for the login from the template
  const template = document.querySelectorAll('#loginForm template')[0];
  const form = document.importNode(template.content.firstElementChild, true);
  const usernameField = form.firstElementChild.firstElementChild;
  const passwordField = form.firstElementChild.firstElementChild.nextElementSibling;
  const button = form.firstElementChild.lastElementChild;

  // container.appendChild(form);


  let page = Page()
  page.firstElementChild.firstElementChild.appendChild(document.createTextNode('Login!'));
  page.firstElementChild.nextElementSibling.appendChild(form)

  container.appendChild(page)

  console.log(page);

    button.addEventListener('click', async function(e) {
    e.preventDefault()

    const username = usernameField.value
    const password = passwordField.value 

    console.log('username', username)
    console.log('password', password );

    // add logic for login here
    const result = await connectionHelpers.getUser({
      username: 'demouser1',
      password:
        '0b14d501a594442a01c6859541bcb3e8164d183d32937b851835442f69d5c94e'
    });
    
    const user = {
      username: result.data.username, 
      userid: result.data.userid,
      token: result.data.token 
    }

    window.localStorage.setItem('state', JSON.stringify(user))

    await renderPage(Sites, container) 
  })
}

window.onload = () => {
  
  app();
};

window.addEventListener('hashchange', event => {
  let hash = window.location.hash 

  if (hash.substr(2,8) === '/sites/'){

  }
})
