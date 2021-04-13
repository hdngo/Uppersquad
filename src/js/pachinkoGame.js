class PachinkoGame {
    constructor(dimensions) {
        this.isActive = false
        this.score = 0
        this.ctx = null
        this.dimensions = {
            width: dimensions.width,
            height: dimensions.height
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
                y: 30,
            },
            color: 'teal',
            altColors: [
                'orange',
                'magenta',
                'goldenrod',
                'grey'
            ],
            radius: this.canvas.width / 25,
            bounce: 0.8, // https://en.wikipedia.org/wiki/Coefficient_of_restitution
            velocity: {
                x: 3.7, // arbitrary
                y: 2 // arbitrary
            },
            delta: {
                x: 0,
                y: 0
            }
        }
        console.log(this.canvas.height - this.ball.radius)

        this.mouseMoveHandler = this.mouseMoveHandler.bind(this)
        this.keyUpHandler = this.keyUpHandler.bind(this)
        this.resizeHandler = this.resizeHandler.bind(this)
        this.releaseBall = this.releaseBall.bind(this)

        this.bindListeners()

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
        document.addEventListener('mousemove', this.mouseMoveHandler, false)

        window.addEventListener('resize', this.resizeHandler, false)
        this.canvas.addEventListener('click', this.releaseBall, false)
    }

    mouseMoveHandler = (e) => {
        // 100 is the container offset..
        // 60 for the translate and the border offset
        // translated 40, border width 20
        let relativeX = e.clientX - this.canvas.offsetLeft - 100 - 60
        if(this.relativeX === this.canvas.width / (this.brickColumnCount + 1)) {
            debugger
        }
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

    keyUpHandler = (e) => {
        if(e.key === " " || e.key === "Spacebar") {
            this.reset()
        }
    }

    reset = () => {
        this.isActive = false
        this.ball.position.x = this.canvas.width / 2
        this.ball.position.y = 30
        this.ball.velocity.x = 3.7
        this.ball.velocity.y = 2 
        document.addEventListener('mousemove', this.mouseMoveHandler)
    }

    resizeHandler = (e) => {
        const sizes = {
            width: this.container.parentElement.getBoundingClientRect().width,
            height: this.container.parentElement.getBoundingClientRect().height
        }

        this.setCanvasDimensions(sizes)
    }

    releaseBall = () => {
        this.isActive = true
        document.removeEventListener('mousemove', this.mouseMoveHandler)
    }

    changeBallColor = () => {
        let randomIndex = Math.floor(Math.random() * this.ball.altColors.length)
        this.ball.color = this.ball.altColors[randomIndex]
    }


    drawScore = () => {
        this.ctx.font = "16px Helvetica"
        this.ctx.fillStyle = "#00CCC"
        this.ctx.fillText(`Score: ${this.score}`, 8, 20)
    }

    drawBall = () => {
        this.ctx.beginPath()
        this.ctx.arc(this.ball.position.x, this.ball.position.y, this.ball.radius, 0, Math.PI*2)
        this.ctx.fillStyle = this.ball.color
        this.ctx.fill()
        this.ctx.closePath()
    }

    draw = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawBall()
        // this.drawScore()

        // physics application
        if (this.isActive) {
            // bottom wall
            if (this.ball.position.y + this.ball.radius >= this.canvas.height) {
                this.ball.velocity.y *= -this.ball.bounce
                this.ball.velocity.x *= this.physics.friction
                this.ball.position.y = this.canvas.height - this.ball.radius
            }
    
            // top wall
            if (this.ball.position.y - this.ball.radius <= 0) {
                this.ball.velocity.y *= -this.ball.bounce
                this.ball.position.y = this.ball.radius
                this.ball.velocity.x *= this.physics.friction
            }
    
            // left wall
            if (this.ball.position.x - this.ball.radius <= 0) {
                this.ball.velocity.x *= -this.ball.bounce
                this.ball.position.x = this.ball.radius
                this.changeBallColor()
            }
    
            // right wall
            if (this.ball.position.x + this.ball.radius >= this.canvas.width) {
                this.ball.velocity.x *= -this.ball.bounce
                this.ball.position.x = this.canvas.width - this.ball.radius
                this.changeBallColor()
            }

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
