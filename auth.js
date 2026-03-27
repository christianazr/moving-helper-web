async function signIn() {
  const email = prompt("Enter your email:");
  
  const { data, error } = await supabaseClient.auth.signInWithOtp({
    email: email,
  });

  if (error) {
    alert("Error logging in");
  } else {
    alert("Check your email for login link");
  }
}

async function getUser() {
  const { data } = await supabaseClient.auth.getUser();
  return data.user;
}
