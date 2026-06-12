async function gerarPerguntaIA() {
    const quizBox = document.getElementById('quiz-box');
    const btnIA = document.getElementById('btn-ia');

    btnIA.disabled = true;
    btnIA.style.opacity = "0.5";
    
    quizBox.innerHTML = `
        <p style="text-align: center; color: #F0141E; font-weight: bold; letter-spacing: 2px;">
            [ A CONECTAR AO BANCO DE DADOS DA S.H.I.E.L.D... ]
        </p>
    `;

    try {

        const URL_API = 'https://opentdb.com/api.php?amount=1&category=11&difficulty=hard&type=boolean';
        const resposta = await fetch(URL_API);
        const dados = await resposta.json();

        if (dados.response_code !== 0) {
            throw new Error("Erro ao obter a pergunta");
        }

        const q = dados.results[0];
        
        const perguntaLimpa = limparTexto(q.question);
        const respostaCorretaLimpa = limparTexto(q.correct_answer);
        
        let alternativas = [q.correct_answer, ...q.incorrect_answers].map(item => limparTexto(item));
        
        
        alternativas.sort().reverse(); 

        let botoesHTML = '';
        alternativas.forEach((alternativa) => {
            const forCorreta = (alternativa === respostaCorretaLimpa);
           
            botoesHTML += `<button onclick="verificarRespostaAPI(this, ${forCorreta}, '${alternativa}')">${alternativa}</button>`;
        });

        quizBox.innerHTML = `
            <div class="question">
                <p style="color: #F0141E; font-size: 0.85rem; letter-spacing: 1px;">&gt; S.H.I.E.L.D. DATABASE ONLINE_</p>
                <p style="margin-bottom: 20px;"><strong>${perguntaLimpa}</strong></p>
                <div style="display: flex; gap: 10px;">${botoesHTML}</div>
            </div>
        `;

    } catch (erro) {
        quizBox.innerHTML = `
            <p style="text-align: center; color: #e74c3c; font-family: 'Arial', sans-serif;">
                [ ERRO DE CONEXÃO: Não foi possível aceder à base de dados. Tenta novamente! ]
            </p>
        `;
        console.error(erro);
    } finally {
        btnIA.disabled = false;
        btnIA.style.opacity = "1";
        btnIA.innerText = "[ GERAR NOVA PERGUNTA ]";
    }
}

function limparTexto(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}


function verificarRespostaAPI(botao, forCorreta, textoAlternativa) {
    const containerDaPergunta = botao.parentElement;
    const botoes = containerDaPergunta.querySelectorAll('button');
    
    botoes.forEach(b => {
        b.disabled = true;
        b.style.cursor = 'not-allowed';
    });

    if (forCorreta) {
        botao.style.backgroundColor = '#2ecc71'; 
        botao.style.color = '#fff';
        botao.style.borderColor = '#2ecc71';
        botao.innerText = `${textoAlternativa}  ✓ (ACCESS GRANTED)`;
    } else {
        botao.style.backgroundColor = '#e74c3c'; 
        botao.style.color = '#fff';
        botao.style.borderColor = '#e74c3c';
        botao.innerText = `${textoAlternativa}  ✗ (ACCESS DENIED)`;
    }
}