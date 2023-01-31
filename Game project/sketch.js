//Game Project 7 - Make it Awesome! 

//~~~~~~~~~~~~~~~~~~~Global variables~~~~~~~~~~~~~~~~~~~\\

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

//char movement variables
var isLeft;
var isRight;
var isFalling;
var isPlummeting;

//game logic variables
var game_score;
var flagpole;
var lives;


var platform;
var enemies;


//sounds and music variables
var bgMusic;
var jump;
var collectableSound;
var win;
var gameOver;


// function preload()
// {
//     soundFormats('mp3','wav');
    
//     //sounds are loaded here
//     bgMusic = loadSound('assets/nemu');
//     gameOver = loadSound('assets/aests - FIGHT')
//     jump = loadSound('assets/jump');
//     win = loadSound('assets/win');
//     collectableSound = loadSound('assets/collectableSound');
    
//     //volume level of each sound
//     bgMusic.setVolume(0.4); 
//     jump.setVolume(0.3);   
//     collectableSound.setVolume(0.5);
//     gameOver.setVolume(0.3);
//     win.setVolume(0.5);    
// }

function setup()
{
    //bacjground music starts playing and starts 
    //again when it ends
   // bgMusic.play();
    //bgMusic.loop();
    
    createCanvas(1024, 576);
	floorPos_y = height * 3/4;  
	
    //number of lives is 3 but javascript
    //counts 0 as first number, thus, 4 is used
    lives = 4;
    
    startGame();
    
}


function startGame()
{

    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    

	// Variable to control the background scrolling.
	scrollPos = 0;

	//Variable to store the real position of the gameChar in the game world. 
    //also needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	//Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	//~~~~~~~~~~~~~~~~~~~ Arrays initialization of scenery objects (position, size...)~~~~~~~~~~~~~~~~~~~\\
    
    trees_x = [260, 650, 800, 1000, 1200, 1500, 1555, 1800, 2000, 2200, 2300, 2700, 2900, 3000, 3200, 3400, 3550, 3700];
    
    clouds =[ 
        {x_pos: 20, y_pos : 20, size: 55},
        {x_pos: 450, y_pos : 10, size: 47}, 
        {x_pos: 1200, y_pos : 80, size: 60},
        {x_pos: 1500, y_pos : 20, size: 60},   
        {x_pos: 1900, y_pos : 40, size: 60},        
    ]
    
    angel = [
        {x_pos: 2050, y_pos : 20, size: 60},
        {x_pos: 2550, y_pos : 20, size: 60},
        {x_pos: 2950, y_pos : 20, size: 60},
        {x_pos: 3350, y_pos : 20, size: 60},
        {x_pos: 3750, y_pos : 20, size: 60},
    ]
    
    volcanoes =[ 
        {x_pos: 10, y_pos: 10, size: 60},
        {x_pos: 450, y_pos : 10, size: 60},
        {x_pos: 800, y_pos : 10, size: 60},
        {x_pos: 1500, y_pos : 10, size: 60},
    ]
    
    canyon = [ 
        {x_pos: 500, width: 100},
        {x_pos: 800, width: 160},
        {x_pos: 1460, width: 100},
        {x_pos: 1800, width: 70},
        {x_pos: 2000, width: 100},
        {x_pos: 2600, width: 100},  
        {x_pos: 2800, width: 100},  
        {x_pos: 2900, width: 80}, 
        {x_pos: 3100, width: 80}, 
        {x_pos: 3400, width: 40}, 
        {x_pos: 3380, width: 50}, 
        
    ]
    
    collectable = [
        {x_pos: 150, y_pos: 315, size: 10, isFound: false},
        {x_pos: 300, y_pos: 315, size: 1, isFound: false},
        {x_pos: 580, y_pos: 400, size: 2, isFound: false},
        {x_pos: 1020, y_pos: 400, size: 10, isFound: false},
        {x_pos: 1600, y_pos: 300, size: 25, isFound: false},
        {x_pos: 2020, y_pos: 400, size: 2, isFound: false},
        {x_pos: 2420, y_pos: 350, size: 2, isFound: false},
        {x_pos: 2520, y_pos: 550, size: 20, isFound: false},
        {x_pos: 2820, y_pos: 550, size: 20, isFound: false},
        {x_pos: 3020, y_pos: 550, size: 20, isFound: false},

    ] 
    
    flagpole= {
        x_pos : 3550,
        isReached: false
        
    }

    //Platform array and position so the numbers define, x and y position   +
    //and the length
    platforms = []; 
    platforms.push(createPlatform(290, floorPos_y - 80, 80));
    platforms.push(createPlatform(450, floorPos_y - 80, 70));
    platforms.push(createPlatform(700, floorPos_y - 80, 50));
    platforms.push(createPlatform(780, floorPos_y - 80, 50));
    platforms.push(createPlatform(1690, floorPos_y - 80, 150));
    platforms.push(createPlatform(1930, floorPos_y - 80, 40));
    
    //Enemy array and position so the numbers define, x and y position
    //and its distance    
    enemies= [];
    enemies.push(new Enemy(0, floorPos_y, 100));
    enemies.push(new Enemy(700, floorPos_y, 100));
    enemies.push(new Enemy(1010, floorPos_y, 100));
    enemies.push(new Enemy(1210, floorPos_y, 100)); 
    enemies.push(new Enemy(1720, floorPos_y - 80, 40));
    enemies.push(new Enemy(1920, floorPos_y, 90));
    enemies.push(new Enemy(3220, floorPos_y, 90));
    
    //Decrements life each time when the character falls down the canyon
    //or collides with the enemy
    lives -= 1;
    game_score = 0;
    
}



