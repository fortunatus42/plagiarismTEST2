function clearTextAreas() {
    var text1 = document.getElementsByName('text1')[0];
    var text2 = document.getElementsByName('text2')[0];
    if (text1 && text2) {
        text1.value = '';
        text2.value = '';
    }
}

function showLoadingSpinner() {
    document.getElementById('loading-spinner').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('plagiarism-form');
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

function hideLoadingSpinner() {
    // Set a timeout to hide the spinner after 3 seconds
    spinnerTimeout = setTimeout(function() {
        document.getElementById('loading-spinner').style.display = 'none';
    }, 5000); // 3000 milliseconds = 3 seconds
}
