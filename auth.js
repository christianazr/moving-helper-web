async function signUpWithPassword(email, password) {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert("Sign up error: " + error.message);
    console.error(error);
    return null;
  }

  alert("Account created successfully.");
  return data.user;
}

async function signInWithPassword(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert("Login error: " + error.message);
    console.error(error);
    return null;
  }

  return data.user;
}

async function getUser() {
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    console.error(error);
    return null;
  }
  return data.session?.user || null;
}

async function signOutUser() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    alert("Sign out error: " + error.message);
    console.error(error);
  }
}
