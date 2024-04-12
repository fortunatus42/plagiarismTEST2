document.addEventListener('DOMContentLoaded', function() {
    var form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent default form submission
        showLoadingSpinner();    // Show the loading spinner
        var formData = new FormData(form);  // Create form data object
        fetch('/', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            // Update the result section with the response data
            document.getElementById('result').innerHTML = data;
            hideLoadingSpinner();  // Hide the loading spinner
        })
        .catch(error => {
            console.error('Error:', error);
            hideLoadingSpinner();  // Hide the loading spinner on error
        });
    });
});

var spinnerTimeout;

function showLoadingSpinner() {
    // Show the loading spinner
    document.getElementById('loading-spinner').style.display = 'flex';
    // Clear any previous timeout
    clearTimeout(spinnerTimeout);
}

function hideLoadingSpinner() {
    // Set a timeout to hide the spinner after 1 second
    spinnerTimeout = setTimeout(function() {
        document.getElementById('loading-spinner').style.display = 'none'
    }, 5000); // 1000 milliseconds = 1 second
}
