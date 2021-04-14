class SideNav {
    constructor(items) {
        this.items = items
        
        this.el = this.createSideNav()
        
        this.bindListeners()
        this.scrollToSection = this.scrollToSection.bind(this)
    }

    bindListeners = () => {
        console.log('?')
        const sideNavItems = this.el.querySelectorAll('.sidenav__item')
        sideNavItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault()
                this.scrollToSection(e, item, index)
            })
        })
    }

    createSideNav = () => {
        const sideNav = document.createElement('nav')
        sideNav.classList.add('sidenav')
        let sideNavHTML = ''
        this.items.forEach((item) => {
            let itemTemplateString = this.createSideNavItem(item)
            sideNavHTML += itemTemplateString
        })

        sideNav.innerHTML = sideNavHTML

        return sideNav
    }

    createSideNavItem = (item) => {
        const sideNavItem = 
        `
            <a class="sidenav__item" data-anchor="${item.name.replace(/ /g, '-').toLowerCase()}" 
            href="#${item.name.replace(/ /g, '-').toLowerCase()}">
                ${item.name}
                <div class="tooltip">Fly to ${item.name}</div>
            </a>
        `
        return sideNavItem
    }

    scrollToSection = (e, item, index) => {
        console.log(e, item)
        console.log(this.items[index])
    }
    
}

export { SideNav }