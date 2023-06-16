export default class FormValidator {
    constructor (inputSelector) {
        this._settings = settings;
        this._form = formElement;
        this._inputList = Array.from(document.querySelectorAll(inputSelector));
        this._buttonElement = formElement.querySelector(this._settings.submitButtonSelector);
    }
    setEventListeners () {
        this._inputList.forEach((item) => {
            item.addEventListener('input', function(e) {
                const spanPlaceholder = document.getElementsByName(item.name)[0];
                if (item.name === 'phone') {
                    const x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
                    e.target.value = !x[2] ? x[1] : '+' + x[1] + ' (' + x[2] + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
                }
                if (item.value) {
                    spanPlaceholder.classList.add("authentication__placeholder_activ");
                    item.classList.add("authentication__input_activ");
                } else {
                    spanPlaceholder.classList.remove("authentication__placeholder_activ");
                    item.classList.remove("authentication__input_activ");
                }
              });
        })
    }

    _showInputError (inputElement, errorMessage) {
        const errorElement = this._form.querySelector(`.${inputElement.id}-error`);
        inputElement.classList.add(this._settings.inputErrorClass);
        errorElement.textContent = errorMessage;
        errorElement.classList.add(this._settings.errorClass);
    };
        
    _hideInputError (inputElement) {
        const errorElement = this._form.querySelector(`.${inputElement.id}-error`);
        inputElement.classList.remove(this._settings.inputErrorClass);
        errorElement.classList.remove(this._settings.errorClass);
        errorElement.textContent = '';
    };
    
    _checkInputValidity (inputElement) {
        if (!inputElement.validity.valid) {
            this._showInputError(inputElement, inputElement.validationMessage);
        } else {
            this._hideInputError(inputElement);
        }
    };
    _setEventListeners () {
        this._toggleButtonState();
        this._inputList.forEach((inputElement) => {
            inputElement.addEventListener('input', () => {
                this._checkInputValidity(inputElement);
                this._toggleButtonState();
            });
        });
    };
    _hasInvalidInput (inputList) {
        return inputList.some((inputElement) => {
        return !inputElement.validity.valid;
    }); 
    }
    _toggleButtonState () {
        if (this._hasInvalidInput(this._inputList)) {
            this._buttonElement.classList.add(this._settings.inactiveButtonClass);
            this._buttonElement.disabled = true;
        } else {
            this._buttonElement.classList.remove(this._settings.inactiveButtonClass);
            this._buttonElement.disabled = false;
        } 
    }
    resetValidation() {
        this._toggleButtonState(); 
        this._inputList.forEach((inputElement) => {
            this._hideInputError(inputElement);
        });
    
        }
    enableValidation () {
        this._form.addEventListener('submit', function (evt) {
            evt.preventDefault();
        });
        this._setEventListeners();

    };
}