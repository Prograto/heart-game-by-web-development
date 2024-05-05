//function to hide section1 and display section2
function play() {
    const section1 = document.getElementById("section1");
    const section2 = document.getElementById("section2");
    
    section1.classList.add("hidden");
    section2.classList.remove("hidden");
    section2.style.zIndex = 1;
}

//for starting the game
function start() {
    event.preventDefault();
    // Get the crush image and assert image files from the form input
    const crushImageInput = document.getElementById('crushImage');
    const assertImageInput = document.getElementById('assertImage');

    const crushImageFile = crushImageInput.files[0];
    const assertImageFile = assertImageInput.files[0];

    if (crushImageFile && assertImageFile) {
        const reader1 = new FileReader();
        const reader2 = new FileReader();

        reader1.onload = function(event) {
            const crushImageBase64 = event.target.result;
            sessionStorage.setItem('crushImage', crushImageBase64);
            reader2.onload = function(event) {
                const assertImageBase64 = event.target.result;
                sessionStorage.setItem('assertImage', assertImageBase64);
                window.location.href = 'game.html';
            };
            reader2.readAsDataURL(assertImageFile);
        };
        reader1.readAsDataURL(crushImageFile);
    } else {
        console.error('Please select both crush and assert images.');
        window.location.href = 'game.html';
        
    }
}
