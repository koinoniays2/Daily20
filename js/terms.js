window.addEventListener("load", function() {
    sessionStorage.removeItem("termsAgree");
    
    const checkbox = document.querySelector("#check_box");
    const checkboxIcon = document.querySelector(".check_box_icon > i");
    const nextBtn = document.querySelector(".next_btn > button");
    function termsSession(boolean) {
        sessionStorage.setItem("termsAgree", boolean);
    };
    
    checkbox.addEventListener("change", function() {
        let isChecked = checkbox.checked;
        checkboxIcon.style.color = isChecked ? "#9FA9D8" : "#999";
        nextBtn.style.backgroundColor = isChecked ? "#9FA9D8" : "#999";
        nextBtn.disabled = !isChecked;
    });

    nextBtn.addEventListener("click", function() {
        termsSession("true");
        window.location.href = "join_page.html";
    });
});
