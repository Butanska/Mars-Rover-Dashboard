require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

//Curiosity Manifest

app.get('/manifests/curiosity', async (req, res) => {
    try {
        let manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity/?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        
        let launchDate = manifest.photo_manifest.launch_date
        let landingDate = manifest.photo_manifest.landing_date
        let status = manifest.photo_manifest.status
        let latestPhotoDate = manifest.photo_manifest.max_date

        let mostRecentPhotos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${latestPhotoDate}&api_key=${process.env.API_KEY}`)
        .then(res => res.json())

        let roverData = {
            launch_date: launchDate,
            landing_date: landingDate,
            rover_status: status,
            latest_photo_date: latestPhotoDate,
            recent_photos: mostRecentPhotos
        }
        
        res.send({ roverData })
    } catch (err) {
        console.log('error:', err);
    }
  })


//Opportunity Manifest

app.get('/manifests/opportunity', async (req, res) => {
    try {
        let manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/opportunity/?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        
        let launchDate = manifest.photo_manifest.launch_date
        let landingDate = manifest.photo_manifest.landing_date
        let status = manifest.photo_manifest.status
        let latestPhotoDate = manifest.photo_manifest.max_date

        let mostRecentPhotos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos?earth_date=${latestPhotoDate}&api_key=${process.env.API_KEY}`)
        .then(res => res.json())

        let roverData = {
            launch_date: launchDate,
            landing_date: landingDate,
            rover_status: status,
            latest_photo_date: latestPhotoDate,
            recent_photos: mostRecentPhotos
        }
        
        res.send({ roverData })
    } catch (err) {
        console.log('error:', err);
    }
  })


//Spirit Manifest

app.get('/manifests/spirit', async (req, res) => {
    try {
        let manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/spirit/?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        
        let launchDate = manifest.photo_manifest.launch_date
        let landingDate = manifest.photo_manifest.landing_date
        let status = manifest.photo_manifest.status
        let latestPhotoDate = manifest.photo_manifest.max_date

        let mostRecentPhotos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos?earth_date=${latestPhotoDate}&api_key=${process.env.API_KEY}`)
        .then(res => res.json())

        let roverData = {
            launch_date: launchDate,
            landing_date: landingDate,
            rover_status: status,
            latest_photo_date: latestPhotoDate,
            recent_photos: mostRecentPhotos
        }
        
        res.send({ roverData })
    } catch (err) {
        console.log('error:', err);
    }
  })


// example API call
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
        console.log(image)
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))