import * as THREE from 'three';

const canvas = document.querySelector('.webgl')

const scene = new THREE.Scene();

/*
There are 4 properties to transform objects -->
- position
- scale
- rotation
- quaternion

All classes that inherit from the Object3D posses these properties like PerspectiveCamera, Mesh, etc.
*/



const sizes = {
    width: 800,
    height: 600
}

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);


/* POSITION

mesh.position.x = 0.7;
mesh.position.y = -0.6;
mesh.position.z = 1;
*/

// You can change all 3 values of x, y and z at once by using the set() method.
mesh.position.set(0.5, 0, 0);


/* SCALE
The default value of each axis is 1.
You can change all the 3 values of x, y and z at once by using the set() method.
*/

// mesh.scale.x = 2;
// mesh.scale.y = 0.5;
// mesh.scale.z = 0.5;

mesh.scale.set(2, 0.5, 0.5);


/* ROTATION

We can rotate objects either with rotation or quaternion. Updating one will automatically update the other.

1. With rotation

rotation also has x, y and z properties but it's Euler (Euler angles are a way of describing a 3D rotation using 3 angles but it has less precision than quaternions).

When you change the x,y and z properties, you can imagine putting a stick through your object's center in the axis direction and then rotating that object on that stick.

The value of these axes is expressed in radians.
A full rotation is something like 3.141592653589793 radians. We can also use the Math.PI constant to get the value.

Be careful, when you rotate on an axis, you might also rotate the other axes. The rotation by default is in the x, y, z order and you can get strange results like an axis not working anymore, this is called "gimbal lock".

To overcome this, you can change the order of the rotation using the reorder method.
NOTE -> Do it before you rotate the object.

2. With quaternion

Quaternions are a way to represent rotations in 3D space. They are more precise than Euler angles and they don't suffer from gimbal lock.
It is a bit more complex to understand but it's the best way to rotate objects.
Remember that the quaternion updates when you change the rotation property.

*/

// mesh.rotation.reorder('YXZ');

// mesh.rotation.y = Math.PI * 0.25;
// mesh.rotation.x = Math.PI * 0.25;


/* AXES HELPER

Positioning things in space can be hard, one good solution is to use the AxesHelper class to display a colored line for each axis.

The parameter is the length of the line of axesHelper (default is 1).
*/
const AxesHelper = new THREE.AxesHelper(2)
scene.add(AxesHelper)

/* GROUPS

You can group objects together to manipulate them as a single object and use position, rotation and scale on the group. We use Group class for this.
*/

const group = new THREE.Group();
scene.add(group);
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff00ff })
);
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
);

cube1.position.set(0, 0, 0);
cube2.position.set(2, 0, 0);
cube3.position.set(-2, 0, 0);

group.add(cube1, cube2, cube3);

group.position.y = 1;
group.rotation.y = Math.PI * 0.25
// group.scale.y = 2;



const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.x = 2;
camera.position.y = 1;
camera.position.z = 3;
scene.add(camera);

/* LOOK AT

Object3D has a lookAt() method that takes a Vector3 object as a parameter and rotates the object so that it's -z axis is pointing at the given vector. The target must be a Vector3 object.

*/

camera.lookAt(group.position);


// The length of the vector is the distance between the object and the origin (0, 0, 0)
// console.log(mesh.position.length());

// The distanceTo() method returns the distance between the object and the given vector. In this case, the distance between the camera ( a Vector3 object) and the mesh.
// console.log(mesh.position.distanceTo(camera.position));

// The normalize() method normalizes (reduces) the vector, meaning it sets its length to 1.
// mesh.position.normalize();
// console.log(mesh.position.length()); ( The result is 1 )


const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// The below code will not work anymore since these transformations are applied after we rendered the scene, it's more like a snapshot of the scene at that moment, so any changes after that will not be reflected in the scene.

mesh.position.x = 0.7;
mesh.position.y = -0.6;
mesh.position.z = 1;
