class WeatherReport {
    constructor() {
        this.defaults = {
            lat: 37.39,
            long: -121.87
        }

        this.userLocation = this.getGeo()
        this.geoEnabled = navigator.geolocation
        this.baseUrl = 'https://api.openweathermap.org/data/2.5/'
        this.getCurrentWeather = this.getCurrentWeather.bind(this)
        
        // should generate report right off the bat with user or default location
        // @todo: on page change, use location of country and update report
        this.el = this.getCurrentWeather(this.userLocation)
    }

    // @todo: time permitting, use hourly data to generate graph
    generateReport = (weatherData) => {
        // type can either be 'user' or 'location', 'user' use `this.userLocation`; `location` use `location` param
        let reportEl = document.createElement('div')
        reportEl.classList.add('weather-report')

        // console.log(`data received`)
        // console.log(weatherData)

        // @todo: use for forecast
        // const { current , hourly, daily } = { ...weatherData }

        // create overview wrapper
        const overviewEl = document.createElement('div')
        overviewEl.classList.add('weather__overview')
        
        const headlineEl = this.createHeadlineEl(weatherData.name)
        overviewEl.appendChild(headlineEl)

        // create icon
        const iconEl = this.getIcon(weatherData.weather[0].icon)
        overviewEl.appendChild(iconEl)

        const currentTempEl = this.createCurrentTempEl(weatherData.main.temp)
        overviewEl.appendChild(currentTempEl)

        const extremitiesEl = this.createExtremitiesEl(weatherData.main.temp_max, weatherData.main.temp_min)
        overviewEl.appendChild(extremitiesEl)
        reportEl.appendChild(overviewEl)

        const conditionsEl = this.createConditionsEl(weatherData)
        
        const factorsEl = this.createFactorsEl(weatherData.main.humidity, weatherData.wind.speed)
        conditionsEl.appendChild(factorsEl)
        
        reportEl.appendChild(conditionsEl)

        const menuContent = document.querySelector('.menu__content')
        menuContent.appendChild(reportEl)
        
        return reportEl
    }

    createHeadlineEl = (headline) => {
        const headlineEl = document.createElement('h2')
        headlineEl.classList.add('weather__title')
        headlineEl.textContent = `${headline}`

        return headlineEl
    }

    createCurrentTempEl = (temp) => {
        const tempEl = document.createElement('div')
        tempEl.classList.add('weather__temp-current')
        tempEl.innerHTML = `${temp}&deg;`

        return tempEl
    }

    createExtremitiesEl = (max, min) => {
        const extremitiesEl = document.createElement('p')
        extremitiesEl.classList.add('weather__temp-extremes')

        const hiEl = document.createElement('span')
        hiEl.classList.add('weather__temp-hi')
        hiEl.innerHTML = `${Math.round(max)}&deg <span class="label">High</span>`
        extremitiesEl.appendChild(hiEl)

        const loEl = document.createElement('span')
        loEl.classList.add('weather__temp-lo')
        loEl.innerHTML = `${Math.round(min)}&deg <span class="label">Low</span>`
        extremitiesEl.appendChild(loEl)

        return extremitiesEl
    }

    createConditionsEl = (weatherData) => {
        const conditionsEl = document.createElement('div')
        conditionsEl.classList.add('weather__conditions')

        const descriptionEl = this.createDescriptionEl(weatherData.weather[0])
        conditionsEl.appendChild(descriptionEl)

        return conditionsEl
    }

    createDescriptionEl = (weather) => {
        const descriptionEl = document.createElement('p')
        descriptionEl.classList.add('weather__description')
        descriptionEl.innerHTML = `
            <p class="weather__description-main>${weather.main}</p>
            <p class="weather__description-sub>${weather.description}</p>
        `

        return descriptionEl
    }

    createFactorsEl = (humidity, windSpeed) => {
        const factorsEl = document.createElement('div')
        factorsEl.classList.add('weather__factors')

        const humidityEl = document.createElement('div')
        humidityEl.classList.add('weather__factor', 'weather__factor-humidity')
        humidityEl.innerHTML = `Humidity: ${Math.round(humidity)}%`
        factorsEl.appendChild(humidityEl)
        
        const windEl = document.createElement('div')
        windEl.classList.add('weather__factor', 'weather__factor-wind')
        windEl.innerHTML = `Winds: ${windSpeed} mph`
        factorsEl.appendChild(windEl)

        return factorsEl
    }

    getIcon = (iconCode) => {
        let iconEl = document.createElement('img')
        iconEl.classList.add('weather-icon')

        fetch(`http://openweathermap.org/img/wn/${iconCode}@2x.png`)
            .then(response => response.blob())
            .then((iconBlob) => {
                const imageURL = URL.createObjectURL(iconBlob)
                iconEl.src = imageURL
            })

        return iconEl
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
            console.log('use da defaults')
            return {
                lat: this.defaults.lat,
                long: this.defaults.long
            }
        }
    }

    getCurrentWeather = async (location) => {
        try {
            let response = await fetch(
                // current weather
                `${this.baseUrl}weather?lat=${location.lat}&lon=${location.long}&units=imperial&APPID=${process.env.MYAPPID}`
            )

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let weatherData = await response.json();

            // generate report
            return this.generateReport(weatherData)
        } catch(e) {
            console.log(e)
        }
    }
    
    // @todo: implement
    getForecast = async (location) => {
        try {
            let response = await fetch(
                `${this.baseUrl}onecall?lat=${location.lat}&lon=${location.long}&units=imperial&APPID=59839023800b2fa8864f25d6d76787ab`
            )
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let weatherData = await response.json();
                // generate report
                // return this.generateReport(weatherData)
        } catch(e) {
            console.log(e)
        }
    }
}

export { WeatherReport }