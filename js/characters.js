// ============================================
// CORRUPTO BROS — Personajes y Causas
// ============================================

const CHARACTERS = {
  milei: {
    id: 'milei',
    name: 'JAVIER MILEI',
    emoji: '🦁',
    title: 'El Peluca Atómico',
    causa: '⚡ Causa $LIBRA',
    color: '#ff8800',
    speed: 5,
    jumpForce: 16,
    specialPower: '🐕 CONAN FANTASMA',
    specialDesc: 'Invoca al espíritu de Conan que elimina fiscales',
    stats: { velocidad: 9, salto: 7, especial: 10 },
    lore: 'Promocionó $LIBRA el 14/02/25 y la cripto subió 1300% para luego colapsar. 7 llamadas con Novelli esa noche. "Actuó de buena fe." Clonó a su perro muerto por USD 50.000.',
    powerEmoji: '👻',
    powerColor: '#ff8800',
    deathQuotes: [
      '"Chau chau chau!" (mientras lo llevan esposado)',
      '"¡Son todos zurdos de m*erda!" (al fiscal)',
      '"Conan, ¡aparecete y salvame!" 🐕',
      '"¡Motosierra al Estado de Derecho!"',
    ],
    collectibleEmoji: '⛓️',
    collectibleName: 'LIBRA Coin',
    platformColor: '#ff8800',
  },

  karina: {
    id: 'karina',
    name: 'KARINA MILEI',
    emoji: '👸',
    title: 'El Jefe (Femenino)',
    causa: '💎 Causa $LIBRA',
    color: '#cc44ff',
    speed: 4,
    jumpForce: 14,
    specialPower: '🌹 RAMO DE ROSAS',
    specialDesc: 'Lanza rosas que congelan a los fiscales',
    stats: { velocidad: 6, salto: 8, especial: 9 },
    lore: 'Secretaria General de la Presidencia. 35 llamadas de Novelli. Grabación: "los 4000 de lo que hay que darle a Karina". Facilitó reuniones entre Milei y los cripto-empresarios.',
    powerEmoji: '🌹',
    powerColor: '#cc44ff',
    deathQuotes: [
      '"Yo no hablo con la prensa ni con la justicia"',
      '"¿Qué rosas? ¿Qué 4000? No sé de qué hablan"',
      '"Mi hermano me va a salvar... ¿Javi? ¿Javi??"',
      '"Soy la jefa. Los jefes no van presos."',
    ],
    collectibleEmoji: '🌹',
    collectibleName: 'Rosas de Coimas',
    platformColor: '#cc44ff',
  },

  adorni: {
    id: 'adorni',
    name: 'MANUEL ADORNI',
    emoji: '✈️',
    title: 'El Viajante VIP',
    causa: '🏖️ Causa Aruba',
    color: '#00aaff',
    speed: 6,
    jumpForce: 15,
    specialPower: '🛫 FIRST CLASS',
    specialDesc: 'Sale volando en primera clase y esquiva todo',
    stats: { velocidad: 7, salto: 9, especial: 8 },
    lore: 'Jefe de Gabinete investigado por enriquecimiento ilícito. Aruba con familia: USD 5.800 en efectivo. Hotel Tamarijn all inclusive. 15+ viajes internacionales. Dos propiedades sin declarar.',
    powerEmoji: '🛫',
    powerColor: '#00aaff',
    deathQuotes: [
      '"Esto no tiene nada que ver con mi gestión..."',
      '"Fue un préstamo de dos jubiladas, es normal"',
      '"¡Deslomado laburando y me critican las vacaciones!"',
      '"Viajé en Premium Economy, NO primera clase (técnico)"',
    ],
    collectibleEmoji: '💼',
    collectibleName: 'Valija VIP',
    platformColor: '#00aaff',
  },

  espert: {
    id: 'espert',
    name: 'JOSÉ LUIS ESPERT',
    emoji: '💊',
    title: 'El Narcoeconomista',
    causa: '🚁 Causa Fred Machado',
    color: '#ff2244',
    speed: 7,
    jumpForce: 13,
    specialPower: '💰 200 MIL VERDES',
    specialDesc: 'Dispara fajos de USD que aturden fiscales',
    stats: { velocidad: 8, salto: 6, especial: 7 },
    lore: 'Recibió USD 200.000 de Fred Machado (acusado de narcotráfico en Texas). Niega vínculo 5 años, luego admite "consultoría". Allanaron su casa y el Congreso. Renunció a su candidatura.',
    powerEmoji: '💰',
    powerColor: '#ff2244',
    deathQuotes: [
      '"¡Cárcel y bala... para los otros!"',
      '"Era para una empresa minera, lo juro"',
      '"Fred quién? Nunca lo vi... bueno, una vez..."',
      '"¡Es una operación del kirchnerismo!"',
    ],
    collectibleEmoji: '✈️',
    collectibleName: 'Vuelo Privado Narco',
    platformColor: '#ff2244',
  },

  spagnuolo: {
    id: 'spagnuolo',
    name: 'DIEGO SPAGNUOLO',
    emoji: '🎙️',
    title: 'El Audio Comprometido',
    causa: '🏥 Causa ANDIS',
    color: '#00ff88',
    speed: 4,
    jumpForce: 12,
    specialPower: '🎤 SILENCIO TOTAL',
    specialDesc: 'Se niega a declarar y congela la pantalla',
    stats: { velocidad: 5, salto: 5, especial: 9 },
    lore: 'Ex director ANDIS. Audios filtrados pediendo coimas del 5-8% en medicamentos de alto costo. $75.000 millones desviados. Menciona a Karina Milei en grabaciones. 35 imputados en la causa.',
    powerEmoji: '🎤',
    powerColor: '#00ff88',
    deathQuotes: [
      '"No voy a declarar." (y se va sin decir nada más)',
      '"Los audios son falsos, es IA" (su defensa)',
      '"Era un restaurante, no una reunión de coimas"',
      '"¡No soy Spagnuolo, soy una IA del kirchnerismo!"',
    ],
    collectibleEmoji: '💊',
    collectibleName: 'Medicamento de Alto Costo',
    platformColor: '#00ff88',
  },

  novelli: {
    id: 'novelli',
    name: 'MAURICIO NOVELLI',
    emoji: '💎',
    title: 'El Trader Fantasma',
    causa: '🪙 Causa $LIBRA',
    color: '#ffd700',
    speed: 8,
    jumpForce: 17,
    specialPower: '📱 BORRAR CHATS',
    specialDesc: 'Borra todas las pruebas en pantalla',
    stats: { velocidad: 10, salto: 10, especial: 6 },
    lore: 'Lobista cripto. 7+ llamadas con Milei el 14/02/25. 35 llamadas con Karina Milei. Fue a Casa Rosada múltiples veces. Operaciones offshore en Delaware, BVI, Cayman, Miami y Panamá.',
    powerEmoji: '📱',
    powerColor: '#ffd700',
    deathQuotes: [
      '"Todo es legal, son negocios normales"',
      '"Ese chat no es mío, fue alterado"',
      '"Soy un simple trader de criptos..."',
      '"¿Casa Rosada? Fui de turista"',
    ],
    collectibleEmoji: '🪙',
    collectibleName: '$LIBRA Coin (sin valor)',
    platformColor: '#ffd700',
  },
};

