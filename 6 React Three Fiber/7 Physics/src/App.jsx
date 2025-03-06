import { Suspense } from "react";
import { Environment, OrbitControls, Grid, Center } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import Wall from "./Wall";

/*

We will use the Rapier library for implementing physics in our scene. It is a determinist library - it creates the simulations to run same across all devices, irrespective of the specifications of the device.
To enable physics, we need to wrap the desired component in the Physics component imported from drei. So, only the components that are wrapped in the Physics component will be affected by the physics.
Unlike native three.js, we don't need to update the physics world manually, we don't need to manually set the bounding box for the objects.

To enable debugging, we can use the debug prop on the Physics component.

Key point - Implementing Physics on a super flat plane is not recommended as it will create a bit of issues, so it is recommended to use physics on a mesh that has a bit of height.

Now, wrap the mesh or object you want to apply physics on in the RigidBody component, which will apply the physics to the object. The RigidBody component takes in a lot of props, like to make the object static, we can set the "type" attribute to "static".

* Colliders - Colliders are the shapes that define the collision of the object. The colliders are automatically handled by Rapier itself and are setup initially. We can use the colliders prop to set the collider for the object. The default bounding box is cuboid, but we can change it to a ball, cylinder, capsule, etc or we can even create our own custom bounding box using various methods.
We can wrap two or more objects in the same RigidBody component to make them collide with each other and create a compound object with individual colliders. For too specific or complex objects, add the colliders prop to "hull" to use the hull collider. It is for classic usage and the drawback is that it is very accurate it's just a wrapper around the object and does not have any internal structure.
Another solution, is to use "trimesh", which is a bit more complex but is more accurate, hence costs more performance. Avoid using "trimesh" for dynamic objects that are constantly changing.
To create custom colliders, first, make the colliders attribute to "false" on the mesh and then import various colliders available from Rapier, and then use it as a component inside the RigidBody and tweak it's params to achieve the desired result. Here is the link to the documentation for the colliders - https://rapier.rs/docs/user_guides/rust/colliders/#shapes

* Impulse(Force)/Torque(rotation) - We can apply force and torque to the object using the applyImpulse and applyTorqueImpulse methods. There are other things like applyImpulse and applyAngularImpulse too which we can use on some specific cases. We need to provide the amount of these values mostly in form of Vectors as like "{x: ..., y: ..., z: ...}".
To apply these things, we first need to access the mesh using the "useRef" hook and then use the applyImpulse and applyTorqueImpulse methods on the current property of the mesh's ref. To trigger these methods, we can setup either onClick or other methods on the mesh.

* Mass - The mass of the object is kinda automatically set by Rapier based on the shape and volume of the object. We can set the mass of the object using the mass attribute on the RigidBody component. The default value is 1.

* Bouncing (Restitution) - The restitution is the property that defines how much the object bounces when it collides with another object. We can set the restitution of the object using the restitution attribute on the RigidBody component. The default value is 0. The result of the bounce will be based on the restitution property of both the objects which are colliding.

* Friction - The friction is the property that defines how much the object slows down when it collides with another object. We can set the friction of the object using the friction attribute on the RigidBody component. The default value is 0.7.

* Events - There are 4 major events that we can use to trigger actions on the object - onCollisionEnter, onCollisionExit, onSleep and onWake. We can use these events to trigger actions on the object when it collides with another object, when it sleeps or wakes up, etc.

*/

const App = () => {
  return (
    <>
      <Grid
        position={[0, 0, 0]}
        args={[10, 10]}
        cellSize={1}
        cellThickness={1}
        cellColor="#6e6e6e"
        sectionSize={2}
        sectionColor="gray"
        fadeDistance={40}
        fadeStrength={2}
        followCamera={false}
        infiniteGrid={true}
      />

      {/* We can set or tweak the gravity of the physics world using the gravity prop on the Physics component. We can also se the gravity scale for each object to make it react different from the world's gravity. */}
      <Physics gravity={[0, -9.81, 0]}>
        <RigidBody colliders={null} type="fixed">
          <CuboidCollider args={[50, 0.1, 50]} position={[0, 0, 0]} />
        </RigidBody>

        <Suspense>
          <Wall
            position={[0, 0, 10]}
            rows={4}
            columns={4}
            maxHeight={10}
            scale={2}
          />

          <Wall
            position={[0, 0, -10]}
            rows={4}
            columns={4}
            maxHeight={10}
            scale={2}
          />
        </Suspense>

        <OrbitControls
          maxPolarAngle={Math.PI * 0.49}
          maxDistance={50}
          minDistance={10}
        />

        <Environment preset="dawn" />

        <Perf position="top-left" />
      </Physics>
    </>
  );
};

export default App;
