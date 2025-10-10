let numero = prompt("digite um numero: ")

function dobro(numero) {
    return numero * 2;
}
console.log(dobro(5));

//Array para armazenar e listar os nomes

let pessoa = ["Kayllane", "Eric", "Gabi", "Duda"];

for (let i = 0; i < pessoa.length; i++) {
    console.log(pessoa[i]);
}

// Objeto 

let carro = {
    marca: "Toyota",
    modelo: "Corolla",
    ano: 2020,
    cor: "Prata"
}

console.log("Marca: " + carro.marca + ", Modelo: " + carro.modelo + ", Ano: " + carro.ano + ", Cor: " + carro.cor);