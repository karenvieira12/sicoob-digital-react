import { useEffect, useState } from 'react';
import api from './services/api';

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Vamos buscar o usuário com ID 1 lá no db.json
    api.get('/usuarios/1')
      .then((response) => {
        setUsuario(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
      });
  }, []);

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>{usuario ? `Olá, ${usuario.nome}!` : 'Carregando...'}</h1>
      
      {usuario && (
        <div style={{ 
          background: '#f0f0f0', 
          padding: '20px', 
          borderRadius: '15px',
          display: 'inline-block' 
        }}>
          <p>Seu saldo bancário atual é:</p>
          <h2 style={{ color: '#2ecc71' }}>R$ {usuario.saldo.toFixed(2)}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
