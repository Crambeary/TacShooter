import { useEffect, useRef, useState } from 'react';
import { Engine, Scene, UniversalCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, Tags } from '@babylonjs/core';
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

interface Target {
    position: Vector3;
}

// Function to create a single room
function createRoom(name: string, position: Vector3, scene: Scene, doors: { north?: boolean, south?: boolean, east?: boolean, west?: boolean } = {}, coverObjects: CoverObject[] = [], targets: Target[] = []) {
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
        const coverBox = MeshBuilder.CreateBox(`${name}Cover${index}`, { width: cover.size.x, height: cover.size.y, depth: cover.size.z }, scene);
        // Position cover relative to room center, adjust Y to sit on floor
        const relativePos = position.add(cover.position);
        coverBox.position = relativePos;
        coverBox.material = coverMat;
        coverBox.checkCollisions = true;
    });

    // Create targets
    const targetMat = new StandardMaterial(name + "TargetMat", scene);
    targetMat.diffuseColor = new Color3(1, 0, 0); // Red targets

    targets.forEach((target, index) => {
        const targetMesh = MeshBuilder.CreateCylinder(`${name}-target-${index}`, { height: 0.8, diameter: 0.5 }, scene);
        // Position target relative to room center, then add room position
        const relativePos = position.add(target.position);
        targetMesh.position = relativePos;
        targetMesh.material = targetMat;
        targetMesh.checkCollisions = true;
        // Add metadata to easily identify targets
        targetMesh.metadata = { type: "target" }; 
        // Add tag for easy counting
        Tags.AddTagsTo(targetMesh, "targetTag");
    });
}

