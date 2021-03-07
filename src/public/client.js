let store = Immutable.Map({
    user: Immutable.Map({ name: 'Mars Explorer' }),
    apod: '',
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
    currentRover: '',
    CuriosityURL: 'https://mars.nasa.gov/msl/mission/overview/',
    OpportunityURL: 'https://mars.nasa.gov/mars-exploration/missions/mars-exploration-rovers/',
    SpiritURL: 'https://mars.nasa.gov/mars-exploration/missions/mars-exploration-rovers/'
})

// add our markup to the page
const root = document.getElementById('root')

// const updateStore = (store, newState) => {
//     store = store.merge(store, newState)
//     render(root, store)
// }

const updateStore = (state, newState) => {
    store = state.merge(newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content

const App = (state) => {
    const apod = state.getIn(['apod','image']);
    
    if (store.get('currentRoverData')) {
      return `
        <header></header>
        <main>
            ${navBar()}
            <!-- {renderSelectedRoverData(store.currentRover)}  -->
            ${renderSelectedRoverData(store.get('currentRover'))}         
  
        </main>
        <footer></footer>
    `
    }
    return `
        <header></header>
        <main>
            ${navBar()}
            ${showcase()}       
  
            <div class ="page-layout">
            ${Greeting(store.get('user').get('name'))}   
                <br>
                <p> 
                   Here you can find information about the NASA Mars Exploration Rovers Curiosity, Opportunity and Spirit. 
                </p>
                <p> 
                   Select the rover you are interested in from the menu above to learn more about its mission and view the most recent photos taken by that rover. 
                </p>
                <br>
                <h2>About NASA's Astronomy Picture of the Day</h2>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                <br>
                ${ImageOfTheDay(state.get('apod'))}
            </div>
        </main>
        <footer></footer>
    `
  }  

//NavBar

const navBar = () => {
    return `
    <!-- Navbar -->
    <nav id="main-nav">
      <div class="container">
        <h1 class="title">
          <!-- <a href="index.html"><i class="fas fa-globe-europe"></i>Mars Rover Dashboard</a> -->
          <i class="fas fa-globe-europe"></i> Mars Rover Dashboard <span> Mission insights </span>
        </h1>
        <div class="roversContainer">
            <div class="rovers">
            <button class="current" onClick="window.location.reload();">APOD</button>
            </div>
            ${buildNavMenu()}
        </div>
      </div>
    </nav>
    `
}

//Showcase

const showcase = () => {
    return `
    <!-- Showcase -->
    <header id="showcase">
      <div class="container">
        <div class="showcase-container">
          <div class="showcase-content">
            <h2>NASA Mars Exploration Rovers</h2>
          </div>
        </div>
      </div>
    </header>
    `
}

//Dynamically build the navigation menu

const buildNavMenu = () => {

    const navArray = store.get('rovers');

    return navArray.map (element => {
    
        return `<div class="rovers" >
        
        <button id="${element}" class="roverButton" type="button" value="${element}" onclick="onClick(this)">${element}</button>
        
        </div> `
    
    }).join(' ')
    
}

//Render data about selected rover

const renderSelectedRoverData = (rover) => {
    // const roverName = store.currentRover
    // const launchDate = store.currentRoverData.roverData.launch_date
    // const landingDate = store.currentRoverData.roverData.landing_date
    // const status = store.currentRoverData.roverData.rover_status
    // const photoDate = store.currentRoverData.roverData.latest_photo_date

    const roverName = store.get('currentRover')
    const launchDate = store.getIn(['currentRoverData', 'roverData', 'launch_date'])
    const landingDate = store.getIn(['currentRoverData', 'roverData', 'landing_date'])
    const status = store.getIn(['currentRoverData', 'roverData', 'rover_status'])
    const photoDate = store.getIn(['currentRoverData', 'roverData', 'latest_photo_date'])
    const roverURL = store.get(`${roverName}URL`)

    return `<div class="page-layout">
    <div class="page-title"> <h2>${roverName} Rover Mission Overview</h2> </div>
    <div class="list-title">Key Facts about NASA's ${roverName} Rover</div>
    <div class="description"> 
        <p>
           <b>Launch:</b>
           <br>
           The ${roverName} rover was launched on ${launchDate}.
        <p>
        <p>
           <b>Landing:</b>
           <br>
           It landed on Mars on ${landingDate}.
        </p>
        <p>
           <b>Status:</b>
           <br> 
           Its current status is ${status}.
        </p>
        <p>
           <b>Latest Photos:</b>
           <br>
           The latest photos obtained by ${roverName} were taken on ${photoDate}. 
           <br>
           You can see them below:
        </p>
    </div>
    ${recentPhotos()}
    <div>
    <p>To learn more about the ${roverName} rover mission, visit NASA's dedicated page <a href="${roverURL}" target="_blank">here.</a></p>
    </div>
    </div> `
    
}

// Most recently available photos

const recentPhotos = () => {
    // const photoArray = store.currentRoverData.roverData.recent_photos.photos

    const photoArray = store.getIn(['currentRoverData', 'roverData', 'recent_photos', 'photos'])

    if (photoArray.length < 4) {
        console.log(photoArray)
        return photoArray.map (pic=> {
            console.log(pic.img_src)
            return (
            `<div>
            <img src="${pic.img_src}" height="350px" width="100%" />
            </div>`
            )
        })
        
    } else {
        const slicedArray = photoArray.slice (0,4)
        return slicedArray.toJS().map (pic => {
            console.log(pic.img_src)
            return (`
            <div>
            <img src="${pic.img_src}" height="350px" width="100%" />
            </div>
        `
        )
        })
    }

}


// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend

const ImageOfTheDay = (apod) => {
    const today = new Date()
    
    if ((!apod) || apod.get('date') === today.getDate() ) {
        getImageOfTheDay(store)
    } else {
        console.log('apod ',apod)
        const photodate = new Date(apod.getIn('image','date'))
        
        if ((!apod) || apod.get('date') === today.getDate() ) {
            getImageOfTheDay(store)
        }
     
        if (apod === '' || apod.getIn(['image', 'media_type']) === undefined ) {
    
            return `<p> Welcome to Mars Rover Dashboard </p>`
            
            }
    
        else if (apod.getIn(['image', 'media_type']) === 'video') {
            return (`
                <p>See today's featured video <a href="${apod.getIn(['image','url'])}" target="_blank">here</a></p>
                <p>${apod.getIn(['image','title'])}</p>
                <p>${apod.getIn(['image','explanation'])}</p>
            `)
        } else {
            return (`
                <h2>Here is today's Astronomy Picture of the Day</h2>
                <img src="${apod.getIn(['image','url'])}" height="350px" width="100%" />
                <p>${apod.getIn(['image','explanation'])}</p>
            `)
        }
    }
}


// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let apod = state.getIn(['apod','image']);

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
        
    //return data
}

//Current Rover API Call

const getCurrentRoverData = (currentRover) => {
    console.log(currentRover)
    fetch(`http://localhost:3000/manifests/${currentRover}`)
        .then(res => res.json())
        .then(currentRoverData => updateStore(store, { currentRoverData }))
  }

// ------------------------------------------------------  COLLECT USER INPUT

const onClick = (e) => {
    const selectedRover = e.id;
    updateStore(store, { currentRover: `${selectedRover}` })
    getCurrentRoverData(store.get('currentRover'))
    console.log(store)
}
