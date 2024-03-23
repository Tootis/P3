function saveTokenLocalStorage (token) {
    localStorage.setItem('authToken', token)
}

function getTokenLocalStorage() {
    return localStorage.getItem('authToken')
}

function checkLoggedIn() {
    const token = getTokenLocalStorage()
    return token !== null;
}

function getDataFromApi(email, password) {
    return fetch("http://localhost:5678/api/users/login",{
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Echec');
        }
        return response.json();
    })
    .then(data => {
        if (data.token){
            saveTokenLocalStorage(data.token)
            return data.token
        } else {
            throw new Error(
                'Erreur Token'
            )}
    });
  }

document.getElementById('login').addEventListener('click', function() {    
    let emailValue = document.getElementById('email').value;
    let passwordValue = document.getElementById('password').value;
    console.log(emailValue,passwordValue)
    getDataFromApi(emailValue,passwordValue)
    .then(token => {
        if (checkLoggedIn()){
            window.location.href = 'index.html'
        }
        
    })
    .catch(error => {
        alert(`Erreur dans l’identifiant ou le mot de passe`);
    })
});

document.getElementById('forgotPassword').addEventListener('click', function() {
    alert('Mot de passe oublié');
});