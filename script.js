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

// Impede publicar a página sem os dados obrigatórios: o aviso some quando eles são preenchidos.
const faltando = [!numero && 'número de WhatsApp', !CONFIG.crp && 'CRP'].filter(Boolean);

if (faltando.length) {
  const aviso = document.getElementById('aviso-config');
  aviso.textContent = `Antes de publicar: preencha ${faltando.join(' e ')} em script.js. Os botões só abrem o WhatsApp depois disso.`;
  aviso.hidden = false;
}
