const R_SMOOTH = 1000.0;

const ParticleSettings = {
  loseEnergy: 0.18,
  speed: 2,
  foodRadius: 8,
  energyPerFood: 30,
  initEnergy: 100
}


class Particle {
  constructor(pos=null, id, behaviours) {
    if (!pos) return this;
    this.pos = pos;
    this.speed = new Vector(0, 0);
    this.id = id;  
    this.type  = behaviours.types[Math.floor(Math.random() * behaviours.types.length)];
   
    this.energy = null;
    this.controller = null;
    this.eatenFood = null;
    this.stats = {
      eatenFood: null,
      energy: null
    }
    this.restartStats();
  }
  
  export() {
    return {
      pos: this.pos,
      id: this.id,
      type: this.type 
    }
  }

  import(particle) {
    this.pos = new Vector(particle.pos.x, particle.pos.y);
    this.speed = new Vector(0, 0);
    this.id = particle.id
    this.type = particle.type
    this.stats = {
      eatenFood: null,
      energy: null
    }
    this.restartStats();
    return this;
  }

  restartStats() {
    this.stats.eatenFood = this.eatenFood;
    this.stats.energy = this.energy;

    this.energy = ParticleSettings.initEnergy;
    this.eatenFood = 0;
  }
  
  addForce(force) {
    this.speed.add(force);
  }

  behave(particles, food) {
    let min = 99999;
    let minParticlePos = null;
    let minFoodPos = null;
    let senses = [];

    particles.forEach(particle => {
      if (this.id === particle.id) return;

      let delta = particle.pos.clone().subtract(this.pos);
      let deltaLength = delta.length();
      if (deltaLength < min) {
        min = deltaLength;
        minParticlePos = particle.pos;
      }
      let minR = this.type.radius + particle.type.radius + this.particlesOffset;
      if (deltaLength <= minR) {
        let repelentForce = delta.clone().divide(deltaLength).multiply(R_SMOOTH * minR * (1.0 / (minR + R_SMOOTH) - 1.0 / (deltaLength + R_SMOOTH)));
        this.speed.add(repelentForce);
      }
    });

    min = 99999;
    food.forEach(f => {
      if (f.eaten) return;
      let delta = f.pos.clone().subtract(this.pos);
      let deltaLength = delta.length();
      if (deltaLength < min) {
        min = deltaLength;
        minFoodPos = f.pos;
      }
      if (deltaLength <= ParticleSettings.foodRadius) {
        f.eaten = true;
        this.eatenFood++;
        this.energy += ParticleSettings.energyPerFood;
      }
    });
    
    senses.push(this.energy / ParticleSettings.initEnergy);
    if (minFoodPos) {
      senses.push(1 / (minFoodPos.x - this.pos.x));
      senses.push(1 / (minFoodPos.y - this.pos.y));
    } else {
      senses.push(0);
      senses.push(0);
    }
    //senses.push(minParticlePos.x - this.pos.x);
    //senses.push(minParticlePos.y - this.pos.y);
    senses.push(minFoodPos ? 1 : 0);

    let action = this.controller.predict(senses);
    if ((action[1] < -0.5 || action[1] > 0.5) && this.energy > 0) {
      this.speed.x = Math.cos(action[0]) * ParticleSettings.speed;
      this.speed.y = Math.sin(action[0]) * ParticleSettings.speed;
      this.pos.add(this.speed);
      this.energy -= ParticleSettings.loseEnergy;
    }
    
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.type.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.type.color;
    ctx.fill();
  }

}

Particle.prototype.maxRadius = 15;
Particle.prototype.minRadius = 10;
Particle.prototype.particlesOffset = 15;
Particle.prototype.repelent_maxForce = 10;
Particle.prototype.repelent_ = 2;
Particle.prototype.repelent_b = (Math.log10(Particle.prototype.repelent_maxForce) / Math.log10(Particle.prototype.repelent_));