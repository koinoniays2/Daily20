window.addEventListener("load", function() {
    const checkbox = document.querySelector("#check_box");
    const checkboxIcon = document.querySelector(".check_box_icon > i");
    const nextBtn = document.querySelector(".next_btn > button");
    function termsSession(boolean) {
        sessionStorage.setItem("termsAgree", boolean);
    };
    
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
    nextBtn.addEventListener("click", function() {
        termsSession("true");
        window.location.href = "index.html";
    });
});
// 뒤로 가기 버튼 눌렀을 때 세션 스토리지 초기화
window.onpopstate = function() {
    sessionStorage.removeItem("termsAgree");
};