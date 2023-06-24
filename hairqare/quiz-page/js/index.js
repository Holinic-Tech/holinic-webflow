// alert('Hello, Sam is testing js alert, test direct changes');
// Get the checkbox element by ID
const checkbox = document.getElementById('SplitEnds1');

// Add a click event listener
checkbox.addEventListener('click', function() {
  // Get the current value of the checkbox
  const h = parseInt(checkbox.value);

  // Call the te(h) function with h - 1
  te(2);
  console.log('clicked checkbox - value', h);
});

// Function te(h)
