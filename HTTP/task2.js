const express = require('express')
const axios = require('axios')

const app = express()
const port = 3000


const API_KEY = 'd8aa6c8bef19da76f6f1c56f614aa13f'
app.get('/weather/:city', async (req, res) => {
    const city = req.params.city
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`

    try {
        const response = await axios.get(url)
        if (response.status === 200) {
            res.status(200).json(response.data)
        } else {
            res.status(response.status).send(response.statusText)
        }
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).send(error.response.statusText)
        } else if (error.request) {
            res.status(500).send('No response from server')
        } else {
            res.status(500).send('Request error')
        }
    }
})

app.get('/weather/:city/401', async (req, res) => {
    const city = req.params.city
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}`

    try {
        const response = await axios.get(url)
        if (response.status === 200) {
            res.status(200).json(response.data)
        } else {
            res.status(response.status).send(response.statusText)
        }
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).send(error.response.statusText)
        } else if (error.request) {
            res.status(500).send('No response from server')
        } else {
            res.status(500).send('Request error')
        }
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})