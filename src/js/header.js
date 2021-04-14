class Header {
    constructor() {
        this.el = this.createHeader()

        this.render()
    }

    createHeader = () => {
        const headerEl = document.createElement('header')
        headerEl.classList.add('header')

        const logo = this.createLogo()
        const controls = this.createControls()

        headerEl.appendChild(logo)
        headerEl.appendChild(controls)

        return headerEl
    }

    createLogo = () => {
        let logoEl = new DOMParser().parseFromString(
            `
                <div class="header__logo">ME</div>
            `,
            'text/html'
        )
        logoEl = logoEl.body.firstChild

        logoEl.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })
        })

        return logoEl
    }

    createControls = () => {
        const headerControlsEl = document.createElement('div')
        headerControlsEl.classList.add('header__controls')

        const menuCTA = this.createCTA('M')
        
        headerControlsEl.appendChild(menuCTA)

        return headerControlsEl
    }

    createCTA = (textContent) => {
        const cta = document.createElement('button')
        cta.classList.add('header__control', 'menu-cta')
        cta.textContent = textContent
        
        return cta
    }

    render = () => {
        const parentEl = document.querySelector('body')
        const refEl = document.querySelector('main')

        parentEl.insertBefore(this.el, refEl)
    }
    
}

export { Header }
