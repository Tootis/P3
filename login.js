function getDataFromApi() {
    return fetch("http://localhost:5678/api/works")
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })
      .then(function (data) {
        return data;
      });
  }

let email = document.getElementById ('email')
console.log(email)
let login = document.getElementById ('login')
console.log(login)

document.getElementById('login').addEventListener('click', function() {
    
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    
    if (email === 'sophie.bluel@test.tld' && password === 'S0phie') {
        alert('Connexion réussie !');
        
    } else {
        alert(`Erreur dans l’identifiant ou le mot de passe`);
    }
});

document.getElementById('forgotPassword').addEventListener('click', function() {
    
    alert('Mot de passe oublié');
});
