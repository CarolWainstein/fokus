const btAdicionarTarefa = document.querySelector('.app__button--add-task');
const btCancelarTarefa = document.querySelector('.app__form-footer__button--cancel');
const btDeletarTexto = document.querySelector('.app__form-footer__button--delete');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');


let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []; // lista de tarefas
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

function atualizarTarefa() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas)); // guarda as informaçoes no navegador local. OBS: ela só trabalha com strings
                                    // o JSON.stringify() tranforma o que for escrito no form em string,m as sem perder o objeto.
};

function criarTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `

    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');

    botao.onclick = () => {
        //debugger //serve para o navegador dizer o que está ocorrendo com o código.
        const novaDescricao = prompt("Qual é o novo nome da tarefa?");

        if(novaDescricao) {
           paragrafo.textContent = novaDescricao;
            tarefa.descricao = novaDescricao;
            atualizarTarefa(); 
        };
    };

    const imagemBotao = document.createElement('img');
    imagemBotao.setAttribute('src', 'imagens/edit.png');
    botao.append(imagemBotao); // acrescenta

    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
    } else {
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active');
                });

            if (tarefaSelecionada == tarefa) {
                paragrafoDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null;

                return
            };

            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;
            paragrafoDescricaoTarefa.textContent = tarefa.descricao;
            
            li.classList.add('app__section-task-list-item-active');
        };
    };

    


    return li
};


btAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden'); // toggle é para alternar. Se tem tira, se não tem coloca o elemento.
});

const limparFormulario = () => {
    textArea.value = '';
    formAdicionarTarefa.classList.add('hidden');
};

formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault(); //impede o comportamento padrão, que nesse caso é recarregar a página ao enviar o formulario.
    const tarefa = {
        descricao: textArea.value // um objeto que guarda o valor do textArea.
    };
    tarefas.push(tarefa); // coloca o valor do textArea na lista "tarefas".
    const tarefaCriada = criarTarefa(tarefa);
    ulTarefas.append(tarefaCriada);
    atualizarTarefa();
    limparFormulario();
});

btCancelarTarefa.addEventListener('click', limparFormulario);

btDeletarTexto.addEventListener('click', () => {
    textArea.value = '';
});

tarefas.forEach(tarefa => { // percorre a lista
    const tarefaCriada = criarTarefa(tarefa);
    ulTarefas.append(tarefaCriada);
});

document.addEventListener('focoFinalizado', () => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
    };
});

const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item"; // if ternário, mesmo resultado o if comum.
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    });
    tarefas =  somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [];
    atualizarTarefa();
};

btnRemoverConcluidas.onclick = () => removerTarefas(true); // sem o (), é para usar a funcção apenas como referencia, não executa-la.

btnRemoverTodas.onclick = () => removerTarefas(false);