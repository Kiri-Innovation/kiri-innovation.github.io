import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default class cmpModel {
  constructor(container1, container2) {
    let object1, texture1, object2, texture2, curModel1, curModel2;
    let showMap = false;
    let renderNextFrame = true;

    const width = container1.offsetWidth || container2.offsetWidth;
    const height = container1.offsetHeight || container2.offsetHeight;

    const camera1 = new THREE.PerspectiveCamera(60, width / height, 0.01, 100000);
    camera1.position.z = 100;
    const camera2 = new THREE.PerspectiveCamera(60, width / height, 0.01, 100000);
    camera2.position.z = 100;

    const scene1 = new THREE.Scene();
    const scene2 = new THREE.Scene();

    const light1 = new THREE.AmbientLight(0xffffff, 0.5);
    const light2 = new THREE.AmbientLight(0xffffff, 0.5);
    scene1.add(light1);
    scene2.add(light2);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1);
    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
    scene1.add(dirLight1);
    scene2.add(dirLight2);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x777777, 0.5);
    hemisphereLight.position.y = 1000;
    scene1.add(hemisphereLight);
    scene2.add(hemisphereLight.clone());

    const bgColor = new THREE.Color(0xf4f5f5);

    const renderer1 = new THREE.WebGLRenderer({ antialias: true });
    renderer1.setPixelRatio(window.devicePixelRatio);
    renderer1.setSize(width, height);
    renderer1.setClearColor(bgColor);

    const renderer2 = new THREE.WebGLRenderer({ antialias: true });
    renderer2.setPixelRatio(window.devicePixelRatio);
    renderer2.setSize(width, height);
    renderer2.setClearColor(bgColor);

    const gl1 = renderer1.getContext("webgl");
    gl1.enable(gl1.CULL_FACE);
    const gl2 = renderer2.getContext("webgl");
    gl2.enable(gl2.CULL_FACE);

    const controls1 = new OrbitControls(camera1, renderer1.domElement);
    const controls2 = new OrbitControls(camera2, renderer2.domElement);

    container1.appendChild(renderer1.domElement);
    container2.appendChild(renderer2.domElement);

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

    function animate() {
      if (!renderNextFrame) return;
      renderNextFrame = false;
      controls1.update();
      renderer1.render(scene1, camera1);
      controls2.update();
      renderer2.render(scene2, camera2);
    }
    renderer1.setAnimationLoop(animate);
    renderer2.setAnimationLoop(animate);

    function loadModel(modelData, onProgress = () => {}, onDone = () => {}, onError = () => {}) {
      let loader;
      if (modelData.type == "glb") {
        loader = new GLTFLoader();
      }
      if (modelData.type == "fbx") {
        loader = new FBXLoader();
      }
      if (modelData.type == "obj") {
        loader = new OBJLoader();
      }
      loader.load(
        modelData.modelUrl,
        function (obj) {
          let object = obj;
          if (modelData.type === "glb") {
            object = object.scene;
          }
          object.castShadow = true;
          object.receiveShadow = true;

          if (modelData.textureUrl) {
            new THREE.TextureLoader().load(
              modelData.textureUrl,
              function (texture) {
                object.traverse(function (child) {
                  // aka setTexture
                  if (child instanceof THREE.Mesh) {
                    texture.magFilter = THREE.NearestFilter;
                    texture.minFilter = THREE.LinearFilter;
                    child.material.map = texture;
                  }
                });
                onDone(object);
                setTimeout(() => {
                  onProgress(100);
                  renderNextFrame = true;
                }, 200);
              },
              () => {},
              onError
            );
          } else {
            onDone(object);
            setTimeout(() => {
              onProgress(100);
              renderNextFrame = true;
            }, 200);
          }
        },
        (xhr) => {
          let progress = Math.floor((xhr.loaded / xhr.total) * 100);
          if (progress < 100) {
            onProgress(progress);
          }
        },
        (err) => {
          onError(err);
        }
      );
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
    function toggleTexture(isVisible) {
      showMap = isVisible;
      object1?.traverse((child) => {
        if (child.isMesh && child.material) {
          texture1 = texture1 || child.material.map;

          if (isVisible) {
            child.material.map = texture1;
          } else {
            child.material.map = null;
          }
          child.material.needsUpdate = true;
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
        }
      });
      renderNextFrame = true;
    }

    this.loadModel1 = function (modelData, onProgress = () => {}) {
      if (modelData.modelUrl == curModel1) return;
      curModel1 = modelData.modelUrl;
      object1 && disposeGroup(object1);
      texture1?.dispose();
      object1 = null;
      texture1 = null;
      renderNextFrame = true;

      loadModel(modelData, onProgress, (object) => {
        if (curModel1 && modelData.modelUrl != curModel1) {
          disposeGroup(object);
          return;
        }
        object1 = object;
        toggleTexture(showMap);
        scene1.add(object);
        renderNextFrame = true;
      });
    };
    this.loadModel2 = function (modelData, onProgress = () => {}) {
      if (modelData.modelUrl == curModel2) return;
      curModel2 = modelData.modelUrl;
      object2 && disposeGroup(object2);
      texture2?.dispose();
      object2 = null;
      texture2 = null;
      renderNextFrame = true;

      loadModel(modelData, onProgress, (object) => {
        if (curModel2 && modelData.modelUrl != curModel2) {
          disposeGroup(object);
          return;
        }
        object2 = object;

        if (modelData.position) {
          object2.position.x = modelData.position.x;
          object2.position.y = modelData.position.y;
          object2.position.z = modelData.position.z;
        }
        if (modelData.rotation) {
          object2.rotation.x = modelData.rotation.x;
          object2.rotation.y = modelData.rotation.y;
          object2.rotation.z = modelData.rotation.z;
        }
        if (modelData.scale) {
          object2.scale.multiplyScalar(modelData.scale);
        }

        toggleTexture(showMap);
        setTimeout(() => {
          console.log(modelData);
          console.log(object1);
          console.log(texture1);
          console.log(object2);
          console.log(texture2);
        }, 10000);
        scene2.add(object);
        renderNextFrame = true;
      });
    };
    this.load = function (modelData1, modelData2, cameraPosition, onProgress1 = () => {}, onProgress2 = () => {}) {
      if (modelData1.modelUrl == curModel1 || modelData2.modelUrl == curModel2) return;

      texture1?.dispose();
      texture2?.dispose();
      object1 && disposeGroup(object1);
      object2 && disposeGroup(object2);

      object1 = null;
      object2 = null;
      texture1 = null;
      texture2 = null;

      camera1.position.x = cameraPosition.x;
      camera1.position.y = cameraPosition.y;
      camera1.position.z = cameraPosition.z;
      renderNextFrame = true;

      this.loadModel1(modelData1, onProgress1);
      this.loadModel2(modelData2, onProgress2);
    };
    this.toggleTexture = toggleTexture;
    animate();
  }
}
