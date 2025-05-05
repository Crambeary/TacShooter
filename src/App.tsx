import { useEffect, useRef } from 'react';
import { Engine, Scene, UniversalCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import './App.css';

// Room dimensions
const ROOM_WIDTH = 12; 
const ROOM_HEIGHT = 4;
const ROOM_DEPTH = 12; 
const WALL_THICKNESS = 0.2;
const DOOR_WIDTH = 2;
const DOOR_HEIGHT = 2.5;

interface CoverObject {
    position: Vector3; 
    size: Vector3;
}

// Function to create a single room
function createRoom(name: string, position: Vector3, scene: Scene, doors: { north?: boolean, south?: boolean, east?: boolean, west?: boolean } = {}, coverObjects: CoverObject[] = []) {
    const roomMat = new StandardMaterial(name + "Mat", scene);
    roomMat.diffuseColor = new Color3(0.8, 0.8, 0.8); 
    const coverMat = new StandardMaterial(name + "CoverMat", scene);
    coverMat.diffuseColor = new Color3(0.6, 0.5, 0.4); 

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
    const wallY = position.y; 

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
        const wallWestBottom = MeshBuilder.CreateBox(name + "WallWestBottom", { 
            width: WALL_THICKNESS, 
            height: ROOM_HEIGHT, 
            depth: (ROOM_DEPTH - DOOR_WIDTH) / 2 
        }, scene);
        wallWestBottom.position = position.add(new Vector3(-ROOM_WIDTH / 2, wallY, -(ROOM_DEPTH + DOOR_WIDTH) / 4));
        wallWestBottom.material = roomMat;
        wallWestBottom.checkCollisions = true;

        const wallWestTop = MeshBuilder.CreateBox(name + "WallWestTop", { 
            width: WALL_THICKNESS, 
            height: ROOM_HEIGHT, 
            depth: (ROOM_DEPTH - DOOR_WIDTH) / 2 
        }, scene);
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
         const wallEastBottom = MeshBuilder.CreateBox(name + "WallEastBottom", { 
            width: WALL_THICKNESS, 
            height: ROOM_HEIGHT, 
            depth: (ROOM_DEPTH - DOOR_WIDTH) / 2 
        }, scene);
        wallEastBottom.position = position.add(new Vector3(ROOM_WIDTH / 2, wallY, -(ROOM_DEPTH + DOOR_WIDTH) / 4));
        wallEastBottom.material = roomMat;
        wallEastBottom.checkCollisions = true;

        const wallEastTop = MeshBuilder.CreateBox(name + "WallEastTop", { 
            width: WALL_THICKNESS, 
            height: ROOM_HEIGHT, 
            depth: (ROOM_DEPTH - DOOR_WIDTH) / 2 
        }, scene);
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

    // Add Cover Objects
    coverObjects.forEach((cover, index) => {
        const coverBox = MeshBuilder.CreateBox(name + `Cover${index}`, { width: cover.size.x, height: cover.size.y, depth: cover.size.z }, scene);
        // Position cover relative to room center, adjust Y to sit on floor
        coverBox.position = position.add(cover.position).add(new Vector3(0, -ROOM_HEIGHT / 2 + cover.size.y / 2, 0)); 
        coverBox.material = coverMat;
        coverBox.checkCollisions = true;
    });

}

function App() {
  const reactCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reactCanvas.current) {
      const engine = new Engine(reactCanvas.current, true);
      const scene = new Scene(engine);

      // Enable collisions and gravity
      scene.gravity = new Vector3(0, -0.9, 0); 
      scene.collisionsEnabled = true;


      // Position camera inside the first room (Room 1 - bottom left)
      const camera = new UniversalCamera("camera", new Vector3(0, 1.6, 0), scene); 
      camera.setTarget(new Vector3(0, 1.6, 1)); 
      camera.attachControl(reactCanvas.current, true);
      camera.applyGravity = true; 
      camera.ellipsoid = new Vector3(0.5, 0.9, 0.5); 
      camera.checkCollisions = true; 

      // Enable WASD movement
      camera.keysUp.push(87);    
      camera.keysDown.push(83);   
      camera.keysLeft.push(65);  
      camera.keysRight.push(68); 
      camera.speed = 0.15; 
      camera.angularSensibility = 5000; 

      // Basic Light
      const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene); 
      light.intensity = 0.8; 


      // Create 2x2 Room Layout
      const cover1: CoverObject[] = [
          { position: new Vector3(-ROOM_WIDTH / 4, 0, ROOM_DEPTH / 4), size: new Vector3(1, 1.5, 3) },
          { position: new Vector3(ROOM_WIDTH / 4, 0, -ROOM_DEPTH / 4), size: new Vector3(2, 1.5, 1) }
      ];
      const cover2: CoverObject[] = [
          { position: new Vector3(0, 0, ROOM_DEPTH / 4), size: new Vector3(3, 1.5, 1) },
      ];
      const cover3: CoverObject[] = [
          { position: new Vector3(ROOM_WIDTH / 4, 0, 0), size: new Vector3(1, 1.5, 2) },
      ];
      const cover4: CoverObject[] = [
          { position: new Vector3(-ROOM_WIDTH / 4, 0, -ROOM_DEPTH / 4), size: new Vector3(1.5, 1.5, 1.5) },
          { position: new Vector3(ROOM_WIDTH / 4, 0, ROOM_DEPTH / 4), size: new Vector3(1, 1.5, 1) }
      ];

      // Room 1 (Bottom-Left)
      createRoom("room1", new Vector3(0, 0, 0), scene, { north: true, east: true }, cover1);
      
      // Room 2 (Bottom-Right)
      createRoom("room2", new Vector3(ROOM_WIDTH, 0, 0), scene, { north: true, west: true }, cover2);

      // Room 3 (Top-Left)
      createRoom("room3", new Vector3(0, 0, ROOM_DEPTH), scene, { south: true, east: true }, cover3);

      // Room 4 (Top-Right)
      createRoom("room4", new Vector3(ROOM_WIDTH, 0, ROOM_DEPTH), scene, { south: true, west: true }, cover4);


      // Pointer lock and Shooting
      scene.onPointerDown = (evt) => {
        if (evt.button === 0) { // Left click
          if (!engine.isPointerLock) {
            engine.enterPointerlock();
          } else {
            // Shoot a ray from camera
            const ray = camera.getForwardRay();

            // Optional: Offset the ray origin slightly if needed
            // const origin = camera.position.add(camera.getDirection(Vector3.Forward()).scale(0.1));
            // const ray = new Ray(origin, camera.getDirection(Vector3.Forward()), 100); 
            
            const pickInfo = scene.pickWithRay(ray);

            if (pickInfo?.hit && pickInfo.pickedMesh) {
              console.log("Hit:", pickInfo.pickedMesh.name);
              // Later: Check if pickedMesh is an enemy, apply damage, etc.

              // Optional: Create a small temporary sphere at the hit point for visual feedback
              // const impactSphere = MeshBuilder.CreateSphere("impact", { diameter: 0.1 }, scene);
              // impactSphere.position = pickInfo.pickedPoint;
              // impactSphere.material = new StandardMaterial("impactMat", scene);
              // (impactSphere.material as StandardMaterial).diffuseColor = Color3.Red();
              // setTimeout(() => impactSphere.dispose(), 200); // Remove after a short time
            }
          }
        }
      }

      scene.onPointerUp = (evt) => {
         if (evt.button === 0) { // Left click
          // Intentionally removed engine.exitPointerlock(); 
          // Pointer lock exit is typically handled by ESC key press (Babylon.js default)
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
        scene.dispose(); 
        engine.dispose();
      }
    }
  }, [reactCanvas]);

  return (
    <canvas ref={reactCanvas} id="renderCanvas" />
  );
}

export default App;