function App() {
  const reactCanvas = useRef<HTMLCanvasElement>(null);
  // UI State
  const [ammo, setAmmo] = useState(30); 
  const [totalTargets, setTotalTargets] = useState(0);
  const [targetsHit, setTargetsHit] = useState(0);

  // Ref for muzzle flash mesh
  const muzzleFlashRef = useRef<BABYLON.Mesh | null>(null);

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
      camera.minZ = 0.05; // Adjusted minZ slightly for weapon model visibility

      // Enable WASD movement
      camera.keysUp.push(87);    
      camera.keysDown.push(83);   
      camera.keysLeft.push(65);  
      camera.keysRight.push(68); 
      camera.speed = 0.15; 
      camera.angularSensibility = 5000; 

      // --- Weapon Placeholder --- 
      const weaponPlaceholder = MeshBuilder.CreateBox("weapon", { width: 0.1, height: 0.15, depth: 0.5 }, scene);
      weaponPlaceholder.material = new StandardMaterial("weaponMat", scene);
      (weaponPlaceholder.material as StandardMaterial).diffuseColor = Color3.Gray();
      weaponPlaceholder.parent = camera; // Attach to camera
      weaponPlaceholder.position = new Vector3(0.2, -0.2, 0.5); // Position relative to camera (right, down, forward)
      weaponPlaceholder.isPickable = false; // Don't let the weapon block shots
      // --- End Weapon Placeholder ---

      // --- Muzzle Flash Placeholder ---
      const muzzleFlash = MeshBuilder.CreatePlane("muzzleFlash", { size: 0.1 }, scene);
      muzzleFlash.material = new StandardMaterial("flashMat", scene);
      (muzzleFlash.material as StandardMaterial).diffuseColor = Color3.Yellow();
      (muzzleFlash.material as StandardMaterial).emissiveColor = Color3.Yellow(); // Make it glow
      muzzleFlash.parent = weaponPlaceholder; // Attach to weapon
      muzzleFlash.position = new Vector3(0, 0, 0.26); // Position at the tip of the weapon
      muzzleFlash.setEnabled(false); // Start disabled
      muzzleFlash.isPickable = false;
      muzzleFlashRef.current = muzzleFlash; // Store reference for later use
      // --- End Muzzle Flash Placeholder ---

      // Basic Light
      const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene); 
      light.intensity = 0.8; 

      // Example Cover Objects for Room 1
      const room1Cover: CoverObject[] = [
        { position: new Vector3(-3, -ROOM_HEIGHT / 2 + 0.5, 3), size: new Vector3(1, 1, 2) }, // Low cover near west wall
        { position: new Vector3(3, -ROOM_HEIGHT / 2 + 0.75, -2), size: new Vector3(2, 1.5, 1) } // Taller cover near east wall
      ];

      // Example Targets for Room 1
      const room1Targets: Target[] = [
        { position: new Vector3(0, 0, 4) }, // Target against north wall
        { position: new Vector3(-4, 0, -4) } // Target in SW corner
      ];

      // Cover and Targets for Room 2 (Top Left)
      const room2Cover: CoverObject[] = [
        { position: new Vector3(0, -ROOM_HEIGHT / 2 + 0.75, 3), size: new Vector3(3, 1.5, 1) }, // Wide cover near north wall
      ];
      const room2Targets: Target[] = [
        { position: new Vector3(4, 0, 0) }, // Target on east wall
      ];

      // Cover and Targets for Room 3 (Bottom Right)
      const room3Cover: CoverObject[] = [
        { position: new Vector3(4, -ROOM_HEIGHT / 2 + 0.5, 0), size: new Vector3(1, 1, 2) }, // Cover near east wall center
      ];
      const room3Targets: Target[] = [
        { position: new Vector3(-4, 0, 4) }, // Target in NW corner
        { position: new Vector3(0, 0, -4) }, // Target on south wall
      ];

      // Cover and Targets for Room 4 (Top Right)
      const room4Cover: CoverObject[] = [
        { position: new Vector3(-3, -ROOM_HEIGHT / 2 + 0.75, -3), size: new Vector3(1.5, 1.5, 1.5) }, // Box cover SW
        { position: new Vector3(3, -ROOM_HEIGHT / 2 + 0.75, 3), size: new Vector3(1, 1.5, 1) } // Small cover NE
      ];
      const room4Targets: Target[] = [
        { position: new Vector3(0, 0, 0) }, // Target in the center
      ];


      // Create rooms
      // Room 1 (Bottom Left)
      createRoom("Room1", new Vector3(0, 0, 0), scene, { north: true, east: true }, room1Cover, room1Targets);

      // Room 2 (Top Left)
      createRoom("Room2", new Vector3(0, 0, ROOM_DEPTH + WALL_THICKNESS), scene, { south: true, east: true }, room2Cover, room2Targets);

      // Room 3 (Bottom Right)
      createRoom("Room3", new Vector3(ROOM_WIDTH + WALL_THICKNESS, 0, 0), scene, { north: true, west: true }, room3Cover, room3Targets);

      // Room 4 (Top Right)
      createRoom("Room4", new Vector3(ROOM_WIDTH + WALL_THICKNESS, 0, ROOM_DEPTH + WALL_THICKNESS), scene, { south: true, west: true }, room4Cover, room4Targets);

      // --- Calculate Initial Target Count ---
      const initialTargets = scene.getMeshesByTags("targetTag");
      setTotalTargets(initialTargets.length);
      setTargetsHit(0); // Ensure hit count is reset on setup
      // --- End Calculate Initial Target Count ---

      // Pointer lock and Shooting
      scene.onPointerDown = (evt) => {
        if (evt.button === 0) { // Left click
          if (!engine.isPointerLock) {
            engine.enterPointerlock();
          } else {
            // Use functional update to access current ammo state
            setAmmo(currentAmmo => {
              // Check for ammo before shooting
              if (currentAmmo <= 0) {
                console.log("Out of ammo!");
                return currentAmmo; // Return current state if no ammo
              }
              
              // --- Proceed with shooting --- 

              // Show Muzzle Flash
              if (muzzleFlashRef.current) {
                muzzleFlashRef.current.setEnabled(true);
                setTimeout(() => {
                  if (muzzleFlashRef.current) {
                    muzzleFlashRef.current.setEnabled(false);
                  }
                }, 60); // Flash duration
              }

              // Shoot a ray from camera center (more accurate for FPS)
              const ray = scene.createPickingRay(engine.getRenderWidth() / 2, engine.getRenderHeight() / 2, null, camera);
              
              const pickInfo = scene.pickWithRay(ray);

              if (pickInfo?.hit && pickInfo.pickedMesh) {
                  console.log("Hit:", pickInfo.pickedMesh.name, "at", pickInfo.pickedPoint);

                  // --- Create Hit Decal Placeholder --- 
                  const hitNormal = pickInfo.getNormal(true); // Get the normal of the hit surface
                  if (hitNormal) {
                    const decalSize = 0.15;
                    const decal = MeshBuilder.CreatePlane("hitDecal", {size: decalSize}, scene);
                    decal.material = new StandardMaterial("decalMat", scene);
                    (decal.material as StandardMaterial).diffuseColor = Color3.Black();
                    (decal.material as StandardMaterial).alpha = 0.8;
                    decal.position = pickInfo.pickedPoint.add(hitNormal.scale(0.01)); // Position at hit point + slight offset
                    
                    // Basic orientation: align decal's local Z with the inverse hit normal
                    // This makes the plane face outwards from the surface it hit.
                    decal.lookAt(pickInfo.pickedPoint.subtract(hitNormal)); 
                    decal.isPickable = false;

                    // Optional: Parent to hit mesh if it might move (causes issues if parent disposed)
                    // if (pickInfo.pickedMesh.metadata?.type !== "target") { // Don't parent to disappearing targets
                    //   decal.setParent(pickInfo.pickedMesh);
                    // }

                    // Remove decal after a few seconds
                    setTimeout(() => decal.dispose(), 5000);
                  }
                  // --- End Hit Decal Placeholder ---

                  // Check if the hit mesh is a target using metadata
                  if (pickInfo.pickedMesh.metadata?.type === "target") {
                      console.log("Target Hit!");
                      // Increment hit count
                      setTargetsHit(prevHits => prevHits + 1);
                      // Optionally destroy the target
                      pickInfo.pickedMesh.dispose(); 
                  } 
              }
              // --- End Proceed with shooting ---

              // Decrement ammo after successful shot logic
              return currentAmmo - 1;
            });
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
  }, [reactCanvas]); // Removed ammo dependency

  const targetsRemaining = totalTargets - targetsHit;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}> {/* Added wrapper div for positioning UI */}
      <canvas ref={reactCanvas} id="renderCanvas" />
      {/* UI Elements */}
      <div className="crosshair"></div>
      <div className="hud-bottom-left">
        <div>Ammo: {ammo}</div>
        <div>Targets Remaining: {targetsRemaining} / {totalTargets}</div>
      </div>
    </div>
  );
}

export default App;
