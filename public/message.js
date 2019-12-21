class Message {
    constructor(payload) {
        this.name = null;
        this.payload = payload;
    }

    export() {
        return {
            name: this.name,
            payload: this.payload
        }
    }

    import(msg) {
        this.name = msg.name;
        this.payload = msg.payload;
        return this;
    }

    setPayload(payload) {
        this.payload = payload;
        return this;
    }

    intent_init_world() {
        this.name = this.get_intent_initWorld();
        return this;
    }

    intent_simulation_ended() {
        this.name = this.get_intent_simulation_ended();
        return this;
    }

    get_intent_simulation_ended() {
        return "simulation_ended";
    }

    get_intent_initWorld() {
        return "init_world";
    }
}