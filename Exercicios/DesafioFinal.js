
const numeroSecreto = Math.floor(Math.random() * 10) + 1;

const palpite = prompt("Tente adivinhar o número (de 1 a 10):");


if (Number(palpite) === numeroSecreto) {
  alert("Parabéns, você acertou!");
} else {
  alert("Tente novamente. O número era " + numeroSecreto + ".");
}
