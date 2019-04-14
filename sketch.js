window.engine;

function preload() {
    engine = new Engine();
}

function setup() {
}

function draw() {
    engine.update();
}

class Engine {
    constructor() {
        this.sound = loadSound('resources/tractor.mp3');

        this.status = false;
        this.speed = 0;
        this.currentSpeed = 0;
        this.currentVolume = 1;
        
        
        this.$toggleEngine = document.querySelector("#toggle_engine");
        this.$speedUp = document.querySelector("#speed_up");
        this.$speedDown = document.querySelector("#speed_down");
        this.$volumeUp = document.querySelector("#volume_up");
        this.$volumeDown = document.querySelector("#volume_down");
        this.$status = document.querySelector("#status");

        this.profiles = {
            startup: {self:"startup", speed: 0, start: 0, end: 6, next: 'idle'},
            idle: {self:"idle", speed: 1, start: 6, end: 38, next: 'idle'},
            speedUp1: {self:"speedUp1", speed: 2, start: 39, end: 42, next: 'speed1'},
            speed1: {self:"speed1", speed: 2, start: 55, end: 56.4, next: 'speed1'},
            speedUp2: {self:"speedUp2", speed: 3, start: 58, end: 64, next: 'speed2'},
            speed2: {self:"speed2", speed: 3, start: 64, end: 65, next: 'speed2'},
            shutdown: {self:"shutdown", speed: 4, start: 76, end: 80, next: 'shutdown'}
        }

        this.profile = this.profiles.startup;

        /* Audio cues
        -----------------------------------------------------------*/
            //Startup Cue
            this.sound.addCue(this.profiles.startup.end, this.nextProfile.bind(this), this.profiles.idle);
            
            //Idle repeat Cue
            this.sound.addCue(this.profiles.idle.end, this.nextProfile.bind(this), this.profiles.idle);
            
            //Hold speed1 Cue
            this.sound.addCue(this.profiles.speed1.end, this.nextProfile.bind(this), this.profiles.speed1);
            
            //Hold speed2 Cue
            this.sound.addCue(this.profiles.speed2.end, this.nextProfile.bind(this), this.profiles.speed2);

            //Shutdown engine Cue
            this.sound.addCue(this.profiles.shutdown.end, this.nextProfile.bind(this), this.profiles.shutdown);
            
            //Stop Engine Cue
            this.sound.addCue(80, this.toggleEngine);
        /*---------------------------------------------------------*/
        
        this.$toggleEngine.addEventListener('click', (e) => {
            this.toggleEngine();
        });
        
        this.$speedUp.addEventListener('click', (e) => {
            this.speedUp();
        });

        this.$speedDown.addEventListener('click', (e) => {
            this.speedDown();
        });
        
        this.$volumeUp.addEventListener('click', (e) => {
            this.currentVolume = this.currentVolume < 1 ? this.currentVolume + 0.25 : 1;
            this.sound.setVolume(this.currentVolume);
        });

        this.$volumeDown.addEventListener('click', (e) => {
            this.currentVolume = this.currentVolume > 0 ? this.currentVolume - 0.25 : 0;
            this.sound.setVolume(this.currentVolume);
        });
    }

    startEngine(){
        this.status = true;
        this.speed = 0;
        this.currentSpeed = 0;
        this.sound.stop();
        this.sound.play();
        this.$toggleEngine.innerHTML = "Stop Engine";
    }

    shutdownEngine(){
        this.status = false;
        this.currentSpeed = 4;
        this.$toggleEngine.innerHTML = "Start Engine";
    }
    

    toggleEngine() {
        this.status ? this.shutdownEngine() : this.startEngine();
    }

    nextProfile(profile){
        this.profile = profile;
        
        if(this.speed != this.profile.speed){
            this.speed = this.profile.speed;
        }

        this.sound.jump(this.profile.start);
    }

    speedUp(){
        if(this.speed < 4){
            this.speed += 1;
        }
    }

    speedDown(){
        if(this.speed > 0){
            this.speed -= 1;
        }
    }

    update() {
        this.$status.innerHTML = /*html*/`
            <div>Status: ${this.status ? "On" : "Off"}</div>
            <div>Current speed: ${this.currentSpeed}</div>
            <div>Wanted speed: ${this.speed}</div>
            <div>Current profile: ${this.profile.self}</div>
            <div>Next profile: ${this.profile.next}</div>
        `;

        if(!this.sound.isPlaying()) return;

        if(this.speed != this.currentSpeed){
            console.log("CHANGE PROFILE:::");
            
            this.currentSpeed = this.speed;

            if (this.speed == 0) {
                this.profile = this.profiles.startup;
            } if (this.speed == 1) {
                this.profile = this.profiles.idle;
            } if (this.speed == 2) {
                this.profile = this.profiles.speedUp1;
            } if (this.speed == 3) {
                this.profile = this.profiles.speedUp2;
            } if (this.speed == 4) {
                this.profile = this.profiles.shutdown;
            }

            console.log(this.speed);
            console.log(this.profile);
            console.log(this.sound.currentTime());

            this.sound.jump(this.profile.start);

            console.log(this.sound.currentTime());
        }
            
        if(this.sound.currentTime() >= this.profiles.shutdown.end){
            this.sound.stop();
        }

        // if (this.sound.currentTime() > this.profile.end){
        //     this.profile = this.profiles[this.profile.next];
        //     this.sound.jump(this.profile.start);
            
        //     console.log(this.speed);
        //     console.log(this.profile);
        // }
    }
}