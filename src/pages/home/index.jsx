import { useEffect, useState } from 'react'; 
import { useAuth } from '../../hooks/useAuth'; 
import { useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, LogOut, Send, 
  ArrowUpRight, ArrowDownLeft, 
  BarChart3, CreditCard, Wallet,
  Home as HomeIcon, List, User // Renomeamos o Home para HomeIcon
} from 'lucide-react';
import './home.css';

export default function Home() {
  const { usuarioLogado, realizarLogout } = useAuth();
  const navigate = useNavigate();
  const [mostrarSaldo, setMostrarSaldo] = useState(false);
  const [valorTransferencia, setValorTransferencia] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [modalSucessoAberto, setModalSucessoAberto] = useState(false);
  const [dadosComprovante, setDadosComprovante] = useState({ valor: 0, chave: '' });

  // --- ESTADOS PARA O PIX E SALDO ---
  const [modalPixAberto, setModalPixAberto] = useState(false);
  const [chavePix, setChavePix] = useState('');
  const [valorPix, setValorPix] = useState('');
  const [saldoLocal, setSaldoLocal] = useState(0);

  const [modalTransferirAberto, setModalTransferirAberto] = useState(false);
  const [nomeDestinatario, setNomeDestinatario] = useState('');

  const [modalPagarAberto, setModalPagarAberto] = useState(false);
  const [escaneando, setEscaneando] = useState(false);

  const [modalInvestirAberto, setModalInvestirAberto] = useState(false);

  // --- ESTADO PARA A LISTA DE TRANSAÇÕES ---
  const [transacoes, setTransacoes] = useState([
    { id: 1, nome: "Padaria Central", data: "Hoje, 08:30", valor: 15.90, tipo: "neg" },
    { id: 2, nome: "Transferência Recebida", data: "Ontem, 14:20", valor: 250.00, tipo: "pos" }
  ]);

  useEffect(() => {
    if (usuarioLogado?.balance) {
      setSaldoLocal(Number(usuarioLogado.balance));
    }
  }, [usuarioLogado]);

  useEffect(() => {
    const timer = setTimeout(() => setCarregando(false), 1500); 
    return () => clearTimeout(timer);
  }, []);

  function realizarTransferencia() {
    const valor = parseFloat(valorTransferencia);
    if (!valor || valor <= 0) return alert("❌ Digite um valor válido!");
    if (valor > saldoLocal) return alert("❌ Saldo insuficiente!");
    
    setSaldoLocal(prev => prev - valor);
    alert(`✅ Sucesso! R$ ${valor.toFixed(2)} transferidos.`);
    setValorTransferencia('');
  }

  const confirmarPix = () => {
    const valor = parseFloat(valorPix);
    if (!chavePix || !valor || valor <= 0) {
      alert("❌ Preencha a chave e um valor válido!");
      return;
    }
    if (valor > saldoLocal) {
      alert("❌ Saldo insuficiente!");
      return;
    }

    setCarregando(true);
    setTimeout(() => {
      setSaldoLocal(prev => prev - valor);
      setDadosComprovante({ valor: valor, chave: chavePix });
      
      const novoRegistro = {
        id: Date.now(),
        nome: `Pix para ${chavePix}`,
        data: "Agora",
        valor: valor,
        tipo: "neg"
      };
      
      setTransacoes(prev => [novoRegistro, ...prev]);

      setModalPixAberto(false);
      setModalSucessoAberto(true);
      
      setChavePix(''); // Limpa o input
      setValorPix(''); // Limpa o input
      setCarregando(false);
    }, 2000);
  }; 

  if (!carregando && !usuarioLogado?.name) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h1>⚠️ Sessão Expirada</h1>
          <p>Por favor, realize o login novamente.</p>
          <button onClick={() => navigate('/')} className="login-btn-premium">Voltar ao Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <div className="user-info">
            <div className="user-avatar">{usuarioLogado?.name?.charAt(0)}</div>
            <div>
              <span className="welcome-text">Olá,</span>
              <strong className="user-name">{usuarioLogado?.name}</strong>
            </div>
          </div>
          <button className="btn-logout" onClick={() => { realizarLogout(); navigate('/'); }}>
            <LogOut size={18} /> <span>Sair</span>
          </button>
        </div>
      </header>

      <main className="home-content">
        <div className="balance-card">
          <div className="balance-header">
            <span>Saldo disponível</span>
            <button className="btn-eye" onClick={() => setMostrarSaldo(!mostrarSaldo)}>
              {mostrarSaldo ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {carregando ? (
            <div className="skeleton-balance"></div>
          ) : (
            <h2 className={`balance-value ${!mostrarSaldo ? 'balance-blur' : ''}`}>
              R$ {saldoLocal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h2>
          )}
        </div>

        <div className="actions-grid">
          <button className="action-item" onClick={() => setModalPixAberto(true)}>
          <div className="icon-box"><Send size={22}/></div>
          Pix
          </button>
          <button className="action-item" onClick={() => {setModalPagarAberto(true);setEscaneando(true);
          // Simula que achou o boleto após 3 segundos
          setTimeout(() => setEscaneando(false), 3000);
          }}>
          <div className="icon-box"><CreditCard size={22}/></div>
          Pagar
          </button>
          <button className="action-item" onClick={() => setModalTransferirAberto(true)}>
          <div className="icon-box"><ArrowUpRight size={22}/></div>
          Transferir
          </button>
          <button className="action-item" onClick={() => setModalInvestirAberto(true)}>
          <div className="icon-box"><BarChart3 size={22}/></div>
          Investir
          </button>
        </div>

        <section className="transfer-card">
          <h3>Simular Transferência</h3>
          <div className="transfer-group-vertical">
    
    {/* Input de nome que recebe o valor do modal */}
        <input 
          type="text" 
          placeholder="Para quem?" 
          value={nomeDestinatario} // <--- Nome que vem do Modal de Transferir
          onChange={(e) => setNomeDestinatario(e.target.value)}
          className="input-transferencia"
        />
    {/* Input de valor e botão "Enviar" */}
        <div className="transfer-input-valor-group"> 
        <input 
          type="number" 
          placeholder="R$ 0,00"
          value={valorTransferencia}
          onChange={(e) => setValorTransferencia(e.target.value)}
          className="input-valor"
        />
      
      {/* Botão alinhado à direita */}
        <div className="btn-enviar-container">
        <button className="btn-enviar" onClick={realizarTransferencia}>Enviar</button>
       </div>
     </div>
  </div>
</section>

        <section className="activity-section">
          <div className="section-header">
            <h3>Atividade Recente</h3>
            <button className="btn-all">Ver tudo</button>
          </div>
          <div className="transaction-list">
            {transacoes.map((t) => (
              <div className="t-item" key={t.id}>
                <div className={`t-icon ${t.tipo === 'neg' ? 'red' : 'green'}`}>
                  {t.tipo === 'neg' ? <ArrowUpRight size={18}/> : <ArrowDownLeft size={18}/>}
                </div>
                <div className="t-info">
                  <strong>{t.nome}</strong>
                  <span>{t.data}</span>
                </div>
                <span className={`t-value ${t.tipo} ${!mostrarSaldo ? 'balance-blur' : ''}`}>
                  {t.tipo === 'neg' ? '-' : '+'} R$ {t.valor.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {modalPixAberto && (
        <div className="modal-overlay">
          <div className="modal-content animate-card">
            <div className="modal-header">
              <h3>Enviar Pix</h3>
              <button className="btn-close" onClick={() => setModalPixAberto(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-input-group">
                <label>Chave Pix</label>
                <input 
                  type="text" 
                  placeholder="CPF, E-mail ou Telefone"
                  value={chavePix}
                  onChange={(e) => setChavePix(e.target.value)}
                />
              </div>
              <div className="modal-input-group">
                <label>Valor</label>
                <input 
                  type="number" 
                  placeholder="R$ 0,00"
                  value={valorPix}
                  onChange={(e) => setValorPix(e.target.value)}
                />
              </div>
              <button className="btn-confirm-pix" onClick={confirmarPix} disabled={carregando}>
                {carregando ? 'PROCESSANDO...' : 'Confirmar Envio'}
              </button>
            </div>
          </div>
        </div>
      )}
  {/* MODAL DE SUCESSO COMPLETO */}
    {modalSucessoAberto && (
      <div className="modal-overlay">
        <div className="modal-content animate-card success-modal">
          <div className="success-icon">
          <span style={{ fontSize: '40px', color: '#48bb78' }}>✓</span>
            </div>
      
          <h2>Pix Enviado!</h2>
      
          <div className="receipt-details">
           <div className="receipt-row">
            <span>Valor</span>
            <strong>R$ {dadosComprovante.valor.toFixed(2)}</strong>
          </div>
           <div className="receipt-row">
          <span>Para</span>
          <strong>{dadosComprovante.chave}</strong>
        </div>
        <div className="receipt-row">
          <span>Data</span>
          <strong>{new Date().toLocaleDateString('pt-BR')}</strong>
        </div>
      </div>

      <div className="modal-actions-vertical">
        <button className="btn-share" onClick={() => alert("Comprovante copiado para a área de transferência!")}>
           Compartilhar Comprovante
        </button>
        
        <button className="btn-confirm-pix" onClick={() => setModalSucessoAberto(false)}>
          Voltar ao Início
        </button>
        </div>
       </div>
      </div>
      )}
      {/* BARRA DE NAVEGAÇÃO INFERIOR - COLE AQUI */}
      <nav className="bottom-nav">
        <div className="nav-item active">
          <HomeIcon size={22} /> 
          <span>Início</span>
        </div>
        <div className="nav-item" onClick={() => alert('Em breve: Extrato')}>
          <List size={22} />
          <span>Extrato</span>
        </div>
        <div className="nav-item" onClick={() => alert('Em breve: Cartões')}>
          <CreditCard size={22} />
          <span>Cartões</span>
        </div>
        <div className="nav-item" onClick={() => alert('Em breve: Perfil')}>
          <User size={22} />
          <span>Perfil</span>
        </div>
      </nav>
      {/* MODAL DE TRANSFERIR - CONTATOS */}
      {modalTransferirAberto && (
        <div className="modal-overlay" onClick={() => setModalTransferirAberto(false)}>
          <div className="modal-content animate-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
            <h3>Transferir para</h3>
            <button className="btn-close" onClick={() => setModalTransferirAberto(false)}>✕</button>
            </div>
      
            <div className="contatos-lista">
            {[
          { nome: "Minha Mãe", cor: "#e91e63" },
          { nome: "Daniel (Namorado)", cor: "#2196f3" },
          { nome: "Foco Estudos", cor: "#4caf50" }
        ].map((contato, index) => (
          <div 
            key={index} 
            className="t-item" 
            style={{ cursor: 'pointer', padding: '15px 0' }}
            onClick={() => {
              setNomeDestinatario(contato.nome); // Preenche o input!
              setModalTransferirAberto(false);   // Fecha o modal
            }}
          >
            <div className="user-avatar" style={{ backgroundColor: contato.cor }}>
              {contato.nome.charAt(0)}
            </div>
            <div className="t-info">
              <strong>{contato.nome}</strong>
              <span>Contato frequente</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
      {modalPagarAberto && (
        <div className="modal-overlay">
          <div className="modal-content animate-card scanner-modal">
            <div className="modal-header">
              <h3>Escanear Boleto</h3>
              <button className="btn-close" onClick={() => setModalPagarAberto(false)}>✕</button>
            </div>

            <div className="scanner-container">
              {escaneando ? (
            <>
            <div className="scanner-frame">
              <div className="laser-line"></div>
            </div>
            <p>Posicione o código de barras...</p>
          </>
        ) : (
          <div className="scanner-success">
            <div className="success-icon">📄</div>
            <p>Boleto Detectado!</p>
            <strong>Energia Elétrica - R$ 124,90</strong>
            <button className="btn-confirm-pix" onClick={() => {
              alert("Pagamento realizado!");
              setModalPagarAberto(false);
            }}>
              Pagar Agora
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)}
          {modalInvestirAberto && (
          <div className="modal-overlay" onClick={() => setModalInvestirAberto(false)}>
            <div className="modal-content animate-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Seu Rendimento</h3>
                <button className="btn-close" onClick={() => setModalInvestirAberto(false)}>✕</button>
              </div>

              <div className="investir-body">
              <div className="rendimento-hoje">
                <span>Rendeu hoje</span>
                <strong className="green">+ R$ 0,42</strong>
              </div>

        {/* Mini Gráfico em SVG */}
        <div className="chart-container">
          <svg viewBox="0 0 100 40" className="chart-svg">
            <path 
              d="M0 40 L10 35 L30 38 L50 20 L70 25 L100 5" 
              fill="none" 
              stroke="#48bb78" 
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="investir-info">
          <p>Seu dinheiro está rendendo <strong>105% do CDI</strong></p>
          <button className="btn-confirm-pix" style={{marginTop: '15px'}}>
            Investir mais
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}