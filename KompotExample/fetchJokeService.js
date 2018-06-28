export async function fetchJoke(){
  const response = await fetch('https://api.chucknorris.io/jokes/random');
  jsonResponse = await response.json();
  return jsonResponse.value;
}