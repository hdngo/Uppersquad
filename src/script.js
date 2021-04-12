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

import * as dat from 'dat.gui'

// const hero = document.querySelector('.hero')
const main = document.querySelector('main')

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
    // const weatherReport = WeatherGenerator.generateReport()
    // myMenu.appendContent(weatherReport)
    // myMenu.appendContent(weatherReport.el)
    // myMenu.weatherCTA.addEventListener('click', WeatherGenerator.getWeather)
}
addWeatherSection()

// generate intro section
const addIntroSection = () => {
    const introSection = new Section('Intro', sectionCount)
    introSection.setTitle('Sup!')

    let p1 = document.createElement('p')
    p1.textContent = 'Jersey raised, VA grown, California on my own'

    let p2 = document.createElement('p')
    p2.textContent = `
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam nulla excepturi nam voluptate obcaecati placeat accusantium assumenda temporibus vero consectetur eos beatae libero iusto earum cum, hic ratione, suscipit error.
    `

    introSection.addContent(p1)
    introSection.addContent(p2)
    
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
        section.render()
        sectionCount++
    })
}
addCountrySections()

// create pachinko section
const addPachinko = () => {
    const pachinkoSection = new Section('Pachinko', sectionCount)
    pachinkoSection.setTitle('Up for a Challenge?')
    pachinkoSection.render()
    sectionCount++
}
addPachinko()