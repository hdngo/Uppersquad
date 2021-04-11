import './scss/index.scss'
import * as dat from 'dat.gui'

console.log("-QuQ-")
console.log(dat)

let hero = document.querySelector('.hero')
window.addEventListener('load', (event) => {
    // console.log('DOM fully loaded and parsed');
    setTimeout(() => {
        hero.classList.add('is-visible')
    }, 700)
})

let up = hero.querySelector('.hero__title-up')
up.addEventListener('animationend', () => {
    console.log('done, scroll now')
    const main = document.querySelector('main')

    setTimeout(() => {
        main.scrollTo({
            top: hero.getBoundingClientRect().height,
            left: 0, behavior: 'smooth'
        })  
    }, 1234)
})

// note: transitionEnd event is called for each property, so for something like transform: prop1, prop2, prop3, it's called 3 times

const createSectionObserver = (targetEl, threshold) => {
    let observer

    let options = {
        root: null,
        rootMargin: "0px",
        threshold: threshold || 0.01
    }

    let target = targetEl

    observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                target.classList.add('is-visible')

                if (entry.intersectionRatio === 0.5) {
                    console.log('visible')
                }
            }

            if (!entry.isIntersecting) {
                target.classList.remove('is-visible')
            }
        })
    }, options)
    observer.observe(target)
}

const clamp = (num, min, max) => {
    return Math.min(Math.max(min, num), max)
}

const sections = document.querySelectorAll('.section')
const releaseTheBalloons = () => {
    sections.forEach((section) => {
        createSectionObserver(section)

        const balloons = section.querySelectorAll('.balloon')
        
        balloons.forEach((balloon, index) => {
            let sectionRect = section.getBoundingClientRect() // redundant
            let quadrantIndex = (index + 1) % 4
            quadrantIndex = quadrantIndex > 0 ? quadrantIndex : 4

            if (quadrantIndex % 2 === 0) {
                balloon.style.left = `${Math.random() * (sectionRect.width / 2)}px`
            } else {
                let clampedX = clamp(Math.random() + 0.5, 0.5, 1) * sectionRect.width
                
                balloon.style.left = `${clampedX}px`
            }
            if (quadrantIndex < 3) {
                balloon.style.top = `${Math.random() * (sectionRect.height / 2)}px`
            } else {    
                let clampedY = clamp(Math.random() + 0.5, 0.5, 1) * sectionRect.height

                balloon.style.top = `${clampedY}px`
            }
        })
    })
}
releaseTheBalloons()

window.addEventListener('resize', () => {
    releaseTheBalloons()

    // window.requestAnimationFrame(releaseTheBalloons)
})