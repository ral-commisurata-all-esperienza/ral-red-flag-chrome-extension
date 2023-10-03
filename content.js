// Rileva la presenza della parola chiave "RAL relativa all'esperienza" nella pagina
if (
  document.body.innerText.includes("RAL commisurata all'esperienza") ||
  document.body.innerText.includes("RAL commisurata all") ||
  document.body.innerText.includes("Competitive salary")
) {
  // Cambia il colore del bordo della pagina in rosso
  document.body.style.border = "5px solid red";
}
