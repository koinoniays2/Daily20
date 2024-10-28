window.addEventListener("load", function() {
    const termsAgree = sessionStorage.getItem("termsAgree");
    if (termsAgree !== "true") {
        alert("비정상적인 접근입니다. 이용약관에 동의해야 합니다.");
        window.location.href = "terms_page.html";
    };
    const showPassword = document.querySelector("#password_show");
    const eye = document.querySelector(".fa-eye-slash");
    const password = document.querySelector("#password");
    const phone = document.querySelector("#phone");
    const email = document.querySelector("#email");
    const id = document.querySelector("#id");
    const name = document.querySelector("#name");
    const phoneError = document.querySelector(".phone_error");
    const emailError = document.querySelector(".email_error");
    const joinBtn = document.querySelector(".next_btn > button");

    let isIdChecked = false;
    let isEmailChecked = false;
    let isPhoneChecked = false;
    // 아이디 중복체크

    // 패스워드 보이기
    showPassword.addEventListener("change", function() {
        const isChecked = showPassword.checked;
        eye.classList.toggle("fa-eye", isChecked); // isChecked가 true일 경우 추가, false일 경우 제거
        eye.classList.toggle("fa-eye-slash", !isChecked);
        password.type = isChecked ? "text" : "password";
    });
     // 입력 검증 함수
    function validateInput(input, regex, errorElement, isChecked) {
        if (input.value === "") {
            errorElement.style.display = "none";
            isChecked = false;
        } else if (!regex.test(input.value)) {
            errorElement.style.display = "inline";
            isChecked = false;
        } else {
            errorElement.style.display = "none";
            isChecked = true;
        }
        return isChecked;
    }
     // 휴대폰번호 양식 검증
    phone.addEventListener("input", function() {
        const regex = /^\d{3}-\d{3,4}-\d{4}$/;
        isPhoneChecked = validateInput(phone, regex, phoneError, isPhoneChecked);
    });
    // 이메일 양식 검증
    email.addEventListener("input", function() {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isEmailChecked = validateInput(email, regex, emailError, isEmailChecked);
    });
    // sweetAlert
    function sweetAlert(icon, text, confirmButtonColor) {
        Swal.fire({
            icon: icon,
            text: text,
            confirmButtonColor: confirmButtonColor
        });
    }
    // 회원가입 버튼
    joinBtn.addEventListener("click", function(){
        if([id.value, password.value, phone.value, name.value, email.value].some(val => val === "")) {
            sweetAlert("error", "빈 칸을 확인해 주세요.", "#9FA9D8");
        }else if(!isPhoneChecked) {
            sweetAlert("error", "휴대폰 번호 양식을 확인해 주세요.", "#9FA9D8");
        }else if(!isEmailChecked) {
            sweetAlert("error", "이메일 양식을 확인해 주세요.", "#9FA9D8");
        };
    });
});