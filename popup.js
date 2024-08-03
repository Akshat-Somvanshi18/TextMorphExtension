document.getElementById("translateButton").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Check if the URL is not a chrome:// URL
  if (!tab.url.startsWith("chrome://")) {
    const language = document.getElementById("form-select").value;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: translateText,
      args: [language],
    });
  } else {
    alert("This extension cannot run on chrome:// URLs");
  }
});

async function translateText(language) {
    const selectedText = window.getSelection().toString();

    var destinationLanguage = "";
    if(language == "Hindi")
      destinationLanguage = "hi";
    else if(language == "German")
      destinationLanguage = "de";
    else if(language == "Spanish")
      destinationLanguage = "es";
    else if(language == "French")
      destinationLanguage = "fr";
    else if(language == "Chinese")
      destinationLanguage = "zh";
    
  if (!selectedText) {
    alert("Select text from the current tab");
  } else {
    const url = ""; //API URL
    const options = {
      method: "POST",
      //API details
      headers: {
        "content-type": "",
        "X-RapidAPI-Key": "",
        "X-RapidAPI-Host": "",
      },
      body: new URLSearchParams({
        source_language: "en",
        target_language: destinationLanguage,
        text: selectedText,
      }),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      alert(`Selected Text (English) : ${selectedText}\nTranslated Text (${language}) : ${result.data.translatedText}`);
    } catch (error) {
      alert(error);
    }
  }
}

document.getElementById("meaningButton").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    // Check if the URL is not a chrome:// URL
    if (!tab.url.startsWith("chrome://")) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: getMeaning,
      });
    } else {
      alert("This extension cannot run on chrome:// URLs");
    }
  });
  
  async function getMeaning() {
      const word = window.getSelection().toString().trim();
      const a = word.split(" ");
      if (a.length >= 2) {
          alert("Select only single word");
          return;
        } else if (a.length == 0 || word === "") {
          alert("Select a word from your current tab");
          return;
        }
        alert(word);

        const url = ``; //API URL
        try {
          const response = await fetch(url);
          if (response.status != 404) {
            let result = await response.json();
            result = result[0];
            const res = result.meanings;
            let meaning = "";
            for(let i=0;i<res.length;i++)
            {
                alert(res[i])
                if(i!=0)
                 meaning+="\n\n(.) Part of Speech : "+res[i].partOfSpeech+"\n";
                else
                 meaning+="(.) Part of Speech : "+res[i].partOfSpeech+"\n";
                for(let j=0;j<res[i].definitions.length;j++)
                {
                    if(res[i].definitions[j].definition && res[i].definitions[j].definition!="")
                    {
                        meaning+=`    ${j+1}) `+res[i].definitions[j].definition+"\n";
                    }
                }
            }
            alert(meaning);


          } else {
            alert("Error: An unexpected error occured");
          }
        } catch (error) {
          alert(error);
        }
    
        
      };
  
