window.addEventListener("load", function() {
    const checkbox = document.querySelector("#check_box");
    const checkboxIcon = document.querySelector(".check_box_icon > i");
    const nextBtn = document.querySelector(".next_btn > button");
    checkbox.addEventListener("change", function() {
        if(checkbox.checked) {
            checkboxIcon.style.color = "#9FA9D8";
            nextBtn.style.backgroundColor = "#9FA9D8";
            nextBtn.disabled = false;
        } else{
            checkboxIcon.style.color = "#999";
            nextBtn.style.backgroundColor = "#999";
            nextBtn.disabled = true;
        };
    });
});