const form = document.querySelector('form');


form.addEventListener('submit', function(event) {
    event.preventDefault(); 

   
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const idade = document.getElementById('idade').value.trim();
    const assunto = document.getElementById('assunto').value; // select
    const mensagem = document.getElementById('mensagem').value.trim();
    const termos = document.getElementById('termos').checked;

   
    if (!nome || !email || !idade || !assunto || !mensagem) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    
    if (!termos) {
        alert('Você precisa aceitar os termos para enviar o formulário.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }

    
    alert(`Formulário enviado com sucesso!\n\nResumo:\n- Nome: ${nome}\n- Email: ${email}\n- Idade: ${idade}\n- Assunto: ${assunto}\n- Mensagem: ${mensagem}`);

    form.reset(); 
});
