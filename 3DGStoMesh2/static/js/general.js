import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const cmpButtonRight = document.getElementById("generalCmpButtonRight");
const cmpButtonLeft = document.getElementById("generalCmpButtonLeft");
const cmpContainerLeft = document.getElementById("generalCmpContainerLeft");
const cmpContainerRight = document.getElementById("generalCmpContainerRight");
const modelLabelDropdown = document.getElementById("generalModelLabelDropdown");
const check3dgsUrl = document.getElementById("generalCheck3dgs");

let object1, texture1, object2, texture2;
let renderNextFrame = false;
let showMap = true;

let model = "Statue";
let modelList = {
  Flower: {
    url: "https://www.kiriengine.app/share/3dgs?taskId=1852602821023629312",
    distance: 0,
  },
  Statue: {
    url: "https://www.kiriengine.app/share/3dgs?taskId=1852423674087342080",
    distance: 0,
  },
  Suitcase: {
    url: "https://www.kiriengine.app/share/3dgs?taskId=1852350800282517504",
    distance: 0,
  },
};

let modelType = 0;
let modelTypeList = ["1.0", "photo"];

cmpButtonLeft.addEventListener("click", () => {
  if (showMap) return;
  showMap = true;
  cmpButtonLeft.classList.add("active");
  cmpButtonRight.classList.remove("active");
  toggleTexture(showMap);
});
cmpButtonRight.addEventListener("click", () => {
  if (!showMap) return;
  showMap = false;
  cmpButtonRight.classList.add("active");
  cmpButtonLeft.classList.remove("active");
  toggleTexture(showMap);
});

modelLabelDropdown.addEventListener("change", (event) => {
  cmpContainerRight.children[1].style.display = "block";
  disposeGroup(object2);
  texture2?.dispose();
  object2 = null;
  texture2 = null;
  renderNextFrame = true;
  modelType = modelLabelDropdown.value;
  const _modelType = modelLabelDropdown.value;
  loadObj(
    `General/${model}/${modelTypeList[modelType]}/3DModel`,
    scene2,
    (p) => {
      if (_modelType === modelType) {
        cmpContainerRight.children[1].children[0].value = p;
      }
    },
    (object) => {
      if (_modelType === modelType) {
        object2 = object;
        scene2.add(object);
        toggleTexture(showMap);
        cmpContainerRight.children[1].style.display = "none";
        renderNextFrame = true;
      } else {
        disposeGroup(object);
      }
    }
  );
  renderNextFrame = true;
});

check3dgsUrl.href = modelList[model].url;

const width = cmpContainerLeft.offsetWidth || cmpContainerRight.offsetWidth;
const height = cmpContainerLeft.offsetHeight || cmpContainerRight.offsetHeight;

const camera1 = new THREE.PerspectiveCamera(60, width / height, 0.01, 100000);
camera1.position.z = 100;
const camera2 = new THREE.PerspectiveCamera(60, width / height, 0.01, 100000);
camera2.position.copy(camera1.position);

const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();

const light1 = new THREE.AmbientLight(0xffffff, 1);
scene1.add(light1);
const light2 = new THREE.AmbientLight(0xffffff, 1);
scene2.add(light2);

const dirLight1 = new THREE.DirectionalLight(0xffffff, 1);
scene1.add(dirLight1);
const dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
scene2.add(dirLight2);

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x777777, 2);
hemisphereLight.position.y = 1000;
scene1.add(hemisphereLight);
scene2.add(hemisphereLight.clone());

const renderer1 = new THREE.WebGLRenderer({ antialias: true });
renderer1.setPixelRatio(window.devicePixelRatio);
renderer1.setSize(width, height);
renderer1.setClearColor(new THREE.Color(0xf4f5f5));
const renderer2 = new THREE.WebGLRenderer({ antialias: true });
renderer2.setPixelRatio(window.devicePixelRatio);
renderer2.setSize(width, height);
renderer2.setClearColor(new THREE.Color(0xf4f5f5));

const gl1 = renderer1.getContext("webgl");
gl1.enable(gl1.CULL_FACE);
const gl2 = renderer2.getContext("webgl");
gl2.enable(gl2.CULL_FACE);

const controls1 = new OrbitControls(camera1, renderer1.domElement);
cmpContainerLeft.appendChild(renderer1.domElement);
const controls2 = new OrbitControls(camera2, renderer2.domElement);
cmpContainerRight.appendChild(renderer2.domElement);

function animate() {
  if (!renderNextFrame) return;
  renderNextFrame = false;
  controls1.update();
  renderer1.render(scene1, camera1);
  controls2.update();
  renderer2.render(scene2, camera2);
}

function loadObj(url, scene, onProgress, onDone) {
  renderNextFrame = false;
  let object;
  const loader = new FBXLoader();
  loader.load(
    `https://d1bj0ra3gv2418.cloudfront.net/public/staticmodel/${url}.fbx`,
    function (obj) {
      object = obj;
      object.castShadow = true;
      object.receiveShadow = true;
      onDone && onDone(object);
      setTimeout(() => {
        renderNextFrame = true;
        onProgress(100);
      }, 200);
    },
    (xhr) => {
      let progress = Math.floor((xhr.loaded / xhr.total) * 100);
      if (progress < 100) {
        onProgress(progress);
      }
    },
    (err) => {
      console.log(err);
    }
  );
}

