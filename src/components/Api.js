export default class Api {
    constructor() {
        
    }
    _checkResponse(res) {
        return res.json();
    }
    singin(inputData) {
        return fetch('http://localhost:3000/singin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputData)
        })
        .then(res => this._checkResponse(res))
    }
    emailConfirm() {
        return fetch('http://localhost:3000/singin', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emailConfirm: true
            })
        })
    }
}