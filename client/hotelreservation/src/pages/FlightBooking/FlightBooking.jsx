import Select from '../../components/common/Select/Select';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlane, FaInfoCircle, FaUserPlus, FaMinus, FaPlus } from 'react-icons/fa';
import { applyCouponCode, createBooking } from '../../api/client';
import { getAuthToken } from '../../api/auth';
import './FlightBooking.css';

const FlightBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state?.flight || {
    airline: 'AZAL',
    flightNumber: 'J2-5620',
    departTime: '14:50',
    departDate: 'Baz, 25 Yan 2026',
    departLocation: 'GYD - Terminal 1',
    departCity: 'Bakı, Azərbaycan',
    arriveTime: '17:35',
    arriveDate: 'Baz, 25 Yan 2026',
    arriveLocation: 'IST - Terminal 1',
    arriveCity: 'İstanbul, Türkiyə',
    duration: '2s 45dəq',
    stops: 'Birbaşa',
    price: 180,
    class: 'Ekonom',
    refundable: true
  };

  const [passengers, setPassengers] = useState([
    {
      id: 1,
      title: 'Mr',
      firstName: '',
      lastName: '',
      dateOfBirth: { date: '', month: '', year: '' },
      nationality: '',
      passportNumber: '',
      passportCountry: '',
      passportExpiry: ''
    }
  ]);

  const [contactInfo, setContactInfo] = useState({
    mobile: '',
    email: ''
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponBusy, setCouponBusy] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const baseFare = (Number(flight.price) || 0) * passengers.length;
  const totalFare = Math.max(0, Math.round((baseFare - discount) * 100) / 100);

  const addPassenger = () => {
    setPassengers([...passengers, {
      id: passengers.length + 1,
      title: 'Mr',
      firstName: '',
      lastName: '',
      dateOfBirth: { date: '', month: '', year: '' },
      nationality: '',
      passportNumber: '',
      passportCountry: '',
      passportExpiry: ''
    }]);
  };

  const removePassenger = (id) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter(p => p.id !== id));
    }
  };

  const updatePassenger = (id, field, value) => {
    setPassengers(passengers.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const updatePassengerDOB = (id, field, value) => {
    setPassengers(passengers.map(p => 
      p.id === id ? { ...p, dateOfBirth: { ...p.dateOfBirth, [field]: value } } : p
    ));
  };

  const applyCoupon = () => {
    const code = couponCode.trim();
    if (!code || couponBusy) return;
    setCouponBusy(true);
    setCouponError('');
    applyCouponCode(code)
      .then((rule) => {
        const percent = Number(rule.percent) || 0;
        const amount = Number(rule.amount) || 0;
        const off = percent > 0 ? baseFare * (percent / 100) : Math.min(amount, baseFare);
        setDiscount(off);
        const nextCode = rule.code || code.toUpperCase();
        setCouponCode(nextCode);
        setAppliedCode(nextCode);
      })
      .catch((error) => {
        setDiscount(0);
        setAppliedCode('');
        setCouponError(error.message || 'Kupon kodu keçərsizdir.');
      })
      .finally(() => setCouponBusy(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!flight?.id) {
      setFormError('Uçuş seçilməyib. Siyahıdan uçuş seçib yenidən cəhd edin.');
      return;
    }
    if (!getAuthToken()) {
      navigate('/login');
      return;
    }

    // Validate lead passenger
    const lead = passengers[0] || {};
    const guestName = `${lead.firstName || ''} ${lead.lastName || ''}`.trim();
    if (!guestName) {
      setFormError('Sərnişinin adını yazın.');
      return;
    }
    
    // Validate all passengers have required info
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.firstName || !p.lastName) {
        setFormError(`Sərnişin ${i + 1}: Ad və soyad tələb olunur.`);
        return;
      }
      if (!p.dateOfBirth.date || !p.dateOfBirth.month || !p.dateOfBirth.year) {
        setFormError(`Sərnişin ${i + 1}: Doğum tarixi tələb olunur.`);
        return;
      }
      if (!p.nationality) {
        setFormError(`Sərnişin ${i + 1}: Milliyyət tələb olunur.`);
        return;
      }
      // Passport fields - NOTE: Backend may not support these yet
      if (!p.passportNumber) {
        setFormError(`Sərnişin ${i + 1}: Pasport nömrəsi tələb olunur.`);
        return;
      }
      if (!p.passportCountry) {
        setFormError(`Sərnişin ${i + 1}: Pasport ölkəsi tələb olunur.`);
        return;
      }
      if (!p.passportExpiry) {
        setFormError(`Sərnişin ${i + 1}: Pasportun bitmə tarixi tələb olunur.`);
        return;
      }
      
      // Validate passport not expired
      const expiryDate = new Date(p.passportExpiry);
      if (expiryDate < new Date()) {
        setFormError(`Sərnişin ${i + 1}: Pasportun müddəti bitib.`);
        return;
      }
    }
    
    // Validate contact info
    if (!contactInfo.email || !/\S+@\S+\.\S+/.test(contactInfo.email)) {
      setFormError('Düzgün email ünvanı yazın.');
      return;
    }
    if (!contactInfo.mobile) {
      setFormError('Mobil nömrə tələb olunur.');
      return;
    }

    // Validate card details - demo payment
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 16) {
      setFormError('Kart nömrəsi 16 rəqəm olmalıdır.');
      return;
    }
    if (!cardName.trim()) {
      setFormError('Kart sahibinin adını yazın.');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setFormError('Bitmə tarixini AA/İİ formatında yazın.');
      return;
    }
    // Demo payment - CVV optional but validate format if provided
    if (cvv && cvv.length > 0 && cvv.length < 3) {
      setFormError('CVV 3 rəqəm olmalıdır.');
      return;
    }

    // Check available seats
    if (flight.seatsAvailable && passengers.length > flight.seatsAvailable) {
      setFormError(`Yalnız ${flight.seatsAvailable} boş yer var.`);
      return;
    }

    setSubmitting(true);
    try {
      const booking = await createBooking({
        bookingType: 'flight',
        flightId: flight.id,
        guests: passengers.length,
        guestName,
        guestEmail: contactInfo.email,
        guestPhone: contactInfo.mobile,
        paymentMethod: 'card',
        cardNumber: digits,
        cardHolder: cardName.trim(),
        couponCode: appliedCode || undefined,
        // NOTE: Backend may not support passenger details yet - sending for future compatibility
        passengers: passengers.map(p => ({
          title: p.title,
          firstName: p.firstName,
          lastName: p.lastName,
          dateOfBirth: `${p.dateOfBirth.year}-${String(p.dateOfBirth.month).padStart(2, '0')}-${String(p.dateOfBirth.date).padStart(2, '0')}`,
          nationality: p.nationality,
          passportNumber: p.passportNumber,
          passportCountry: p.passportCountry,
          passportExpiry: p.passportExpiry
        }))
      });
      navigate('/booking-success', { state: { booking } });
    } catch (error) {
      setFormError(error.message || 'Rezervasiya alınmadı.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flight-booking-page">
      <div className="booking-container">
        <div className="booking-layout">
          {/* Main Content */}
          <main className="booking-main">
            {/* Flight Summary */}
            <section className="flight-summary-section">
              <div className="flight-route-header">
                <FaPlane className="route-icon" />
                <h1 className="route-title">
                  {flight.departCity.split(',')[0]} ({flight.departLocation.split(' -')[0]}) 
                  → 
                  {flight.arriveCity.split(',')[0]} ({flight.arriveLocation.split(' -')[0]})
                </h1>
              </div>
              <div className="route-meta">
                <span>{flight.departDate}</span>
                <span>•</span>
                <span>{flight.stops}</span>
                <span>•</span>
                <span>{flight.duration}</span>
              </div>

              <div className="flight-class-badge">
                Səyahət Sinfi: {flight.class}
              </div>

              {/* Flight Details */}
              <div className="flight-legs">
                <div className="flight-leg">
                  <div className="airline-header">
                    <div className="airline-badge">✈️</div>
                    <div>
                      <div className="airline-name">{flight.airline}</div>
                      <div className="flight-number">{flight.flightNumber}</div>
                    </div>
                  </div>

                  <div className="flight-timeline">
                    <div className="timeline-point">
                      <div className="timeline-time">{flight.departTime}</div>
                      <div className="timeline-date">{flight.departDate}</div>
                      <div className="timeline-location">{flight.departLocation}</div>
                      <div className="timeline-city">{flight.departCity}</div>
                    </div>

                    <div className="timeline-connector">
                      <div className="connector-line"></div>
                      <div className="connector-duration">{flight.duration}</div>
                    </div>

                    <div className="timeline-point">
                      <div className="timeline-time">{flight.arriveTime}</div>
                      <div className="timeline-date">{flight.arriveDate}</div>
                      <div className="timeline-location">{flight.arriveLocation}</div>
                      <div className="timeline-city">{flight.arriveCity}</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Important Information */}
            <section className="info-section">
              <h2 className="section-title">
                <FaInfoCircle /> Vacib Məlumat
              </h2>
              
              <div className="info-alert">
                <div className="alert-icon">→</div>
                <div className="alert-content">
                  <h3>ABŞ-a səyahət edən sərnişinlər üçün qeyd</h3>
                  <ul>
                    <li>Səyahət edə bilənlər: Tam peyvənd olunan sərnişinlər ölkəyə daxil olmağa icazə verilir</li>
                    <li>Təyinat məhdudiyyətləri: Hindistandan vaksinasiya olunmayan sərnişinlər daxil ola bilməz</li>
                    <li>Özünüizolyasiya tələb oluna bilər</li>
                  </ul>
                </div>
              </div>

              <div className="info-alert">
                <div className="alert-icon">→</div>
                <div className="alert-content">
                  <h3>Qaydalar haqqında qeyd</h3>
                  <p>
                    Biz sizə ən son məlumatı təqdim etmək üçün əlimizdən gələni edirik, lakin 
                    cari hadisələrin sürətlə dəyişən xarakteri səbəbindən, bəzən bu mümkün olmaya bilər. 
                    Rezervasiya və ya səyahətə başlamazdan əvvəl bütün qaydalar ilə tanış olun.
                  </p>
                </div>
              </div>
            </section>

            {/* Traveler Details */}
            <section className="travelers-section">
              <div className="section-header">
                <h2 className="section-title">Sərnişin Məlumatları</h2>
                <button type="button" className="btn-add-passenger" onClick={addPassenger}>
                  <FaUserPlus /> Yeni Sərnişin
                </button>
              </div>

              <div className="info-notice">
                <span className="notice-badge">New</span>
                Pasport məlumatlarınızı dəqiq daxil edin
              </div>

              <form onSubmit={handleSubmit} className="travelers-form">
                {passengers.map((passenger, index) => (
                  <div key={passenger.id} className="traveler-card">
                    <div className="traveler-card-header">
                      <h3>Sərnişin {index + 1}</h3>
                      {passengers.length > 1 && (
                        <button 
                          type="button" 
                          className="btn-remove-passenger"
                          onClick={() => removePassenger(passenger.id)}
                        >
                          <FaMinus />
                        </button>
                      )}
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Başlıq</label>
                        <Select 
                          value={passenger.title}
                          onChange={(e) => updatePassenger(passenger.id, 'title', e.target.value)}
                          required
                        >
                          <option value="Mr">Kişi</option>
                          <option value="Mrs">Qadın</option>
                        </Select>
                      </div>

                      <div className="form-group span-2">
                        <label>Tam Ad</label>
                        <div className="name-inputs">
                          <input
                            type="text"
                            placeholder="Ad"
                            value={passenger.firstName}
                            onChange={(e) => updatePassenger(passenger.id, 'firstName', e.target.value)}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Soyad"
                            value={passenger.lastName}
                            onChange={(e) => updatePassenger(passenger.id, 'lastName', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group span-2">
                        <label>Doğum Tarixi</label>
                        <div className="date-inputs">
                          <Select
                            value={passenger.dateOfBirth.date}
                            onChange={(e) => updatePassengerDOB(passenger.id, 'date', e.target.value)}
                            required
                          >
                            <option value="">Gün</option>
                            {[...Array(31)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                          </Select>
                          <Select
                            value={passenger.dateOfBirth.month}
                            onChange={(e) => updatePassengerDOB(passenger.id, 'month', e.target.value)}
                            required
                          >
                            <option value="">Ay</option>
                            {['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn', 'İyl', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'].map((m, i) => (
                              <option key={i} value={i + 1}>{m}</option>
                            ))}
                          </Select>
                          <Select
                            value={passenger.dateOfBirth.year}
                            onChange={(e) => updatePassengerDOB(passenger.id, 'year', e.target.value)}
                            required
                          >
                            <option value="">İl</option>
                            {[...Array(100)].map((_, i) => {
                              const year = new Date().getFullYear() - i;
                              return <option key={year} value={year}>{year}</option>;
                            })}
                          </Select>
                        </div>
                      </div>

                      <div className="form-group span-2">
                        <label>Milliyyət</label>
                        <Select
                          value={passenger.nationality}
                          onChange={(e) => updatePassenger(passenger.id, 'nationality', e.target.value)}
                          required
                        >
                          <option value="">Milliyyəti seçin</option>
                          <option value="AZ">Azərbaycan</option>
                          <option value="TR">Türkiyə</option>
                          <option value="US">ABŞ</option>
                          <option value="GB">Böyük Britaniya</option>
                          <option value="FR">Fransa</option>
                          <option value="DE">Almaniya</option>
                          <option value="RU">Rusiya</option>
                        </Select>
                      </div>

                      <div className="form-group">
                        <label>Pasport Nömrəsi</label>
                        <input
                          type="text"
                          placeholder="Pasport nömrəsi"
                          value={passenger.passportNumber}
                          onChange={(e) => updatePassenger(passenger.id, 'passportNumber', e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Pasport Ölkəsi</label>
                        <Select
                          value={passenger.passportCountry}
                          onChange={(e) => updatePassenger(passenger.id, 'passportCountry', e.target.value)}
                          required
                        >
                          <option value="">Ölkə seçin</option>
                          <option value="AZ">Azərbaycan</option>
                          <option value="TR">Türkiyə</option>
                          <option value="US">ABŞ</option>
                        </Select>
                      </div>

                      <div className="form-group">
                        <label>Pasportun Bitmə Tarixi</label>
                        <input
                          type="date"
                          value={passenger.passportExpiry}
                          onChange={(e) => updatePassenger(passenger.id, 'passportExpiry', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Contact Information */}
                <div className="contact-section">
                  <h3 className="subsection-title">Rezervasiya detalları göndəriləcək</h3>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Mobil Nömrə</label>
                      <input
                        type="tel"
                        placeholder="+994 XX XXX XX XX"
                        value={contactInfo.mobile}
                        onChange={(e) => setContactInfo({ ...contactInfo, mobile: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Email Ünvanı</label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="contact-section">
                  <h3 className="subsection-title">Kart məlumatları</h3>
                  <div className="form-grid">
                    <div className="form-group span-2">
                      <label>Kart nömrəsi</label>
                      <input
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="•••• •••• •••• ••••"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/[^\d ]/g, '').slice(0, 19))}
                        required
                      />
                    </div>
                    <div className="form-group span-2">
                      <label>Kart sahibinin adı</label>
                      <input
                        autoComplete="cc-name"
                        placeholder="Ad Soyad"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Bitmə tarixi</label>
                      <input
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="AA/İİ"
                        value={expiry}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                          setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
                        }}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        required
                      />
                    </div>
                  </div>
                </div>

                {formError && <p className="coupon-error">{formError}</p>}
                <button type="submit" className="btn-proceed-payment" disabled={submitting}>
                  {submitting ? 'Ödənilir...' : `₼${totalFare} ödə`}
                </button>
              </form>
            </section>
          </main>

          {/* Sidebar - Fare Summary */}
          <aside className="fare-sidebar">
            <div className="fare-card">
              <h3 className="fare-title">Ödəniş Xülasəsi</h3>

              <div className="fare-breakdown">
                <div className="fare-item">
                  <span className="fare-label">
                    Əsas Tarif <FaInfoCircle />
                  </span>
                  <span className="fare-value">₼{baseFare}</span>
                </div>

                {discount > 0 && (
                  <div className="fare-item discount">
                    <span className="fare-label">Endirim</span>
                    <span className="fare-value">−₼{discount.toFixed(0)}</span>
                  </div>
                )}

                <div className="fare-total">
                  <span className="total-label">Cəmi</span>
                  <span className="total-value">₼{totalFare}</span>
                </div>
              </div>

              <div className="coupon-section">
                <h4>Endirim Kuponu</h4>
                <div className="coupon-input-group">
                  <input
                    type="text"
                    placeholder="Kupon kodu"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError('');
                      setDiscount(0);
                      setAppliedCode('');
                    }}
                  />
                  <button type="button" onClick={applyCoupon} className="btn-apply-coupon" disabled={couponBusy}>
                    {couponBusy ? '...' : 'Tətbiq et'}
                  </button>
                </div>
                {couponError && <p className="coupon-error">{couponError}</p>}
              </div>

              <div className="cancellation-info">
                <h4>Ləğvetmə və Dəyişiklik</h4>
                <p className={`refund-status ${flight.refundable ? 'refundable' : 'non-refundable'}`}>
                  {flight.refundable ? 'Geri qaytarıla bilər' : 'Geri qaytarılmır'}
                </p>
                <p className="cancellation-text">
                  Bu rezervasiyanın ləğvi cəriməsi gediş tarixinə nə qədər yaxın olmasından asılıdır.
                </p>
                <button className="btn-view-rules">Ətraflı</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default FlightBooking;
