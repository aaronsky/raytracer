var scene = {};
scene.camera = {
  point: {
    x: 0,
    y: 1.8,
    z: 10
  },
  fieldOfView: 45,
  vector: {
    x: 0,
    y: 3,
    z: 0
  }
};
scene.lights = [{
  x: -30,
  y: -10,
  z: 20
}];
scene.objects = [{
  type: 'sphere',
  point: {
    x: 0,
    y: 3.5,
    z: -3
  },
  color: {
    x: 155,
    y: 200,
    z: 155
  },
  specular: 0.2,
  lambert: 0.7,
  ambient: 0.1,
  radius: 3
}, {
  type: 'sphere',
  point: {
    x: -4,
    y: 2,
    z: -1
  },
  color: {
    x: 155,
    y: 155,
    z: 155
  },
  specular: 0.1,
  lambert: 0.9,
  ambient: 0.0,
  radius: 0.2
}, {
  type: 'sphere',
  point: {
    x: -4,
    y: 3,
    z: -1
  },
  color: {
    x: 255,
    y: 255,
    z: 255
  },
  specular: 0.2,
  lambert: 0.7,
  ambient: 0.1,
  radius: 0.1
}];
