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
    // const arr1 = store.rovers
    // arr1.forEach(element => {
    //     const anchor = document.createElement('div');
    //     document.body.appendChild(anchor);
    //     const button = document.createElement('button');
    //     button.innerHTML = `${element}`;
    //     anchor.appendChild(button);
    // })
    buildNavMenu()

    return `
        <header></header>
        <main>
            Mars Dashboard
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

//Dynamically build the navigation menu

const buildNavMenu = () => {
    const navArray = store.rovers;
    const navbarList = document.createElement('section');
    const container = document.createElement('div');
    container.className = 'roversContainer';
    navbarList.appendChild(container);
  
    navArray.forEach (element => {
      const anchor = document.createElement('div');
      anchor.className = 'rovers';
      container.appendChild(anchor);
      const button = document.createElement('button');
      button.id = `${element}`;
      button.className = 'roverButton';
      button.type = 'button';
      button.value = `${element}`;
      button.onclick = onClick(this);
      button.innerHTML = `${element}`;
      anchor.appendChild(button);
    })
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
    //const photodate = new Date(apod.date)
    //console.log(photodate.getDate(), today.getDate());
    console.log(today);
    console.log(today.getDate());
    //console.log(photodate.getDate());

    //console.log(photodate.getDate() === today.getDate());
    //Since we initially don't have data in the apod and it has just an empty string, the following condition will evaluate to True. This will cause the function `getImageOfTheDay` to be called so that we can fetch some data for the apod object from the API:
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }
    //console.log(apod.image.date)
    
    // check if the photo of the day is actually type video!
    if (apod.image.media_type === "video") {
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


