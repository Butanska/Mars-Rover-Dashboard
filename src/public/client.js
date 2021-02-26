let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content

const App = (state) => {
    let { rovers, apod } = state
  
    if (store.currentRoverData) {
      return `
        <header></header>
        <main>
            ${navBar()}
            ${renderSelectedRoverData(store.currentRover)}
            ${Greeting(store.user.name)}          
  
        </main>
        <footer></footer>
    `
    }
    return `
        <header></header>
        <main>
            ${navBar()}
            ${showcase()}
            ${Greeting(store.user.name)}          
  
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
                ${ImageOfTheDay(apod)}
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
            <div class="category category-italy">Italy</div>
            <h2>The Venice Files</h2>
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

    const navArray = store.rovers;
    
    return navArray.map (element => {
    
        return `<div class="rovers" >
        
        <button id="${element}" class="roverButton" type="button" value="${element}" onclick="onClick(this)">${element}</button>
        
        </div> `
    
    }).join(' ')
    
}

//Render data about selected rover

const renderSelectedRoverData = (rover) => {
    const roverName = store.currentRover
    const launchDate = store.currentRoverData.roverData.launch_date
    const landingDate = store.currentRoverData.roverData.landing_date
    const status = store.currentRoverData.roverData.rover_status
    const photoDate = store.currentRoverData.roverData.latest_photo_date

    // Most recently available photos
    recentPhotos()

    return `<div class="roverData" >
    <h1>${roverName}</h1>
    <ul>
        <li>The ${roverName} rover was launched on ${launchDate}.</li>
        <li>It landed on Mars on ${landingDate}.</li>
        <li>Its current status is ${status}.</li>
        <li>The latest photos obtained by ${roverName} were taken on ${photoDate}. You can see them below:</li>
    </ul>

    </div> `
    
}

// Most recently available photos

const recentPhotos = () => {
    const photoArray = store.currentRoverData.roverData.recent_photos.photos
    if (photoArray.length < 4) {
        console.log(photoArray)
    } else {
        const slicedArray = photoArray.slice (0,4)
        console.log(slicedArray)
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
    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());
    // console.log(today);
    // console.log(today.getDate());
    // console.log(photodate.getDate());

    //console.log(photodate.getDate() === today.getDate());

    //Since we initially don't have data in the apod and it has just an empty string, the following condition will evaluate to True. This will cause the function `getImageOfTheDay` to be called so that we can fetch some data for the apod object from the API:
    if ((!apod) || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }
    //console.log(apod.image.date)
    
    // check if the photo of the day is actually type video!
 
    if (apod === '' || apod.image.media_type === undefined ) {

        return `<p> Welcome to Mars Rover Dashboard </p>`
        
        }

    else if (apod.image.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.image.url}" target="_blank">here</a></p>
            <p>${apod.image.title}</p>
            <p>${apod.image.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state
    //destructuring, equivalent to let apod = state.apod
    //console.log(state)

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
    
    //return data
}

//Current Rover API Call

const getCurrentRoverData = (currentRover) => {
    fetch(`http://localhost:3000/manifests/${currentRover}`)
        .then(res => res.json())
        .then(currentRoverData => updateStore(store, { currentRoverData }))
  }

// ------------------------------------------------------  COLLECT USER INPUT

const onClick = (e) => {
    const selectedRover = e.id;
    updateStore(store, { currentRover: `${selectedRover}` })
    getCurrentRoverData(store.currentRover)
    console.log(store)
}


