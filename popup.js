let words = [];

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.message === "domContentLoaded") {
//     checkSavedKeywords();
//   }
// });
//
//
// const checkSavedKeywords = () => {
//   fetch("data.json")
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       // Send the keywords to the content script to parse the job description
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.scripting.executeScript(
//           {
//             target: { tabId: tabs[0].id },
//             function: checkJobDescription,
//             args: [data],
//           },
//           (results) => {
//             const resultContainer = document.getElementById("results");
//
//             if (results && results[0] && results[0].result) {
//               results[0].result.forEach((result) => {
//                 const div = document.createElement("div");
//                 words.push(result.keyword);
//                 if (result.found) {
//                   div.innerHTML = `<span class="green-check">&#x2713;</span> ${result.keyword}`;
//                 } else {
//                   div.innerHTML = `<span class="red-cross">&times;</span> ${result.keyword}`;
//                 }
//                 resultContainer.appendChild(div);
//               });
//             } else {
//               resultContainer.textContent = "No job description found.";
//             }
//           },
//         );
//       });
//     })
//     .catch((error) => {
//       console.error("Error loading JSON data:", error);
//     });
// };
//
let keywordIndex = 1;
let score = 0;

document.getElementById("resetBtn").addEventListener("click", () => {
  // Update score display
  score = 0;
  document.getElementById("score").textContent = `Score: ${score}`;
  document.getElementById("results").innerHTML = "";
  words = [];
});

document.getElementById("addKeywordBtn").addEventListener("click", () => {
  const container = document.getElementById("keywords-container");

  // Create a new keyword input block
  const keywordEntry = document.createElement("div");
  keywordEntry.classList.add("keyword-entry");

  keywordEntry.innerHTML = `
        <input type="text" class="keyword-input" placeholder="Enter a word">
        <label><input type="radio" name="flag-${keywordIndex}" value="good" checked> Good</label>
        <label><input type="radio" name="flag-${keywordIndex}" value="bad"> Bad</label>
        <button class="remove-btn">Remove</button>
    `;

  container.appendChild(keywordEntry);
  keywordIndex++;

  // Add remove button functionality
  const removeBtn = keywordEntry.querySelector(".remove-btn");
  removeBtn.style.display = "inline-block";
  removeBtn.addEventListener("click", () => {
    keywordEntry.remove();
  });
});

document.getElementById("checkBtn").addEventListener("click", () => {
  const keywords = [];
  const keywordEntries = document.querySelectorAll(".keyword-entry");

  keywordEntries.forEach((entry, index) => {
    const word = entry.querySelector(".keyword-input").value.trim();
    const flag = entry.querySelector(
      `input[name="flag-${index}"]:checked`,
    ).value;

    if (word) {
      keywords.push({ word, flag });
    }
  });

  if (keywords.length === 0) {
    alert("Please enter some keywords.");
    return;
  }
  console.log(keywords);

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
            if (words.includes(result.keyword)) {
              return;
            } else {
              words.push(result.keyword);
            }
            const div = document.createElement("div");
            if (result.found) {
              if (result.flag === "good") {
                div.innerHTML = `<span class="green-check">&#x2713;</span> ${result.keyword} +1`;
                score += 1;
              } else {
                div.innerHTML = `<span class="green-check">&#x2713;</span> ${result.keyword} -1`;
                score -= 1;
              }
            } else {
              if (result.flag === "good") {
                div.innerHTML = `<span class="red-cross">&times;</span> ${result.keyword} -1`;
                score -= 1;
              } else {
                div.innerHTML = `<span class="red-cross">&times;</span> ${result.keyword} +1`;
                score += 1;
              }
            }
            console.log(result);
            resultContainer.appendChild(div);
          });

          // Update score display
          document.getElementById("score").textContent = `Score: ${score}`;
        }
      },
    );
  });
});

function checkJobDescription(keywords) {
  const jobDescription =
    document.getElementById("job-details")?.innerText || "";
  return keywords.map((keyword) => {
    const regex = new RegExp(`\\b${keyword.word.trim()}\\b`, "i");
    return {
      keyword: keyword.word.trim(),
      found: regex.test(jobDescription),
      flag: keyword.flag,
    };
  });
}
