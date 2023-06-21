(function () {
    function OmegaDictate(elementId) {
      // Check if browser supports the Web Speech API
      if ("webkitSpeechRecognition" in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
  
        const container = document.getElementById(elementId);
        const startBtn = document.getElementById("start-btn");
        const pauseBtn = document.getElementById("pause-btn");
        const continueBtn = document.getElementById("continue-btn");
        const endBtn = document.getElementById("end-btn");
        const outputTextarea = document.getElementById("output");
  
        let finalTranscript = "";
        let recognizing = false;
        let permissionGranted = false; // Flag to check if permission is already granted
  
        recognition.onstart = function () {
          recognizing = true;
        };
  
        recognition.onresult = function (event) {
          let interimTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + " ";
            } else {
              interimTranscript += transcript;
            }
          }
          outputTextarea.value = finalTranscript + "\n" + interimTranscript;
        };
  
        recognition.onerror = function (event) {
          console.error("Speech recognition error occurred: " + event.error);
        };
  
        recognition.onend = function () {
          recognizing = false;
          startBtn.disabled = false;
          pauseBtn.disabled = true;
          continueBtn.disabled = false;
          endBtn.disabled = true;
        };
  
        startBtn.addEventListener("click", function () {
          if (!recognizing) {
            if (!permissionGranted) {
              // Request microphone permission only if it hasn't been granted yet
              startBtn.disabled = true;
              endBtn.disabled = true;
              recognition.start();
            } else {
              finalTranscript = "";
              recognition.lang = "en-US";
              recognition.start();
              startBtn.disabled = true;
              pauseBtn.disabled = false;
              continueBtn.disabled = false;
              endBtn.disabled = false;
            }
          }
        });
  
        pauseBtn.addEventListener("click", function () {
          if (recognizing) {
            recognition.stop();
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            continueBtn.disabled = false;
            endBtn.disabled = false;
          }
        });
  
        continueBtn.addEventListener("click", function () {
          if (!recognizing) {
            recognition.start();
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            continueBtn.disabled = false;
            endBtn.disabled = false;
          }
        });
  
        endBtn.addEventListener("click", function () {
          if (recognizing) {
            recognition.stop();
            recognizing = false;
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            continueBtn.disabled = false;
            endBtn.disabled = true;
          }
        });
  
        outputTextarea.addEventListener("input", function () {
          finalTranscript = outputTextarea.value;
        });
  
        // Request microphone permission initially
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(() => {
            permissionGranted = true;
            startBtn.disabled = false;
          })
          .catch((error) => {
            console.error("Error accessing microphone: ", error);
          });
      } else {
        console.error("Web Speech API is not supported by this browser.");
      }
    }
  
    // Expose the SpeechToText function globally
    window.OmegaDictate = OmegaDictate;
  })();
  