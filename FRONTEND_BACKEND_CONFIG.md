# 🌐 Frontend-Backend Kommunikation - Konfiguration

## ⚠️ Wichtig zu verstehen!

Das **React Frontend läuft im Browser** des Benutzers, NICHT im Docker Container!
- Der Browser kann **nicht** auf Docker Container-Namen wie "server" zugreifen
- Der Browser kann **nur** auf öffentliche URLs zugreifen

---

## 🔧 Konfiguration nach Deployment-Szenario

### Szenario 1: Lokale Entwicklung (ohne Docker)

```bash
# UI/.env.local (erstellen)
REACT_APP_API_URL=http://localhost:8888
```

```bash
# Starten
cd Server
npm start  # Läuft auf Port 8888

cd UI
npm start  # Läuft auf Port 3000
```

**Frontend greift zu:** `http://localhost:8888`

---

### Szenario 2: Docker Compose (lokale Container)

**Option A: Nginx Reverse Proxy (EMPFOHLEN)**

Die nginx.conf ist bereits konfiguriert:
```nginx
location /api {
    proxy_pass http://server:3001;  # Container-Name funktioniert hier!
}
```

```bash
# .env (im Root-Verzeichnis)
REACT_APP_API_URL=http://localhost:3000/api
```

```bash
docker-compose up -d
```

**Frontend greift zu:** `http://localhost:3000/api` → Nginx leitet zu `server:3001` weiter

**Option B: Backend direkt exposen**

```bash
# .env
REACT_APP_API_URL=http://localhost:3001
```

Nginx Proxy-Config auskommentieren in `UI/nginx.conf`

---

### Szenario 3: Docker + Server Port ändern

Dein Server läuft auf Port **8888** (nicht 3001 wie in docker-compose.yml)!

**Server/index.js anpassen:**
```javascript
// Zeile 26 ändern von:
app.listen(8888);

// Zu:
const PORT = process.env.PORT || 8888;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
```

**docker-compose.yml anpassen:**
```yaml
server:
  environment:
    PORT: 3001  # Oder 8888
  ports:
    - "8888:8888"  # Statt 3001:3001
```

**Nginx Proxy anpassen:**
```nginx
location /api {
    proxy_pass http://server:8888;  # Port anpassen!
}
```

---

### Szenario 4: Railway/Render Deployment

**Separate Deployments (Frontend + Backend getrennt):**

```bash
# In Railway/Render Backend Settings:
# Notiere die URL: z.B. https://braincheck-api.up.railway.app

# In Vercel/Netlify Frontend Settings:
REACT_APP_API_URL=https://braincheck-api.up.railway.app
```

**Wichtig:** CORS im Backend muss die Frontend-URL erlauben!

```javascript
// Server/app.js
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", 
    process.env.FRONTEND_URL || "*");  // Besser: spezifische URL
  // ... rest
});
```

---

### Szenario 5: Alles zusammen in einem Docker (Single Container)

**Nicht empfohlen**, aber möglich:

```dockerfile
# Frontend wird in Backend-Container gebuildet
FROM node:20-alpine

WORKDIR /app

# Backend
COPY Server/package*.json ./
RUN npm ci --only=production
COPY Server/ ./

# Frontend Build
COPY UI/package*.json ./ui/
WORKDIR /app/ui
RUN npm ci
COPY UI/ ./
RUN REACT_APP_API_URL=/api npm run build

# Frontend Static Files zum Backend
RUN mv build ../public

WORKDIR /app
EXPOSE 8888
CMD ["node", "index.js"]
```

---

## 🎯 Empfohlene Konfiguration für dich

### Lokale Entwicklung:

**1. Server Port konsistent machen:**

`Server/index.js`:
```javascript
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**2. UI Environment:**

`UI/.env.local`:
```
REACT_APP_API_URL=http://localhost:8888
```

**3. Starten:**
```bash
# Terminal 1
cd Server && npm start

# Terminal 2
cd UI && npm start
```

---

### Docker Compose Lokal:

**Option 1: Mit Nginx Proxy (Alles unter Port 3000)**

`docker-compose.yml` ändern:
```yaml
server:
  environment:
    PORT: 8888
  ports:
    - "8888:8888"  # Server auf Port 8888
```

`UI/nginx.conf`:
```nginx
location /api {
    proxy_pass http://server:8888;  # Backend Container
}
```

`.env`:
```bash
REACT_APP_API_URL=http://localhost:3000/api
```

`UI/Dockerfile` Build-Arg verwenden:
```dockerfile
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL
```

**Starten:**
```bash
docker-compose up --build
```

**Zugriff:**
- Frontend: http://localhost:3000
- API über Nginx: http://localhost:3000/api/...
- Backend direkt: http://localhost:8888 (für Tests)

---

**Option 2: Ohne Proxy (Separate Ports)**

`.env`:
```bash
REACT_APP_API_URL=http://localhost:8888
```

`docker-compose.yml`:
```yaml
server:
  ports:
    - "8888:8888"
  environment:
    PORT: 8888
```

Nginx `/api` proxy auskommentieren.

**Zugriff:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8888

---

### Production Deployment (Railway/Render):

**Backend Umgebungsvariablen:**
```bash
PORT=8888  # Oder was Railway vorgibt
FRONTEND_URL=https://your-frontend.vercel.app
```

**Frontend Umgebungsvariablen:**
```bash
REACT_APP_API_URL=https://your-backend.up.railway.app
```

**Backend CORS anpassen:**
```javascript
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", 
    process.env.FRONTEND_URL || "http://localhost:3000");
  // ...
});
```

---

## ✅ Zusammenfassung

1. ✅ **fetch_function.js** nutzt jetzt `REACT_APP_API_URL`
2. ⚠️ **Server Port** muss konsistent sein (8888 oder 3001)
3. 🔧 **Verschiedene .env Dateien** für verschiedene Umgebungen
4. 🐳 **Docker Compose** nutzt am besten Nginx Proxy
5. 🌍 **Production** braucht externe URLs

---

## 🚀 Nächste Schritte

Wähle dein Szenario:

**A) Lokale Entwicklung ohne Docker:**
→ Erstelle `UI/.env.local` mit `REACT_APP_API_URL=http://localhost:8888`

**B) Docker Compose lokal:**
→ Aktualisiere `docker-compose.yml` und `.env`
→ Entscheide: Nginx Proxy oder separate Ports

**C) Production Deployment:**
→ Deploy Backend zu Railway
→ Deploy Frontend zu Vercel
→ Setze URLs in Environment Variables

Sag mir, welches Szenario du brauchst, und ich helfe dir bei der Konfiguration!
