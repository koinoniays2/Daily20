window.addEventListener("load", function() {
    const termsAgree = sessionStorage.getItem("termsAgree");
    if (termsAgree !== "true") {
        Swal.fire({
            icon: "error",
            text: "비정상적인 접근입니다. 이용약관에 동의해야 합니다.",
            confirmButtonColor: "#9FA9D8"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "index.html";
            };
        });
    };
    const showPassword = document.querySelector("#password_show");
    const eye = document.querySelector(".fa-eye-slash");
    const password = document.querySelector("#password");
    const phone = document.querySelector("#phone");
    const email = document.querySelector("#email");
    const id = document.querySelector("#id");
    const name = document.querySelector("#name");
    const idError = document.querySelector(".id_error");
    const phoneError = document.querySelector(".phone_error");
    const emailError = document.querySelector(".email_error");
    const joinBtn = document.querySelector(".next_btn > button");
    const idCheckBtn = document.querySelector(".id_box > button");

    let isIdErrorChecked = false;
    let isIdChecked = false;
    let isEmailChecked = false;
    let isPhoneChecked = false;
    // sweetAlert
    function sweetAlert(state, text) {
        Swal.fire({
            icon: state,
            text: text,
            confirmButtonColor: "#9FA9D8"
        });
    };
    // 아이디 중복체크
    idCheckBtn.addEventListener("click", async function() {
        const userId = id.value.trim();
        if(!isIdErrorChecked && userId) {
            sweetAlert("error", "아이디 형식을 확인해 주세요.");
            return
        };
        if(!userId) {
            sweetAlert("error", "아이디를 입력하세요.");
            return
        };
        try {
            const response = await fetch("https://server-rose-one.vercel.app/join/idCheck", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId })
            });
            if (!response.ok) throw new Error("서버 응답 에러");

            const data = await response.json();
    
            if (data.result) {
                sweetAlert("success", "사용 가능한 아이디입니다.");
                isIdChecked = true;
            } else {
                sweetAlert("error", "이미 사용 중인 아이디입니다.");
                isIdChecked = false;
            };
        } catch (error) {
            console.error(error);
        };
    });
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
     // 아이디 양식 검증
    id.addEventListener("input", function() {
        const regex = /^[a-z][a-z0-9]{4,}$/;
        isIdChecked = false; // 아이디 input란이 변할 때마다 중복체크 하기 위해
        isIdErrorChecked = validateInput(id, regex, idError, isIdErrorChecked);
    });
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
    // 회원가입 버튼
    joinBtn.addEventListener("click", function(){
        if([id.value, password.value, phone.value, name.value, email.value].some(val => val === "")) {
            sweetAlert("error", "빈 칸을 확인해 주세요.");
        }else if(!isIdChecked) {
            sweetAlert("error", "아이디 중복 확인을 해주세요.");
        }else if(!isPhoneChecked) {
            sweetAlert("error", "휴대폰 번호 형식을 확인해 주세요.");
        }else if(!isEmailChecked) {
            sweetAlert("error", "이메일 형식을 확인해 주세요.");
        };
    });
});