const GAME_QUOTES = [
  '"El ajuste lo paga la casta" 🪚',
  '"No hay plata" 💸',
  '"Viva la libertad, carajo" 🦁',
  '"La justicia es un instrumento de la corporación política" ⚖️',
  '"Son todos zurdos" 🔴',
  '"Chau chau chau" 👋',
  '"Lo hice de buena fe" 😇',
  '"Es una operación política" 🎭',
  '"El kirchnerismo destruyó el país" 📉',
  '"Soy el mensajero, no el responsable" 📩',
];

const MANUAL_DATA = [
  {
    char: 'MILEI 🦁',
    causa: '⚡ Causa $LIBRA',
    text: 'El 14/02/2025 Milei publicó en X promoviendo $LIBRA. La cripto subió 1.300% y colapsó, dejando pérdidas de +USD 100 millones. Registros revelan 7 llamadas con Novelli esa noche. También clonó a su perro Conan (muerto en 2017) por USD 50.000 y consulta a un médium para hablar con él.'
  },
  {
    char: 'KARINA MILEI 👸',
    causa: '💎 Causa $LIBRA',
    text: 'Secretaria General de la Presidencia, investigada en la causa $LIBRA. Grabación de Novelli: "los 4000 de lo que hay que darle a Karina". Recibió 35 llamadas de Novelli. Facilitó reuniones entre su hermano y los criptoempresarios en Casa Rosada.'
  },
  {
    char: 'ADORNI ✈️',
    causa: '🏖️ Causa Aruba + Enriquecimiento',
    text: 'Jefe de Gabinete investigado por enriquecimiento ilícito. Viajó a Aruba en diciembre 2024: USD 5.800 en efectivo por 4 pasajes. Hotel Tamarijn all inclusive ≈ USD 12.000. 15+ viajes internacionales desde que asumió. Compró 2 propiedades con préstamos de jubiladas de 64 y 72 años.'
  },
  {
    char: 'ESPERT 💊',
    causa: '🚁 Causa Fred Machado / Narcotráfico',
    text: 'Recibió USD 200.000 de empresa vinculada a Fred Machado, acusado de narcotráfico y lavado en Texas. Negó el vínculo durante 5 años. Viajó en avión privado de Machado. La Justicia allanó su casa y despacho. Renunció a su candidatura y a presidir la comisión de Presupuesto.'
  },
  {
    char: 'SPAGNUOLO 🎙️',
    causa: '🏥 Causa ANDIS / Coimas Discapacidad',
    text: 'Ex director de ANDIS. Audios lo muestran pidiendo coimas del 5-8% en compras de medicamentos para personas con discapacidad. $75.000 millones de pesos desviados. En grabaciones menciona a Karina Milei. Procesado por cohecho y fraude. Se negó a declarar ante la justicia.'
  },
  {
    char: 'NOVELLI 💎',
    causa: '🪙 Causa $LIBRA / Offshore',
    text: 'Lobista cripto que actuó como puente entre Milei y Hayden Davis (creador de $LIBRA). Múltiples visitas a Casa Rosada. Operaciones offshore en Delaware, BVI, Islas Caimán, Miami y Panamá. Mensaje autodirigido: "Pago Javier Kari". Su celular peritado reveló toda la trama.'
  },
];
