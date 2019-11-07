
const ParticleTypes = [
  {
    name: "blue",
    color: "#87fffd",
    radius: 5,
    frictionModificator: 1, 
    forceRadius: 200,
    maxForce: 0.4,
    behaviour: [
      {
        name: "yellow",
        forceModificator: -1
      },
      {
        name: "blue",
        forceModificator: -1.03
      },
      {
        name: "white",
        forceModificator: 1.1
      },
      {
        name: "repelent",
        forceModificator: 1
      },
      {
        name: "purple",
        forceModificator: 1
      }
    ]
  },
  {
    name: "yellow",
    color: "#fbff1e",
    radius: 6,
    frictionModificator: 1, 
    forceRadius: 100,
    maxForce: 0.7,
    behaviour: [
      {
        name: "repelent",
        forceModificator: 1
      },
      {
        name: "blue",
        forceModificator: 1 
      },
      {
        name: "white",
        forceModificator: -1
      }
    ]
  },
  {
    name: "repelent",
    color: "#00ff55",
    radius: 4,
    frictionModificator: 0.5,
    forceRadius: 800,
    maxForce: 0.3,
    behaviour: [
      {
        name: "all",
        forceModificator: -1
      }
    ]
  },
  {
    name: "white",
    color: "white",
    radius: 6,
    frictionModificator: 1, 
    forceRadius: 180,
    maxForce: 0.8,
    behaviour: [
      {
        name: "yellow",
        forceModificator: -1.1
      }
    ]
  },
  {
    name: "purple",
    color: "purple",
    radius: 6,
    frictionModificator: 1, 
    forceRadius: 350,
    maxForce: 0.5,
    behaviour: [
      {
        name: "white",
        forceModificator: 1.1
      },
      {
        name: "yellow",
        forceModificator: 1.1
      },
      {
        name: "blue",
        forceModificator: -0.1
      },
      {
        name: "repelent",
        forceModificator: 1
      },
      {
        name: "orange",
        forceModificator: -1.3
      }
    ]
  },
  {
    name: "orange",
    color: "#ffaa00",
    radius: 6,
    frictionModificator: 1, 
    forceRadius: 300,
    maxForce: 0.6,
    behaviour: [
      {
        name: "yellow",
        forceModificator: 1
      },
      {
        name: "orange",
        forceModificator: -0.4
      },
      {
        name: "purple",
        forceModificator: -1
      }
    ]
  },
  {
    name: "pink",
    color: "#ff00f6",
    radius: 5,
    frictionModificator: 1, 
    forceRadius: 100,
    maxForce: 0.7,
    behaviour: [
      {
        name: "yellow",
        forceModificator: 1
      },
      {
        name: "orange",
        forceModificator: -0.4
      },
      {
        name: "purple",
        forceModificator: -1
      }
    ]
  },
  {
    name: "black",
    color: "black",
    radius: 5,
    frictionModificator: 1, 
    forceRadius: 200,
    maxForce: 0.8,
    behaviour: [
      {
        name: "yellow",
        forceModificator: 1
      },
      {
        name: "orange",
        forceModificator: -0.4
      },
      {
        name: "purple",
        forceModificator: -1
      }
    ]
  }
]

class Behaviour {
  constructor() {
    this.types = this.shuffleBehaviour();
  }
    
  shuffleBehaviour() {
    ParticleTypes.forEach(type => {
      type.forceRadius = Math.random() * 200 + 80;
      type.maxForce = Math.random() * 1.1;
      type.behaviour = [];
      ParticleTypes.forEach(target=> {
        if (Math.floor(Math.random() * 6) % 7 === 0) {
          return;
        }
        type.behaviour.push({
          name: target.name,
          forceModificator: Math.random() * 3.5 - 2
        })
      })
    });
    return ParticleTypes;
  }
    
  exportBehaviour() {
    window.behaviour = this.types;
    let items = JSON.parse(localStorage.getItem("saved_behaviours")) || [];
    items.push(this.types);
    localStorage.setItem(items);
    console.log("The behaviour is stored in 'behaviour' variable and in localStorage");
  }
  
  
}
