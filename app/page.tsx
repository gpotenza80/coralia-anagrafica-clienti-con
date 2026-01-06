'use client';

import { useState } from 'react';

export default function AnagraficaClienti() {
  const [clienti, setClienti] = useState([
    {
      id: 1,
      ragioneSociale: "Acme Corporation S.r.l.",
      partitaIva: "12345678901",
      email: "info@acme.it",
      telefono: "+39 02 1234567"
    },
    {
      id: 2,
      ragioneSociale: "Beta Solutions S.p.A.",
      partitaIva: "98765432109",
      email: "contatti@beta.it",
      telefono: "+39 06 9876543"
    }
  ]);

  const [formData, setFormData] = useState({
    ragioneSociale: "",
    partitaIva: "",
    email: "",
    telefono: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.ragioneSociale.trim()) {
      newErrors.ragioneSociale = "Ragione sociale è obbligatoria";
    }
    
    if (!formData.partitaIva.trim()) {
      newErrors.partitaIva = "Partita IVA è obbligatoria";
    } else if (!/^\d{11}$/.test(formData.partitaIva)) {
      newErrors.partitaIva = "Partita IVA deve essere di 11 cifre";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email è obbligatoria";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email non valida";
    }
    
    if (!formData.telefono.trim()) {
      newErrors.telefono = "Telefono è obbligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (editingId) {
      setClienti(prev => prev.map(cliente => 
        cliente.id === editingId 
          ? { ...cliente, ...formData }
          : cliente
      ));
      setEditingId(null);
    } else {
      const nuovoCliente = {
        id: Date.now(),
        ...formData
      };
      setClienti(prev => [...prev, nuovoCliente]);
    }

    resetForm();
  };

  const handleEdit = (cliente) => {
    setFormData({
      ragioneSociale: cliente.ragioneSociale,
      partitaIva: cliente.partitaIva,
      email: cliente.email,
      telefono: cliente.telefono
    });
    setEditingId(cliente.id);
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo cliente?")) {
      setClienti(prev => prev.filter(cliente => cliente.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      ragioneSociale: "",
      partitaIva: "",
      email: "",
      telefono: ""
    });
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  const handleNewClient = () => {
    resetForm();
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Anagrafica Clienti</h1>
                <p className="text-sm text-gray-600 mt-1">Gestisci i tuoi clienti</p>
              </div>
              <button
                onClick={handleNewClient}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Nuovo Cliente
              </button>
            </div>
          </div>

          {showForm && (
            <div className="px-6 py-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {editingId ? "Modifica Cliente" : "Nuovo Cliente"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ragione Sociale *
                    </label>
                    <input
                      type="text"
                      name="ragioneSociale"
                      value={formData.ragioneSociale}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.ragioneSociale ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Inserisci ragione sociale"
                    />
                    {errors.ragioneSociale && (
                      <p className="text-red-500 text-xs mt-1">{errors.ragioneSociale}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Partita IVA *
                    </label>
                    <input
                      type="text"
                      name="partitaIva"
                      value={formData.partitaIva}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.partitaIva ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="12345678901"
                      maxLength="11"
                    />
                    {errors.partitaIva && (
                      <p className="text-red-500 text-xs mt-1">{errors.partitaIva}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="email@esempio.it"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefono *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.telefono ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="+39 02 1234567"
                    />
                    {errors.telefono && (
                      <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingId ? "Aggiorna" : "Salva"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Annulla
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="px-6 py-6">
            {clienti.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun cliente</h3>
                <p className="text-gray-600 mb-4">Inizia aggiungendo il tuo primo cliente</p>
                <button
                  onClick={handleNewClient : null}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Aggiungi Cliente
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Ragione Sociale</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">P.IVA</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Telefono</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clienti.map((cliente) => (
                      <tr key={cliente.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{cliente.ragioneSociale}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{cliente.partitaIva}</td>
                        <td className="py-3 px-4 text-gray-600">{cliente.email}</td>
                        <td className="py-3 px-4 text-gray-600">{cliente.telefono}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(cliente)}
                              className="inline-flex items-center p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Modifica"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(cliente.id)}
                              className="inline-flex items-center p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                              title="Elimina"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7
}}}))))