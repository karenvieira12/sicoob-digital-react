import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Usando o Hook (Ponto 4 do prof)
import './login.css'; 

export default function Login() {
  const navigate = useNavigate();
  const { realizarLogin } = useAuth(); 
  
  const [carregando, setCarregando] = useState(false);
  
  // Criamos estados para capturar o que é digitado (Necessário para a lógica)
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function handleLogin() {
    // 1. Impedir login vazio (Regra de negócio básica)
    if (!email || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    setCarregando(true);
    
    // 2. Tentar realizar o login (Lógica de erro/sucesso do Ponto 1)
    const resultado = await realizarLogin(email, senha);
    
    if (resultado.success) {
      navigate('/home');
    } else {
      // Exibe o erro de senha errada ou servidor offline
      alert(resultado.message); 
    }
    
    setCarregando(false);
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-content">
          <div className="fake-logo">
            <div className="fake-logo-icon"></div>
            Sicoob Digital
          </div>
          <h1>Bem-vinda ao seu <br /> <strong>Banco Digital</strong></h1>
          <p>Gerencie suas finanças com segurança e agilidade.</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-box">
          <h2>Olá, Karen! 👋</h2>
          <p className="subtitle">Digite suas credenciais para acessar.</p>
          
          <div className="input-group">
            <label>E-mail</label>
            <input 
              type="text" 
              placeholder="Digite seu e-mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Captura o texto
            />
          </div>

          <div className="input-group">
            <label>Sua Senha</label>
            <input 
              type="password" 
              placeholder="Digite sua senha" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)} // Captura a senha
            />
          </div>
          
          <button 
            className="login-btn-premium" 
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