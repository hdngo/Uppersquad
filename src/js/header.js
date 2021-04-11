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
        const logoEl = document.createElement('div')
        logoEl.classList.add('header__logo')
        logoEl.textContent = 'ME'

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
