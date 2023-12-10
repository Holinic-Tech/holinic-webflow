// Create the overlay element
const overlay = document.createElement('div');
overlay.id = 'loader';
overlay.style.cssText = `
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 999;
    font-family: 'RecklessNeueBook', sans-serif; /* Custom font with a fallback */
`;

// Create the CSS loader
const cssLoader = document.createElement('div');
cssLoader.className = 'lds-roller';
for (let i = 0; i < 8; i++) {
    const div = document.createElement('div');
    cssLoader.appendChild(div);
}

// Create the text container
const textContainer = document.createElement('div');
textContainer.id = 'textContainer';
textContainer.style.cssText = `
    text-align: center;
    width: 100%;
`;

// Create a container for the loader and text
const centerContainer = document.createElement('div');
centerContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-family: 'RecklessNeueBook', sans-serif; /* Custom font with a fallback */
`;

// Append the CSS loader and text container to the center container
centerContainer.appendChild(cssLoader);
centerContainer.appendChild(textContainer);

// Append the center container to the overlay
overlay.appendChild(centerContainer);

// Append the overlay to the body
document.body.appendChild(overlay);

// Updated text lines content with FontAwesome icons
// const textLinesContent = [
//     { text: 'Checking available seats', icon: 'fas fa-chair' },
//     { text: 'seats available', icon: 'fas fa-users' }, // Placeholder for random number
//     { text: '1 seat reserved for you', icon: 'fas fa-user-check' },
//     { text: 'Please complete quiz to check if you’re a fit', icon: 'fas fa-puzzle-piece' },
//     { text: 'Quiz starting now…', icon: 'fas fa-hourglass-start' }
// ];
// Updated text lines content with emojis
const textLinesContent = [
    { text: '🪑 Checking available seats' },
    { text: '🧍‍♂️🧍‍♀️ seats available' }, // Placeholder for random number
    { text: '👤 1 seat reserved for you' },
    { text: '🧩 Please complete quiz to check if you’re a fit' },
    { text: '⏳ Quiz starting now…' }
];

textLinesContent.forEach((item, index) => {
    const line = document.createElement('div');
    line.className = 'text-box';
    line.id = `textLine${index}`;

    // Create and append the FontAwesome icon
    const icon = document.createElement('i');
    icon.className = item.icon;
    icon.style.cssText = 'margin-right: 10px;'; // Styling for the icon

    // Append icon and text to the line
    line.appendChild(icon);
    line.appendChild(document.createTextNode(item.text));

    textContainer.appendChild(line);
});

// Function to show and animate the text lines
function animateTextLines() {
    let delay = 500; // Initial delay

    textLinesContent.forEach((_, index) => {
        setTimeout(() => {
            const line = document.getElementById(`textLine${index}`);
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
            if (index === 1) {
                const randomSeats = Math.floor(Math.random() * 20) + 2; // Ensure at least 1 seat
                line.innerText = `${randomSeats} seats available`;
            }
        }, delay);

        delay += 700; // Increment delay for the next line
    });
}

// Function to hide the overlay and display the CSS loader and text
function hideOverlay() {
    overlay.style.display = 'none';
    cssLoader.style.display = 'none'; // Hide the CSS loader
    textContainer.style.display = 'none'; // Hide the text container
    
}
function showOverlay() {
    overlay.style.display = 'flex';
    cssLoader.style.display = 'inline-block'; // Show the CSS loader
    textContainer.style.display = 'block'; // Show the text container
    animateTextLines(); // Start the text animation
}

// Add event listeners for DOMContentLoaded and load events
document.addEventListener('DOMContentLoaded', showOverlay); // Show the overlay when DOM is loaded
window.addEventListener('load', hideOverlay); // Hide the overlay when everything is loaded

// CSS for text boxes
const style = document.createElement('style');
style.textContent = `
.text-box {
    background-color: #FFFFFF; /* Light grey background */
    border: 0px solid #dcdcdc; /* Slight border for definition */
    border-radius: 20px; /* Rounded corners */
    padding: 10px 20px; /* Padding inside the box */
    margin: 10px auto; /* Margin for spacing between boxes, centered horizontally */
    box-shadow: 0 1px 0px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out; /* Smooth transition for animation */
    opacity: 0; /* Start with box invisible */
    transform: translateY(20px); /* Start slightly lower */
    width: 80%; /* Responsive width */
    max-width: 400px; /* Maximum width */
    text-align: center; /* Center the text */
    font-size: 1.2em; /* Larger text */
    display: flex; /* Flex display to align icon and text */
    align-items: center; /* Center items vertically */
    justify-content: center; /* Center items horizontally */
    font-family: 'RecklessNeueBook', sans-serif; /* Custom font with a fallback */

}
`;

document.head.appendChild(style);

// Include the CSS for the CSS loader
const loaderStyle = document.createElement('style');
loaderStyle.textContent = `
.lds-roller {
    display: inline-block;
   
    width: 10vw; /* responsive width */
    height: 10vw; /* responsive height */
    margin-bottom: 20px; /* Add some space between the loader and text */

  }
  .lds-roller div {
    animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    transform-origin: 40px 40px;
  }
  .lds-roller div:after {
    content: " ";
    display: block;
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #79CECC;
    margin: -4px 0 0 -4px;
  }
  .lds-roller div:nth-child(1) {
    animation-delay: -0.036s;
  }
  .lds-roller div:nth-child(1):after {
    top: 63px;
    left: 63px;
  }
  .lds-roller div:nth-child(2) {
    animation-delay: -0.072s;
  }
  .lds-roller div:nth-child(2):after {
    top: 68px;
    left: 56px;
  }
  .lds-roller div:nth-child(3) {
    animation-delay: -0.108s;
  }
  .lds-roller div:nth-child(3):after {
    top: 71px;
    left: 48px;
  }
  .lds-roller div:nth-child(4) {
    animation-delay: -0.144s;
  }
  .lds-roller div:nth-child(4):after {
    top: 72px;
    left: 40px;
  }
  .lds-roller div:nth-child(5) {
    animation-delay: -0.18s;
  }
  .lds-roller div:nth-child(5):after {
    top: 71px;
    left: 32px;
  }
  .lds-roller div:nth-child(6) {
    animation-delay: -0.216s;
  }
  .lds-roller div:nth-child(6):after {
    top: 68px;
    left: 24px;
  }
  .lds-roller div:nth-child(7) {
    animation-delay: -0.252s;
  }
  .lds-roller div:nth-child(7):after {
    top: 63px;
    left: 17px;
  }
  .lds-roller div:nth-child(8) {
    animation-delay: -0.288s;
  }
  .lds-roller div:nth-child(8):after {
    top: 56px;
    left: 12px;
  }
  @keyframes lds-roller {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

document.head.appendChild(loaderStyle);
