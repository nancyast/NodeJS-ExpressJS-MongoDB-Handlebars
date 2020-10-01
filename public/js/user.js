function deleteUser(id) {
  fetch(`http://localhost:4000/users/${id}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async (response) => {
    console.log('response ', response);
    window.location.replace('http://localhost:4000/users');
  });
}

$(document).ready(function () {
  console.log('ready!');
  // Create User
  $('#add-user-form').on('submit', (event) => {
    event.preventDefault();
    const requestBody = {
      firstName: $('input[name="firstName"]').val(),
      lastName: $('input[name="lastName"]').val(),
      dob: $('input[name="dob"]').val(),
      gender: $('select[name="gender"]').val(),
      email: $('input[name="email"]').val(),
      address: $('input[name="address"]').val(),
      country: $('input[name="country"]').val(),
      zipCode: $('input[name="zipCode"]').val(),
      password: $('input[name="password"]').val(),
      confirmedPassword: $('input[name="confirmedPassword"]').val(),
    };
    console.log('requestBody ', requestBody);

    fetch('http://localhost:4000/users', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }).then((response) => {
      window.location.replace('http://localhost:4000/users');
    });
  });

  $('#edit-user-form').on('submit', (event) => {
    event.preventDefault();
    const userId = $('#edit-user-form').attr('action');
    console.log('userId ', userId);
    const requestBody = {
      firstName: $('input[name="firstName"]').val(),
      lastName: $('input[name="lastName"]').val(),
      dob: $('input[name="dob"]').val(),
      gender: $('select[name="gender"]').val(),
      email: $('input[name="email"]').val(),
      address: $('input[name="address"]').val(),
      country: $('input[name="country"]').val(),
      zipCode: $('input[name="zipCode"]').val(),
    };

    console.log('requestBody ', requestBody);
    fetch(`http://localhost:4000/users/${userId}`, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }).then((response) => {
      window.location.replace('http://localhost:4000/users');
    });
  });
});
