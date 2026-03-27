import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; 
import './login.css'; 
import { Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function Login() {
  // Estados 
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(false);

  // Funções e variáveis
  const navigate = useNavigate();
  const { realizarLogin } = useAuth(); 
  
  // 
  const formularioPreenchido = email.length > 0 && senha.length > 0;

  const toggleSenha = () => {
    setVerSenha(!verSenha); 
  }; 

  async function handleLogin() {
    if (!email || !senha) {
      setErro(true);
      setTimeout(() => setErro(false), 500);
      return;
    }

    setCarregando(true);
    const resultado = await realizarLogin(email, senha);
    
    if (resultado.success) {
      window.location.href = '/home';
    } else {
      setErro(true);
      setTimeout(() => setErro(false), 500);
    }
    
    setCarregando(false);
  }

  return (
    <div className="login-page">
    <div className="login-left">
      <div className="login-left-content animate-text">
        <div className="fake-logo">
          <div className="fake-logo-icon"></div>
          Sicoob Digital
          </div>
          <h1>Bem-vinda ao seu <br /> <strong>Banco Digital</strong></h1>
          <p>Gerencie suas finanças com segurança e agilidade.</p>
        </div>
      </div>

      <div className="login-right">
       <div className={`login-form-box animate-card ${erro ? 'shake-error' : ''}`}>
        <h2>Olá, Karen! <CheckCircle2 size={24} color="#00ae9d" style={{ verticalAlign: 'middle', marginLeft: '8px' }} /></h2>
        <p className="subtitle">Digite suas credenciais para acessar.</p>
          
          <div className="input-group">
            <label>E-mail</label>
            <div className="input-wrapper">
              <Mail className="icon" size={20} />
              <input 
                type="text" 
                placeholder="Digite seu e-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Sua Senha</label>
            <div className="input-wrapper">
              <Lock className="icon" size={20} />
              <input 
                type={verSenha ? "text" : "password"} 
                placeholder="Digite sua senha" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button 
                type="button" 
                className="btn-ver-senha" 
                onClick={toggleSenha}
              >
                {verSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            className={`login-btn-premium ${formularioPreenchido ? 'pulsar' : ''}`} 
            onClick={handleLogin}
            disabled={carregando}
          >
            {carregando ? 'CARREGANDO...' : 'Acessar Minha Conta'}
          </button>
        </div>
      </div>
    </div>
  );
}