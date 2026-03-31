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

  const [abaAtiva, setAbaAtiva] = useState('inicio');

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

  useEffect(() => {
  const algumModalAberto = modalPixAberto || modalTransferirAberto || modalPagarAberto || modalInvestirAberto || modalSucessoAberto;
  
  if (algumModalAberto) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
}, [modalPixAberto, modalTransferirAberto, modalPagarAberto, modalInvestirAberto, modalSucessoAberto]);

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
  
  {/* --- TELA DE INÍCIO --- */}
  {abaAtiva === 'inicio' && (
    <div className="animate-card">
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
        <button className="action-item" onClick={() => {setModalPagarAberto(true); setEscaneando(true); setTimeout(() => setEscaneando(false), 3000);}}>
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
          <input 
            type="text" 
            placeholder="Para quem?" 
            value={nomeDestinatario} 
            onChange={(e) => setNomeDestinatario(e.target.value)}
            className="input-transferencia"
          />
          <div className="transfer-input-valor-group"> 
            <input 
              type="number" 
              placeholder="R$ 0,00"
              value={valorTransferencia}
              onChange={(e) => setValorTransferencia(e.target.value)}
              className="input-valor"
            />
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
    </div>
  )}

  {/* --- TELA DE EXTRATO --- */}
  {abaAtiva === 'extrato' && (
    <div className="tab-content animate-card">
      <h3 style={{ marginBottom: '20px' }}>Extrato Detalhado</h3>
      {/* Reutilizando sua lista de transações para o extrato não ficar vazio */}
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
              <span className={`t-value ${t.tipo}`}>
                {t.tipo === 'neg' ? '-' : '+'} R$ {t.valor.toFixed(2)}
              </span>
            </div>
          ))}
      </div>
    </div>
  )}

  {/* --- TELA DE CARTÕES --- */}
  {abaAtiva === 'cartoes' && (
    <div className="tab-content animate-card">
      <h3>Meus Cartões</h3>
      <div className="credit-card-mockup">
         <div className="card-chip"></div>
         <strong style={{fontSize: '18px'}}>{usuarioLogado?.name}</strong>
         <span style={{letterSpacing: '2px'}}>**** **** **** 5678</span>
      </div>
      <p style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>Cartão virtual ativo</p>
    </div>
  )}

  {/* --- TELA DE PERFIL  --- */}
  {abaAtiva === 'perfil' && (
    <div className="tab-content animate-card">
      {/* Foto/Avatar Centralizado */}
    <div className="user-avatar" style={{width: '80px', height: '80px', fontSize: '30px', margin: '0 auto 15px', backgroundColor: '#004d4d', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%'}}>
      {usuarioLogado?.name?.charAt(0)}
    </div>
    
    <h3 style={{ marginBottom: '5px' }}>{usuarioLogado?.name}</h3>
    <p style={{color: '#666', marginBottom: '30px'}}>Desenvolvedora ADS</p>
    
    {/* Container de Informações com Alinhamento Profissional */}
    <div className="profile-info-container" style={{ width: '100%' }}>
      
      <div className="profile-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee' }}>
        <strong style={{ color: '#004d4d' }}>E-mail</strong>
        <span style={{ color: '#666' }}>{usuarioLogado?.email || 'karen.dev@exemplo.com'}</span>
      </div>

      <div className="profile-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee' }}>
        <strong style={{ color: '#004d4d' }}>Conta</strong>
        <span style={{ color: '#666' }}>12345-6</span>
      </div>

      <div className="profile-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee' }}>
        <strong style={{ color: '#004d4d' }}>Agência</strong>
        <span style={{ color: '#666' }}>0001</span>
      </div>

      <div className="profile-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee' }}>
        <strong style={{ color: '#004d4d' }}>Tipo</strong>
        <span style={{ color: '#666' }}>Corrente</span>
      </div>
      
    </div>

    {/* Botão de Sair com destaque */}
    <button 
      className="btn-logout" 
      style={{
        marginTop: '40px', 
        width: '100%', 
        padding: '14px', 
        borderRadius: '15px', 
        backgroundColor: '#fff1f1', 
        color: '#e53e3e', 
        border: '1px solid #fed7d7',
        fontWeight: 'bold',
        cursor: 'pointer'
      }} 
      onClick={() => { realizarLogout(); navigate('/'); }}
    >
      Sair da Conta
    </button>
  </div>
)}

</main>

      {modalPixAberto && (
        <div className="modal-overlay" onClick={() => setModalPixAberto(false)}>
          {/* ADICIONE o onClick com stopPropagation aqui no modal-content: */}
          <div className="modal-content animate-card" onClick={(e) => e.stopPropagation()}>
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
    /* Ao clicar no fundo escuro, o modal fecha */
    <div className="modal-overlay" onClick={() => setModalSucessoAberto(false)}>
      <div className="modal-content animate-card success-modal" onClick={(e) => e.stopPropagation()}>
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
        <div 
          className={`nav-item ${abaAtiva === 'inicio' ? 'active' : ''}`} 
          onClick={() => setAbaAtiva('inicio')}
        >
          <HomeIcon size={22} /> 
          <span>Início</span>
        </div>

        <div 
          className={`nav-item ${abaAtiva === 'extrato' ? 'active' : ''}`} 
          onClick={() => setAbaAtiva('extrato')}
        >
        <List size={22} />
        <span>Extrato</span>
        </div>
        <div 
          className={`nav-item ${abaAtiva === 'cartoes' ? 'active' : ''}`} 
          onClick={() => setAbaAtiva('cartoes')}
        >
          <CreditCard size={22} />
          <span>Cartões</span>
        </div>

        <div 
          className={`nav-item ${abaAtiva === 'perfil' ? 'active' : ''}`} 
          onClick={() => setAbaAtiva('perfil')}
        >
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
        <div className="modal-overlay" onClick={() => setModalPagarAberto(false)}>
          <div className="modal-content animate-card scanner-modal" onClick={(e) => e.stopPropagation()}>
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