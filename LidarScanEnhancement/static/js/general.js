import cmpModel from "./cmpModel.js";

const cmpContainerLeft = document.getElementById("generalCmpContainerLeft");
const cmpContainerRight = document.getElementById("generalCmpContainerRight");
const cmpButtonRight = document.getElementById("generalCmpButtonRight");
const cmpButtonLeft = document.getElementById("generalCmpButtonLeft");
const generalCmpProgressWrapLeft = document.getElementById("generalCmpProgressWrapLeft");
const generalCmpProgressWrapRight = document.getElementById("generalCmpProgressWrapRight");
const generalCmpProgressLeft = document.getElementById("generalCmpProgressLeft");
const generalCmpProgressRight = document.getElementById("generalCmpProgressRight");

const model = new cmpModel(cmpContainerLeft, cmpContainerRight);

const modelList = {
  model1: {
    obj: {
      modelUrl: `https://d1bj0ra3gv2418.cloudfront.net/public/staticmodel/general/model1/enhanced/3DModel.obj`,
      textureUrl: `https://d1bj0ra3gv2418.cloudfront.net/public/staticmodel/general/model1/enhanced/3DModel.jpg`,
      type: "obj",
    },
    glb: {
      modelUrl: `https://d1bj0ra3gv2418.cloudfront.net/public/staticmodel/general/model1/3DModel.glb`,
      rotation: {
        x: 0,
        y: -2.1,
        z: 0,
      },
      position: {
        x: 0,
        y: -0.85,
        z: 0,
      },
      scale: 1,
      type: "glb",
    },
    cameraPosition: {
      x: 0,
      y: 4.725768262827002e-16,
      z: 7.717765262796205,
    },
  },
  model2: {
    obj: {
      modelUrl: `https://d1bj0ra3gv2418.cloudfront.net/public/staticmodel/general/model2/enhanced/3DModel.obj`,
      textureUrl: `https://d1bj0ra3gv2418.cloudfront.net/public/staticmodel/general/model2/enhanced/3DModel.jpg`,
      type: "obj",
    },
    glb: {
      modelUrl: `https://d1bj0ra3gv2418.cloudfront.net/public/staticmodel/general/model2/3DModel.glb`,
      rotation: {
        x: 0,
        y: 3,
        z: 0,
      },
      position: {
        x: 0,
        y: 0,
        z: -5,
      },
      scale: 1,
      type: "glb",
    },
    cameraPosition: {
      x: 0,
      y: 4.064244445816943e-16,
      z: 6.637414883453137,
    },
  },
  model3: {
    obj: {
      modelUrl: `https://d1bj0ra3gv2418.cloudfront.net/public/staticmodel/general/model3/enhanced/3DModel.obj`,
      textureUrl: `https://d1bj0ra3gv2418.cloudfront.net/public/staticmodel/general/model3/enhanced/3DModel.jpg`,
      type: "obj",
    },
    glb: {
      modelUrl: `https://d1bj0ra3gv2418.cloudfront.net/public/staticmodel/general/model3/3DModel.glb`,
      rotation: {
        x: 0,
        y: 2,
        z: 0,
      },
      position: {
        x: 0,
        y: 0,
        z: -2,
      },
      scale: 1,
      type: "glb",
    },
    cameraPosition: {
      x: 0,
      y: 2.216526027786656e-16,
      z: 3.619861709237125,
    },
  },
};

function handleGeneralComparisonClick(modelName) {
  generalCmpProgressWrapLeft.style.display = "";
  generalCmpProgressWrapRight.style.display = "";
  const modelData = modelList[modelName];
  model.load(
    modelData.obj,
    modelData.glb,
    modelData.cameraPosition,
    (xhr) => {
      generalCmpProgressLeft.value = xhr;
      if (xhr == 100) {
        generalCmpProgressWrapLeft.style.display = "none";
      }
    },
    (xhr) => {
      generalCmpProgressRight.value = xhr;
      if (xhr == 100) {
        generalCmpProgressWrapRight.style.display = "none";
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

window.handleGeneralComparisonClick = handleGeneralComparisonClick;
handleGeneralComparisonClick("model1");
