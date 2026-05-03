# 🎮 CORRUPTO BROS — La Causa Infinita

> *"El ajuste lo paga la casta, pero el juego lo jugás vos"*

Un juego de plataformas estilo Mario Bros pero con la temática de los escándalos políticos de la Argentina actual. Una parodia satírica basada en hechos reales de dominio público.

**Actualización visual:** los personajes ahora usan retratos faciales en pixel art en selección, HUD y gameplay.

---

## 🆕 VERSIÓN MEJORADA

Esta entrega suma:
- 40 niveles generados con dificultad progresiva.
- 8 mundos/escenarios: Congreso, Caribe offshore, Casa Rosada, Tribunales, Crypto City, Aeropuerto VIP, ANDIS y Final.
- Enemigos con lógica de plataforma clásica: patrullan, giran en bordes, algunos vuelan, saltan, cargan al jugador o funcionan como mini-boss.
- Plataformas móviles, checkpoints, pinches, powerups y barra de progreso del nivel.
- En móvil, doble toque sobre **SALTAR** activa el poder especial.

## 🕹️ CÓMO JUGAR

**Controles (teclado):**
- `←` `→` → Mover
- `↑` o `ESPACIO` → Saltar (doble salto habilitado)
- `X` o `SHIFT` → Activar poder especial
- `ESC` → Volver al menú

**Controles (móvil):**
- Botones táctiles en pantalla

**Mecánicas:**
- Saltá sobre los **fiscales** y **periodistas** para ganarles puntos
- ¡Evitá a los **jueces**! No se pueden pisotear
- Colectá los íconos especiales de cada personaje para sumar CAUSA$
- Llegá a la meta 🏁 de cada nivel para avanzar
- Cada personaje tiene un **poder especial único** (tecla X)

---

## 👥 PERSONAJES Y CAUSAS

| Personaje | Causa Real | Poder Especial |
|-----------|-----------|----------------|
| 🦁 **JAVIER MILEI** | Causa $LIBRA - Criptomoneda que colapsó causando pérdidas de +USD 100M | 👻 Conan Fantasma: invoca al perro muerto para aturdir fiscales |
| 👸 **KARINA MILEI** | Causa $LIBRA - 35 llamadas con Novelli, mencionada en grabaciones | 🌹 Ramo de Rosas: paraliza enemigos cercanos |
| ✈️ **ADORNI** | Causa Aruba - Enriquecimiento ilícito, 15+ viajes VIP, propiedades sin declarar | 🛫 First Class: sale disparado y esquiva todo |
| 💊 **ESPERT** | Causa Fred Machado - Recibió USD 200K de empresario acusado de narcotráfico | 💰 200 Mil Verdes: recolecta todos los ítems cercanos |
| 🎙️ **SPAGNUOLO** | Causa ANDIS - $75.000M desviados de fondos para discapacidad, coimas del 5-8% | 🤫 Silencio Total: invincibilidad temporal + bonus |
| 💎 **NOVELLI** | Causa $LIBRA - Trader cripto con operaciones offshore en 5 paraísos fiscales | 📱 Borrar Chats: elimina todos los enemigos en pantalla |

---

## ⚙️ SETUP SUPABASE (Leaderboard Online)

### 1. Crear proyecto en Supabase
Ir a https://supabase.com y crear una cuenta y proyecto gratuito.

### 2. Configurar la base de datos
En el **SQL Editor** de Supabase, ejecutar:

```sql
-- Tabla de puntajes
CREATE TABLE scores (
  id BIGSERIAL PRIMARY KEY,
  player_name TEXT NOT NULL,
  character_id TEXT NOT NULL,
  character_emoji TEXT NOT NULL,
  score INTEGER NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seguridad (lectura y escritura pública)
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all reads" ON scores FOR SELECT USING (true);
CREATE POLICY "Allow all inserts" ON scores FOR INSERT WITH CHECK (true);

-- Índice para ordenar por puntaje
CREATE INDEX idx_scores_score ON scores(score DESC);

-- Limitar a scores razonables (anti-cheat básico)
ALTER TABLE scores ADD CONSTRAINT score_check CHECK (score >= 0 AND score <= 9999999);
ALTER TABLE scores ADD CONSTRAINT name_check CHECK (length(player_name) BETWEEN 1 AND 20);
```

### 3. Obtener credenciales
En Supabase → **Project Settings** → **API**:
- Copiar `Project URL`
- Copiar `anon public key`

### 4. Configurar el juego
En el archivo `js/supabase.js`, reemplazar:

```javascript
const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY_AQUI';
```

> **NOTA:** Sin configurar Supabase, el juego funciona con localStorage (scores locales). Los puntajes se guardan en el navegador.

---

## 🚀 DESPLIEGUE EN GITHUB PAGES

### 1. Subir a GitHub
```bash
git init
git add .
git commit -m "🎮 Corrupto Bros - Initial release"
git remote add origin https://github.com/TU_USUARIO/corrupto-bros.git
git push -u origin main
```

### 2. Activar GitHub Pages
- Ir al repositorio → **Settings** → **Pages**
- Source: **Deploy from branch**
- Branch: `main` / `root`
- Guardar y esperar ~2 minutos

El juego estará disponible en: `https://TU_USUARIO.github.io/corrupto-bros/`

---

## 📲 COMPARTIR EN REDES

El juego incluye botón de compartir que genera texto con tu puntaje para Twitter/X, Instagram, WhatsApp, etc.

---

## ⚖️ DISCLAIMER LEGAL

Este juego es **sátira política y parodia**. Todos los hechos mencionados sobre las causas judiciales son de **dominio público**, ampliamente reportados por medios periodísticos argentinos e internacionales. El juego no afirma culpabilidad alguna (la justicia es la que determina eso). El humor y la crítica política son pilares de la democracia.

Fuentes: La Nación, Infobae, Perfil, Página 12, NY Times, CoinDesk, entre otros.

---

## 🛠️ TECNOLOGÍAS

- **Frontend:** HTML5 Canvas, CSS3, Vanilla JavaScript
- **Backend/Scores:** Supabase (PostgreSQL + REST API)
- **Fuentes:** Google Fonts (Press Start 2P, VT323)
- **Sin dependencias npm** — funciona directo en navegador

---

*Hecho con 🧉 en Argentina. Porque si no reís, llorás.*
