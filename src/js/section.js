class Section {
    constructor(title, id, data){
        this.title = title
        this.id = id
        this.words = data && data.words ? data.words : []
        this.balloons = [] 

        this.el = this.renderSection()
        this.renderLayout()
        this.content = this.el.querySelector('.section__content')
        this.populateSection()

        this.releaseTheBalloons = this.releaseTheBalloons.bind(this)
    }

    renderSection = () => {
        let sectionEl = document.createElement('section')
        sectionEl.classList.add(
            'section',
            `section-${this.title.replace(/ /g, '-').toLowerCase()}`,
        )

        if (this.id % 2 !== 0) {
            sectionEl.classList.add('section-reverse')
        }
        
        sectionEl.setAttribute('id', `section-${this.id}`)

        return sectionEl
    }

    populateSection = () => {
        let background = this.createBackground()
        this.el.appendChild(background)
    }

    renderLayout = () => {
        let contentEl = document.createElement('div')
        contentEl.classList.add('section__content')

        this.el.appendChild(contentEl)
    }

    setTitle = (string) => {
        let titleEl = document.createElement('h2')
        titleEl.classList.add('section__title')
        titleEl.textContent = string || this.title

        this.content.appendChild(titleEl)
    }

    createBackground = () => {
        let backgroundEl = document.createElement('div')
        backgroundEl.classList.add('section__background')

        if (this.words && this.words.length) {
            this.words.forEach((word) => {
                let balloon = this.createBalloon(word)
    
                backgroundEl.appendChild(balloon)
                this.balloons.push(balloon)
            })
        }

        return backgroundEl
    }

    addContent = (node) => {
        this.content.appendChild(node)
    }

    createBalloon = (string) => {
        let balloonEl = document.createElement('div')
        balloonEl.classList.add('balloon')

        let word = string.split(' ')
        balloonEl.innerHTML = `${word.join(`<br\/>`)}`

        return balloonEl
    }

    createSectionObserver = (targetEl, threshold) => {
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

    releaseTheBalloons = () => {
        const clamp = (num, min, max) => {
            return Math.min(Math.max(min, num), max)
        }

        this.createSectionObserver(this.el)
        
        let sectionRect = this.el.getBoundingClientRect()

        this.balloons.forEach((balloon, index) => {
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
    }

    render = () => {
        const main = document.querySelector('main')
        main.appendChild(this.el)

        if (this.balloons && this.balloons.length) {
            this.releaseTheBalloons()
        } else {
            this.createSectionObserver(this.el)
        }
    }

    bindListeners = () => {
        window.addEventListener('resize', () => {
            if (this.balloons) {
                this.releaseTheBalloons()
            }
        })
    }
}

export { Section }
