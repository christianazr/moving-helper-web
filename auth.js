async function signIn() {
  const email = prompt("Enter your email:");

  const { error } = await supabaseClient.auth.signInWithOtp({
    email: email,
  });

  if (error) {
    alert("Error sending magic link");
  } else {
    alert("Check your email");
  }
}

async function getUser() {
  const { data, error } = await supabaseClient.auth.getSession();
  return data.session?.user || null;
}