function draw()
{
    
   //This coniditional statement allows the background and the ground to
   //change colour when the character crosses 2000 pixels
    
    if( gameChar_world_x < 2000)
    {
        background(255, 140, 0);
        //draws ground
        fill(128, 128, 128);
        noStroke();
        rect(0, floorPos_y, width, height/4); 
        
    }
    
    else{ 
        background(173, 216, 230);
        fill(240, 128, 128);
        noStroke();
        rect(0, floorPos_y, width, height/4); 
    }


    //Push saves the current drawing style settings and transformations
    //while pop() restores these settings
    
    push();
    translate(scrollPos, 0);

	//Calls the draw clouds.
    drawClouds(); 

	//Calls the draw volcanoes.
    drawVolcanoes();
    
    //Calls the draw trees.
    drawTrees();
  
    //Calls the draw angel clouds
    drawAngel();

    //Checks the collectable's state
    for (var i = 0; i < collectable.length; i++)
        {
            if (collectable[i].isFound == true) {}
            
            else 
            {
                drawCollectable(collectable[i]);
                checkCollectable(collectable[i]);   
            } 
        }
    

    // Checks the canyon's state
    for (var i = 0; i < canyon.length; i++)
        {
            drawCanyon(canyon[i]);
            checkCanyon(canyon[i]);   
        }
    
    //calls the renderFlagpole function
    renderFlagpole(); 
    
    //platform
    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
    
    //checks enemy contact
    for (var i = 0; i < enemies.length; i++)
        {
            enemies[i].update();
            enemies[i].draw();
            
            if(enemies[i].isContact(gameChar_world_x, gameChar_y))
                {
                    startGame();
                    break;
                }
        }

    pop();
    

	//Calls game character function
	
	drawGameChar();
    
    
    //draw screen text   
    fill(0);
    textSize(25);
    text("score: " + game_score, 20, 20);  
    
    
    //if live is at 0, game over is displayed
    //gameOver sound is played once
    //no further movement
    if (lives < 1)
        {
            bgMusic.stop();
            text("Game over. Press space to continue", 450, 300);
            //gameOver.play();
            //gameOver.noLoop();            
            return    
        }
    
    //when the char reaches the flagpole, the text is displayed
    //win sound is displayed
    //no further movement
    if (flagpole.isReached == true)
        {
            bgMusic.stop();
            text("Level complete. Press space to continue", 460, 300);
          //  win.play();
           // win.noLoop();            
            return    
        }

    for (var i = 0; i< lives; i++)
    {
        text("lives :" + lives, 20, 50);            
        }
    
    // Logic to make the game character rise and fall.
    if(gameChar_y < floorPos_y)
        {
            //local variable
            var isContact = false;
            for(var i = 0; i < platforms.length; i++)
                {
                    if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
                        {
                            isContact = true;
                            break;
                        }
                }
            if(isContact == false)
                {
                    isFalling = true;  
                    gameChar_y += 2;   
                }
            else 
                {
                    isFalling = false;
                }
        }
    
    else
        {
            isFalling = false;         
        }

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; 
		}
	}

    if(isPlummeting == true)
        {
            gameChar_y += 20;
        }
        

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
        
    
    if(flagpole.isReached != true)
        {
            checkFlagpole();
        }  
    
    //conditional statement to test if the player has fallen below the canvas.
    
    if (gameChar_y >height+500 && lives > 0)
        {
            startGame();
        }
}

// ~~~~~~~~~~~~~~~~~~~~~ \\
// Key control functions
// ~~~~~~~~~~~~~~~~~~~~~ \\

function keyPressed(){
    //if flagpole is reached, music stops, win music played
    //with no loop
    if(flagpole.isReached && key == ' ')
    {
        // bgMusic.stop();
        // win.play();
        // win.noLoop();
        nextLevel();
        return
    }
    
    //when the char loses a life, it starts from the beginning
    else if(lives == 0 && key == ' ')
    {
        returnToStart();
        return
    }
    
    //to know which key is what number using the console
	console.log("press" + keyCode);
    
    //here I have gave the user the choice between WAD and arrows + spacebar
    
    //the user has been give the option to use the arrows + spacebar and WAD
    
    if(keyCode == 37 || keyCode == 65)
        {
            
            isLeft = true;
            console.log("isLeft:" + isLeft);
        }
    
    if(keyCode == 39 || keyCode == 68)
        {
            isRight = true;
            console.log("isRight:" + isRight);
        }
    
    //32 = spacebar, 38 = up arrow, 87 = W  
    if((keyCode == 32 || keyCode == 38 || keyCode == 87) && gameChar_y == floorPos_y)
        {
            gameChar_y -=100;
            isFalling=true;
            console.log("isFalling:" + isFalling);
            //jump.play();  
        }

    }


