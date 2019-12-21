class CollisionManager {
  constructor(particles, width, height) {
    this.particles = particles;
    this.checked = [];
    this.width = width;
    this.height = height;
  }


  addPair(uid1, uid2) {
    this.checked.push({
      first: uid1,
      second: uid2
    });
  }

  checkPair(uid1, uid2) {
    for (let i = 0; i < this.checked.length; ++i) {
      let pair = this.checked[i];
      let option1 = pair.first === uid1 && pair.second === uid2;
      let option2 = pair.first === uid2 && pair.second === uid1;
      if (option1 || option2) return true;
    }
    return false;
  }

  clearPairs() {
    this.checked = [];
  } 

  outOfBoundaries(particle) {
    let colliderPredict = new Vector(particle.pos).add(particle.speed);
    let x = colliderPredict.x;
    let y = colliderPredict.y;
    let radius = particle.type.radius;
    if (typeof window !== "undefined" ? window.wrapWorld : true) {
      if (x <= -radius) {
        particle.pos.x = this.width + radius;
      } else if (x >= this.width - radius) {
        particle.pos.x = -radius;
      }
      
      if (y <= -radius) {
        particle.pos.y = this.height + radius;  
      } else if (y >= this.height - radius) {
        particle.pos.y = -radius;
      }
    } else {
      if (x <= radius) {
        particle.pos.x = radius;
        particle.speed.x = -particle.speed.x;    
      } else if (x >= this.width - radius) {
        particle.pos.x = this.width - radius;
        particle.speed.x = -particle.speed.x;
      }
      
      if (y <= radius) {
        particle.pos.y = radius;
        particle.speed.y = -particle.speed.y;
      } else if (y >= this.height - radius) {
        particle.pos.y = this.height - radius;
        particle.speed.y = -particle.speed.y;
      }
    } 
  }

  collide() {
    for (let i = 0; i < this.particles.length; ++i) {
      let collider = this.particles[i];
      this.outOfBoundaries(collider);
    }
    // this.clearPairs();
  }

}

CollisionManager.prototype.particlesOffset = 2;
