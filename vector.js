var Vector = {};

Vector.UP = { x: 0, y: 1, z: 0 };
Vector.ZERO = { x: 0, y: 0, z: 0 };
Vector.WHITE = { x: 255, y: 255, z: 255 };

Vector.copy = function (vec) {
  return { x: vec.x, y: vec.y, z: vec.z };
};
Vector.ZEROcp = function () {
  return Vector.copy(Vector.ZERO);
};

Vector.dotProduct = function (lhs, rhs) {
  return (lhs.x * rhs.x) + (lhs.y * rhs.y) + (lhs.z * rhs.z);
};
Vector.crossProduct = function (lhs, rhs) {
  return {
    x: (lhs.y * rhs.z) - (lhs.z * rhs.y),
    y: (lhs.z * rhs.x) - (lhs.x * rhs.z),
    z: (lhs.x * rhs.y) - (lhs.y * rhs.x)
  };
};
Vector.scale = function (vec, scale) {
  return {
    x: vec.x * scale,
    y: vec.y * scale,
    z: vec.z * scale
  };
};
Vector.unitVector = function (vec) {
  return Vector.scale(vec, 1 / Vector.length(vec));
};

Vector.add = function (lhs, rhs) {
  return {
    x: lhs.x + rhs.x,
    y: lhs.y + rhs.y,
    z: lhs.z + rhs.z
  };
};
Vector.add3 = function (lhs, mhs, rhs) {
  return Vector.add(lhs, Vector.add(mhs, rhs));
};
Vector.subtract = function (lhs, rhs) {
  return {
    x: lhs.x - rhs.x,
    y: lhs.y - rhs.y,
    z: lhs.z - rhs.z
  };
};
Vector.length = function (vec) {
  return Math.sqrt(Vector.dotProduct(vec, vec));
};
Vector.reflectThrough = function (vec, normal) {
  var dot = Vector.scale(normal, Vector.dotProduct(vec, normal));
  return Vector.subtract(Vector.scale(dot, 2), vec);
};