//the function below stops the the char from keep on going
//when a button is released
function keyReleased()
{
    if(keyCode == 37 || keyCode == 65)
        {
            isLeft = false;
            console.log("isLeft:" + isLeft);
        }
    
    if(keyCode == 39 || keyCode == 68)
        {
            isRight = false;
            console.log("isRight:" + isRight);
        }
    
    if((keyCode == 32 || keyCode == 38 || keyCode == 87) && gameChar_y == floorPos_y )
        {
            isFalling = false;
            console.log("isFalling:" + isFalling);
        }
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\
    //                          GAME CHARACTER DRAWING                                 \\
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\
	if(isLeft && isFalling)
	{
        // Jumping-left code
        //horn
        stroke(0);
        fill(255);
        triangle(gameChar_x-2, gameChar_y-60, gameChar_x+1, gameChar_y-73, gameChar_x+5, gameChar_y-60); 

        //head
        stroke(0);
        fill(255, 0, 0);
        ellipse(gameChar_x+1, gameChar_y-40, 40, 40);    

        //eye
        fill(0, 100, 0);
        arc(gameChar_x-8,gameChar_y-40, 25, 25, 2.5, PI + QUARTER_PI, PIE);

        fill(0);
        ellipse(gameChar_x-18, gameChar_y-40.5, 4, 8);

        fill(255);
        ellipse(gameChar_x-19, gameChar_y-43, 2.5, 4);

        //mouth
        fill(250, 128, 114);
        arc(gameChar_x-8, gameChar_y-30, 15, 15, 1.6, HALF_PI*2, PIE); 

        //leg
        stroke(0);
        fill(255, 0, 0);
        rect(gameChar_x-2, gameChar_y-      20, 7, 15);

        fill(0);
        quad(gameChar_x+13, gameChar_y-13, gameChar_x+16, gameChar_y-7, gameChar_x+2.5, gameChar_y, gameChar_x-1.5, gameChar_y-4.1);


	}
	else if(isRight && isFalling)
	{
        //Jumping-right code
        //horn
        stroke(0);
        fill(255);
        triangle(gameChar_x-2, gameChar_y-60, gameChar_x+1, gameChar_y-73, gameChar_x+5, gameChar_y-60); 

        //head
        stroke(0);
        fill(255, 0, 0);
        ellipse(gameChar_x+1, gameChar_y-40, 40, 40);

        //eye
        fill(0, 100, 0);
        arc(gameChar_x+11, gameChar_y-40, 25, 25, 5.5, QUARTER_PI, PIE);

        fill(0);
        ellipse(gameChar_x+22, gameChar_y-40, 4, 8);

        fill(255);
        ellipse(gameChar_x+23, gameChar_y-42, 2.5, 4);

        //mouth
        fill(250, 128, 114);
        arc(gameChar_x+10, gameChar_y-30, 15, 15, 0, HALF_PI, PIE);

        //tooth
        fill(255);
        rect(gameChar_x+12, gameChar_y-30, 2, 4);

        //leg
        stroke(0);
        fill(255, 0, 0);
        rect(gameChar_x-2, gameChar_y-20, 7, 15);

        fill(0);
        quad(gameChar_x+5.5, gameChar_y-4.2, gameChar_x+2.9, gameChar_y+1,  gameChar_x-13, gameChar_y-5, gameChar_x-10, gameChar_y-10); 

	}
	else if(isLeft)
	{
        //Walking left code
        //horn
        stroke(0);
        fill(255);
        triangle(gameChar_x-2, gameChar_y-60, gameChar_x+1, gameChar_y-73, gameChar_x+5, gameChar_y-60); 

        //head
        stroke(0);
        fill(255, 0, 0);
        ellipse(gameChar_x+1, gameChar_y-40, 40, 40);

        //eye
        fill(0, 100, 0);
        arc(gameChar_x-8,gameChar_y-41, 25, 25, 2.5, PI + QUARTER_PI, PIE);

        fill(0);
        ellipse(gameChar_x-18, gameChar_y-41.5, 4, 8);

        fill(255);
        ellipse(gameChar_x-19, gameChar_y-44, 2.5, 4);

        //mouth
        fill(250, 128, 114);
        arc(gameChar_x-8, gameChar_y-30, 15, 15, 1.6, HALF_PI*2, PIE);

        //leg
        stroke(0);
        fill(255, 0, 0);
        rect(gameChar_x-1, gameChar_y-20, 7, 15);

        fill(0);
        rect(gameChar_x-11, gameChar_y-10, 17, 10);   
	}
    
	else if(isRight)
	{
		//Walking right code
        //horn
        stroke(0);
        fill(255);
        triangle(gameChar_x-2, gameChar_y-60, gameChar_x+1, gameChar_y-73, gameChar_x+5, gameChar_y-60); 

        //head
        stroke(0);
        fill(255, 0, 0);
        ellipse(gameChar_x+1, gameChar_y-40, 40, 40);    

        //eye
        fill(0, 100, 0);
        arc(gameChar_x+10, gameChar_y-40, 25, 25, 5.5, QUARTER_PI, PIE);

        fill(0);
        ellipse(gameChar_x+20, gameChar_y-40, 4, 8);

        fill(255);
        ellipse(gameChar_x+21, gameChar_y-42, 2.5, 4);

        //mouth
        fill(250, 128, 114);
        arc(gameChar_x+10, gameChar_y-30, 15, 15, 0, HALF_PI, PIE);

        //tooth
        fill(255);
        rect(gameChar_x+12, gameChar_y-30, 2, 4);

        //leg
        stroke(0);
        fill(255, 0, 0);
        rect(gameChar_x-1, gameChar_y-20, 7, 15);

        fill(0);
        rect(gameChar_x-1, gameChar_y-10, 17, 10 );   


	}
    
	else if(isFalling || isPlummeting)
	{
		//Jumping facing forwards code
        //horns
        stroke(0);
        fill(255);
        triangle(gameChar_x-12, gameChar_y-55, gameChar_x-10, gameChar_y-70, gameChar_x-4, gameChar_y-60); 
        triangle(gameChar_x+7, gameChar_y-60, gameChar_x+15, gameChar_y-70, gameChar_x+15, gameChar_y-55);

        //head
        stroke(0);
        fill(255, 0, 0);
        ellipse(gameChar_x+1, gameChar_y-40, 40, 40);


        //eye
        fill(0, 100, 0);
        ellipse(gameChar_x+1  , gameChar_y-45, 15, 15);

        fill(0);
        ellipse(gameChar_x+1  , gameChar_y-45, 8, 8);

        fill(255);
        noStroke();
        ellipse(gameChar_x-1  , gameChar_y-47, 4, 4);

        //mouth
        fill(250, 128, 114);
        stroke(0);

        arc(gameChar_x+1  , gameChar_y-35, 20, 20, 0, 2* HALF_PI, CHORD);

        //tooth
        stroke(0);
        fill(255)
        rect(gameChar_x-6.5, gameChar_y-35, 5, 5);

        //legs
        stroke(0);
        fill(255, 0, 0);
        rect(gameChar_x-3, gameChar_y-20, 7, 8);

        fill(0);
        rect(gameChar_x-3, gameChar_y - 11, 7, 3 );  
	}
    
	else
	{
		//Standing front facing code
        //horns
        stroke(0);
        fill(255);
        triangle(gameChar_x-10, gameChar_y-55, gameChar_x-10, gameChar_y-70, gameChar_x-2, gameChar_y-60); 
        triangle(gameChar_x+7, gameChar_y-60, gameChar_x+15, gameChar_y-70, gameChar_x+15, gameChar_y-55);

        //head
        stroke(0);
        fill(255, 0, 0);
        ellipse(gameChar_x+2.5  , gameChar_y-40, 40, 40);

        //eye
        fill(0, 100, 0);
        ellipse(gameChar_x+2.5  , gameChar_y-45, 15, 15);

        fill(0);
        ellipse(gameChar_x+2.5  , gameChar_y-45, 8, 8);

        fill(255);
        noStroke();
        ellipse(gameChar_x+0  , gameChar_y-47, 4, 4);

        //mouth
        stroke(0); 
        fill(250, 128, 114);
        arc(gameChar_x+2.5  , gameChar_y-35, 20, 20, 0, 2* HALF_PI, CHORD);

        //tooth
        stroke(0);
        fill(255)
        rect(gameChar_x-5, gameChar_y-35, 5, 5);

        //legs
        stroke(0);
        fill(255, 0, 0);
        rect(gameChar_x-1, gameChar_y-20, 7, 15);

        fill(0);
        rect(gameChar_x-1, gameChar_y-9, 7, 9 );   
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{    
 	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\
    //                          CLOUD DRAWING                                          \\
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \\   
    
    for(var i = 0; i < clouds.length; i ++)
        {            
            //!!!CLOUD!!!
            fill(128, 128, 128);
            noStroke();

            ellipse(clouds[i].x_pos + 20, clouds[i].y_pos + 40, clouds[i].size, clouds[i].size -10); 
            ellipse(clouds[i].x_pos + 60, clouds[i].y_pos + 30, clouds[i].size, clouds[i].size - 10); 
            ellipse(clouds[i].x_pos + 110, clouds[i].y_pos + 40, clouds[i].size - 10);    
            ellipse(clouds[i].x_pos + 50, clouds[i].y_pos + 60, clouds[i].size, clouds[i].size - 10); 
            ellipse(clouds[i].x_pos +90, clouds[i].y_pos +55, clouds[i].size, clouds[i].size - 10); 

            //cloud eyes
            fill(0);
            noStroke();
            ellipse(clouds[i].x_pos + 45,  clouds[i].y_pos + 40, 20);
            ellipse(clouds[i].x_pos + 90,  clouds[i].y_pos + 40, 20);

            fill(255);
            ellipse(clouds[i].x_pos + 49  ,  clouds[i].y_pos + 35, 8, 6);
            ellipse(clouds[i].x_pos + 95 , clouds[i].y_pos + 35, 8, 6);

            //cloud blush
            fill(255, 0, 0);
            ellipse(clouds[i].x_pos + 38  ,  clouds[i].y_pos + 60, 10, 8);
            ellipse(clouds[i].x_pos + 98  ,  clouds[i].y_pos + 60, 10, 8);

            //cloud mouth
            fill(0);
            ellipse(clouds[i].x_pos + 70  ,  clouds[i].y_pos + 60, 8, 10)
                    
        }
}

function drawAngel()
{
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\
    //                          ANGEL CLOUD DRAWING                                    \\
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\    
    for (var i = 0; i < angel.length; i++)
        {
            var r;
            var g;
            var b;
            var a;
    
    
            r = random(0, 255); // r is a random number between 0 - 255
            g = random(0,255); // g is a random number betwen 100 - 200
            b = random(0, 255); // b is a random number between 0 - 100
            a = random(200,255); // a is a random number between 200 - 255
            //wing
            fill(r, g, b, a);
            stroke(0);
            
            //left wing
            beginShape();
            
            curveVertex(angel[i].x_pos + 137, angel[i].y_pos + 12);
            curveVertex(angel[i].x_pos + 137, angel[i].y_pos + 12);
            curveVertex(angel[i].x_pos + 80, angel[i].y_pos + 1);
            curveVertex(angel[i].x_pos + 40, angel[i].y_pos + 35);
            curveVertex(angel[i].x_pos + 20, angel[i].y_pos + 80);
            curveVertex(angel[i].x_pos + 40, angel[i].y_pos + 85);
            curveVertex(angel[i].x_pos + 42, angel[i].y_pos + 75);
            curveVertex(angel[i].x_pos + 44, angel[i].y_pos + 85);
            curveVertex(angel[i].x_pos + 60, angel[i].y_pos + 89);
            curveVertex(angel[i].x_pos + 67, angel[i].y_pos + 85);
            curveVertex(angel[i].x_pos + 68, angel[i].y_pos + 75);
            curveVertex(angel[i].x_pos + 75, angel[i].y_pos + 85);
            curveVertex(angel[i].x_pos + 88, angel[i].y_pos + 85);
            curveVertex(angel[i].x_pos + 90, angel[i].y_pos + 75);
            curveVertex(angel[i].x_pos + 98, angel[i].y_pos + 85);
            curveVertex(angel[i].x_pos + 105, angel[i].y_pos + 85);
            curveVertex(angel[i].x_pos + 110, angel[i].y_pos + 75);
            curveVertex(angel[i].x_pos + 115, angel[i].y_pos + 85);
            curveVertex(angel[i].x_pos + 125, angel[i].y_pos + 85);
            curveVertex(angel[i].x_pos + 146, angel[i].y_pos + 75);
            curveVertex(angel[i].x_pos + 175, angel[i].y_pos + 45);
            
            endShape();
            
            //right wing
            beginShape();
            
            curveVertex(angel[i].x_pos + 240, angel[i].y_pos + 12);
            curveVertex(angel[i].x_pos + 240, angel[i].y_pos + 12);
            curveVertex(angel[i].x_pos + 310, angel[i].y_pos + 1);
            curveVertex(angel[i].x_pos + 347, angel[i].y_pos + 35);
            curveVertex(angel[i].x_pos + 367, angel[i].y_pos + 80);
            curveVertex(angel[i].x_pos + 347, angel[i].y_pos + 85);
            curveVertex(angel[i].x_pos + 335, angel[i].y_pos + 75);
            curveVertex(angel[i].x_pos + 333, angel[i].y_pos + 85);
            curveVertex(angel[i].x_pos + 317, angel[i].y_pos + 89);
            curveVertex(angel[i].x_pos + 310, angel[i].y_pos + 85);
            curveVertex(angel[i].x_pos + 309, angel[i].y_pos + 75);
            curveVertex(angel[i].x_pos + 302, angel[i].y_pos + 85);
            curveVertex(angel[i].x_pos + 289, angel[i].y_pos + 85);
            curveVertex(angel[i].x_pos + 287, angel[i].y_pos + 75);
            curveVertex(angel[i].x_pos + 279, angel[i].y_pos + 85);
            curveVertex(angel[i].x_pos + 272, angel[i].y_pos + 85);
            curveVertex(angel[i].x_pos + 267, angel[i].y_pos + 75);
            curveVertex(angel[i].x_pos + 262, angel[i].y_pos + 85);
            curveVertex(angel[i].x_pos + 252, angel[i].y_pos + 85);
            curveVertex(angel[i].x_pos + 231 , angel[i].y_pos + 75);
            curveVertex(angel[i].x_pos + 231, angel[i].y_pos + 45);

            endShape();    
            
            fill(230, 120, 120);
            stroke(0);
            strokeWeight(7);
            ellipse(angel[i].x_pos + 200, angel[i].y_pos+40, angel[i].size + 80, angel[i].size + 40); 

           //cloud eyes
            fill(0);
            noStroke();
            ellipse(angel[i].x_pos + 165,  angel[i].y_pos + 30, angel[i].size - 20);
            ellipse(angel[i].x_pos + 240,  angel[i].y_pos + 30, angel[i].size - 20); //right eye needs fixing

            fill(255);
            ellipse(angel[i].x_pos + 160  ,  angel[i].y_pos + 20, angel[i].size - 40);
            ellipse(angel[i].x_pos + 235  , angel[i].y_pos + 20, angel[i].size - 40);

            ellipse(angel[i].x_pos + 175  ,  angel[i].y_pos + 42, angel[i].size- 53, angel[i].size - 54);
            ellipse(angel[i].x_pos + 252  ,  angel[i].y_pos + 41, angel[i].size- 53, angel[i].size - 54);

            //mouth
            fill(0);
            arc(angel[i].x_pos + 202, angel[i].y_pos + 38, angel[i].size - 25, angel[i].size - 25, 0, 2* HALF_PI, CHORD);

            fill(255);
            ellipse(angel[i].x_pos + 202.5,  angel[i].y_pos + 42, angel[i].size- 33, angel[i].size - 54);

            //cloud blush
            fill(255, 0, 0);
            ellipse(angel[i].x_pos + 164  ,  angel[i].y_pos + 52.5, 13, 8);
            ellipse(angel[i].x_pos  + 242  ,  angel[i].y_pos + 53, 13, 8);

        }
}

// Function to draw volcanoes objects.
function drawVolcanoes() 
{
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\
    //                          VOLCANO DRAWING                                       \\
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\
    for (var i = 0; i < volcanoes.length ; i++ )
        {   
  
            //!!!VOLCANO!!!
            fill(139, 69, 19);
            stroke(0);
            quad(volcanoes[i].x_pos + 87, volcanoes[i].y_pos + 422, volcanoes[i].x_pos + 390, volcanoes[i].y_pos + 422, volcanoes[i].x_pos + 293, volcanoes[i].y_pos + 140, volcanoes[i].x_pos + 187, volcanoes[i].y_pos +140);

            //lava
            fill(255, 69, 0);
            noStroke();
            rect(volcanoes[i].x_pos + 183, volcanoes[i].y_pos + 135, volcanoes[i].size + 93, volcanoes[i].size + 20, volcanoes[i].size + 5);

            //left
            ellipse(volcanoes[i].x_pos + 192, volcanoes[i].y_pos + 160, volcanoes[i].size + 15);
            ellipse(volcanoes[i].x_pos + 188, volcanoes[i].y_pos + 170, volcanoes[i].size + 15);
            ellipse(volcanoes[i].x_pos + 184, volcanoes[i].y_pos + 180, volcanoes[i].size + 15);
            ellipse(volcanoes[i].x_pos + 180, volcanoes[i].y_pos + 190, volcanoes[i].size + 15);
            ellipse(volcanoes[i].x_pos + 205, volcanoes[i].y_pos + 180, volcanoes[i].size + 15);


            //mid
            ellipse(volcanoes[i].x_pos + 230, volcanoes[i].y_pos + 180, volcanoes[i].size + 15);
            ellipse(volcanoes[i].x_pos + 240, volcanoes[i].y_pos + 180, volcanoes[i].size + 15);

            //right
            ellipse(volcanoes[i].x_pos + 292, volcanoes[i].y_pos + 155, volcanoes[i].size + 15);
            ellipse(volcanoes[i].x_pos + 295, volcanoes[i].y_pos + 160, volcanoes[i].size + 15);
            ellipse(volcanoes[i].x_pos + 296, volcanoes[i].y_pos + 170, volcanoes[i].size + 15);
            ellipse(volcanoes[i].x_pos + 300, volcanoes[i].y_pos + 180, volcanoes[i].size + 15);
            ellipse(volcanoes[i].x_pos + 272, volcanoes[i].y_pos + 180, volcanoes[i].size + 15);
            ellipse(volcanoes[i].x_pos + 305, volcanoes[i].y_pos + 190, volcanoes[i].size + 15);

            //mountain eyes    
            fill(0);
            noStroke();
            ellipse(volcanoes[i].x_pos + 190,  volcanoes[i].y_pos + 300, volcanoes[i].size + 10);
            ellipse(volcanoes[i].x_pos + 280,  volcanoes[i].y_pos + 300, volcanoes[i].size + 10);

            fill(255);
            ellipse(volcanoes[i].x_pos + 200  ,  volcanoes[i].y_pos + 295, volcanoes[i].size - 10, volcanoes[i].size - 12);
            ellipse(volcanoes[i].x_pos + 290  ,  volcanoes[i].y_pos + 295, volcanoes[i].size - 10, volcanoes[i].size - 12);

            //mountain blush
            fill(255, 99, 71);
            ellipse(volcanoes[i].x_pos + 170  ,  volcanoes[i].y_pos + 360, volcanoes[i].size - 10, volcanoes[i].size - 12);
            ellipse(volcanoes[i].x_pos + 310  ,  volcanoes[i].y_pos + 360, volcanoes[i].size - 10, volcanoes[i].size - 12);

            //mountain mouth
            stroke(0); 
            fill(250, 128, 114);
            arc(volcanoes[i].x_pos + 240, volcanoes[i].y_pos + 340, 20, 20, 0, 2* HALF_PI, CHORD);

            //smoke
            noStroke();
            fill(128, 128, 128); 
            ellipse(volcanoes[i].x_pos + 225, volcanoes[i].y_pos + 30, volcanoes[i].size, volcanoes[i].size -10); 
            ellipse(volcanoes[i].x_pos + 215, volcanoes[i].y_pos +60, volcanoes[i].size, volcanoes[i].size - 10);  
            ellipse(volcanoes[i].x_pos + 230, volcanoes[i].y_pos + 80, volcanoes[i].size - 10); 
            ellipse(volcanoes[i].x_pos + 245, volcanoes[i].y_pos + 80, volcanoes[i].size-10); 
            ellipse(volcanoes[i].x_pos + 275, volcanoes[i].y_pos +40, volcanoes[i].size-10);    
            ellipse(volcanoes[i].x_pos + 185, volcanoes[i].y_pos + 40, volcanoes[i].size, volcanoes[i].size - 10); 
            ellipse(volcanoes[i].x_pos + 255, volcanoes[i].y_pos +55, volcanoes[i].size, volcanoes[i].size - 10); 
            ellipse(volcanoes[i].x_pos + 225, volcanoes[i].y_pos + 90, volcanoes[i].size - 10);

            ellipse(volcanoes[i].x_pos + 240, volcanoes[i].y_pos + 100, volcanoes[i].size - 10);
            ellipse(volcanoes[i].x_pos + 215, volcanoes[i].y_pos + 100, volcanoes[i].size - 10);
            ellipse(volcanoes[i].x_pos + 300, volcanoes[i].y_pos + 50, volcanoes[i].size + 20, volcanoes[i].size - 20);
            ellipse(volcanoes[i].x_pos + 300, volcanoes[i].y_pos + 50, volcanoes[i].size + 20, volcanoes[i].size - 20);
            ellipse(volcanoes[i].x_pos + 350, volcanoes[i].y_pos + 50, volcanoes[i].size + 20, volcanoes[i].size - 20);
            ellipse(volcanoes[i].x_pos + 380, volcanoes[i].y_pos + 50, volcanoes[i].size + 40, volcanoes[i].size - 40);
        }
}

// Function to draw trees objects.
function drawTrees() 
{
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\
    //                                 TREE DRAWING                                   \\
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\
    
    for(var i = 0; i< trees_x.length; i++)
        {
            ///!!!TREE!!!
            
            fill(139, 69, 19);
            rect(trees_x[i] + 170, floorPos_y, 30, -81);
            
            noStroke();
            fill(34, 139, 34);
            ellipse(trees_x[i] + 160, 340, 90); 
            ellipse(trees_x[i] + 182, 305, 100); 
            ellipse(trees_x[i] + 210, 340, 80);    

            //right eye
            stroke(0);
            noFill();
            beginShape(line);
            
            vertex(trees_x[i] + 166, 300);
            vertex(trees_x[i] + 175, 305);
            vertex(trees_x[i] + 166 , 310);
            
            endShape();

            //left eye
            beginShape(line);
            
            vertex(trees_x[i] + 199, 300);
            vertex(trees_x[i] + 190, 305);
            vertex(trees_x[i] + 199 , 310);
            
            endShape();

            stroke(220, 20, 60);
            noFill();
            beginShape(LINES);
            
            vertex(trees_x[i] + 155 , 320);
            vertex(trees_x[i] + 153 , 329);
            vertex(trees_x[i] + 160 , 320);
            vertex(trees_x[i] + 158 , 329);
            vertex(trees_x[i] + 165 , 320);
            vertex(trees_x[i] + 163 , 329);
            vertex(trees_x[i] + 202 , 320);
            vertex(trees_x[i] + 204 , 329);
            vertex(trees_x[i] + 207 , 320);
            vertex(trees_x[i] + 209 , 329);
            vertex(trees_x[i] + 212 , 320);
            vertex(trees_x[i] + 214 , 329);
            
            endShape();

            //tree mouth
            stroke(0); 
            fill(250, 128, 114);
            arc(trees_x[i] + 183.5, 325, 15, 15, 0, 2* HALF_PI, CHORD);
        }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\
    //                         CANYON DRAWING                                         \\
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\
    fill(255, 69, 0);
    noStroke(0);
    rect(t_canyon.x_pos + 60, 432, t_canyon.width, 150);

}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    //logic for canyon
    if(gameChar_world_x > t_canyon.x_pos+60 && gameChar_world_x < t_canyon.x_pos + 60 + t_canyon.width && gameChar_y >= floorPos_y)
    {
        isPlummeting = true;
    }

}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\
    //                          COLLECTABLE DRAWING                                   \\
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\
    //local variables
    var r;
    var g;
    var b;
    var a;
    
    
    r = random(0, 255); // r is a random number between 0 - 255
    g = random(0,255); // g is a random number betwen 100 - 200
    b = random(0, 255); // b is a random number between 0 - 100
    a = random(200,255); // a is a random number between 200 - 255
  

    fill(r, g, b, a);
    stroke(0);
    strokeWeight(2);
    rect(t_collectable.x_pos + 150, t_collectable.y_pos + 32.5, t_collectable.size + 50, -t_collectable.size - 53); 
    
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    //logic for collectable item
    
   
    var d = dist(gameChar_world_x, gameChar_y, t_collectable.x_pos + 150, t_collectable.y_pos + 32.5);
    
    if (d < 80)
        {

            t_collectable.isFound = true;
            //collectableSound.play();
            game_score +=  t_collectable.size;

            
        }
}

