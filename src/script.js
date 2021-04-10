import './scss/index.scss'
import * as dat from 'dat.gui'

console.log("-QuQ-")
console.log(dat)

window.addEventListener('DOMContentLoaded', (event) => {
    // console.log('DOM fully loaded and parsed');
    const hero = document.querySelector('.hero')
    setTimeout(() => {
        hero.classList.add('is-visible')
    }, 2000)
});