var canvas = document.getElementById("c"),
    height = 320;
    width = 240;
function resize() {
  canvas.width = width;
  canvas.height = height;
  canvas.style.cssText = 'width:'+640+'px;height:'+480+'px;';
};
resize();

var ctx = canvas.getContext('2d'),
  data = ctx.getImageData(0, 0, width, height);

function render(scene) {
  var camera = scene.camera,
    objects = scene.objects,
    lights = scene.lights;
  var eye = Vector.unitVector(Vector.subtract(camera.vector, camera.point)),
    right = Vector.unitVector(Vector.crossProduct(eye, Vector.UP)),
    up = Vector.unitVector(Vector.crossProduct(right, eye)),
    fovRadians = Math.PI * (camera.fieldOfView / 2) / 180,
    heightWidthRatio = height / width,
    halfWidth = Math.tan(fovRadians),
    halfHeight = heightWidthRatio * halfWidth,
    cameraWidth = halfWidth * 2,
    cameraHeight = halfHeight * 2,
    pixelWidth = cameraWidth / (width - 1),
    pixelHeight = cameraHeight / (height - 1);

  var index, color;
  var ray = {
    point: camera.point
  };
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      var xComp = Vector.scale(right, (x * pixelWidth) - halfWidth),
        yComp = Vector.scale(up, (y * pixelHeight) - halfHeight);

      ray.vector = Vector.unitVector(Vector.add3(eye, xComp, yComp));
      color = trace(ray, scene, 0);
      index = (x * 4) + (y * width * 4);
      data.data[index + 0] = color.x;
      data.data[index + 1] = color.y;
      data.data[index + 2] = color.z;
      data.data[index + 3] = 255;
    }
  }
  ctx.putImageData(data, 0, 0);
};

function trace (ray, scene, depth) {
  if (depth > 3) return;
  var distObject = intersectScene(ray, scene);
  if (distObject[0] === Infinity) {
    return Vector.WHITE;
  }
  var dist = distObject[0],
      object = distObject[1];

  var pointAtTime = Vector.add(ray.point, Vector.scale(ray.vector, dist));
  return surface(ray, scene, object, pointAtTime, sphereNormal(object, pointAtTime), depth);
};

function intersectScene(ray, scene) {
  var closest = [Infinity, null];
  for (var i = 0; i < scene.objects.length; i++) {
    var object = scene.objects[i],
        dist = sphereIntersection(object, ray);
    if (dist !== undefined && dist < closest[0]) {
      closest = [dist, object];
    }
  }
  return closest;
};

function sphereIntersection (sphere, ray) {
  var eyeToCenter = Vector.subtract(sphere.point, ray.point),
      v = Vector.dotProduct(eyeToCenter, ray.vector),
      eoDot = Vector.dotProduct(eyeToCenter, eyeToCenter),
      discriminant = (sphere.radius * sphere.radius) - eoDot + (v * v);

  if (discriminant < 0) {
    return;
  } else {
    return v - Math.sqrt(discriminant);
  }
};

function sphereNormal(sphere, position) {
  return Vector.unitVector(Vector.subtract(position, sphere.point));
};

function surface(ray, scene, object, pointAtTime, normal, depth) {
  var color = object.color,
      zero = Vector.ZERO,
      lambert = 0;

  if (object.lambert) {
    for (var i = 0; i < scene.lights.length; i++) {
      var lightPoint = scene.lights[0];
      if (!isLightVisible(pointAtTime, scene, lightPoint)) 
        continue;
      var contribution = Vector.dotProduct(Vector.unitVector(Vector.subtract(lightPoint, pointAtTime)), normal);
      if (contribution > 0)
        lambert += contribution;
    };
  }
  if (object.specular) {
    var reflectedRay = {
      point: pointAtTime,
      vector: Vector.reflectThrough(ray.vector, normal)
    };
    var reflectedColor = trace(reflectedRay, scene, ++depth);
    if (reflectedColor) {
      zero = Vector.add(zero, Vector.scale(reflectedColor, object.specular));
    }
  }
  lambert = Math.min(1, lambert);
  return Vector.add3(zero, 
                     Vector.scale(color, lambert * object.lambert),
                     Vector.scale(color, object.ambient));
};

function isLightVisible(point, scene, light) {
  var distObject = intersectScene({
    point: point,
    vector: Vector.unitVector(Vector.subtract(point, light))
  }, scene);
  return distObject[0] > -0.005;
};

var planet1 = 0,
    planet2 = 0;

function tick () {
  if (playing)
    requestAnimationFrame(tick);
  planet1 += 0.1;
  planet2 += 0.2;

  scene.objects[1].point.x = Math.sin(planet1) * 3.5;
  scene.objects[1].point.z = -3 + (Math.cos(planet1) * 3.5);

  scene.objects[2].point.x = Math.sin(planet2) * 4;
  scene.objects[2].point.z = -3 + (Math.cos(planet2) * 4);

  render(scene);
  document.getElementById('fps').innerHTML = fps.get();
};

var playing = false;

function play () {
  playing = true;
  fps.reset();
  requestAnimationFrame(tick);
};

function stop () {
  playing = false;
};

var fps = {
  start: 0,
  frames: 0,
  get: function () {
    this.frames++;
    var now = new Date().getTime(),
        current = (now - this.start) / 1000;
    now = Math.floor(this.frames / current);
    if (current > 1) {
      this.start = new Date().getTime();
      this.frames = 0;
    }
    return now;
  },
  reset: function () {
    this.start = 0;
    this.frames = 0;
  }
}

render(scene);

document.getElementById('play').onclick = play;
document.getElementById('stop').onclick = stop;
window.onresize = resize;