function renderFlagpole()
{
    push();
    
    stroke(150);
    strokeWeight(5);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 200);
    
    
    if (flagpole.isReached)
        {
            noStroke();
            fill(255, 0, 255)
            rect(flagpole.x_pos, floorPos_y - 200, 50, 50);
            
        }
    
    else{
        noStroke();
        fill(255, 0, 255)
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
        
    }
    
    pop();
    
}

function checkFlagpole()
{
    //abs makes sure that the number is positive no matter what
    var d = abs(gameChar_world_x - flagpole.x_pos);
    
    if(d < 20)
        {
            flagpole.isReached = true;
        }
}

function createPlatform(x, y, length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()        
        {
            fill(255, 255, 0);
            stroke(0);
            rect(this.x, this.y, this.length, 20);
        },
        //gc stands for game character 
        checkContact: function(gc_x, gc_y)
        {
            //checks whether game char is in contact with the platform
            
            if(gc_x > this.x && gc_x < this.x + this.length )
                {
                    var d = this.y - gc_y;
                    if (d >= 0 && d < 5)
                        {
                            return true;   
                        }                  
                }
            return false;
        }
    }
    
    return p;
}

function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.current_x = x;
    this.incr = 1;
    
    
    this.draw = function()
    {
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\
        //                          ENEMY DRAWING                                 \\
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\
        
        //body
        fill(128, 0, 128);
        stroke(0);
        strokeWeight(2);
        rect(this.current_x - 5, this.y - 65, 50, 60, 180);

        //eye
        strokeWeight(2);
        fill(255);
        beginShape(line);
        vertex(this.current_x + 20, this.y - 53);
        vertex(this.current_x + 10, this.y - 57);

        vertex(this.current_x, this.y - 50);
        vertex(this.current_x + 10, this.y - 37);

        vertex(this.current_x + 30, this.y - 37);
        vertex(this.current_x + 40, this.y - 50);

        vertex(this.current_x + 30, this.y - 57);
        vertex(this.current_x + 20, this.y - 53);

        endShape();

        //pupil
        stroke(0);
        strokeWeight(1.5);
        fill(139, 0, 139);
        //fill(255, 0, 0);
        arc(this.current_x + 20, this.y - 38, 20, 28, PI, TWO_PI);
        
        fill(0);
        ellipse(this.current_x + 20, this.y - 45, 8, 14);

        fill(255);
        ellipse(this.current_x + 22, this.y - 49, 5);

        //mouth 
        fill(0);
        arc(this.current_x + 20, this.y - 25, 20, 20, 0, 2* HALF_PI, CHORD);
    }
    //updates the enemy position
    this.update= function()
    {
        this.current_x += this.incr;
        
        if (this.current_x < this.x)
            {
                this.incr = 1
            }
        
        else if (this.current_x > this.x + this.range)
            {
                this.incr = -1;
            }
    }
    
    this.isContact = function(gc_x, gc_y)
    {
        //returns true if contact is made
        var d = dist(gc_x, gc_y, this.current_x, this.y);
        
        if (d < 10)
            {
                return true;
            }
        
        return false;
    }
}

