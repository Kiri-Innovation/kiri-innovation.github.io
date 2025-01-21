document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".comparison-slider");
  const afterContainer = document.querySelector(".after-container");
  const sliderHandle = document.querySelector(".slider-handle");
  const imageComparison = document.querySelector(".image-comparison");

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  function handleMove(e) {
    if (!isDown) return;
    e.preventDefault();

    const x = e.pageX || e.touches[0].pageX;
    const walk = x - startX;
    const sliderRect = slider.getBoundingClientRect();
    let newPosition = ((scrollLeft + walk) / sliderRect.width) * 100;

    // 限制滑块在0-100%之间
    newPosition = Math.max(0, Math.min(100, newPosition));

    afterContainer.style.width = `${newPosition}%`;
    sliderHandle.style.left = `${newPosition}%`;
  }

  function handleImageComparisonMove(e) {
    if (!isDown) return;
    e.preventDefault();

    const x = e.pageX || e.touches[0].pageX;
    const imageComparisonRect = imageComparison.getBoundingClientRect();
    let newPosition = ((x - imageComparisonRect.left) / imageComparisonRect.width) * 100;

    // 限制滑块在0-100%之间
    newPosition = Math.max(0, Math.min(100, newPosition));

    afterContainer.style.width = `${newPosition}%`;
    sliderHandle.style.left = `${newPosition}%`;
  }

  imageComparison.addEventListener("mouseenter", (e) => {
    isDown = true;
    slider.classList.add("active");
  });

  window.addEventListener("mousemove", handleImageComparisonMove);

  imageComparison.addEventListener("mouseleave", (e) => {
    isDown = false;
    slider.classList.remove("active");
  });

  /*   slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.classList.add("active");
    startX = e.pageX;
    scrollLeft = ((parseFloat(afterContainer.style.width) || 50) / 100) * slider.offsetWidth;
  }); */
  slider.addEventListener("touchstart", (e) => {
    isDown = true;
    slider.classList.add("active");
    startX = e.touches[0].pageX;
    scrollLeft = ((parseFloat(afterContainer.style.width) || 50) / 100) * slider.offsetWidth;
  });

  //   window.addEventListener("mousemove", handleMove);
  window.addEventListener("touchmove", handleMove);

  /*   window.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("active");
  }); */
  window.addEventListener("touchend", () => {
    isDown = false;
    slider.classList.remove("active");
  });
  const viewModelLink = {
    houseSnow: {
      nweLink: "https://test.kiriengine.app/share/3dgs?taskId=1878707747273310208",
      oldLink: "https://www.kiriengine.app/share/3dgs?taskId=1878500763731230720",
    },
    birdFountain: {
      nweLink: "https://test.kiriengine.app/share/3dgs?taskId=1877255662950416384",
      oldLink: "https://www.kiriengine.app/share/3dgs?taskId=1876612389646893056",
    },
    angelStatue: {
      nweLink: "https://test.kiriengine.app/share/3dgs?taskId=1877213540423565312",
      oldLink: "https://www.kiriengine.app/share/3dgs?taskId=1860342260135100416",
    },
    trunk: {
      nweLink: "https://test.kiriengine.app/share/3dgs?taskId=1876208023651745792",
      oldLink: "https://www.kiriengine.app/share/3dgs?taskId=1875935585915371520",
    },
  };
  const compareImg = document.querySelectorAll(".hf-leg .tab-nav-item");
  const beforeImage = document.querySelector(".before-image");
  const afterImage = document.querySelector(".after-image");
  const viewModelEl = document.querySelectorAll(".view-model");
  window.handleTabClick = function (tab, index) {
    beforeImage.src = `./static/image/m-old-${tab}.png`;
    afterImage.src = `./static/image/m-${tab}.png`;
    viewModelEl[0].href = viewModelLink[tab].nweLink;
    viewModelEl[1].href = viewModelLink[tab].oldLink;
    compareImg.forEach((item) => {
      item.classList.remove("active");
    });
    compareImg[index].classList.add("active");
  };

  const compareModelLink = {
    bakery: {
      kiri: "https://test.kiriengine.app/share/3dgs/?taskId=1876174247215235072",
      polycam: "https://poly.cam/capture/4d0df115-440c-4bb7-a538-0c5a69e20ccb",
      luma: "https://lumalabs.ai/embed/96a88a70-2e2b-4061-bbd9-9151e3f4d75f?mode=sparkles&background=%23ffffff&color=%23000000&showTitle=true&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=undefined&showMenu=false",
    },
    fireHydrant: {
      kiri: "https://test.kiriengine.app/share/3dgs?taskId=1877263733701476352",
      polycam: "https://poly.cam/capture/a72515e0-50ee-4722-8638-57162019e111",
      luma: "https://lumalabs.ai/embed/7f96140b-bde0-4f02-b777-c8cf6676bbec?mode=sparkles&background=%23ffffff&color=%23000000&showTitle=true&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=undefined&showMenu=false",
    },
  };
  const compareVideo = document.querySelectorAll(".sibda .tab-nav-item");
  const compareVideoEl = document.querySelectorAll(".compare-video");
  const compareModelEl = document.querySelectorAll(".video-item a");
  window.handleVideoTabClick = function (tab, index) {
    compareVideoEl[0].src = `./static/video/${tab}/KIRI.mp4`;
    compareVideoEl[0].poster = `./static/image/${tab}/KIRI.png`;
    compareModelEl[0].href = compareModelLink[tab].kiri;
    compareVideoEl[1].src = `./static/video/${tab}/polycam.mp4`;
    compareVideoEl[1].poster = `./static/image/${tab}/polycam.png`;
    compareModelEl[1].href = compareModelLink[tab].polycam;
    compareVideoEl[2].src = `./static/video/${tab}/luma.mp4`;
    compareVideoEl[2].poster = `./static/image/${tab}/luma.png`;
    compareModelEl[2].href = compareModelLink[tab].luma;

    compareVideo.forEach((item) => {
      item.classList.remove("active");
    });
    console.log(index);

    compareVideo[index].classList.add("active");
  };
});
