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
