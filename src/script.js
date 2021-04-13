import './scss/index.scss'
import "core-js/stable";
import "regenerator-runtime/runtime";
// had a regeneratorruntime not defnied issue, hence ^, see: https://stackoverflow.com/questions/53558916/babel-7-referenceerror-regeneratorruntime-is-not-defined
const Countries =  require('../data/countries.json').countries
import { Header } from './js/header.js'
import { Menu } from './js/menu.js'
import { WeatherReport } from './js/weatherReport.js'
import { Hero } from './js/hero.js'
import { Section } from './js/section.js'
import { PachinkoGame} from './js/pachinkoGame.js'

let sectionCount = 0

// header
const addHeader = () => {
    const header = new Header()
}
addHeader()

// hero
const addHero = () => {
    const hero = new Hero()

    hero.el.classList.add('is-visible')
}
addHero()

// menu
const menuCTA = document.querySelector('.menu-cta')
const myMenu = new Menu(menuCTA)

// get the weather
const addWeatherSection = () => {
    const weatherReport = new WeatherReport()
    // myMenu.weatherCTA.addEventListener('click', WeatherGenerator.getWeather)
}
addWeatherSection()

// generate intro section
const addIntroSection = () => {
    const introSection = new Section('Intro', sectionCount)
    introSection.setTitle('Heyo!')

    const container = document.createElement('div')
    container.classList.add('container')

    const blurb = document.createElement('div')
    blurb.classList.add('blurb')
    blurb.innerHTML = `<h3>The name's Harvey</h3><p><span>Jersey raised</span><span>VA grown</span><span>California - Expensive homes</span></p>`
    container.appendChild(blurb)

    const jerseyDiv = document.createElement('div')
    jerseyDiv.classList.add('card', 'card-jersey')
    const jerseyImg = document.createElement('img')
    jerseyImg.setAttribute("src", "/images/joyz.jpg")
    jerseyDiv.appendChild(jerseyImg)
    
    container.appendChild(jerseyDiv)

    introSection.addContent(container)
    
    introSection.render()
    sectionCount++
}
addIntroSection()

// generate country sections
const addCountrySections = () => {
    Countries.forEach((country) => {
        let { name, ...content } = { ...country } 
        let section = new Section(name, sectionCount, content)
        section.setTitle(name)

        const container = document.createElement('div')
        container.classList.add('container')

        const blurb = document.createElement('div')
        blurb.classList.add('blurb')
        blurb.innerHTML = `<h3>${content.blurb.headline}</h3><p><span>${content.blurb.phrase}</span></p>`
        container.appendChild(blurb)

        const cardEl = document.createElement('div')
        cardEl.classList.add('card', `card-${name.replace(/ /g, '-').toLowerCase()}`)
        const cardImg = document.createElement('img')
        cardImg.setAttribute("src", content.image)
        cardEl.appendChild(cardImg)
        
        container.appendChild(cardEl)

        section.addContent(container)

        section.render()
        sectionCount++
    })
}
addCountrySections()

// create pachinko section
const addPachinkoSection = () => {
    const pachinkoSection = new Section('Pachinko', sectionCount)
    pachinkoSection.setTitle('Up for a Challenge?')
    pachinkoSection.render()
    sectionCount++

    // note: canvas being injected creates a 'lag' issue
    // probably because it takes time to paint/render
    // temporarily adding logic to wait until the section is visible to inject it
    let pachinkoGame = document.querySelector('.pachinko-stall')
    window.addEventListener('scroll', () => {
        if (pachinkoSection.isVisible) {
            if (!pachinkoGame) {
                // @todo: need to subtract border width
                const sizes = {
                    width: pachinkoSection.content.getBoundingClientRect().width - 40 - 40,
                    height: pachinkoSection.content.getBoundingClientRect().height
                }

                let game = new PachinkoGame(sizes)
                pachinkoGame = document.querySelector('.pachinko-stall')

                const upButton = document.createElement('button')
                upButton.classList.add('up')
                upButton.textContent = 'up'

                upButton.addEventListener('click', () => {
                    const main = document.querySelector('main')
                    const cheese = document.querySelector('.cheese')
                    cheese.classList.add('is-visible')
                    window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                    })
                })
                pachinkoSection.addContent(upButton)
            }
        }
    })
}
addPachinkoSection()
