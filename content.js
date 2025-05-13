const isLinkedin = () => {
  if (window.location.href.includes("linkedin.com")) {
    return true;
  }
  return false;
};

const f = () => {
  const element = document.getElementById("ral-commisurata-check");
  if (element) {
    console.log("Removing");
    element.parentNode.removeChild(element);
  }
  if (
    document.body.innerText.includes("RAL commisurata all'esperienza") ||
    document.body.innerText.includes("RAL commisurata") ||
    document.body.innerText.includes("Competitive salary") ||
    document.body.innerText.includes("commisurat") ||
    document.body.innerText.includes("azienda leader") ||
    document.body.innerText.includes(
      "RAL in relazione all’esperienza effettivamente maturata",
    )
  ) {
    // Cambia il colore del bordo della pagina in rosso
    const iDiv = document.createElement("div");
    iDiv.id = "ral-commisutata-check";
    const icon = document.createElement("p");
    icon.style.fontSize = "50px";
    icon.innerHTML = "🚩";
    iDiv.className = "block";
    iDiv.style.position = "fixed";
    iDiv.style.top = "20px";
    iDiv.style.zIndex = "9999";
    iDiv.appendChild(icon);
    document.getElementsByTagName("body")[0].appendChild(iDiv);
  } else {
    const iDiv = document.createElement("div");
    iDiv.id = "ral-commisutata-check";
    const icon = document.createElement("p");
    icon.style.fontSize = "50px";
    icon.innerHTML = "✅";
    iDiv.className = "block";
    iDiv.style.position = "fixed";
    iDiv.style.zIndex = "9999";
    iDiv.style.top = "20px";
    iDiv.appendChild(icon);
    document.getElementsByTagName("body")[0].appendChild(iDiv);
  }
};

if (isLinkedin()) {
  setTimeout(f, 2000);
} else {
  f();
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // listen for messages sent from background.js
  if (request.message === "changeUrl") {
    f();
  }
});
const notifyDescriptionLoaded = () => {
  console.log("DOM content loaded in the tab");
  const intervalId = setInterval(() => {
    const jobDescription = document.getElementById("job-details")?.innerText;
    if (jobDescription !== null && jobDescription !== "About the job") {
      chrome.runtime.sendMessage({ message: "domContentLoaded" });
      clearInterval(intervalId);
      return;
    }
  }, 1000);
};

if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", notifyDescriptionLoaded);
} else {
  // `DOMContentLoaded` has already fired
  notifyDescriptionLoaded();
}
