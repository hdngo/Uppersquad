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

    addUpButton = () => {
        let upButton = new DOMParser().parseFromString(
            `
                <button class="up">UP</button>
            `,
            'text/html'
        )
        upButton = upButton.body.firstChild
        this.main.appendChild(upButton)
        this.upButton = upButton
        upButton.addEventListener('click', (e) => {
            const cheese = document.querySelector('.cheese')
            cheese.classList.add('is-visible')
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })

            e.target.classList.remove('is-visible')
        })
    }

    addIntroSection = () => {
        const introSection = new Section('Intro', this.sectionCount)
        introSection.setTitle('Heyo!')
    
        const container = document.createElement('div')
        container.classList.add('container')
        container.innerHTML = `
            <div class="blurb">
                <h3>The name's Harvey</h3>
                <p>
                    <span>Jersey raised</span>
                    <span>VA grown</span>
                    <span>California - Expensive homes</span>
                </p>
                <p>keep scrollin' to peep<br/>some of the other places I've been to!</p>
            </div>
            <div class="card card-jersey">
                <div class="image" style="background-image: url('/images/joyz.jpg')"></div>
            </div>
        `
        introSection.addContent(container)
        introSection.render()
        this.sectionCount++
        this.intro = introSection
    }

    addSideNav = () => {
        const sidenav = new SideNav(this.countryData, this.weatherReport)
        this.sideNav = sidenav
        this.main.appendChild(this.sideNav.el)

        const parentEl = document.querySelector('body')
        const refEl = this.main

        parentEl.insertBefore(this.sideNav.el, refEl)
        window.addEventListener('scroll', () => {
            const hero = document.querySelector('.hero')
            const main = document.querySelector('main')
            if (main.scrollTop > hero.getBoundingClientRect().bottom) {
                sidenav.el.classList.add('is-visible')
            } else {
                sidenav.el.classList.remove('is-visible')
                this.upButton.classList.remove('is-visible')
            }
        })
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

        // @todo: re-add instructions; height constraint and content loading causes a strange scroll jack issue
        /* let instructions = new DOMParser().parseFromString(
            `
                <div class="instructions">
                    <h3>How to Play</h3>
                    <p>Drop ball: Click.</p>
                    <p>Apply force: Click around!</p>
                    <p>Reset: Space Key</p>
                    <p>Win: Hit all 4 walls</p>
                    <p>There's 12 rounds, so get goin!</p>
                </div>
            `,
            'text/html'
        )
        instructions = instructions.body.firstChild
        this.pachinkoSection.addContent(instructions) */

        // note: canvas being injected creates a 'lag' issue
        // probably because it takes time to paint/render
        // temporarily adding logic to wait until the section is visible to inject it
        let pachinkoGame = document.querySelector('.pachinko-stall')

        const initializePachinko = () => {
            if (pachinkoSection.intersected) {
                this.upButton.classList.add('is-visible')

                if (!pachinkoGame) {
                    // @todo: use computed styles
                    // 1st 40 is for translated value
                    // 2nd 40 is for left+right border width
                    // edward 40 hands
                    const sizes = {
                        width: (pachinkoSection.content.getBoundingClientRect().width - 40 - 40) * 0.8,
                        height: (pachinkoSection.content.getBoundingClientRect().height) * 0.4
                    }
    
                    let game = new PachinkoGame(sizes)
                    pachinkoGame = document.querySelector('.pachinko-stall')

                    window.addEventListener('scroll', () => {
                        const fullyVisibleSections = document.querySelectorAll('.section.is-full-view')
                        if (fullyVisibleSections && fullyVisibleSections.length) {
                            this.upButton.classList.add('is-visible')
                        }
                    })
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
        this.addWeatherReport()
        this.addSideNav()
        this.addUpButton()
        this.addIntroSection()
        this.addCountrySections()
        this.setupPachinko()
    }
}

const app = new App()
app.render()