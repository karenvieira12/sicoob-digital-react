import { useEffect, useState } from 'react'; 
import { useAuth } from '../../hooks/useAuth'; 
import { useNavigate } from 'react-router-dom';
import './home.css';

export default function Home() {
  const { usuarioLogado, realizarLogout } = useAuth();
  const navigate = useNavigate();
  const [mostrarSaldo, setMostrarSaldo] = useState(false);
  const [valorTransferencia, setValorTransferencia] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCarregando(false);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  function realizarTransferencia() {
    const valor = parseFloat(valorTransferencia);
    if (!valor || valor <= 0) return alert("❌ Digite um valor válido!");
    if (valor > usuarioLogado.balance) return alert("❌ Saldo insuficiente!");
    
    alert(`✅ Sucesso! R$ ${valor.toFixed(2)} transferidos.`);
    setValorTransferencia('');
  }

  // --- 🔴 NOVO: VERIFICAÇÃO DE ERRO/OFFLINE (Ponto 1 do Prof) ---
  if (!carregando && !usuarioLogado?.name) {
    return (
      <div className="home-container" style={{ textAlign: 'center', padding: '50px' }}>
        <h1>⚠️ Erro ao carregar dados</h1>
        <p>O servidor está offline ou sua sessão expirou.</p>
        <button 
          onClick={() => navigate('/')} 
          className="login-btn-premium" 
          style={{ width: '200px', marginTop: '20px' }}
        >
          Voltar para o Login
        </button>
      </div>
    );
  }

  if (!usuarioLogado) return <h1>Acesso Negado</h1>;

  return (
    <div className="home-container">
      {/* O resto do seu return continua EXATAMENTE igual ao que você já tem */}
      <header className="home-header">
        <div className="user-info">
          <div className="user-avatar">{usuarioLogado?.name?.charAt(0)}
          </div>
          <span>Olá, <strong>{usuarioLogado.name}</strong></span>
        </div>
        <button className="btn-logout" onClick={() => { realizarLogout(); navigate('/'); }}>Sair</button>
      </header>

      <main className="home-content">
        <div className="balance-card">
          <div className="balance-header">
            <p>Saldo disponível</p>
            <button className="btn-eye" onClick={() => setMostrarSaldo(!mostrarSaldo)}>
              {mostrarSaldo ? '👁️' : '🙈'}
            </button>
          </div>

          {carregando ? (
            <div className="skeleton-container">
              <div className="skeleton skeleton-title"></div>
            </div>
          ) : (
            <h2 className={`balance-value ${!mostrarSaldo ? 'balance-hidden' : ''}`}>
              R$ {Number(usuarioLogado.balance).toFixed(2)}
            </h2>
          )}
        </div>

        <section className="transfer-area" style={{ marginTop: '30px', background: 'white', padding: '20px', borderRadius: '15px' }}>
          <h3>Simular Transferência (Pix)</h3>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <input 
              type="number" 
              placeholder="R$ 0,00"
              value={valorTransferencia}
              onChange={(e) => setValorTransferencia(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', flex: 1 }}
            />
            <button 
              onClick={realizarTransferencia}
              style={{ backgroundColor: '#00ae9d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Transferir
            </button>
          </div>
        </section>

        <div className="actions-grid">
          <div className="action-item"><span className="action-icon">💸</span>Pix</div>
          <div className="action-item"><span className="action-icon">📄</span>Pagar</div>
          <div className="action-item"><span className="action-icon">📲</span>Transferir</div>
          <div className="action-item"><span className="action-icon">📊</span>Investir</div>
        </div>

        <section className="recent-activity">
          <h3>Atividade Recente</h3>
          {carregando ? (
            <div className="skeleton skeleton-activity" style={{ width: '100%', height: '100px', marginTop: '10px' }}></div>
          ) : (
            <>
              <div className="transaction-item">
                <div className="transaction-info">
                  <span className="transaction-name">Padaria Central</span>
                  <span className="transaction-date">Hoje, 08:30</span>
                </div>
                <span className={`transaction-value value-negative ${!mostrarSaldo ? 'balance-hidden' : ''}`}>- R$ 15,90</span>
              </div>
              <div className="transaction-item">
                <div className="transaction-info">
                  <span className="transaction-name">Transferência Recebida</span>
                  <span className="transaction-date">Ontem, 14:20</span>
                </div>
                <span className={`transaction-value value-positive ${!mostrarSaldo ? 'balance-hidden' : ''}`}>+ R$ 250,00</span>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

