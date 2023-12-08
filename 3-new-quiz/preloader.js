// Create the overlay and SVG elements
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
`;

const svgImage = document.createElement('img');
svgImage.id = 'svgImage';
svgImage.src = 'hq_loader.svg';
svgImage.style.cssText = `
    width: 200px;
    height: 200px;
    display: block;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

document.body.appendChild(overlay);
document.body.appendChild(svgImage);

// Create the text container
const textContainer = document.createElement('div');
textContainer.id = 'textContainer';
textContainer.style.cssText = `
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 100%;
`;

document.body.appendChild(textContainer);

// Updated text lines content with FontAwesome icons
const textLinesContent = [
    { text: 'Checking available seats', icon: 'fas fa-chair' },
    { text: 'seats available', icon: 'fas fa-users' }, // Placeholder for random number
    { text: '1 seat reserved for you', icon: 'fas fa-user-check' },
    { text: 'Please complete quiz to check if you’re a fit', icon: 'fas fa-puzzle-piece' },
    { text: 'Quiz starting now…', icon: 'fas fa-hourglass-start' }
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

// Function to hide the overlay and display the SVG and text
function hideOverlay() {
    overlay.style.display = 'none';
    svgImage.style.display = 'block';
    textContainer.style.display = 'block';
    animateTextLines();
}

// Add event listeners for DOMContentLoaded and load events
document.addEventListener('DOMContentLoaded', hideOverlay);
window.addEventListener('load', hideOverlay);

// CSS for text boxes
const style = document.createElement('style');
style.textContent = `
.text-box {
    background-color: #f2f2f2; /* Light grey background */
    border: 1px solid #dcdcdc; /* Slight border for definition */
    border-radius: 10px; /* Rounded corners */
    padding: 10px 20px; /* Padding inside the box */
    margin: 10px auto; /* Margin for spacing between boxes, centered horizontally */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
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
}
`;

document.head.appendChild(style);
