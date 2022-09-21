import * as THREE from 'https://cdn.skypack.dev/three@0.144.0';

export var Conversion = Conversion || {};

Conversion.ZOOM_RATIO_C2M = 48.26;

Conversion.toCupixPosition = (xyz, tmM2C) => {
  if (tmM2C == undefined) throw new Error('Invalid tm');
  if (!Geom.isValidXYZ(xyz)) throw new Error('Invalid xyz');
  const pos = Geom.fromTHREEVector3(Geom.toTHREEVector3(xyz).applyMatrix4(tmM2C));
  return pos;
}

Conversion.toMatterportPosition = (xyz, tmC2M) => {
  if (tmC2M == undefined) throw new Error('Invalid tm');
  if (!Geom.isValidXYZ(xyz)) throw new Error('Invalid xyz');
  const pos = Geom.fromTHREEVector3(Geom.toTHREEVector3(xyz).applyMatrix4(tmC2M));
  return pos;
}

Conversion.toCupixDirectionLookAt = (cxyz, mrotation, tmM2C) => {
  // `rotation.x`: is the amount the camera will rotate up/down, in the range between [-90…90]
  // with -90 being straight down and 90 being straight up, 45 would be looking up at a 45 degree angle., -45 down etc..
  // `rotation.y`: is the amount the camera rotate around horizontally, between [-360…0…360],
  // negative values to rotate to the left, positive to rotate to the right.
  if (tmM2C == undefined) throw new Error('Invalid tm');
  if (!Geom.isValidXYZ(cxyz)) throw new Error('Invalid xyz');
  if (mrotation == undefined || isNaN(mrotation.x) || isNaN(mrotation.y)) throw new Error('Invalid rotation');

  const mRadX = mrotation.x * Math.PI / 180;
  const mRadY = mrotation.y * Math.PI / 180;

  const mlookAt = Geom.toTHREEVector3({
    x: -Math.cos(mRadX) * Math.sin(mRadY),
    y: Math.sin(mRadX),
    z: -Math.cos(mRadX) * Math.cos(mRadY)
  });

  const clookAt = mlookAt.clone().applyMatrix4(tmM2C.clone().setPosition(0, 0, 0));
  return {
    x: cxyz.x + clookAt.x,
    y: cxyz.y + clookAt.y,
    z: cxyz.z + clookAt.z
  };
}

Conversion.toMatterportRotation = (tmCamera, tmC2M) => {
  if (tmCamera == undefined) throw new Error('Invalid camera tm');
  if (tmC2M == undefined) throw new Error('Invalid tm');
  const yaxis = new THREE.Vector3(0, 1, 0);
  const _zaxis = new THREE.Vector3(0, 0, -1);

  const lookAt = new THREE.Vector3().setFromMatrixColumn(tmCamera, 2).negate();
  const up = new THREE.Vector3().setFromMatrixColumn(tmCamera, 1);
  const mlookAt = lookAt.clone().applyMatrix4(tmC2M.clone().setPosition(0, 0, 0));
  const mup = up.clone().applyMatrix4(tmC2M.clone().setPosition(0, 0, 0));
  const mright = Geom.fromTHREEVector3(mlookAt.clone().cross(mup));

  const mprojLookAt = mlookAt.clone().projectOnPlane(yaxis);
  const xrot = Geom.projectedAngle(mright, mprojLookAt, mlookAt) * 180 / Math.PI;
  const yrot = Geom.projectedAngle(yaxis, _zaxis, mprojLookAt) * 180 / Math.PI;
  return { x: xrot, y: yrot };
}

Conversion.toMatterportZoom = (fov) => {
  if (isNaN(fov)) throw new Error('Invalid fov');
  return (168.78 - fov) / Conversion.ZOOM_RATIO_C2M;
}

