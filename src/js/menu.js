class Menu {
    constructor(trigger) {
        this.trigger = trigger
        this.opened = false

        this.el = this.renderMenu()
        this.renderLayout()
        this.content = this.el.querySelector('.menu__content')

        // this.weatherCTA = this.renderWeatherButton();

        this.bindListeners()
    }

    renderMenu = () => {
        let menuEl = document.createElement('aside')
        const parentEl = document.querySelector('body')
        const refEl = document.querySelector('main')

        parentEl.insertBefore(menuEl, refEl)

        return menuEl
    }

    renderLayout = () => {
        this.el.classList.add('menu')
        let menuWrapper = document.createElement('div')
        menuWrapper.classList.add('menu__wrapper')

        let menuContent = document.createElement('div')
        menuContent.classList.add('menu__content')

        menuWrapper.appendChild(menuContent)
        this.el.appendChild(menuWrapper)
    }

    bindListeners = () => {
        this.trigger.addEventListener('click', this.toggleOpened)
    }

    toggleOpened = () => {
        this.opened = !this.opened
        
        if (this.opened) {
            this.open()
        } else {
            this.close()
        }
    }

    open = () => {
        this.el.classList.add('menu--is-open')
    }

    close = () => {
        this.el.classList.remove('menu--is-open')
    }

    /* renderWeatherButton = () => {
        let weatherBtnEl = document.createElement('button')
        weatherBtnEl.classList.add('weather__control')
        weatherBtnEl.textContent = 'W'

        this.appendContent(weatherBtnEl)

        return weatherBtnEl
    } */

    appendContent = (contentNode) => {
        this.content.appendChild(contentNode)
    }
}

export { Menu }