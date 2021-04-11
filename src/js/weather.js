class Weather {
    constructor(lat, long) {
        this.defaults = {
            lat: 37.39,
            long: 121.87
        }

        this.lat = lat || this.defaults.lat
        this.long = long || this.defaults.long
        this.geoEnabled = navigator.geolocation
    }

    generateReport = () => {
        let reportEl = document.createElement('div')
        reportEl.classList.add('weather-report')

        const coords = this.printCoords()
        reportEl.appendChild(coords)

        return reportEl
    }

    printCoords = () => {
        let coordsEl = document.createElement('p')
        
        if('geolocation' in navigator) {
            coordsEl.innerHTML = `lat: ${this.lat}, long: ${this.long}`
        } else {
            coordsEl.innerHTML = `Sorry, we're unable to get your location! :(`
        }

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
            console.log('womp womp')
        }

        if (this.geoEnabled) {
            console.log("sending, your location")
            navigator.geolocation.getCurrentPosition(success, error)
        } else {
            console.log('dun dun dun')
        }
    }
}

export { Weather }