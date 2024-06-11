document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    let randomId = getCookie('userId');
    if (!randomId) {
        randomId = prompt('Please enter your username:');
        if (randomId) {
            setCookie('userId', randomId, 365);
        }
    }

    // Load messages from local storage when page loads
    loadMessages();

    sendButton.addEventListener('click', () => {
        sendMessage();
    });

    messageInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText !== '') {
            const messageElement = createMessageElement(randomId, messageText);
            messagesContainer.appendChild(messageElement);
            saveMessage(randomId, messageText);
            messageInput.value = '';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    function createMessageElement(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        
        const senderElement = document.createElement('span');
        senderElement.className = 'sender';
        senderElement.textContent = `${sender}: `;
        messageElement.appendChild(senderElement);

        const textElement = document.createElement('span');
        textElement.textContent = message;
        messageElement.appendChild(textElement);

        return messageElement;
    }

    function saveMessage(sender, message) {
        let messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.push({ sender, message });
        localStorage.setItem('messages', JSON.stringify(messages));
    }

    function loadMessages() {
        let messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.forEach(msg => {
            const messageElement = createMessageElement(msg.sender, msg.message);
            messagesContainer.appendChild(messageElement);
        });
    }

    // Clear chat button functionality
    if (randomId === 'Lucian') {
        const clearChatButton = document.createElement('button');
        clearChatButton.textContent = 'Clear Chat';
        clearChatButton.className = 'clear-chat-button'; // Apply the CSS class
        clearChatButton.addEventListener('click', () => {
            clearChat();
        });
        sendButton.insertAdjacentElement('afterend', clearChatButton);
    }


    function clearChat() {
        messagesContainer.innerHTML = '';
        localStorage.removeItem('messages');
    }

    // Handling file input for image sending
    messageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                const imageUrl = reader.result;
                const messageElement = createImageMessageElement(randomId, imageUrl);
                messagesContainer.appendChild(messageElement);
                saveMessage(randomId, imageUrl);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            };
        }
    });

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const cookieName = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return "";
    }
});

