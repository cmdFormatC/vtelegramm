import FormValidator from '../components/FormValidator.js';
import Api from '../components/Api.js';
const inputList = Array.from(document.querySelectorAll(".authentication__input"));
const formValidator = new FormValidator ('.authentication__input');
const formElement = document.querySelector('.singin')
const api = new Api()
formValidator.setEventListeners();
function submitForm () {
    const inputData = getInputData();
    api.singin(inputData)
    .then(async (res) => {
        console.log(res)
        if (res.isRegisted) {
            const emailErrorElement = document.querySelector('.input-email-error');
            emailErrorElement.textContent = 'Пользователь с таким email уже зарегистрирован';
            emailErrorElement.classList.add('authentication____error_activ');

        } else {
            const emailConfirmationElement = renderEmailConfirmation('emailConfirmation');
            emailConfirmationElement.querySelector(".authentication__paragraph_accent").textContent = res.userEmail;
            formElement.innerHTML = '';
            formElement.append(emailConfirmationElement);
            const formValidator = new FormValidator ('.authentication__input');
            formValidator.setEventListeners();
            await renderResendTimer(".authentication__link");
        };
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
async function renderResendTimer (resendElementSelector) {
    const resendElement = document.querySelector(resendElementSelector);
    for (let i = 59; i >= 0; i--) {
        await resendTimer(resendElement, i)
    };
    // resendElement.addEventListener('click' api.resendCode)
}
function renderEmailConfirmation(selector) {
    const formConfirmation = document.getElementById(selector).content.cloneNode(true);
    return formConfirmation
}
function resendTimer(resendElement, seconds) {
    return new Promise((resolve) => {
        resendElement.classList.add('authentication__link_disable');
        if (seconds > 0) {
            setTimeout(function() {
                resendElement.textContent = `Отправить повтороно (${seconds})`;
                resolve();
            }, 1000);
        } else {
            resendElement.classList.remove('authentication__link_disable');
            resendElement.textContent = `Отправить повтороно`;
            resolve();
        };
    });
}
function getInputData() {
    const data = {};
    inputList.forEach((item) => {
        data[item.name] = item.value;
    })
    return data
}
document.querySelector('.authentication__button').addEventListener('click', submitForm);
