import cmpModel from "./cmpModel.js";

const cmpContainerLeft = document.getElementById("roomsCmpContainerLeft");
const cmpContainerRight = document.getElementById("roomsCmpContainerRight");
const cmpButtonRight = document.getElementById("roomsCmpButtonRight");
const cmpButtonLeft = document.getElementById("roomsCmpButtonLeft");
const roomsCmpProgressWrapLeft = document.getElementById("roomsCmpProgressWrapLeft");
const roomsCmpProgressWrapRight = document.getElementById("roomsCmpProgressWrapRight");
const roomsCmpProgressLeft = document.getElementById("roomsCmpProgressLeft");
const roomsCmpProgressRight = document.getElementById("roomsCmpProgressRight");

const model = new cmpModel(cmpContainerLeft, cmpContainerRight);

const modelList = {
  model1: {
    obj: {
      modelUrl: `https://d1bj0ra3gv2418.cloudfront.net/public/staticmodel/rooms/model1/enhanced/3DModel.obj`,
      textureUrl: `https://d1bj0ra3gv2418.cloudfront.net/public/staticmodel/rooms/model1/enhanced/3DModel.jpg`,
      type: "obj",
    },
    glb: {
      modelUrl: `https://d1bj0ra3gv2418.cloudfront.net/public/staticmodel/rooms/model1/3DModel.glb`,
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      scale: 1,
      type: "glb",
    },
    cameraPosition: {
      x: 0,
      y: 3.4311715759305696e-14,
      z: 10.3528426840269,
    },
  },
  model2: {
    obj: {
      modelUrl: `https://d1bj0ra3gv2418.cloudfront.net/public/staticmodel/rooms/model2/enhanced/3DModel.obj`,
      textureUrl: `https://d1bj0ra3gv2418.cloudfront.net/public/staticmodel/rooms/model2/enhanced/3DModel.jpg`,
      type: "obj",
    },
    glb: {
      modelUrl: `https://d1bj0ra3gv2418.cloudfront.net/public/staticmodel/rooms/model2/3DModel.glb`,
      rotation: {
        x: 0,
        y: 3.6,
        z: 0,
      },
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      scale: 1,
      type: "glb",
    },
    cameraPosition: {
      x: 0.5090604397387729,
      y: 0.07220110996534178,
      z: 6.22201003918556,
    },
  },
};

function handleRoomsComparisonClick(modelName) {
  roomsCmpProgressWrapLeft.style.display = "";
  roomsCmpProgressWrapRight.style.display = "";
  const modelData = modelList[modelName];
  model.load(
    modelData.obj,
    modelData.glb,
    modelData.cameraPosition,
    (xhr) => {
      roomsCmpProgressLeft.value = xhr;
      if (xhr == 100) {
        roomsCmpProgressWrapLeft.style.display = "none";
      }
    },
    (xhr) => {
      roomsCmpProgressRight.value = xhr;
      if (xhr == 100) {
        roomsCmpProgressWrapRight.style.display = "none";
      }
    }
  );
}

cmpButtonLeft.addEventListener("click", () => {
  cmpButtonLeft.classList.add("active");
  cmpButtonRight.classList.remove("active");
  model.toggleTexture(false);
});

cmpButtonRight.addEventListener("click", () => {
  cmpButtonRight.classList.add("active");
  cmpButtonLeft.classList.remove("active");
  model.toggleTexture(true);
});

window.handleRoomsComparisonClick = handleRoomsComparisonClick;
handleRoomsComparisonClick("model1");
