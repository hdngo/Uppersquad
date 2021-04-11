class Hero {
    constructor() {
        this.el = this.createHero()

        this.render()
    }

    createHero = () => {
        const heroEl = document.createElement('div')
        heroEl.classList.add('hero')

        const heroTitleEl = document.createElement('h1')
        heroTitleEl.classList.add('hero__title')
        heroTitleEl.innerHTML = `
            <span class="hero__title-base">The 
                <span class="hero__title-only">Only</span>
                 Way</span>
                <br/>
                <span class="hero__subtitle">
                    <span class="hero__title-is">is</span> 
                    <span class="hero__title-up">UP
                </span>
            </span>
        `

        heroEl.appendChild(heroTitleEl)

        return heroEl
    }

    render = () => {
        const main = document.querySelector('main')

        main.appendChild(this.el)
    }
}

export { Hero }