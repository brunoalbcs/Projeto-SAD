import { useState, useRef } from 'react'
import { PAGES } from '../constants/pages'

export default function UploadPage({ onNavigate, onAddLaudos }) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    setSelectedFiles((prev) => [...prev, ...files])
    // TODO: Integrar com backend - enviar arquivos
    // uploadFiles(files)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    setSelectedFiles((prev) => [...prev, ...files])
    // TODO: Integrar com backend - enviar arquivos
    // uploadFiles(files)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUploadSubmit = () => {
    if (selectedFiles.length > 0) {
      // TODO: Integrar com backend - enviar arquivos
      // uploadFiles(selectedFiles)
      // Processar arquivos e criar laudos
      const novosLaudos = selectedFiles.map((file, index) => {
        // Gerar dados mockados para cada arquivo
        // Em produção, isso viria do backend após processar o arquivo
        const total = Math.floor(Math.random() * 20) + 20 // 20-40 campos
        const extraidos = Math.floor(Math.random() * total) + 1
        const confiabilidade = Math.floor((extraidos / total) * 100)
        
        let acao = 'Prosseguir'
        let descartado = false
        
        if (confiabilidade < 20) {
          acao = 'Descartado'
          descartado = true
        } else if (confiabilidade < 50) {
          acao = 'Revisar Campos'
        }
        
        return {
          id: Date.now() + index, // ID único baseado em timestamp
          nome: file.name,
          extraidos: extraidos,
          total: total,
          confiabilidade: confiabilidade,
          acao: acao,
          descartado: descartado,
        }
      })
      
      // Adicionar os novos laudos ao estado compartilhado
      if (onAddLaudos) {
        onAddLaudos(novosLaudos)
      }
      
      console.log('Arquivos selecionados:', selectedFiles)
      console.log('Laudos criados:', novosLaudos)
      
      // Limpar arquivos selecionados
      setSelectedFiles([])
      
      // Navegar para a página de edição
      if (onNavigate) {
        onNavigate(PAGES.EDIT)
      }
    }
  }

  return (
    <main className="main-layout main-config">
      <section className="config-container">
        <header className="config-header">
          <h1>Upload dos documentos</h1>
          <p>
            Faça Upload de arquivos PDF para extrair automaticamente os dados dos laudos desejados.
          </p>
        </header>

        <section className="config-card upload-card">
          <div className="steps-bar">
            <div className="step step-active">
              <span className="step-number">1</span>
              <span className="step-label">Upload</span>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <span className="step-label">Edição</span>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <span className="step-label">Exportação</span>
            </div>
          </div>

          <div
            className="upload-area"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div className="upload-icon">⬆</div>
            <p>
              Arraste os arquivos aqui ou{' '}
              <button
                type="button"
                className="link-button upload-link"
                onClick={handleUploadClick}
              >
                clique para selecionar
              </button>
            </p>
            <span className="upload-subtitle">
              Formatos suportados: PDF, DOCx
            </span>
          </div>

          {selectedFiles.length > 0 && (
            <div className="uploaded-files-section">
              <h3 className="uploaded-files-title">Nomes dos arquivos</h3>
              <div className="uploaded-files-list">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="uploaded-file-item">
                    <div className="uploaded-file-checkmark">✓</div>
                    <span className="uploaded-file-name">{file.name}</span>
                    <button
                      type="button"
                      className="uploaded-file-clear"
                      onClick={() => handleRemoveFile(index)}
                    >
                      Limpar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div className="upload-submit-container">
              <button
                type="button"
                className="primary-button upload-submit-button"
                onClick={handleUploadSubmit}
              >
                Carregar Dados
              </button>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

