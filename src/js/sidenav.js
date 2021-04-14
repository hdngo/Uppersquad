class SideNav {
    constructor(items, weatherReport) {
        this.items = items
        this.weatherReport = weatherReport
        
        this.el = this.createSideNav()
        
        this.bindListeners()
        this.scrollToSection = this.scrollToSection.bind(this)
        this.activeItem = null
        this.flyEvent = null
        this.generateReport = this.generateReport.bind(this)
        window.addEventListener('fly', this.generateReport)
    }

    bindListeners = () => {
        const sideNavItems = this.el.querySelectorAll('.sidenav__item')
        sideNavItems.forEach((item) => {
            item.addEventListener('click', (e) => {
                e.preventDefault()
                this.scrollToSection(e)
            })
        })
    }

    createSideNav = () => {
        const sideNav = document.createElement('nav')
        sideNav.classList.add('sidenav')
        let sideNavHTML = '<ul class="sidenav__list">'
        this.items.forEach((item, index) => {
            let itemTemplateString = this.createSideNavItem(item, index)
            sideNavHTML += itemTemplateString
        })

        sideNav.innerHTML = sideNavHTML

        return sideNav
    }

    createSideNavItem = (item, index) => {
        const sideNavItem = 
        `
            <a class="sidenav__item" data-country-index="${index}" data-country="${item.name.replace(/ /g, '-').toLowerCase()}" 
            href="#${item.name.replace(/ /g, '-').toLowerCase()}">
                ${item.name}
                <div class="tooltip">Fly to ${item.name}</div>
            </a>
        `
        return sideNavItem
    }
    
    generateReport = (e) =>{
        this.weatherReport.clearReport()
        setTimeout(() => {
            this.weatherReport.getCurrentWeather(e.detail.country.location)
        }, 1500)
    }

    scrollToSection = (e) => {
        if (e.target === this.activeItem) {
            return
        }
        
        const targetClass = e.target.getAttribute('data-country')
        const targetSection = document.querySelector(`.section-${targetClass}`)
        const targetId = e.target.getAttribute('data-country-index')
        const item = this.items[targetId]
        
        if (this.flyEvent) {
            this.flyEvent = null
        }
        
        const flyEvent = new CustomEvent(
            'fly', { 
                detail: { country: item }
            }
        )
        this.flyEvent = flyEvent

        window.dispatchEvent(flyEvent)
        
        window.scrollTo({
            top: targetSection.offsetTop,
            left: 0,
            behavior: 'smooth'
        })
        // this.weatherReport.getCurrentWeather(item)

        const main = document.querySelector('main')

        if (this.activeItem) {
            this.activeItem.classList.remove('is-active')
        }

        e.target.classList.add('is-active')
        this.activeItem = e.target
    }
    
}

export { SideNav }