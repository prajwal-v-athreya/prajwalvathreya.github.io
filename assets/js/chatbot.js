// Function to append a message with typing effect
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

  // For user messages, just add the text
  if (sender === "user") {
    messageDiv.textContent = text;
  } else {
    // For bot messages, create a span for typing effect
    const typingContainer = document.createElement("span");
    typingContainer.className = "typing-effect";

    // Add a cursor element
    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";

    messageDiv.appendChild(typingContainer);
    messageDiv.appendChild(cursor);

    // Animate the text appearing word by word
    animateTextTyping(text, typingContainer, cursor);
  }

  messageRow.appendChild(avatar);
  messageRow.appendChild(messageDiv);

  chatMessages.appendChild(messageRow);
  scrollToBottom();
}

// Function to animate text typing word by word
function animateTextTyping(text, container, cursor) {
  const words = text.split(" ");
  let wordIndex = 0;
  let charIndex = 0;
  let currentWord = "";

  // Create span for the first word
  const wordSpan = document.createElement("span");
  container.appendChild(wordSpan);

  const typingInterval = setInterval(() => {
    if (wordIndex < words.length) {
      // If we've typed all characters in the current word
      if (charIndex >= words[wordIndex].length) {
        // Move to the next word
        charIndex = 0;
        wordIndex++;

        // Add a space after each word (except the last)
        if (wordIndex <= words.length) {
          container.appendChild(document.createTextNode(" "));
        }

        // Create a new span for the next word
        if (wordIndex < words.length) {
          const newWordSpan = document.createElement("span");
          container.appendChild(newWordSpan);
          currentWord = newWordSpan;
        } else {
          // We've finished typing all words
          clearInterval(typingInterval);
          cursor.remove(); // Remove cursor when done
        }
      } else {
        // Type the next character
        if (!currentWord) {
          currentWord = wordSpan;
        }

        const char = words[wordIndex][charIndex];
        const charSpan = document.createElement("span");
        charSpan.className = "typing-character";
        charSpan.textContent = char;
        charSpan.style.animationDelay = `${charIndex * 0.05}s`;

        currentWord.appendChild(charSpan);
        charIndex++;

        // Scroll as typing happens
        scrollToBottom();
      }
    } else {
      clearInterval(typingInterval);
      cursor.remove(); // Remove cursor when done
    }
  }, 50); // Adjust speed here (lower = faster)
}

// Replace your existing getBotResponse function with this updated version
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

    let botReply;

    // Check if the API call was successful
    if (response.ok) {
      const data = await response.json();

      // Extract the answer based on your API format
      if (data && data.answer) {
        // Remove extra quotes if present
        botReply = data.answer.replace(/^"(.*)"$/, "$1");
      } else {
        botReply =
          "I couldn't process that. What else would you like to know about Prajwal?";
      }
    } else {
      // Fallback responses
      const fallbackReplies = [
        "Have you ever had a dream that you were so sure was real?",
        "The Matrix is everywhere, it is all around us.",
        "There is no spoon.",
        "Unfortunately, no one can be told what the Matrix is. You have to see it for yourself.",
        "You take the blue pill, the story ends. You take the red pill, you stay in Wonderland.",
      ];

      botReply =
        fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
    }

    // Remove typing indicator
    removeTypingIndicator();

    // Add bot response with typing effect
    appendMessage(botReply, "bot");
  } catch (error) {
    console.error("Error:", error);

    // Remove typing indicator
    removeTypingIndicator();

    // Show error message
    appendMessage(
      "Error connecting to the Oracle. The Matrix has you...",
      "bot",
    );
  }
}