Conversion.getConversionTransformMatrixM2C = (cxyz0, cxyz1, mxyz0, mxyz1) => {
  if (!Geom.isValidXYZ(cxyz0)) throw new Error('Invalid point');
  if (!Geom.isValidXYZ(cxyz1)) throw new Error('Invalid point');
  if (!Geom.isValidXYZ(mxyz0)) throw new Error('Invalid point');
  if (!Geom.isValidXYZ(mxyz1)) throw new Error('Invalid point');
  let angle = Math.asin(((cxyz0.x - cxyz1.x) * (-mxyz0.z + mxyz1.z) - (mxyz0.x - mxyz1.x) * (cxyz0.y - cxyz1.y)) / (Math.pow((mxyz0.x - mxyz1.x), 2) + Math.pow((-mxyz0.z + mxyz1.z), 2)));
  if (isNaN(angle)) throw new Error('Invalid angle');

  const diffcx = cxyz0.x - cxyz1.x;
  const diffmx = mxyz0.x - mxyz1.x;
  if ((diffcx < 0 && diffmx > 0) || (diffcx > 0) && diffmx < 0) {
    angle = Math.PI - angle;
  }

  const tx = cxyz0.x - mxyz0.x * Math.cos(angle) + mxyz0.z * Math.sin(angle);
  const ty = cxyz0.y + mxyz0.x * Math.sin(angle) + mxyz0.z * Math.cos(angle);
  const tz = cxyz0.z - mxyz0.y;

  const tm = new THREE.Matrix4().set(
    Math.cos(angle), 0, -Math.sin(angle), tx,
    -Math.sin(angle), 0, -Math.cos(angle), ty,
    0, 1, 0, tz,
    0, 0, 0, 1
  );
  return tm;
}

export var Geom = Geom || {};

Geom.eps = 0.00000001;

Geom.calcSQR = (n) => {
  return n * n;
}

Geom.calcSQDistance = (lxyz, rxyz) => {
  return Geom.calcSQR(lxyz.x - rxyz.x) + Geom.calcSQR(lxyz.y - rxyz.y) + Geom.calcSQR(lxyz.z - rxyz.z);
}

Geom.isValidXYZ = (xyz) => {
  return xyz != undefined && !isNaN(xyz.x) && !isNaN(xyz.y) && !isNaN(xyz.y);
}

Geom.arrayToXYZ = (arr) => {
  return arr ? { x: arr[0], y: arr[1], z: arr[2] } : undefined;
}

Geom.arrayToMatrix4 = (arr) => {
  if (arr == undefined) return undefined;
  const m = new THREE.Matrix4();
  m.set(
    arr[0], arr[1], arr[2], arr[3],
    arr[4], arr[5], arr[6], arr[7],
    arr[8], arr[9], arr[10], arr[11],
    arr[12], arr[13], arr[14], arr[15]);
  return m;
}

Geom.toInverseMatrix4 = (m) => {
  return m.clone().invert();
}

Geom.findNearest = (xyz, candidates, positionGetter) => {
  let minDistance = Infinity;
  let found;

  candidates.forEach(it => {
    const pos = positionGetter(it);
    if (pos == undefined) return;
    const distance = Geom.calcSQDistance(xyz, pos);
    if (minDistance >= distance) {
      minDistance = distance;
      found = it;
    }
  });

  return found;
}

Geom.toTHREEVector3 = (xyz) => new THREE.Vector3(xyz.x, xyz.y, xyz.z);

Geom.fromTHREEVector3 = (xyz) => ({ x: xyz.x, y: xyz.y, z: xyz.z });

Geom.projectedAngle = (axis, v1, v2) => {
  const _axis = Geom.toTHREEVector3(axis);
  const _v1 = Geom.toTHREEVector3(v1);
  const _v2 = Geom.toTHREEVector3(v2);
  _v1.projectOnPlane(_axis);
  _v2.projectOnPlane(_axis);
  if (_v1.length() < Geom.eps || _v2.length() < Geom.eps) {
    return 0.0;
  }
  let angle = _v1.angleTo(_v2);
  if (_v1.cross(_v2).dot(_axis) < 0) {
    angle *= -1.0;
  }
  return angle;
}
