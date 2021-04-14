class PachinkoGame {
    constructor(dimensions) {
        this.isActive = false
        this.score = 0
        this.ctx = null
        this.dimensions = {
            width: dimensions.width,
            height: dimensions.height
        }

        this.walls = {
            top: { status: 0 },
            right: { status: 0 },
            bottom: { status: 0 },
            left: { status: 0 }
        }

        //https://www.engineersedge.com/coeffients_of_friction.htm
        this.physics = {
            gravity: 0.3, // arbitrary
            friction: 0.9, // rubber x asphalt
        }

        this.createCanvas()

        // move into function
        // make ball dims based off canvas size
        this.ball = {
            position: {
                x: this.canvas.width / 2,
                y: 40,
            },
            color: 'teal',
            altColors: [
                'orange',
                'magenta',
                'goldenrod',
                'grey'
            ],
            radius: 30,
            bounce: 0.8, // https://en.wikipedia.org/wiki/Coefficient_of_restitution
            velocity: {
                x: 3.7, // arbitrary
                y: 2 // arbitrary
            }
        }

        this.mouseMoveHandler = this.mouseMoveHandler.bind(this)
        this.keyUpHandler = this.keyUpHandler.bind(this)
        this.resizeHandler = this.resizeHandler.bind(this)
        this.releaseBall = this.releaseBall.bind(this)

        this.bindListeners()
        this.easterEgg = "S'Upperquad!"
        this.render()
    }

    createCanvas = () => {
        const canvasContainer = document.createElement('div')
        canvasContainer.classList.add('pachinko-stall')
        let canvas = document.createElement('canvas')
        canvas.setAttribute('id', 'pachinko')
        
        this.container = canvasContainer
        this.canvas = canvas
        this.setCanvasDimensions(this.dimensions)
        canvasContainer.appendChild(canvas)

        this.ctx = this.canvas.getContext('2d')
    }

    setCanvasDimensions = (dimensions) => {
        this.canvas.width = dimensions.width
        this.canvas.height = dimensions.height
    }

    bindListeners = () => {
        document.addEventListener('keyup', this.keyUpHandler, false)
        this.canvas.addEventListener('mousemove', this.mouseMoveHandler, false)
        this.canvas.addEventListener('mousedown', this.mouseDownHandler, false)
        this.canvas.addEventListener('mouseup', this.mouseUpHandler, false)
        window.addEventListener('resize', this.resizeHandler, false)
        this.canvas.addEventListener('click', this.releaseBall, false)
    }

    mouseMoveHandler = (e) => {
        ('moving')
        // 100 is the container offset..
        // 60 for the translate and the border offset
        // translated 40, border width 20
        let relativeX = e.clientX - this.canvas.offsetLeft - 100 - 60 - this.container.offsetLeft

        if (relativeX < this.ball.radius) {
            this.ball.position.x = this.ball.radius
            return
        }

        if (relativeX >= this.canvas.width - this.ball.radius) {
            this.ball.position.x = this.canvas.width - this.ball.radius
            return
        }
        if (relativeX > 0 && relativeX < this.canvas.width) {
            this.ball.position.x = relativeX
            return
        }
    }

    addForce = (e) => {
        if (this.isActive) {
            let relativeX = e.clientX - this.canvas.offsetLeft - 100 - 60 - this.container.offsetLeft
            // border top 20
            // got lucky with using bounding rect, maybe use it for relativeX ?
            let relativeY = e.clientY - this.canvas.getBoundingClientRect().top - 20
            
            if (relativeX < 20 || relativeX > this.canvas.width) {
                relativeX = 0
            }
            
            if (relativeY < 20 || relativeY > this.canvas.height) {
                relativeY = 0
            }
             // use relative x and find distance from ball, to apply a force equal to dif
            let force = { x: 0, y: 0 }
            if (relativeX !== this.ball.position.x) {
                force.x = relativeX < this.ball.position.x ? this.ball.position.x - relativeX : -1 *(relativeX - this.ball.position.x)
            }

            if (relativeY !== this.ball.position.y) {
                force.y = relativeY < this.ball.position.y ?  this.ball.position.y - relativeY : -1 *(relativeY - this.ball.position.y)
            }

            this.ball.velocity.x += force.x / 10
            this.ball.velocity.y += force.y / 10
        }
    }

    keyUpHandler = (e) => {
        if(e.key === " " || e.key === "Spacebar") {
            this.reset()
        }
    }

    reset = () => {
        this.isActive = false
        this.ball.position.x = this.canvas.width / 2
        this.ball.position.y = 40
        this.ball.velocity.x = 3.7
        this.ball.velocity.y = 2
        this.canvas.style.borderBottomColor = "#e100ff"
        this.canvas.style.borderTopColor = "#e100ff"
        this.canvas.style.borderLeftColor = "#e100ff"
        this.canvas.style.borderRightColor = "#e100ff"
        this.walls = {
            top: { status: 0 },
            right: { status: 0 },
            bottom: { status: 0 },
            left: { status: 0 }
        }
        this.canvas.addEventListener('mousemove', this.mouseMoveHandler)
        this.canvas.removeEventListener('click', this.addForce)
        if (!this.score) {
            this.score = 0
        }
    }

    resizeHandler = (e) => {
        const parentElement = this.container.parentElement
        const borderLeftWidth = getComputedStyle(this.canvas).getPropertyValue('border-left-width')
        const borderRightWidth = getComputedStyle(this.canvas).getPropertyValue('border-right-width')
        const borderWidth = parseInt(borderLeftWidth.replace('px', ''))+ parseInt(borderRightWidth.replace('px', ''))

        const sizes = {
            width: (parentElement.getBoundingClientRect().width - borderWidth - 40) * 0.8,
            height: (parentElement.getBoundingClientRect().height) * 0.4
        }

        this.setCanvasDimensions(sizes)

        this.reset()
    }

    releaseBall = () => {
        this.canvas.addEventListener('click', this.addForce, false)
        this.isActive = true
        this.canvas.removeEventListener('mousemove', this.mouseMoveHandler)
    }

    changeBallColor = () => {
        let randomIndex = Math.floor(Math.random() * this.ball.altColors.length)
        this.ball.color = this.ball.altColors[randomIndex]
    }

    revealEasterEgg = () => {
        const revealedString = this.easterEgg.substring(0, this.score)

        if (revealedString) {
            this.ctx.font = "24px luckiest_guyregular"
            this.ctx.fillStyle = "magenta"
            this.ctx.fillText(revealedString, 15, this.canvas.height / 2 + 20)
        }

        if (this.score === this.easterEgg.length) {
            // game end
            return
        }
    }

    drawScore = () => {
        this.ctx.font = "12px robotothin"
        this.ctx.fillStyle = "#00CCC"
        this.ctx.fillText(`Score: ${this.score}`, 5, 10)
    }

    drawVelocityStats = () => {
        this.ctx.font = "10px robotothin"
        this.ctx.fontWeight = "700" // ?
        this.ctx.fillStyle = "#000000"
        this.ctx.fillText(`Vx: ${this.ball.velocity.x.toFixed(2)} Vy: ${this.ball.velocity.y.toFixed(2)}`, 5, 30)
        // note: check stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary for performance and optimization
    }

    drawBall = () => {
        this.ctx.beginPath()
        this.ctx.arc(this.ball.position.x, this.ball.position.y, this.ball.radius, 0, Math.PI*2)
        this.ctx.fillStyle = this.ball.color
        this.ctx.fill()
        this.ctx.closePath()
    }

    checkScoringCondition = () => {
        // status..plural ?
        let wallStati = []
        Object.values(this.walls).forEach((wall) => {
            wallStati.push(wall.status)
        })

        let scored = wallStati.every((status) => 
            status === 1
        )

        if (scored) {
            if (this.score < this.easterEgg.length) {
                this.score++
                this.reset()
            } else {
                this.reset()
            }
        }
        return scored
    }

    draw = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.revealEasterEgg()
        this.drawBall()
        this.drawVelocityStats()
        this.drawScore()

        // physics application
        if (this.isActive) {
            // note: figure out how to detect ball has stopped
            // bottom wall
            if (this.ball.position.y + this.ball.radius >= this.canvas.height) {
                this.ball.velocity.y *= -this.ball.bounce
                this.ball.velocity.x *= this.physics.friction
                this.ball.position.y = this.canvas.height - this.ball.radius
                this.walls.bottom.status = 1
                this.canvas.style.borderBottomColor = 'teal'
            }
    
            // top wall
            if (this.ball.position.y - this.ball.radius <= 0) {
                this.ball.velocity.y *= -this.ball.bounce
                this.ball.position.y = this.ball.radius
                this.ball.velocity.x *= this.physics.friction
                this.canvas.style.borderBottomColor = 'teal'
                this.walls.top.status = 1
                this.canvas.style.borderTopColor = 'teal'
            }
    
            // left wall
            if (this.ball.position.x - this.ball.radius <= 0) {
                this.ball.velocity.x *= -this.ball.bounce
                this.ball.position.x = this.ball.radius
                this.changeBallColor()
                this.walls.left.status = 1
                this.canvas.style.borderLeftColor = 'teal'
            }
    
            // right wall
            if (this.ball.position.x + this.ball.radius >= this.canvas.width) {
                this.ball.velocity.x *= -this.ball.bounce
                this.ball.position.x = this.canvas.width - this.ball.radius
                this.changeBallColor()
                this.walls.right.status = 1
                this.canvas.style.borderRightColor = 'teal'
            }

            this.checkScoringCondition()

            // @todo: figure out when the ball has officially stopped

            this.ball.velocity.y += this.physics.gravity

            this.ball.position.x += this.ball.velocity.x
            this.ball.position.y += this.ball.velocity.y
        }
        requestAnimationFrame(this.draw)
    }

    render = () => {
        const pachinkoContent = document.querySelector('.section-pachinko .section__content')
        pachinkoContent.appendChild(this.container)

        this.draw()
    }
}

export { PachinkoGame }
