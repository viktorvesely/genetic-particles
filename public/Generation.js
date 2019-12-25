const GenerationSettings =  {
    crossoverChance: 60,
    mutationChance: 0.2,
    mutationAmplitude: 0.2,
    thresholdAmplitude: 0.02
}

class Generation {
    constructor(particles=null) {
        if (!particles) return this;
        this.particles = particles;
        this.genoms = [];
        this.particles.forEach(particle => {
            let genom = new Genom(particle);
            particle.controller = genom.nn; 
            this.genoms.push(genom);
        });
        this.generation = 0;
    }

    export() {
        return this.genoms.map(el=> {
            return el.flatten();
        });
    }

    import(particles, genoms) {
        this.particles = particles;
        this.genoms = [];
        this.particles.forEach((particle,i) => {
            let genom = new Genom(particle).loadFlatten(genoms[i]);
            particle.controller = genom.nn;
            this.genoms.push(genom);
        });
        this.generation = this.generation ? this.generation : 0;
        return this;
    }

    fitness(particle) {
        return 17*Math.pow(particle.eatenFood, 2) + (particle.energy * 0.6) * Math.max(particle.eatenFood - 1, 0);
    }
    cross(p1, p2) {
        let f1, f2;
        f1 = p1.flatten();
        f2 = p2.flatten();
        let index = this.randInt(0, f1.length - 1);
        for (let i = 0; i < f1.length; ++i) {
            if (i < index) {
                f2[i] = f1[i];
            } else {
                f1[i] = f2[i];
            }
        }
        
        p1.loadFlatten(f1);
        p2.loadFlatten(f2);
    }

    mutate(genom) {
        let flat = genom.flatten();
        flat.forEach((gene, i) => {
            if (this.roll(GenerationSettings.mutationChance)) {
                flat[i] += (Math.random()*2 -1) * GenerationSettings.mutationAmplitude;
            }
        });
        genom.loadFlatten(flat);
    }

    compareGenom(g1, g2) {
        return g1.fitness - g2.fitness;
    }

    new_day() {
        let sum = 0;
        let threshold = 0;
        let newPopulation = [];
        this.genoms.forEach(genom => {
            genom.fitness = this.fitness(genom.particle);
            sum += genom.fitness;
            genom.particle.restartStats();
        });
        console.log(`Generation #${++this.generation}`)
        console.log(`Avrg: ${sum / this.genoms.length}`);
        this.genoms = this.genoms.sort(this.compareGenom).reverse();
        console.log(`Best: ${this.genoms[0].fitness}`);
        console.log(this.genoms[0].particle.stats);
        let parent = null;
        let selected = false;
        while(newPopulation.length !== this.genoms.length) {
            let _sum = 0;
            threshold = this.randInt(0, sum  * GenerationSettings.thresholdAmplitude);
            selected = false;
            for(let i = 0; i < this.genoms.length; ++i) {
                let genom = this.genoms[i];
                _sum += genom.fitness;
                if (_sum > threshold) {
                    selected = true;
                    if (this.roll(GenerationSettings.crossoverChance)) {
                        if (parent !== null) {
                            this.cross(genom, parent);
                            this.mutate(genom);
                            newPopulation.push(genom);
                            if (newPopulation.length === this.genoms.length) break;
                            this.mutate(parent);
                            newPopulation.push(parent);                            
                            parent = null;
                            break;
                        }
                        parent = genom;
                    } else {
                        this.mutate(genom);
                        newPopulation.push(genom);
                        break;
                    } 
                }
            }
            if (!selected) break;
        }
        
    }

    roll(chance) {
        let rand = Math.random();
        return rand <= chance / 100; 
    }

    randInt(min, max) {
        return Math.floor(Math.random() * (max - min))  + min;
    }

}

Generation.prototype.day_length = 1000 * 60 * 1.5;
