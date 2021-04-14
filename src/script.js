import './scss/index.scss'
import "core-js/stable";
import "regenerator-runtime/runtime";
// had a regeneratorruntime not defnied issue, hence ^, see: https://stackoverflow.com/questions/53558916/babel-7-referenceerror-regeneratorruntime-is-not-defined
const Countries =  require('../data/countries.json').countries
import { Header } from './js/header.js'
import { Menu } from './js/menu.js'
import { WeatherReport } from './js/weatherReport.js'
import { Hero } from './js/hero.js'
import { SideNav } from './js/sidenav.js'
import { Section } from './js/section.js'
import { PachinkoGame} from './js/pachinkoGame.js'

class App {
    constructor() {
        this.sectionCount = 0
        this.main = document.querySelector('main')
        this.countryData = Countries
        this.countrySections = {}
    }

    addHeader = () => {
        const header = new Header()
        this.menuTrigger = document.querySelector('.menu-cta')
    }

    addHero = () => {
        const hero = new Hero()
        hero.el.classList.add('is-visible')
        this.hero = hero
    }

    addMenu = () => {
        const menu = new Menu(this.menuTrigger)
        this.menu = menu
    }

    addWeatherReport = () => {
        const weatherReport = new WeatherReport()
        this.weatherReport = weatherReport
    }

    addIntroSection = () => {
        const introSection = new Section('Intro', this.sectionCount)
        introSection.setTitle('Heyo!')
    
        const container = document.createElement('div')
        container.classList.add('container')
    
        const blurb = document.createElement('div')
        blurb.classList.add('blurb')
        blurb.innerHTML = `<h3>The name's Harvey</h3><p><span>Jersey raised</span><span>VA grown</span><span>California - Expensive homes</span></p>`
        container.appendChild(blurb)
    
        const jerseyDiv = document.createElement('div')
        jerseyDiv.classList.add('card', 'card-jersey')
        const jerseyImg = document.createElement('div')
        jerseyImg.classList.add('image')
        jerseyImg.style.backgroundImage = `url("/images/joyz.jpg")`
        jerseyDiv.appendChild(jerseyImg)
        
        container.appendChild(jerseyDiv)
    
        introSection.addContent(container)
        
        introSection.render()
        this.sectionCount++
        this.intro = introSection
    }

    addSideNav = () => {
        const sidenav = new SideNav(this.countryData)
        this.sideNav = sidenav
        this.main.appendChild(this.sideNav.el)

        const parentEl = document.querySelector('body')
        const refEl = this.main

        parentEl.insertBefore(this.sideNav.el, refEl)
    }

    addCountrySections = () => {
        this.countryData.forEach((country) => {
            let { name, ...content } = { ...country } 
            let section = new Section(name, this.sectionCount, content)
            section.setTitle(name)
    
            const container = document.createElement('div')
            container.classList.add('container')
    
            const blurb = document.createElement('div')
            blurb.classList.add('blurb')
            blurb.innerHTML = `<h3>${content.blurb.headline}</h3><p><span>${content.blurb.phrase}</span></p>`
            container.appendChild(blurb)
    
            const cardEl = document.createElement('div')
            cardEl.classList.add('card', `card-${name.replace(/ /g, '-').toLowerCase()}`)
            const cardImg = document.createElement('div')
            cardImg.classList.add('image')
            cardImg.style.backgroundImage = `url(${content.image})`
            cardEl.appendChild(cardImg)
            
            container.appendChild(cardEl)
    
            section.addContent(container)
    
            section.render()
            this.sectionCount++
            this.countrySections[name] = section
        })
    }

    setupPachinko = () => {
        const pachinkoSection = new Section('Pachinko', this.sectionCount)
        pachinkoSection.setTitle('Up for a Challenge?')
        pachinkoSection.render()
        this.sectionCount++
        this.pachinkoSection = pachinkoSection
    
        // note: canvas being injected creates a 'lag' issue
        // probably because it takes time to paint/render
        // temporarily adding logic to wait until the section is visible to inject it
        let pachinkoGame = document.querySelector('.pachinko-stall')

        const initializePachinko = () => {
            if (pachinkoSection.intersected) {
                if (!pachinkoGame) {
                    // @todo: use computed styles
                    // 1st 40 is for translated value
                    // 2nd 40 is for left+right border width
                    // edward 40 hands
                    const sizes = {
                        width: (pachinkoSection.content.getBoundingClientRect().width - 40 - 40) * 0.8,
                        height: (pachinkoSection.content.getBoundingClientRect().height) * 0.8
                    }
    
                    let game = new PachinkoGame(sizes)
                    pachinkoGame = document.querySelector('.pachinko-stall')
    
                    const upButton = document.createElement('button')
                    upButton.classList.add('up')
                    upButton.textContent = 'up'
    
                    upButton.addEventListener('click', () => {
                        const cheese = document.querySelector('.cheese')
                        cheese.classList.add('is-visible')
                        window.scrollTo({
                            top: 0,
                            left: 0,
                            behavior: 'smooth'
                        })
                    })
                    pachinkoSection.addContent(upButton)
                } else {
                    window.removeEventListener('scroll', initializePachinko)
                }
            }
        }
        window.addEventListener('scroll', initializePachinko, false)
    }

    render = () => {
        this.addHeader()
        this.addHero()
        this.addMenu()
        this.addSideNav()
        this.addWeatherReport()
        this.addIntroSection()
        this.addCountrySections()
        this.setupPachinko()
    }
}

const app = new App()
app.render()