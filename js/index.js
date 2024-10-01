
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 768;

context.fillStyle = 'white';
context.fillRect(0, 0, canvas.width, canvas.height);


//  placement tiles 
//  haal placement tiles uit array plaats in een 2d array en haal de locaties op 

const placementTilesData2D = [];

for (let i = 0; i < placementTilesData.length; i += 40) {
    placementTilesData2D.push(placementTilesData.slice(i, i + 40))
}


const placementTiles = []

placementTilesData2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 68) {
            placementTiles.push(new PlacementTile({
                position: {
                    x: x * 32,
                    y: y * 32
                }
            }))
        }
    })
})


const image = new Image();

image.onload = () => {
    animate();
}

image.src = 'img/gameMap.png';


//plaats "enemies" in de map

const enemies = []


//waves

function spawnEnemies(spawnCount){
    for (let i = 1; i < spawnCount; i++) {
        const xOffset = i * 50;
        enemies.push(
            new Enemy({
                position: { x: waypoints[0].x - xOffset, y: waypoints[0].y }
    
            })
        )
    }
}

const buildings = [];
let activeTile = undefined;
let enemyCount = 4;
//players health
let hearts = 10;
//players coins
let coins = 150;

spawnEnemies(enemyCount);

function animate() {
    const animationId = requestAnimationFrame(animate);

    context.drawImage(image, 0, 0);

    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.update();

        //remove enemy if its at end of map and decrease hearts
        if(enemy.position.x > canvas.width){
            hearts -= 1;
            enemies.splice(i, 1)
            document.querySelector('.hearts-count').innerHTML = hearts;
            
        
            //if hearts = 0 end game
            if(hearts === 0) {
                console.log("game over");
                cancelAnimationFrame(animationId);
                document.querySelector('.game-over').style.display = 'flex';
            }
        }
    }

    //check for enemies and spawn new wave
    if(enemies.length === 0){
        enemyCount += 2;
        spawnEnemies(enemyCount);
    }

    placementTiles.forEach((tile) => {
        tile.update(mouse);
    })

    //building loop
    buildings.forEach((building) => {
        building.update();
        building.target = null;
        const validEnemies = enemies.filter(enemy =>{
            const xDifference = enemy.center.x - building.center.x;
            const yDifference = enemy.center.y - building.center.y;
            const distance = Math.hypot(xDifference, yDifference);
            return distance < enemy.radius + building.radius
        });
        building.target = validEnemies[0];
        


        for (let i = building.projectiles.length - 1; i >= 0; i--) {
            const projectile = building.projectiles[i];

            projectile.update();

            const xDifference = projectile.enemy.center.x - projectile.position.x;
            const yDifference = projectile.enemy.center.y - projectile.position.y;
            const distance = Math.hypot(xDifference, yDifference);

            // if enemy gets hit
            if (distance < projectile.enemy.radius + projectile.radius) {
                projectile.enemy.health -= 20;
                
                //kill enemy
                if(projectile.enemy.health <= 0){
                    const enemyIndex = enemies.findIndex((enemy) => {
                        return projectile.enemy === enemy;
                    });

                    if(enemyIndex > -1 ) {
                        enemies.splice(enemyIndex, 1);
                        coins += 10;
                        document.querySelector('.coins-count').innerHTML = coins;
                    }
                }

                building.projectiles.splice(i, 1);
            }
        }
    });
}



//muis locatie

const mouse = {
    x: undefined,
    y: undefined
}

canvas.addEventListener('click', (event) => {
    if (activeTile && !activeTile.isOccupied && coins -50 >= 0) {
        console.log('ooooo');
        coins -= 50;
        document.querySelector('.coins-count').innerHTML = coins;
        
        buildings.push(
            new Building({
                position: {
                    x: activeTile.position.x,
                    y: activeTile.position.y
                }
            }))
        activeTile.isOccupied = true;
    }
})

window.addEventListener('mousemove', (event) => {
    const canvasRect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - canvasRect.left;
    mouse.y = event.clientY - canvasRect.top;

    activeTile = null;
    for (let i = 0; i < placementTiles.length; i++) {
        const tile = placementTiles[i];
        if (mouse.x > tile.position.x &&
            mouse.x < tile.position.x + tile.size &&
            mouse.y > tile.position.y &&
            mouse.y < tile.position.y + tile.size
        ) {
            activeTile = tile;
            break;
        }
    }
})