async function newFormHandler(event) {
   event.preventDefault();
 
   const title = document.querySelector('input[name="post-title"]').value;
   const post_url = document.querySelector('input[name="post-url"]').value;

   // manage to get the rolling dice integer outcome and matching image-file integer based name
   // for 6 variables and passed them in the post method
 
   const response = await fetch(`/api/posts`, {
      method: 'POST',
      body: JSON.stringify({
         title,
         post_url // user ID can be obtained from the session, see post-routes.js
      }),
      headers: {
         'Content-Type': 'application/json'
      }
   });
   if (response.ok) {
      document.location.replace('/dashboard'); // Use replace method
   } else {
      alert(response.statusText);
   }
 }
 
 document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);