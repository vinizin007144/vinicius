   // ===== ARRAY QUE ARMAZENA OS ITENS DO ORÇAMENTO =====
   let itens = [];

   // ===== FUNÇÃO: ADICIONAR ITEM =====
   function adicionarItem() {
       const nome = document.getElementById('nomeItem').value.trim();
       const tipo = document.getElementById('tipoItem').value;
       const qtd = parseInt(document.getElementById('qtdItem').value);
       const valor = parseFloat(document.getElementById('valorItem').value);

       // Validações
       if (nome === '') {
           alert('⚠️ Por favor, informe a descrição do item.');
           return;
       }
       if (isNaN(qtd) || qtd <= 0) {
           alert('⚠️ A quantidade deve ser maior que zero.');
           return;
       }
       if (isNaN(valor) || valor < 0) {
           alert('⚠️ Informe um valor válido.');
           return;
       }

       // Adiciona ao array
       itens.push({
           nome: nome,
           tipo: tipo,
           quantidade: qtd,
           valorUnitario: valor
       });

       // Limpa o formulário
       document.getElementById('nomeItem').value = '';
       document.getElementById('qtdItem').value = '1';
       document.getElementById('valorItem').value = '';
       document.getElementById('nomeItem').focus();

       // Atualiza a página
       renderizarTabela();
       atualizarResumo();
   }

   // ===== FUNÇÃO: REMOVER ITEM =====
   function removerItem(index) {
       itens.splice(index, 1);
       renderizarTabela();
       atualizarResumo();
   }

   // ===== FUNÇÃO: RENDERIZAR A TABELA =====
   function renderizarTabela() {
       const corpo = document.getElementById('corpoTabela');
       corpo.innerHTML = '';

       if (itens.length === 0) {
           corpo.innerHTML = '<tr><td colspan="7" class="vazio">Nenhum item cadastrado ainda.</td></tr>';
           return;
       }

       itens.forEach((item, index) => {
           const subtotal = item.quantidade * item.valorUnitario;
           const linha = `
               <tr>
                   <td>${index + 1}</td>
                   <td>${item.nome}</td>
                   <td>${item.tipo}</td>
                   <td>${item.quantidade}</td>
                   <td>${formatarMoeda(item.valorUnitario)}</td>
                   <td>${formatarMoeda(subtotal)}</td>
                   <td><button class="btn-remover" onclick="removerItem(${index})">Remover</button></td>
               </tr>
           `;
           corpo.innerHTML += linha;
       });
   }

   // ===== FUNÇÃO: ATUALIZAR RESUMO (SUBTOTAL, DESCONTO, TOTAL) =====
   function atualizarResumo() {
       // Calcula o subtotal
       let subtotal = 0;
       itens.forEach(item => {
           subtotal += item.quantidade * item.valorUnitario;
       });

       // Pega o desconto em %
       const descontoPercentual = parseFloat(document.getElementById('desconto').value) || 0;

       // Limita o desconto entre 0 e 100
       if (descontoPercentual < 0) document.getElementById('desconto').value = 0;
       if (descontoPercentual > 100) document.getElementById('desconto').value = 100;

       const descontoReal = subtotal * (Math.min(descontoPercentual, 100) / 100);
       const total = subtotal - descontoReal;

       // Atualiza os valores na tela
       document.getElementById('subtotal').textContent = formatarMoeda(subtotal);
       document.getElementById('valorDesconto').textContent = '- ' + formatarMoeda(descontoReal);
       document.getElementById('total').textContent = formatarMoeda(total);
   }

   // ===== FUNÇÃO: LIMPAR TUDO =====
   function limparTudo() {
       if (itens.length === 0) return;
       if (confirm('Deseja realmente limpar todo o orçamento?')) {
           itens = [];
           document.getElementById('desconto').value = 0;
           renderizarTabela();
           atualizarResumo();
       }
   }

   // ===== FUNÇÃO AUXILIAR: FORMATAR VALOR EM MOEDA BRASILEIRA =====
   function formatarMoeda(valor) {
       return valor.toLocaleString('pt-BR', {
           style: 'currency',
           currency: 'BRL'
       });
   }