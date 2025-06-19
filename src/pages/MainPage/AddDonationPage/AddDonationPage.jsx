import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './AddDonationPage.css'

const AddDonationPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [institution, setInstitution] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [amount, setAmount] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`http://localhost:3200/v1/institution/${id}`, {
          headers: { Authorization: token }
        })
        setInstitution(res.data.institution)
      } catch {
        setError('Error al cargar la institución')
      } finally {
        setLoading(false)
      }
    }
    fetchInstitution()
  }, [id])

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, '')
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2, 4)
    if (value.length > 5) value = value.slice(0, 5)
    setExpiry(value)
  }

  const luhnCheck = (num) => {
    let arr = (num + '')
      .split('')
      .reverse()
      .map(x => parseInt(x))
    let sum = 0
    for (let i = 0; i < arr.length; i++) {
      let val = arr[i]
      if (i % 2 !== 0) {
        val *= 2
        if (val > 9) val -= 9
      }
      sum += val
    }
    return sum % 10 === 0
  }

  const validateExpiry = (value) => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) return 'Ingrese una fecha válida MM/AA'
    const [monthStr, yearStr] = value.split('/')
    const month = parseInt(monthStr, 10)
    const year = parseInt('20' + yearStr, 10)
    const today = new Date()
    const expiryDate = new Date(year, month)
    if (expiryDate <= today) return 'La tarjeta está vencida'
    return null
  }

  const validate = () => {
    const newErrors = {}
    if (!amount || isNaN(amount) || Number(amount) <= 0) newErrors.amount = 'Ingrese un monto válido mayor a 0'
    if (!cardName.trim()) newErrors.cardName = 'El nombre en la tarjeta es obligatorio'
    if (!cardNumber || cardNumber.length !== 16 || !luhnCheck(cardNumber)) newErrors.cardNumber = 'Número de tarjeta inválido'
    const expiryError = validateExpiry(expiry)
    if (expiryError) newErrors.expiry = expiryError
    if (!cvv || !(cvv.length === 3 || cvv.length === 4)) newErrors.cvv = 'Ingrese un CVV válido de 3 o 4 dígitos'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      const token = localStorage.getItem('token')
      const maintenanceAmount = amount * 0.10
      const institutionAmount = amount - maintenanceAmount
      await axios.post('http://localhost:3200/v1/donation/add',
        { amount: Number(amount), maintenanceAmount, institutionAmount, institution: id },
        { headers: { Authorization: token } }
      )
      alert('Donación realizada con éxito')
      navigate(`/main/institution/${id}`)
    } catch {
      alert('Error al registrar la donación')
    }
  }

  if (loading) return <p className="loading">Cargando institución...</p>
  if (error) return <p className="error">{error}</p>

  return (
    <div className="donation-container">
      <h2 className="donation-title">Donar a {institution?.name}</h2>
      <p className="donation-description">{institution?.description}</p>
      <form onSubmit={handleSubmit} className="donation-form" noValidate>
        <div className="input-group">
          <label htmlFor="amount">Monto a donar</label>
          <input
            id="amount"
            type="number"
            min="1"
            step="any"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Ej: 100"
            required
            className={`input-field ${errors.amount ? 'input-error' : ''}`}
          />
          {errors.amount && <p className="error-message">{errors.amount}</p>}
        </div>
        <div className="input-group">
          <label htmlFor="cardName">Nombre en la tarjeta</label>
          <input
            id="cardName"
            type="text"
            value={cardName}
            onChange={e => setCardName(e.target.value)}
            placeholder="Como aparece en la tarjeta"
            required
            className={`input-field ${errors.cardName ? 'input-error' : ''}`}
            autoComplete="cc-name"
          />
          {errors.cardName && <p className="error-message">{errors.cardName}</p>}
        </div>
        <div className="input-group">
          <label htmlFor="cardNumber">Número de tarjeta</label>
          <input
            id="cardNumber"
            type="text"
            value={cardNumber}
            onChange={e => setCardNumber(e.target.value.replace(/\D/g, ''))}
            placeholder="1234 5678 9012 3456"
            maxLength={16}
            required
            className={`input-field ${errors.cardNumber ? 'input-error' : ''}`}
            autoComplete="cc-number"
            inputMode="numeric"
          />
          {errors.cardNumber && <p className="error-message">{errors.cardNumber}</p>}
        </div>
        <div className="inline-group">
          <div className="input-group half-width">
            <label htmlFor="expiry">Fecha de expiración (MM/AA)</label>
            <input
              id="expiry"
              type="text"
              value={expiry}
              onChange={handleExpiryChange}
              placeholder="MM/AA"
              maxLength={5}
              required
              className={`input-field ${errors.expiry ? 'input-error' : ''}`}
              autoComplete="cc-exp"
            />
            {errors.expiry && <p className="error-message">{errors.expiry}</p>}
          </div>
          <div className="input-group half-width">
            <label htmlFor="cvv">CVV</label>
            <input
              id="cvv"
              type="password"
              value={cvv}
              onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
              placeholder="123"
              maxLength={4}
              required
              className={`input-field ${errors.cvv ? 'input-error' : ''}`}
              autoComplete="cc-csc"
              inputMode="numeric"
            />
            {errors.cvv && <p className="error-message">{errors.cvv}</p>}
          </div>
        </div>
        <button type="submit" className="btn-donate" aria-label="Confirmar donación">Donar</button>
      </form>
    </div>
  )
}

export default AddDonationPage
