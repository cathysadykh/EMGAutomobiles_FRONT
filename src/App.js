// App.js
import React, { useState, useEffect } from 'react';
import { Car, User, LogOut, Edit, Trash2, PlusCircle } from 'lucide-react';
import './App.css';

const App = () => {
  const ADMIN_USER = {
    username: 'admin',
    password: 'admin123'
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [voitures, setVoitures] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    fetchVoitures();
  }, []);

  const fetchVoitures = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/Voiture');
      const data = await response.json();
      setVoitures(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username === ADMIN_USER.username && 
        credentials.password === ADMIN_USER.password) {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setLoginError('');
    } else {
      setLoginError('Identifiants incorrects');
    }
  };

  const AdminSection = () => (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <Car size={32} color="#2563eb" />
            <h1 className="logo-text">EMG Automobiles - Admin</h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="login-button">
              <PlusCircle size={20} />
              Ajouter une voiture
            </button>
            <button className="login-button" onClick={() => setIsAuthenticated(false)}>
              <LogOut size={20} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="cars-grid">
          {voitures.map((voiture) => (
            <div key={voiture.id} className="car-card">
              <img
                src={voiture.urlImage || '/api/placeholder/400/200'}
                alt={`${voiture.marque?.nom} ${voiture.modele?.nom}`}
                className="car-image"
              />
              <div className="car-info">
                <h2 className="car-title">
                  {`${voiture.marque?.nom} ${voiture.modele?.nom}`}
                </h2>
                <p>Année: {voiture.annee}</p>
                <p className="car-price">
                  {new Intl.NumberFormat('fr-FR', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  }).format(voiture.prix)}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`car-status ${voiture.estDisponible ? 'status-available' : 'status-sold'}`}>
                    {voiture.estDisponible ? 'Disponible' : 'Vendu'}
                  </span>
                  <div className="admin-actions">
                    <button className="admin-button edit-button">
                      <Edit size={20} />
                    </button>
                    <button className="admin-button delete-button">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );

  const PublicPortal = () => (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <Car size={32} color="#2563eb" />
            <h1 className="logo-text">EMG Automobiles</h1>
          </div>
          <button className="login-button" onClick={() => setShowLoginModal(true)}>
            <User size={20} />
            Connexion Admin
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="cars-grid">
          {voitures.map((voiture) => (
            <div key={voiture.id} className="car-card">
              <img
                src={voiture.urlImage || '/api/placeholder/400/200'}
                alt={`${voiture.marque?.nom} ${voiture.modele?.nom}`}
                className="car-image"
              />
              <div className="car-info">
                <h2 className="car-title">
                  {`${voiture.marque?.nom} ${voiture.modele?.nom}`}
                </h2>
                <p>Année: {voiture.annee}</p>
                <p className="car-price">
                  {new Intl.NumberFormat('fr-FR', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  }).format(voiture.prix)}
                </p>
                <span className={`car-status ${voiture.estDisponible ? 'status-available' : 'status-sold'}`}>
                  {voiture.estDisponible ? 'Disponible' : 'Vendu'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );

  const LoginModal = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="car-title">Connexion Admin</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Nom d'utilisateur</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="form-input"
              required
            />
          </div>
          {loginError && (
            <div className="error-message">{loginError}</div>
          )}
          <div className="button-container">
            <button
              type="button"
              onClick={() => {
                setShowLoginModal(false);
                setLoginError('');
                setCredentials({ username: '', password: '' });
              }}
              className="button-secondary"
            >
              Annuler
            </button>
            <button type="submit" className="button-primary">
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {isAuthenticated ? <AdminSection /> : <PublicPortal />}
      {showLoginModal && <LoginModal />}
    </>
  );
};

export default App;