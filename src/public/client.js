let store = Immutable.Map({
    user: Immutable.Map({ name: "Student" }),
    apod: '',
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
    currentRover: ''
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = store.merge(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content

const App = (state) => {
    // let { rovers, apod } = state
    //const rovers = state.get('rovers');
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
            ${Greeting(store.get('user').get('name'))}          
  
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                ${ImageOfTheDay(state.get('apod'))}
            </section>
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
            <button class="current">APOD</button>
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
            <div class="category category-mars">Mars</div>
            <h2>Mars Exploration Rovers</h2>
            <p>Lorem ipsum ...</p>
            <a href="blog_post.html" class="btn">Read More</a>
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

    return `<div class="roverData" >
    <h1>${roverName}</h1>
    <ul>
        <li>The ${roverName} rover was launched on ${launchDate}.</li>
        <li>It landed on Mars on ${landingDate}.</li>
        <li>Its current status is ${status}.</li>
        <li>The latest photos obtained by ${roverName} were taken on ${photoDate}. You can see them below:</li>
    </ul>
    ${recentPhotos()}
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
        console.log(slicedArray)
        return slicedArray.map (pic => {
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
        console.log("apod ",apod)
        const photodate = new Date(apod.getIn('image','date'))
        console.log(apod.get('date'))
        console.log(photodate.getDate(), today.getDate());
        if ((!apod) || apod.get('date') === today.getDate() ) {
            getImageOfTheDay(store)
        }
     
        if (apod === '' || apod.getIn(['image', 'media_type']) === undefined ) {
    
            return `<p> Welcome to Mars Rover Dashboard </p>`
            
            }
    
        else if (apod.getIn(['image', 'media_type']) === "video") {
            return (`
                <p>See today's featured video <a href="${apod.getIn(['image','url'])}" target="_blank">here</a></p>
                <p>${apod.getIn(['image','title'])}</p>
                <p>${apod.getIn(['image','explanation'])}</p>
            `)
        } else {
            return (`
                <img src="${apod.getIn(['image','url'])}" height="350px" width="100%" />
                <p>${apod.getIn(['image','explanation'])}</p>
            `)
        }
    }
}


// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    //let { apod } = state
    let apod = state.getIn(['apod','image']);
    //destructuring, equivalent to let apod = state.apod

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
