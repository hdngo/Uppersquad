class WeatherReport {
    constructor() {
        this.defaults = {
            lat: 37.77,
            long: -122.42
        }

        this.geoEnabled = navigator.geolocation
        this.baseUrl = 'https://api.openweathermap.org/data/2.5/'
        this.getCurrentWeather = this.getCurrentWeather.bind(this)
        this.generateLayout()
        this.getGeo = this.getGeo.bind(this)
        this.getGeo()
        this.generateReport = this.generateReport.bind(this)
        this.showLoader = this.showLoader.bind(this)
        this.getLocalWeather = this.getLocalWeather.bind(this)
        // should generate report right off the bat with user or default location
        // @todo: on page change, use location of country and update report
        // this.el = this.getCurrentWeather(this.userLocation)
    }

    // @todo: time permitting, use hourly data to generate graph
    generateLayout = () => {
        const reportEl = document.createElement('div')
        reportEl.classList.add('weather-report')
        const loaderEl = document.createElement('div')
        loaderEl.classList.add('loader')
        reportEl.appendChild(loaderEl)
        this.loader = loaderEl
        const forecastControls = document.createElement('div')
        forecastControls.classList.add('weather__controls')
        forecastControls.innerHTML = 
            `
                <button class="weather__control weather__control-local">Use My Location</button>
            `
        reportEl.appendChild(forecastControls)

        const menuContent = document.querySelector('.menu__content')
        menuContent.appendChild(reportEl)

        this.localWeatherButton = document.querySelector('.weather__control-local')
        this.localWeatherButton.addEventListener('click', this.getLocalWeather)
        this.el = reportEl
    }

    generateReport = (weatherData) => {
        // @todo: use for forecast
        // const { current , hourly, daily } = { ...weatherData }
        let iconEl = this.getIcon(weatherData.weather[0].icon)
        let reportContent = new DOMParser().parseFromString(
            `
                <div class="weather__overview">
                    <h2 class="weather__title">${weatherData.name}</h2>
                    <div class="weather__temp-current">Current Temp: ${weatherData.main.temp}&deg;</div>
                    <p class="weather__temp-extremes">
                        <span class="weather__temp-hi">${Math.round(weatherData.main.temp_max)}&deg; <span class="label">High</span></span>
                        <span class="weather__temp-lo">${Math.round(weatherData.main.temp_min)}&deg; <span class="label">Low</span></span>
                    </p>
                </div>
                <div class="weather__conditions">
                    <div class="weather__description">
                        <p class="weather__description-main">Current Condition: ${weatherData.weather[0].main}</p>
                        <p class="weather__description-sub">"${weatherData.weather[0].description}" to be precise</p>
                    </div>
                    <div class="weather__factors">
                        <div class="weather__factor weather__factor-humidity">${Math.round(weatherData.main.humidity)}% humidity</div>
                        <div class="weather__factor weather__factor-wind">${weatherData.wind.speed}mph winds</div>
                    </div>
                </div>
            `,
            'text/html'
        )
        const reportOverview = reportContent.body.firstChild
        const reportConditions = reportOverview.nextElementSibling

        this.el.appendChild(reportOverview)
        this.el.appendChild(reportConditions)
        const overviewEl = document.querySelector('.weather__overview')
        const refEl = document.querySelector('.weather__temp-current')
        overviewEl.insertBefore(iconEl, refEl)
    }

    // @todo: implement forecast
    generateWeeklyForecast = (location) => {
        console.log(location)
    }

    getIcon = (iconCode) => {
        // let iconElWrapper
        let iconEl
         = document.createElement('img')
        iconEl.classList.add('weather-icon')

        // @todo: solve cors issue for lodaing image
        fetch(`http://openweathermap.org/img/wn/${iconCode}@2x.png`, {
            mode: 'cors'
        })
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

            const latLong = {
                lat: lat,
                long: long
            }

            this.userLocation = latLong

            // current weather
            this.getCurrentWeather(latLong)

            // forecast
            // this.getWeeklyForecast(this.userLocation)
        }

        const error = () => {
            // @todo: show error message ui
            console.log(`There was an error trying to retrieve your location, so here's mine.. o_o?`)
            // should have a better error message tbh
            this.userLocation = this.defaults

            // current weather
            const weatherReport = this.getCurrentWeather(this.userLocation)

            // forecast
            // this.getWeeklyForecast(this.userLocation)
        }

        navigator.geolocation.getCurrentPosition(success, error)
    }

    getCurrentWeather = async (location) => {
        try {
            let response = await fetch(
                // current weather
                `${this.baseUrl}weather?lat=${location.lat}&lon=${location.long}&units=imperial&APPID=${process.env.MYAPPID}`
            )
            this.showLoader()
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let weatherData = await response.json();
            this.hideLoader()
            // generate report
            return this.generateReport(weatherData)
        } catch(e) {
            console.log(e)
        }
    }
    
    // @todo: implement
    getWeeklyForecast = async (location) => {
        try {
            let response = await fetch(
                `${this.baseUrl}onecall?lat=${location.lat}&lon=${location.long}&units=imperial&APPID=${process.env.MYAPPID}`
            )
            console.log('forecasting')
            this.showLoader()
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let weatherData = await response.json();
            this.hideLoader()
                this.generateWeeklyForecast()
        } catch(e) {
            console.log(e)
        }
    }
    
    getLocalWeather = () => {
        this.clearReport()
        setTimeout(() => {
            this.getGeo()
        }, 1800)
    }

    showLoader = () => {
        this.loader.classList.add('loading')
    }

    hideLoader = () => {
        this.loader.classList.remove('loading')
    }

    clearReport = () => {
        const overview = document.querySelector('.weather__overview')
        const conditions = document.querySelector('.weather__conditions')
        this.showLoader()
        overview.classList.add('disappearing')
        conditions.classList.add('disappearing')
        setTimeout(() => {
            this.el.removeChild(overview)
            this.el.removeChild(conditions)
        }, 1300)
    }
}

export { WeatherReport }