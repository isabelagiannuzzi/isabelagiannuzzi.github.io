// Preencha aqui os dados de contato. É o único trecho que precisa ser editado.
const CONFIG = {
  whatsapp: '5511957230929',   // Com DDI e DDD, só números. O link wa.me/message não aceita as mensagens prontas.
  crp: 'CRP 06/227835',
  instagram: 'https://www.instagram.com/psicogiannuzzi',
  email: 'psicogiannuzzi@gmail.com',
};

const numero = CONFIG.whatsapp.replace(/\D/g, '');

// Com número preenchido, cada botão abre o WhatsApp com a sua mensagem inicial.
if (numero) {
  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    const mensagem = encodeURIComponent(link.dataset.mensagem);
    link.href = `https://wa.me/${numero}?text=${mensagem}`;
    link.target = '_blank';
    link.rel = 'noopener';
  });
}

document.querySelectorAll('[data-crp]').forEach((el) => {
  el.textContent = CONFIG.crp;
});

document.querySelector('[data-crp-linha]').hidden = !CONFIG.crp;

const contatos = {
  instagram: CONFIG.instagram,
  email: CONFIG.email && `mailto:${CONFIG.email}`,
};

Object.entries(contatos).forEach(([nome, endereco]) => {
  if (!endereco) return;
  const item = document.querySelector(`[data-contato="${nome}"]`);
  item.hidden = false;
  const link = item.querySelector('a');
  link.href = endereco;
  if (nome === 'instagram') {
    link.target = '_blank';
    link.rel = 'noopener';
  }
});

// Lista de momentos: abre e fecha deslizando. Sem JavaScript, os itens continuam funcionando sem animação.
const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
const momentos = [...document.querySelectorAll('.momentos-lista details')];
const DURACAO = 360;
const SUAVE = 'cubic-bezier(.22, .61, .36, 1)';

// O atributo name fecharia os outros itens na hora, sem animação; o script assume essa função.
momentos.forEach((item) => item.removeAttribute('name'));

function animar(item, abrindo) {
  const corpo = item.querySelector('.momento-corpo');
  item.animacao?.cancel();

  if (abrindo) item.open = true;
  const altura = corpo.scrollHeight;
  const espaco = getComputedStyle(corpo).paddingBottom;
  const fechado = { height: '0px', paddingBottom: '0px', opacity: 0, transform: 'translateY(-6px)' };
  const aberto = { height: `${altura}px`, paddingBottom: espaco, opacity: 1, transform: 'translateY(0)' };

  corpo.classList.add('animando');
  item.fechando = !abrindo;
  const animacao = corpo.animate(abrindo ? [fechado, aberto] : [aberto, fechado], { duration: DURACAO, easing: SUAVE });
  item.animacao = animacao;
  animacao.onfinish = () => {
    if (!abrindo) item.open = false;
    item.fechando = false;
    corpo.classList.remove('animando');
    item.animacao = null;
  };
}

momentos.forEach((item) => {
  item.querySelector('summary').addEventListener('click', (evento) => {
    if (movimentoReduzido.matches) {
      // Sem animação, mas mantendo um item aberto por vez.
      momentos.forEach((outro) => { if (outro !== item) outro.open = false; });
      return;
    }
    evento.preventDefault();
    // Um item que está fechando ainda conta como aberto; clicar nele de novo o reabre.
    const vaiAbrir = !item.open || item.fechando;
    if (vaiAbrir) {
      momentos.forEach((outro) => { if (outro !== item && outro.open && !outro.fechando) animar(outro, false); });
    }
    animar(item, vaiAbrir);
  });
});

// Impede publicar a página sem os dados obrigatórios: o aviso some quando eles são preenchidos.
const faltando = [!numero && 'número de WhatsApp', !CONFIG.crp && 'CRP'].filter(Boolean);

if (faltando.length) {
  const aviso = document.getElementById('aviso-config');
  aviso.textContent = `Antes de publicar: preencha ${faltando.join(' e ')} em script.js. Os botões só abrem o WhatsApp depois disso.`;
  aviso.hidden = false;
}
