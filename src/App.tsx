import { useEffect, useRef } from 'react';
import { Engine, Scene, UniversalCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import './App.css';

// Room dimensions
const ROOM_WIDTH = 10;
const ROOM_HEIGHT = 4;
const ROOM_DEPTH = 10;
const WALL_THICKNESS = 0.2;
const DOOR_WIDTH = 2;
const DOOR_HEIGHT = 2.5;

// Function to create a single room
function createRoom(name: string, position: Vector3, scene: Scene, doors: { north?: boolean, south?: boolean, east?: boolean, west?: boolean } = {}) {
    const roomMat = new StandardMaterial(name + "Mat", scene);
    roomMat.diffuseColor = new Color3(0.8, 0.8, 0.8); // Light grey for walls/floor/ceiling

    // Floor
    const floor = MeshBuilder.CreateBox(name + "Floor", { width: ROOM_WIDTH, height: WALL_THICKNESS, depth: ROOM_DEPTH }, scene);
    floor.position = position.add(new Vector3(0, -ROOM_HEIGHT / 2, 0));
    floor.material = roomMat;
    floor.checkCollisions = true;

    // Ceiling
    const ceiling = MeshBuilder.CreateBox(name + "Ceiling", { width: ROOM_WIDTH, height: WALL_THICKNESS, depth: ROOM_DEPTH }, scene);
    ceiling.position = position.add(new Vector3(0, ROOM_HEIGHT / 2, 0));
    ceiling.material = roomMat;
    ceiling.checkCollisions = true;

    // Walls (with potential doorways)
    const wallParams = { height: ROOM_HEIGHT, depth: WALL_THICKNESS };
    const wallY = position.y; // Walls centered vertically at room center

    // North Wall (+Z)
    if (doors.north) {
        const wallNorthLeft = MeshBuilder.CreateBox(name + "WallNorthLeft", { width: (ROOM_WIDTH - DOOR_WIDTH) / 2, ...wallParams }, scene);
        wallNorthLeft.position = position.add(new Vector3(-(ROOM_WIDTH + DOOR_WIDTH) / 4, wallY, ROOM_DEPTH / 2));
        wallNorthLeft.material = roomMat;
        wallNorthLeft.checkCollisions = true;

        const wallNorthRight = MeshBuilder.CreateBox(name + "WallNorthRight", { width: (ROOM_WIDTH - DOOR_WIDTH) / 2, ...wallParams }, scene);
        wallNorthRight.position = position.add(new Vector3((ROOM_WIDTH + DOOR_WIDTH) / 4, wallY, ROOM_DEPTH / 2));
        wallNorthRight.material = roomMat;
        wallNorthRight.checkCollisions = true;

        // Lintel above door
        const lintelNorth = MeshBuilder.CreateBox(name + "LintelNorth", { width: DOOR_WIDTH, height: ROOM_HEIGHT - DOOR_HEIGHT, depth: WALL_THICKNESS }, scene);
        lintelNorth.position = position.add(new Vector3(0, wallY + DOOR_HEIGHT / 2, ROOM_DEPTH / 2));
        lintelNorth.material = roomMat;
        lintelNorth.checkCollisions = true;

    } else {
        const wallNorth = MeshBuilder.CreateBox(name + "WallNorth", { width: ROOM_WIDTH, ...wallParams }, scene);
        wallNorth.position = position.add(new Vector3(0, wallY, ROOM_DEPTH / 2));
        wallNorth.material = roomMat;
        wallNorth.checkCollisions = true;
    }

     // South Wall (-Z)
    if (doors.south) {
        const wallSouthLeft = MeshBuilder.CreateBox(name + "WallSouthLeft", { width: (ROOM_WIDTH - DOOR_WIDTH) / 2, ...wallParams }, scene);
        wallSouthLeft.position = position.add(new Vector3(-(ROOM_WIDTH + DOOR_WIDTH) / 4, wallY, -ROOM_DEPTH / 2));
        wallSouthLeft.material = roomMat;
        wallSouthLeft.checkCollisions = true;

        const wallSouthRight = MeshBuilder.CreateBox(name + "WallSouthRight", { width: (ROOM_WIDTH - DOOR_WIDTH) / 2, ...wallParams }, scene);
        wallSouthRight.position = position.add(new Vector3((ROOM_WIDTH + DOOR_WIDTH) / 4, wallY, -ROOM_DEPTH / 2));
        wallSouthRight.material = roomMat;
        wallSouthRight.checkCollisions = true;

         // Lintel above door
        const lintelSouth = MeshBuilder.CreateBox(name + "LintelSouth", { width: DOOR_WIDTH, height: ROOM_HEIGHT - DOOR_HEIGHT, depth: WALL_THICKNESS }, scene);
        lintelSouth.position = position.add(new Vector3(0, wallY + DOOR_HEIGHT / 2, -ROOM_DEPTH / 2));
        lintelSouth.material = roomMat;
        lintelSouth.checkCollisions = true;
    } else {
        const wallSouth = MeshBuilder.CreateBox(name + "WallSouth", { width: ROOM_WIDTH, ...wallParams }, scene);
        wallSouth.position = position.add(new Vector3(0, wallY, -ROOM_DEPTH / 2));
        wallSouth.material = roomMat;
        wallSouth.checkCollisions = true;
    }

    const sideWallParams = { width: WALL_THICKNESS, height: ROOM_HEIGHT, depth: ROOM_DEPTH};

    // West Wall (-X)
    if (doors.west) {
        const wallWestBottom = MeshBuilder.CreateBox(name + "WallWestBottom", { depth: (ROOM_DEPTH - DOOR_WIDTH) / 2, ...sideWallParams }, scene);
        wallWestBottom.position = position.add(new Vector3(-ROOM_WIDTH / 2, wallY, -(ROOM_DEPTH + DOOR_WIDTH) / 4));
        wallWestBottom.material = roomMat;
        wallWestBottom.checkCollisions = true;

        const wallWestTop = MeshBuilder.CreateBox(name + "WallWestTop", { depth: (ROOM_DEPTH - DOOR_WIDTH) / 2, ...sideWallParams }, scene);
        wallWestTop.position = position.add(new Vector3(-ROOM_WIDTH / 2, wallY, (ROOM_DEPTH + DOOR_WIDTH) / 4));
        wallWestTop.material = roomMat;
        wallWestTop.checkCollisions = true;

        // Lintel above door
        const lintelWest = MeshBuilder.CreateBox(name + "LintelWest", { width: WALL_THICKNESS, height: ROOM_HEIGHT - DOOR_HEIGHT, depth: DOOR_WIDTH }, scene);
        lintelWest.position = position.add(new Vector3(-ROOM_WIDTH / 2, wallY + DOOR_HEIGHT / 2, 0));
        lintelWest.material = roomMat;
        lintelWest.checkCollisions = true;

    } else {
        const wallWest = MeshBuilder.CreateBox(name + "WallWest", { ...sideWallParams }, scene);
        wallWest.position = position.add(new Vector3(-ROOM_WIDTH / 2, wallY, 0));
        wallWest.material = roomMat;
        wallWest.checkCollisions = true;
    }

     // East Wall (+X)
    if (doors.east) {
         const wallEastBottom = MeshBuilder.CreateBox(name + "WallEastBottom", { depth: (ROOM_DEPTH - DOOR_WIDTH) / 2, ...sideWallParams }, scene);
        wallEastBottom.position = position.add(new Vector3(ROOM_WIDTH / 2, wallY, -(ROOM_DEPTH + DOOR_WIDTH) / 4));
        wallEastBottom.material = roomMat;
        wallEastBottom.checkCollisions = true;

        const wallEastTop = MeshBuilder.CreateBox(name + "WallEastTop", { depth: (ROOM_DEPTH - DOOR_WIDTH) / 2, ...sideWallParams }, scene);
        wallEastTop.position = position.add(new Vector3(ROOM_WIDTH / 2, wallY, (ROOM_DEPTH + DOOR_WIDTH) / 4));
        wallEastTop.material = roomMat;
        wallEastTop.checkCollisions = true;

        // Lintel above door
        const lintelEast = MeshBuilder.CreateBox(name + "LintelEast", { width: WALL_THICKNESS, height: ROOM_HEIGHT - DOOR_HEIGHT, depth: DOOR_WIDTH }, scene);
        lintelEast.position = position.add(new Vector3(ROOM_WIDTH / 2, wallY + DOOR_HEIGHT / 2, 0));
        lintelEast.material = roomMat;
        lintelEast.checkCollisions = true;
    } else {
        const wallEast = MeshBuilder.CreateBox(name + "WallEast", { ...sideWallParams }, scene);
        wallEast.position = position.add(new Vector3(ROOM_WIDTH / 2, wallY, 0));
        wallEast.material = roomMat;
        wallEast.checkCollisions = true;
    }
}


function App() {
  const reactCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reactCanvas.current) {
      const engine = new Engine(reactCanvas.current, true);
      const scene = new Scene(engine);

      // Enable collisions and gravity
      scene.gravity = new Vector3(0, -0.9, 0); // Standard gravity
      scene.collisionsEnabled = true;


      // Position camera inside the first room, slightly above ground level
      const camera = new UniversalCamera("camera", new Vector3(0, 1.6, -ROOM_DEPTH / 2 + 2), scene); 
      camera.setTarget(new Vector3(0, 1.6, 0)); // Look towards the center of the first room
      camera.attachControl(reactCanvas.current, true);
      camera.applyGravity = true; // Enable gravity for the camera
      camera.ellipsoid = new Vector3(0.5, 0.9, 0.5); // Collision ellipsoid around the camera
      camera.checkCollisions = true; // Enable collisions for the camera

      // Enable WASD movement
      camera.keysUp.push(87);    // W
      camera.keysDown.push(83);   // S
      camera.keysLeft.push(65);  // A
      camera.keysRight.push(68); // D
      camera.speed = 0.15; // Adjusted speed for indoor movement
      camera.angularSensibility = 5000; // Adjust mouse sensitivity

      // Basic Light
      const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene); // Light from above
      light.intensity = 0.7;


      // Create three rooms in a row along the X-axis
      // Room 1 (Center at 0,0,0) - Door East
      createRoom("room1", Vector3.Zero(), scene, { east: true });

      // Room 2 (Center at ROOM_WIDTH, 0, 0) - Doors West and East
      createRoom("room2", new Vector3(ROOM_WIDTH, 0, 0), scene, { west: true, east: true });

      // Room 3 (Center at 2 * ROOM_WIDTH, 0, 0) - Door West
      createRoom("room3", new Vector3(ROOM_WIDTH * 2, 0, 0), scene, { west: true });


      // Remove the large ground plane - rooms have floors now
      // const ground = scene.getMeshByName("ground");
      // if (ground) {
      //   ground.dispose();
      // }


      // Pointer lock for FPS controls
      scene.onPointerDown = (evt) => {
        // Check if the clicked mesh is NOT a UI element (if we add UI later)
        if (evt.button === 0) { // Left click
            engine.enterPointerlock();
        }
      }

      scene.onPointerUp = (evt) => {
         if (evt.button === 0) { // Left click
          engine.exitPointerlock();
        }
      }

      engine.runRenderLoop(() => {
        scene.render();
      });

      // Handle window resize
      const resize = () => {
        engine.resize();
      }
      window.addEventListener('resize', resize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', resize);
        if (engine.isPointerLock) {
          engine.exitPointerlock();
        }
        scene.dispose(); // Dispose scene resources
        engine.dispose();
      }
    }
  }, [reactCanvas]);

  return (
    <canvas ref={reactCanvas} id="renderCanvas" />
  );
}

export default App;
