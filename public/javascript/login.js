
// // Version Classic
// function signupFormHandler(event) {
//    event.preventDefault();
// 
//    const username = document.querySelector('#username-signup').value.trim();
//    const email = document.querySelector('#email-signup').value.trim();
//    const password = document.querySelector('#password-signup').value.trim();
// 
//    if (username && email && password) {
//       fetch('/api/users', {
//          method: 'post',
//          body: JSON.stringify({
//             username,
//             email,
//             password
//          }),
//          headers: { 'Content-Type': 'application/json' }
//       }).then((response) => {console.log(response)})
//    }
// }

// -- we'll use an ES6 feature called async/await:

// // Version  async/await/then[response]
// async function signupFormHandler(event) {
//    event.preventDefault();
//  
//    const username = document.querySelector('#username-signup').value.trim();
//    const email = document.querySelector('#email-signup').value.trim();
//    const password = document.querySelector('#password-signup').value.trim();
//  
//    if (username && email && password) {
//      await fetch('/api/users', {
//        method: 'post',
//        body: JSON.stringify({
//          username,
//          email,
//          password
//        }),
//        headers: { 'Content-Type': 'application/json' }
//      }).then((response) => {console.log(response)})
//    }
// }

// Version  async/[response]-await
async function signupFormHandler(event) {
   event.preventDefault();
 
   const username = document.querySelector('#username-signup').value.trim();
   const email = document.querySelector('#email-signup').value.trim();
   const password = document.querySelector('#password-signup').value.trim();
 
   if (username && email && password) {
     const response = await fetch('/api/users', {
       method: 'post',
       body: JSON.stringify({
         username,
         email,
         password
       }),
       headers: { 'Content-Type': 'application/json' }
     });
     console.log(response);
   }
 }

 // LOGIN OPTION
async function loginFormHandler(event) {
   event.preventDefault();
   const email = document.querySelector('#email-login').value.trim();
   const password = document.querySelector('#password-login').value.trim();

   if (email && password) {
      const response = await fetch('/api/users/login', {
         method: 'post',
         body: JSON.stringify({
         email,
         password
         }),
         headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
         document.location.replace('/');
      } else {
         alert('Failed to log in.');
         alert(response.statusText);
      }
   }
}

// // apiFoodUrl = 'https://api.edamam.com/api/recipes/v2?app_id=' + APP_ID + '&app_key=' + API_KEY 
// //                   + '&type=public&cuisineType=' + searchOptions.cuisineType
// //                   + '&q=' + recipephrase;   
// 
// // fetch(apiFoodUrl).then(function(food_response) 
// // {
// //   // console.log(food_response);  
// //    if(food_response.ok)
// //    {
// //       food_response.json().then(function(food_data)
// //       {
// //          // console.log(food_data);
// //          // -- action
// //          result = displayRecipeHits(food_data, searchByClicking);
// //          if(result = null){
// //          console.log("No recipe hit found or an error has occurred");
// //          } // end if
// //       });
// //    }
// //    else
// //    {
// //          console.log("Error: Recipe Data Not Found"); // status 400
// //    }
// // })  
// // .catch(function(error){
// //     console.log("An error has occured: " + error);
// // }); // it ends here

 
 document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
 document.querySelector('.login-form').addEventListener('submit', loginFormHandler);