class World {

  constructor(id=null, nParticles, mode="EVOLUTION", tickBase=60) {
    if (!id) return this;
    this.canvas = document.getElementById(id);
    this.resize();
    
    this.ctx = this.canvas.getContext("2d");
    this.maxLines = Math.floor(this.canvas.height / this.lineSize);
    this.particlesOffset = this.canvas.width / this.nParticlesPerLine;
    this.shouldDraw = true;
    this.pause = false;
    this.tickBase = tickBase;
    this.ticks = 0;
    this.ticksToTime = 1000 / tickBase;
    
    this.behaviour = new Behaviour();
    this.particles = [];
    this.switchMode(mode);
    window.wrapWorld = true;
    this.food = new Food(this.canvas.width, this.canvas.height, 30);
    this.initPopulation(nParticles);
    this.generation = new Generation(this.particles);
    
    this.collision = new CollisionManager(this.particles, this.canvas.width, this.canvas.height);
    
    this.draw();
    this.interval = this.createTickInterval(this.tickBase);
  }

  simulation_constructor(particles, generation, width, height, days) {
    this.food = new Food(width, height, this.settings.foodPerDay);
    this.particles = particles;
    this.generation = generation;
    this.collision = new CollisionManager(this.particles, width, height);
    this.pause = false;
    this.ticks = 0;
    for (let i = 0; i < (this.settings.ticksPerDay * days - 2); ++i) {
      this.tick();
    }
    return this;
  }

  createTickInterval(pTickbase) {
    return setInterval(function(context) {
      context.tick.call(context);
    }, 1000 / pTickbase, this);
  }

  changeTickRate(to) {
    clearInterval(this.interval);
    this.interval = this.createTickInterval(to);
  }

  new_day() {
    this.pause = true;
    this.generation.new_day();
    this.food.populateFood();
    this.ticks = 0;
    this.pause = false;
  }
  
  switchMode (mode) {
    let nMode = this.MODE[mode] || this.MODE.BEHAVIOUR;
    let nextFriction = this.FRICTION[nMode] || this.FRICTION[this.DEFAULT_FRICTION];
    this.frictionCoefficient = nextFriction;
    this.mode = nMode;
  }
  
  shuffleBehaviour () {
    this.behaviour.shuffleBehaviour();
  }
  
  destroy() {
    clearInterval(this.interval);
    this.shouldDraw = false;
  }

  resize() {
    let realSize = this.canvas.getBoundingClientRect();
    this.canvas.width = realSize.width;
    this.canvas.height = realSize.height;
  }
  
  wrap() {
    window.wrapWorld = !window.wrapWorld;
  }

  initPopulation(nParticles) {
    let finalPopulationSize = nParticles
    let lines = Math.ceil(nParticles / this.nParticlesPerLine);
    if (lines > this.maxLines) {
      finalPopulationSize = this.maxLines * this.nParticlesPerLine;
    }
    for (let i = 0; i < finalPopulationSize; ++i) {
      let currentLine = Math.floor(i / this.nParticlesPerLine) + 1;
      let currentIndex = i % this.nParticlesPerLine;
      let currentXPos = (currentIndex * this.particlesOffset) + (this.particlesOffset / 2);
      this.particles.push(new Particle(new Vector(currentXPos , currentLine * this.lineSize), this.particles.length, this.behaviour));
    }
  }

  restartPosition() {
      this.particles.forEach((particle, i) => {
        let currentLine = Math.floor(i / this.nParticlesPerLine) + 1;
        let currentIndex = i % this.nParticlesPerLine;
        let currentXPos = (currentIndex * this.particlesOffset) + (this.particlesOffset / 2);
        particle.pos.x = currentXPos;
        particle.pos.y = currentLine * this.lineSize;
      });
  }

  skipDays(n) {
    this.pause = true;
    let worker = new Worker("world.js");
    let msg = new Message({
      particles: this.particles,
      days: n,
      generation: this.generation,
      width: this.canvas.width,
      height: this.canvas.height
    }).intent_init_world();
    worker.postMessage(msg.export());
    let ctx = this;
    worker.onmessage = (e) => {
      let received = new Message().import(e.data);
      let payload = received.payload;
      switch(received.name) {
        case received.intent_simulation_ended():
          ctx.generation = payload.generation;
          ctx.particles = payload.particles;
          worker.terminate();
          ctx.new_day();
          break;
        default:
          break;
      }
    }
  }

  tick() {
    if (this.pause) return;
    
    if (this.ticks === this.settings.ticksPerDay) this.new_day();
    this.ticks++;
    
    this.collision.collide();
    
    this.particles.forEach(particle => {
      let friction = new Vector(particle.speed)
        .negative()
        .multiply(this.frictionCoefficient)
        .multiply(particle.type.frictionModificator);
      particle.speed.add(friction);
      particle.behave(this.particles, this.food.value);
      particle.pos.add(particle.speed);
    });
  }

  draw() {
    if (!this.shouldDraw) { return; }
    requestAnimationFrame(() => {
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      this.ctx.beginPath();
      this.ctx.fillStyle = "#060719";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles.forEach(particle => {
        particle.draw(this.ctx);
      });
      this.food.value.forEach(f => {
        this.food.draw(this.ctx, f);
      });
      this.draw();
    })
  }
}

World.prototype.nParticlesPerLine = 30;
World.prototype.lineSize = 60;
World.prototype.frictionCoefficient = 0.1;
World.prototype.MODE = {};
World.prototype.FRICTION = [];
World.prototype.MODE.BEHAVIOUR = 0;
World.prototype.MODE.EVOLUTION = 1;
World.prototype.DEFAULT_FRICTION = -1;
World.prototype.FRICTION[World.prototype.DEFAULT_FRICTION] = 0.1;
World.prototype.FRICTION[World.prototype.MODE.EVOLUTION] = 0.1;
World.prototype.settings = {
  ticksPerDay: 1000,
  foodPerDay: 30
}


window.tickBase = 190;
window.nPopulation = 25;

function initSimulation(days, particles, generation, width, height) {
  let world = new World().simulation_constructor(
    particles,
    generation,
    width,
    height,
    days
  );
  let msg = new Message({
    generation: world.generation,
    particles: world.particles
  }).intent_simulation_ended();
  postMessage(msg.export());
}

function initWorker() {
    onmessage = (e => {
      let msg = new Message().import(e.data);
      let payload = msg.payload;
      switch (msg.name) {
        case msg.get_intent_initWorld():
          initSimulation(
            payload.days,
            payload.particles,
            payload.generation,
            payload.width,
            payload.height
            );
          break;
        default:
          throw Error(`Unknown message was sent with name ${msg.name}`);
      }
    });
}

function initWorld() {
  window.world = new World("world", window.nPopulation, "EVOLUTION" , window.tickBase);

  window.addEventListener("resize", () => {
    world.resize();
  });
  
  
  window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    
    if (key == 83) { // S
    } else if (key == 87) { // W
      world.wrap();
    } else if (key == 38) { // KEY_UP
      window.tickBase += 10;
      console.log(`TickBase - ${window.tickBase}`);
      world.changeTickRate(window.tickBase);
    } else if (key == 40) { // KEY_DOWN
      window.tickBase -= 10;
      console.log(`TickBase - ${window.tickBase}`);
      world.changeTickRate(window.tickBase);
    } else if (key == 49) { // 1
    } else if (key == 50) { // 2
    } else if (key == 51) { // 3
    } else if (key == 80) { // P
      world.pause = !world.pause;
    }
  }
}

var self = this;
(function() {
  if(self.document === undefined) {
    initWorker();
  } else {
    initWorld();
  }
}());

