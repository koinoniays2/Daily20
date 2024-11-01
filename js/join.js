window.addEventListener("load", function() {
    const termsAgree = sessionStorage.getItem("termsAgree");
    if (termsAgree !== "true") {
        Swal.fire({
            icon: "error",
            text: "비정상적인 접근입니다.",
            confirmButtonColor: "#9FA9D8"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "index.html";
            };
        });
    };
    const showPasswordCheck = document.querySelector("#password_show_check");
    const eyeIcon = document.querySelector(".fa-eye-slash");
    const id = document.querySelector("#id");
    const idCheckBtn = document.querySelector(".id_box > button");
    const password = document.querySelector("#password");
    const name = document.querySelector("#name");
    const phone = document.querySelector("#phone");
    const email = document.querySelector("#email");
    const idError = document.querySelector(".id_error");
    const phoneError = document.querySelector(".phone_error");
    const emailError = document.querySelector(".email_error");
    const joinBtn = document.querySelector(".btn_box > button");

    let isIdChecked = false; // 중복체크
    let isIdRegChecked = false;
    let isEmailRegChecked = false;
    let isPhoneRegChecked = false;

    // sweetAlert
    function sweetAlert(icon, text) {
        Swal.fire({
            icon,
            text,
            confirmButtonColor: "#9FA9D8"
        });
    };
    // 아이디 중복체크
    idCheckBtn.addEventListener("click", async function() {
        const userId = id.value.trim();
        if(!isIdRegChecked && userId) {
            sweetAlert("error", "아이디 형식을 확인해 주세요.");
            return
        };
        if(!userId) {
            sweetAlert("error", "아이디를 입력하세요.");
            return
        };
        /*  http://localhost:3000/join/idCheck
            https://server-rose-one.vercel.app/join/idCheck
        */
        try {
            const response = await fetch("https://server-rose-one.vercel.app/join/idCheck", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id : userId })
            });
            // 실패시
            const data = await response.json();
            if (!response.ok) {
                if (response.status === 400 || response.status === 500) {
                    sweetAlert("error", data.message);
                } else {
                    throw new Error("예상하지 못한 오류가 발생했습니다. 상태 코드: " + response.status);
                }
                return;
            };
            // 상태코드 200 (성공시)
            if (data.result) {
                sweetAlert("success", data.message);
                isIdChecked = true; // 사용가능
            } else {
                sweetAlert("error", data.message);
                isIdChecked = false; // 중복
            };
        } catch (error) {
            console.error(error);
            sweetAlert("error", "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        };
    });
    // 패스워드 보이기
    showPasswordCheck.addEventListener("change", function() {
        const isChecked = showPasswordCheck.checked;
        eyeIcon.classList.toggle("fa-eye", isChecked); // isChecked가 true일 경우 추가, false일 경우 제거
        eyeIcon.classList.toggle("fa-eye-slash", !isChecked);
        password.type = isChecked ? "text" : "password";
    });
     // 입력 검증 함수
    function validateInput(input, regex, errorElement, isChecked) {
        if (input.value === "") { // input란이 비어 있으면 오류 메세지 숨김
            errorElement.style.display = "none";
            isChecked = false;
        } else if (!regex.test(input.value)) { // 형식에 맞지 않으면 오류 메세지 나타내기
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
        isIdRegChecked = validateInput(id, regex, idError, isIdRegChecked);
    });
     // 휴대폰번호 양식 검증
    phone.addEventListener("input", function() {
        const regex = /^\d{3}-\d{3,4}-\d{4}$/;
        isPhoneRegChecked = validateInput(phone, regex, phoneError, isPhoneRegChecked);
    });
    // 이메일 양식 검증
    email.addEventListener("input", function() {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isEmailRegChecked = validateInput(email, regex, emailError, isEmailRegChecked);
    });
    // 회원가입 버튼
    joinBtn.addEventListener("click", async function(){
        if([id.value, password.value, phone.value, name.value, email.value].some(value => value.trim() === "")) {
            sweetAlert("error", "빈 칸을 확인해 주세요.");
            return;
        }else if(!isIdChecked) {
            sweetAlert("error", "아이디 중복 확인을 해주세요.");
            return;
        }else if(!isPhoneRegChecked) {
            sweetAlert("error", "휴대폰 번호 형식을 확인해 주세요.");
            return;
        }else if(!isEmailRegChecked) {
            sweetAlert("error", "이메일 형식을 확인해 주세요.");
            return;
        };
        /*  http://localhost:3000/join
            https://server-rose-one.vercel.app/join
        */
        try {
            const response = await fetch("https://server-rose-one.vercel.app/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    id : id.value.trim(),
                    password : password.value.trim(),
                    name : name.value.trim(),
                    phone : phone.value.trim(),
                    email : email.value.trim()
                })
            });
            const data = await response.json(); 
            if (!response.ok) {
                if (response.status === 400 || response.status === 500) {
                    sweetAlert("error", data.message);
                } else {
                    throw new Error("예상하지 못한 오류가 발생했습니다. 상태 코드: " + response.status);
                };
                return;
            };

            if (data.result) { // 회원가입 완료
                Swal.fire({
                    icon: "success",
                    text: data.message,
                    confirmButtonColor: "#9FA9D8"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "index.html";
                    };
                });
            };
        } catch (error) {
            console.error(error);
            sweetAlert("error", "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        };
    });
});