//versameling van classes

class PlacementTile {
    constructor({ position = { x: 0, y: 0 } }) {
        this.position = position;
        this.size = 32;
        this.color = 'rgba(255, 255, 255, 0)';
        this.occupied = false;
    }

    draw() {
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.size, this.size);
    }

    // als over een "placement tile" heen wordt gehovert-
    //laat zien dat plaatsen mogelijk is en laat range van het gebouw zien
    update(mouse) {
        this.draw();

        if (mouse.x > this.position.x &&
            mouse.x < this.position.x + this.size &&
            mouse.y > this.position.y &&
            mouse.y < this.position.y + this.size
        ) {
            this.color = 'rgba(255, 255, 255, 0.7)';

            this.center = {
                x: this.position.x + this.size / 2,
                y: this.position.y + this.size / 2
            }
            // !!! functie komt later !!! 
            // //groote van "range" cirkel rond "placementile"
            // const radius = this.size * 5; 
            
            // //maken van de cirkel 
            // context.beginPath();
            // context.arc(this.center.x, this.center.y, radius, 0, Math.PI * 2);
            // context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            // context.fillStyle = 'rgba(255, 255, 255, 0.5)';
            // context.lineWidth = 3;
            // context.stroke();
            // context.fill();

        } else {
            this.color = 'rgba(255, 255, 255, 0)';
        }
    }
}


class Enemy {
    constructor({ position = { x: 0, y: 0 } }) {
        this.position = position;
        this.width = 32;
        this.height = 32;
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2,
        }
        this.waypointIndex = 0;
        this.radius = 20;
        this.health = 100;
        this.speed = 2;
        this.velocity = {
            x: 0,
            y: 0
        };
    }

    draw() {
        //enemy circle
        context.fillStyle = 'red';
        // context.fillRect(this.position.x, this.position.y, this.width, this.height);
        context.beginPath()
        context.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
        context.fill();

        //enemy health bar
        context.fillStyle = "red";
        context.fillRect(this.position.x, this.position.y - 15, this.width, 10);

        context.fillStyle = "green";
        context.fillRect(this.position.x, this.position.y - 15, this.width * this.health / 100, 10);
    }

    update() {
        this.draw();

        const waypoint = waypoints[this.waypointIndex];
        const yDistance = waypoint.y - this.center.y;
        const xDistance = waypoint.x - this.center.x;
        const angle = Math.atan2(yDistance, xDistance);


        //velocity of the enemies
        this.velocity.x = Math.cos(angle) * this.speed;
        this.velocity.y = Math.sin(angle) * this.speed;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2,
        }


        if (
            Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) < 
              Math.abs(this.velocity.x) &&

            Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) < 
              Math.abs(this.velocity.y) &&
            this.waypointIndex < waypoints.length - 1
            ) {
            this.waypointIndex++;

            
        }
    }
}

class Projectile {
    constructor({ position = {x: 0, y: 0}, enemy }){
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.enemy = enemy;
        this.radius = 5;
        this.speed = 20;
     }
     draw() {
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = 'black';
        context.fill()
     }

     update() {
        this.draw();

        const angle = Math.atan2(
            this.enemy.center.y - this.position.y,
            this.enemy.center.x - this.position.x
        );
        this.velocity.x = Math.cos(angle) * this.speed;
        this.velocity.y = Math.sin(angle) * this.speed;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Building {
     constructor({ position = {x: 0, y: 0} }){
        this.position = position;
        this.width = 32;
        this.height = 32;
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }
        //"projectiles" van de gebouwen
        this.projectiles = [
            
        ]
        //hoever het gebouw kan schieten
        this.radius = 175;
        this.target;
        this.frames = 0;
     }

     draw() {
        context.fillStyle = 'blue';
        context.fillRect(this.position.x, this.position.y, 32, 32);
        
        context.beginPath()
        context.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255, 255, 255, 0.1)';
        context.fill()
    }

    update(){
        this.draw()
        if(this.frames % 50 === 0 && this.target){
            this.projectiles.push(
                new Projectile({
                position: {
                    x: this.center.x,
                    y: this.center.y
                },
                enemy: this.target
            }))
        }
        this.frames++;
    }
}

