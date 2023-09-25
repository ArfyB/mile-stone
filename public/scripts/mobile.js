const mobileMenuBtnElement = document.getElementById('mobile-menu-btn');
const mobileMenuElement = document.getElementById('mobile-menu');

function toggleMobileMenu() {
    mobileMenuElement.classList.toggle('open'); // 해당 함수가 실행될때마다 open 클래스가 추가 or 삭제된다.
}

mobileMenuBtnElement.addEventListener('click', toggleMobileMenu); // 클릭했을때 toggleMobileMenu함수 실행. ( 함수에 괄호를 쓰지않으면 해당 js파일을 분석할때에는 실행되지않고 클릭시에만 실행된다. )