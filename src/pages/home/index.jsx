import { useEffect, useState } from 'react'; 
import { useAuth } from '../../hooks/useAuth'; 
import { useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, LogOut, Send, 
  ArrowUpRight, ArrowDownLeft, 
  BarChart3, CreditCard, Wallet 
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
          <button className="action-item"><div className="icon-box"><CreditCard size={22}/></div>Pagar</button>
          <button className="action-item"><div className="icon-box"><ArrowUpRight size={22}/></div>Transferir</button>
          <button className="action-item"><div className="icon-box"><BarChart3 size={22}/></div>Investir</button>
        </div>

        <section className="transfer-card">
          <h3>Simular Transferência</h3>
          <div className="transfer-group">
            <input 
              type="number" 
              placeholder="R$ 0,00"
              value={valorTransferencia}
              onChange={(e) => setValorTransferencia(e.target.value)}
            />
            <button onClick={realizarTransferencia}>Enviar</button>
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
    </div>
  );
}