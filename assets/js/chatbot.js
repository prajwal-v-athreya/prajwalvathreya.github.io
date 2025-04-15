// Matrix Oracle Chatbot functionality
document.addEventListener("DOMContentLoaded", function () {
  const chatInput = document.getElementById("chat-input");
  const sendMessage = document.getElementById("send-message");
  const chatMessages = document.getElementById("chat-messages");

  // Process the initial message
  function processInitialMessage() {
    const initialMessage = document.querySelector(".message-row.bot .message");
    if (initialMessage) {
      const text = initialMessage.textContent.trim();
      initialMessage.textContent = ''; // Clear the content
      
      // Split text into words and create spans
      const words = text.split(/\s+/);
      words.forEach((word, index) => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "word";
        wordSpan.textContent = word + " ";
        initialMessage.appendChild(wordSpan);
        
        // Animate each word with a slight delay
        setTimeout(() => {
          wordSpan.classList.add("visible");
        }, index * 50);
      });
    }
  }

  // Call processInitialMessage when the page loads
  processInitialMessage();

  // Function to send message
  function sendChatMessage() {
    const message = chatInput.value.trim();
    if (message) {
      // Add user message to chat
      appendMessage(message, "user");

      // Clear input
      chatInput.value = "";

      // Scroll to bottom
      scrollToBottom();

      // Get bot response
      getBotResponse(message);
    }
  }

  // Function to append a message to the chat
  function appendMessage(text, sender) {
    const messageRow = document.createElement("div");
    messageRow.className = `message-row ${sender}`;

    const avatar = document.createElement("div");
    avatar.className = "avatar";

    const icon = document.createElement("div");
    icon.className = "oracle-icon";
    icon.textContent = sender === "user" ? "U" : "O";

    avatar.appendChild(icon);

    const messageDiv = document.createElement("div");
    messageDiv.className = "message";
    
    // Split text into words and create spans for each word
    const words = text.split(/\s+/);
    words.forEach((word, index) => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "word";
        wordSpan.textContent = word + " ";
        messageDiv.appendChild(wordSpan);
        
        // Animate each word with a slight delay
        setTimeout(() => {
            wordSpan.classList.add("visible");
        }, index * 50); // 50ms delay between words
    });

    messageRow.appendChild(avatar);
    messageRow.appendChild(messageDiv);
    chatMessages.appendChild(messageRow);

    // Make the message container visible after a short delay
    setTimeout(() => {
        messageDiv.classList.add("visible");
    }, 100);

    // Scroll to bottom after all words are typed
    setTimeout(() => {
        scrollToBottom();
    }, words.length * 50 + 200);
  }

  // Function to show typing indicator
  function showTypingIndicator() {
    const messageRow = document.createElement("div");
    messageRow.className = "message-row bot";
    messageRow.id = "typing-indicator-row";

    const avatar = document.createElement("div");
    avatar.className = "avatar";

    const icon = document.createElement("div");
    icon.className = "oracle-icon";
    icon.textContent = "O";

    avatar.appendChild(icon);

    const messageDiv = document.createElement("div");
    messageDiv.className = "message";

    const typingIndicator = document.createElement("div");
    typingIndicator.className = "typing-indicator";

    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("span");
      typingIndicator.appendChild(dot);
    }

    messageDiv.appendChild(typingIndicator);
    messageRow.appendChild(avatar);
    messageRow.appendChild(messageDiv);

    chatMessages.appendChild(messageRow);
    scrollToBottom();
  }

  // Function to remove typing indicator
  function removeTypingIndicator() {
    const indicator = document.getElementById("typing-indicator-row");
    if (indicator) {
      chatMessages.removeChild(indicator);
    }
  }

  // Function to scroll to the bottom of the chat
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Handle send button click
  sendMessage.addEventListener("click", sendChatMessage);

  // Handle Enter key press
  chatInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendChatMessage();
    }
  });

  // Function to escape HTML tags
  function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
  }

  // Function to get response from your API
  async function getBotResponse(message) {
    // Show typing indicator
    showTypingIndicator();

    try {
      // Make the real API call to your endpoint
      const response = await fetch("https://resumebot-wine.vercel.app/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: message }),
      });

      // Fallback responses in case the API fails
      const fallbackReplies = [
        "Have you ever had a dream that you were so sure was real?",
        "The Matrix is everywhere, it is all around us.",
        "There is no spoon.",
        "Unfortunately, no one can be told what the Matrix is. You have to see it for yourself.",
        "You take the blue pill, the story ends. You take the red pill, you stay in Wonderland.",
      ];

      let botReply;

      // Add a slight delay to make the typing indicator more natural (minimum 1 second)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if the API call was successful
      if (response.ok) {
        const data = await response.json();

        // Extract the answer based on your API format
        if (data && data.answer) {
          // Remove extra quotes if present and escape HTML
          botReply = escapeHtml(data.answer.replace(/^"(.*)"$/, "$1"));
        } else {
          botReply =
            "I couldn't process that. What else would you like to know about Prajwal?";
        }
      } else {
        // Use fallback if API call fails
        console.error("API error:", response.status);
        botReply =
          fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      }

      // Remove typing indicator
      removeTypingIndicator();

      // Add bot response
      appendMessage(botReply, "bot");

      // Scroll to bottom
      scrollToBottom();
    } catch (error) {
      console.error("Error:", error);

      // Remove typing indicator
      removeTypingIndicator();

      // Show error message
      appendMessage(
        "Error connecting to the Oracle. The Matrix has you...",
        "bot",
      );
      scrollToBottom();
    }
  }

  // Focus input on load
  chatInput.focus();

  // Create Matrix rain effect in the background
  function createMatrixRain() {
    const matrixRain = document.createElement("div");
    matrixRain.className = "matrix-rain";
    document.getElementById("chat-container").appendChild(matrixRain);

    const characters =
      "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890";
    const numColumns = Math.floor(window.innerWidth / 20);

    for (let i = 0; i < numColumns; i++) {
      const column = document.createElement("div");
      column.className = "matrix-column";
      column.style.left = `${i * 20}px`;

      // Random speed
      const speed = 10 + Math.random() * 30;
      column.style.animationDuration = `${speed}s`;

      // Random delay
      const delay = Math.random() * 10;
      column.style.animationDelay = `-${delay}s`;

      // Create random Matrix characters
      let columnText = "";
      const numChars = Math.floor(Math.random() * 20) + 5;
      for (let j = 0; j < numChars; j++) {
        columnText += characters.charAt(
          Math.floor(Math.random() * characters.length),
        );
      }
      column.textContent = columnText;

      matrixRain.appendChild(column);
    }
  }

  // Uncomment to enable Matrix rain effect
  // createMatrixRain();
});
