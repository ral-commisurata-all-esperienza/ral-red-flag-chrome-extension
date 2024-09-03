chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "domContentLoaded") {
    checkSavedKeywords();
  }
});

const checkSavedKeywords = () => {
  fetch("data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const keywords = data.map((item) => item.name);
      // Send the keywords to the content script to parse the job description
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            function: checkJobDescription,
            args: [keywords],
          },
          (results) => {
            const resultContainer = document.getElementById("results");

            if (results && results[0] && results[0].result) {
              results[0].result.forEach((result) => {
                const div = document.createElement("div");
                if (result.found) {
                  div.innerHTML = `<span class="green-check">&#x2713;</span> ${result.keyword}`;
                } else {
                  div.innerHTML = `<span class="red-cross">&times;</span> ${result.keyword}`;
                }
                resultContainer.appendChild(div);
              });
            } else {
              resultContainer.textContent = "No job description found.";
            }
          },
        );
      });
    })
    .catch((error) => {
      console.error("Error loading JSON data:", error);
    });
};

document.addEventListener("DOMContentLoaded", checkSavedKeywords);

document.getElementById("checkBtn").addEventListener("click", () => {
  const keywords = document.getElementById("keywords").value.trim().split(",");
  if (keywords.length === 0) {
    alert("Please enter some keywords or phrases.");
    return;
  }

  // Send the keywords to the content script to parse the job description
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: checkJobDescription,
        args: [keywords],
      },
      (results) => {
        const resultContainer = document.getElementById("results");

        if (results && results[0] && results[0].result) {
          results[0].result.forEach((result) => {
            const div = document.createElement("div");
            if (result.found) {
              div.innerHTML = `<span class="green-check">&#x2713;</span> ${result.keyword}`;
            } else {
              div.innerHTML = `<span class="red-cross">&times;</span> ${result.keyword}`;
            }
            resultContainer.appendChild(div);
          });
        } else {
          resultContainer.textContent = "No job description found.";
        }
      },
    );
  });
});

function checkJobDescription(keywords) {
  const jobDescription =
    document.getElementById("job-details")?.innerText || "";
  return keywords.map((keyword) => {
    const regex = new RegExp(`\\b${keyword.trim()}\\b`, "i");
    return { keyword: keyword.trim(), found: regex.test(jobDescription) };
  });
}
