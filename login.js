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
            console.log('token', data.token);
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

    getDataFromApi(`sophie.bluel@test.tld`, `S0phie`)

    .then(token => {
        alert('Connexion réussie !');
    })

    .catch(error => {
        alert(`Erreur dans l’identifiant ou le mot de passe`);
        console.error(error);
    })
});

document.getElementById('forgotPassword').addEventListener('click', function() {
    
    alert('Mot de passe oublié');
});
