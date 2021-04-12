class WeatherReport {
    constructor() {
        this.defaults = {
            lat: 37.39,
            long: -121.87
        }

        this.userLocation = this.getGeo()
        this.geoEnabled = navigator.geolocation
        this.baseUrl = 'https://api.openweathermap.org/data/2.5/'
        this.getWeather = this.getWeather.bind(this)
        
        // should generate report right off the bat with user or default location
        // @todo: on page change, use location of country and update report
        this.el = this.getWeather(this.userLocation)
    }

    generateReport = (weatherData) => {
        // type can either be 'user' or 'location', 'user' use `this.userLocation`; `location` use `location` param
        let reportEl = document.createElement('div')
        reportEl.classList.add('weather-report')

        // const coords = this.printCoords()
        // reportEl.appendChild(coords)
        console.log(`data received`)
        console.log(weatherData)
        // current report
        const { current , hourly, daily } = { ...weatherData }
        console.log(current, hourly, daily)

        // temp = currentWeather.temp
        // humidity = currentWeather.humidity
        // windspeed = currentWeather.wind_speed
        // condition = currentWeather.weather[0]
        // -- description: .description
        // -- icon : id
        // -- icon: icon (img) -- http://openweathermap.org/img/wn/`${icon}@2x.png
        let iconEl = document.createElement('img')
        iconEl.classList.add('weather-icon')

        // const getIcon = async (iconCode) => {
        //     try {
        //         let response = await fetch(
        //             `http://openweathermap.org/img/wn/${iconCode}@2x.png`
        //         )

        //         if (!response.ok) {
        //             throw new Error(`HTTP error! status: ${response.status}`);
        //         }

        //         icon = await response.blob()
        //         console.log(icon)
        //     } catch(e) {
        //         console.log(e)
        //     }
        // }
        fetch(`http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`)
            .then(response => response.blob())
            .then((iconBlob) => {
                const imageURL = URL.createObjectURL(iconBlob)
                iconEl.src = imageURL
            })
        reportEl.appendChild(iconEl)

        const menuContent = document.querySelector('.menu__content')
        menuContent.appendChild(reportEl)
        
        return reportEl
    }

    printCoords = (location) => {
        let coordsEl = document.createElement('p')
        
        // if('geolocation' in navigator) {
        //     coordsEl.innerHTML = `lat: ${location.lat}, long: ${location.long}`
        // } else {
        //     coordsEl.innerHTML = `Sorry, we're unable to get your location! :(`
        // }

        return coordsEl
    }

    getGeo = () => {
        const success = (position) => {
            const lat = position.coords.latitude
            const long = position.coords.longitude

            return {
                lat: lat,
                long: long
            }
        }

        const error = () => {
            // @todo: show error message ui
            console.log(`There was an error trying to retrieve your location, so here's mine.. o_o?`)
            // should have a better error message tbh

            return {
                lat: this.defaults.lat,
                long: this.defaults.long
            }
        }

        if (this.geoEnabled) {
            navigator.geolocation.getCurrentPosition(success, error)
        } else {
            // console.log('dun dun dun')
            console.log('use da defaults')
            return {
                lat: this.defaults.lat,
                long: this.defaults.long
            }
        }
    }

    getWeather = async (location) => {
        // one call for current
        // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
        //weather icon
        // http://openweathermap.org/img/wn/10d@2x.png
        console.log(`current location: ${location}`)
        //units=imperial param
        try {
            let response = await fetch(
                // `${this.baseUrl}weather?q=London,uk&APPID=59839023800b2fa8864f25d6d76787ab`
                `${this.baseUrl}onecall?lat=${location.lat}&lon=${location.long}&units=imperial&APPID=59839023800b2fa8864f25d6d76787ab`
            )

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let weatherData = await response.json();
            // console.log(weatherData)
            // return weatherData
            // generate report
            return this.generateReport(weatherData)
        } catch(e) {
            console.log(e)
        }
    } 
}

export { WeatherReport }