function cmpLeftLoad(url, name) {
  disposeGroup(object1);
  texture1?.dispose();
  object1 = null;
  texture1 = null;
  renderNextFrame = true;
  loadObj(
    url,
    scene1,
    (p) => {
      if (name === model) {
        cmpContainerLeft.children[1].children[0].value = p;
      }
    },
    (object) => {
      if (name != model) {
        return disposeGroup(object);
      }
      scene1.add(object);
      renderNextFrame = true;
      if (modelList[name].distance == 0) {
        const box = new THREE.Box3().setFromObject(object);
        const boxRadius = box.max.distanceTo(box.min) / 2;

        const fovV = 60;
        let aspectX, aspectY, fovH;
        aspectX = width / 2;
        aspectY = height / 2;
        const cameraZ = aspectY / Math.tan(((fovV / 2) * Math.PI) / 180);
        fovH = ((Math.atan(aspectX / cameraZ) * 180) / Math.PI) * 2;
        const fov = Math.min(fovV, fovH);
        const distance = boxRadius / Math.sin((fov / 2 / 180) * Math.PI);
        camera1.position.z = distance / 2;
        modelList[name].distance = distance / 2;
      }

      object1 = object;
      toggleTexture(showMap);
      cmpContainerLeft.children[1].style.display = "none";
    }
  );
  renderNextFrame = true;
}
function cmpRightLoad(url, name) {
  disposeGroup(object2);
  texture2?.dispose();
  object2 = null;
  texture2 = null;
  renderNextFrame = true;
  loadObj(
    url,
    scene2,
    (p) => {
      if (name === model) {
        cmpContainerRight.children[1].children[0].value = p;
      }
    },
    (object) => {
      if (name != model) {
        return disposeGroup(object);
      }
      scene2.add(object);
      renderNextFrame = true;
      if (modelList[name].distance == 0) {
        const box = new THREE.Box3().setFromObject(object);
        const boxRadius = box.max.distanceTo(box.min) / 2;

        const fovV = 60;
        let aspectX, aspectY, fovH;
        aspectX = width / 2;
        aspectY = height / 2;
        const cameraZ = aspectY / Math.tan(((fovV / 2) * Math.PI) / 180);
        fovH = ((Math.atan(aspectX / cameraZ) * 180) / Math.PI) * 2;
        const fov = Math.min(fovV, fovH);
        const distance = boxRadius / Math.sin((fov / 2 / 180) * Math.PI);
        camera2.position.z = distance / 2;
        modelList[name].distance = distance / 2;
      }

      object2 = object;
      toggleTexture(showMap);
      cmpContainerRight.children[1].style.display = "none";
    }
  );
  renderNextFrame = true;
}

function disposeGroup(group) {
  if (!group) return;

  while (group.children.length > 0) {
    const child = group.children[0];
    disposeObject3D(child);
    group.remove(child);
  }

  if (group.parent) {
    group.parent.remove(group);
  }

  group.userData = null;
}

function disposeObject3D(object) {
  if (!object) return;

  while (object.children.length > 0) {
    const child = object.children[0];
    disposeObject3D(child);
    object.remove(child);
  }

  if (object.geometry) {
    object.geometry.dispose();
  }

  if (object.material) {
    if (Array.isArray(object.material)) {
      object.material.forEach((material) => {
        for (const key in material) {
          if (material[key] && material[key].isTexture) {
            material[key].dispose();
          }
        }
        material.dispose();
      });
    } else {
      for (const key in object.material) {
        if (object.material[key] && object.material[key].isTexture) {
          object.material[key].dispose();
        }
      }
      object.material.dispose();
    }
  }

  if (object.parent) {
    object.parent.remove(object);
  }

  object.userData = null;
}

renderer1.setAnimationLoop(animate);
renderer2.setAnimationLoop(animate);

controls1.addEventListener("change", () => {
  camera2.position.copy(camera1.position);
  controls2.target.copy(controls1.target);
  dirLight1.position.set(camera1.position.x, camera1.position.y, camera1.position.z);
  renderNextFrame = true;
});
controls2.addEventListener("change", () => {
  camera1.position.copy(camera2.position);
  controls1.target.copy(controls2.target);
  dirLight2.position.set(camera2.position.x, camera2.position.y, camera2.position.z);
  renderNextFrame = true;
});

function toggleTexture(isVisible) {
  object1?.traverse((child) => {
    if (child.isMesh && child.material) {
      texture1 = texture1 || child.material.map;
      if (isVisible) {
        child.material.map = texture1;
      } else {
        child.material.map = null;
      }
      child.material.needsUpdate = true;
      renderNextFrame = true;
    }
  });
  object2?.traverse((child) => {
    if (child.isMesh && child.material) {
      texture2 = texture2 || child.material.map;
      if (isVisible) {
        child.material.map = texture2;
      } else {
        child.material.map = null;
      }
      child.material.needsUpdate = true;
      renderNextFrame = true;
    }
  });
}

function handleGeneralComparisonClick(name) {
  model = name;
  cmpContainerLeft.children[1].style.display = "block";
  cmpContainerRight.children[1].style.display = "block";
  check3dgsUrl.href = modelList[name].url;
  scene1.remove(object1);
  renderNextFrame = true;
  cmpLeftLoad(`General/${name}/2.0/3DModel`, name);
  scene2.remove(object2);
  renderNextFrame = true;
  cmpRightLoad(`General/${name}/${modelTypeList[modelType]}/3DModel`, name);
  renderNextFrame = true;
}

window.handleGeneralComparisonClick = handleGeneralComparisonClick;

cmpLeftLoad(`General/${model}/2.0/3DModel`, model);
cmpRightLoad(`General/${model}/1.0/3DModel`, model);
animate();
