async function getScores() {
  const results = await fetch('http://localhost:3000/scores',{
      method: 'GET',
      mode:'cors',
      headers: {
        'Content-Type': 'application/json'
      },
    });
  return results.json();
}

async function postScores(time, name, time) {
  const results = await fetch('http://localhost:3000?time',{
      method: 'POST',
      mode:'cors',
      headers: {
        'Content-Type': 'application/json'
      },
    });
  return results.json();
}
