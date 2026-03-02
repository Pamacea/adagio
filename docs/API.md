# API Documentation — ADAGIO

> *Documentation de l'API RESTful Adagio*

---

## Base de l'API

```
Production :  https://api.adagio.com/v1
Staging     :  https://api-staging.adagio.com/v1
Development : http://localhost:3001/v1
```

---

## Authentification

Adagio utilise **JWT (JSON Web Tokens)** pour l'authentification.

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Schéma d'Authentification

1. **Inscription/Connexion** : Recevoir un access token + refresh token
2. **Requêtes authentifiées** : Envoyer l'access token dans le header Authorization
3. **Refresh** : Utiliser le refresh token pour obtenir un nouvel access token

---

## Endpoints

### Authentification

#### POST /auth/register

Crée un nouveau compte utilisateur.

**Request :**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Response (201) :**
```json
{
  "user": {
    "id": "cuid123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-03-02T10:00:00Z"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

#### POST /auth/login

Authentifie un utilisateur existant.

**Request :**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200) :**
```json
{
  "user": {
    "id": "cuid123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

#### POST /auth/refresh

Rafraîchit le token d'accès.

**Request :**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200) :**
```json
{
  "accessToken": "eyJhbGc...",
  "expiresIn": 3600
}
```

#### POST /auth/logout

Termine la session utilisateur.

**Request :**
```http
Authorization: Bearer <token>
```

**Response (204) :** No Content

---

### Théorie Musicale

#### GET /theory/keys

Liste toutes les tonalités disponibles.

**Response (200) :**
```json
{
  "keys": [
    { "name": "C", "octave": 4 },
    { "name": "C#", "octave": 4 },
    { "name": "Db", "octave": 4 },
    ...
  ]
}
```

#### GET /theory/modes

Liste tous les modes avec leurs caractéristiques émotionnelles.

**Query Parameters :**
- `feeling` (optional) : Filtrer par sensation (ex: "sombre", "aérien")
- `limit` (optional) : Nombre de résultats (défaut: 50)
- `offset` (optional) : Pagination

**Response (200) :**
```json
{
  "modes": [
    {
      "id": "cuid456",
      "slug": "dorian",
      "name": "Dorien",
      "intervals": ["1", "2", "b3", "4", "5", "6", "b7"],
      "character": "Mineur chaud / Jazzy",
      "sensation": "Chaud, Soulful, Sophistiqué",
      "feeling": "Sophistiqué, Cool",
      "greekName": "Dorian",
      "relativeTo": "ii in major",
      "axisGroup": "Tonique (si utilisé en résolution)",
      "advice": "Le b3 et le b7 donnent la couleur mineure, le 6 majeur le rend jazzy."
    },
    ...
  ],
  "total": 7,
  "limit": 50,
  "offset": 0
}
```

#### GET /theory/modes/:slug

Détails d'un mode spécifique.

**Response (200) :**
```json
{
  "mode": {
    "id": "cuid456",
    "slug": "dorian",
    "name": "Dorien",
    "intervals": ["1", "2", "b3", "4", "5", "6", "b7"],
    "character": "Mineur chaud / Jazzy",
    "sensation": "Chaud, Soulful, Sophistiqué",
    "feeling": "Sophistiqué, Cool",
    "greekName": "Dorian",
    "relativeTo": "ii in major",
    "axisGroup": "Tonique",
    "advice": "Excellent sur un accord m7 ou ii-V-I.",
    "compatibleChords": ["Cm7", "Cm9", "Cm11"],
    "famousUsage": ["So What - Miles Davis", "Impressions - John Coltrane"]
  }
}
```

#### GET /theory/keys/:key/modes

Retourne tous les modes pour une tonalité donnée.

**Parameters :**
- `key` : Nom de la tonalité (ex: "C", "F#")

**Response (200) :**
```json
{
  "key": "C",
  "modes": [
    {
      "name": "Ionien",
      "slug": "ionian",
      "notes": ["C", "D", "E", "F", "G", "A", "B"]
    },
    {
      "name": "Dorien",
      "slug": "dorian",
      "notes": ["D", "E", "F", "G", "A", "B", "C"]
    },
    ...
  ]
}
```

#### GET /theory/scales

Liste toutes les gammes disponibles.

**Query Parameters :**
- `type` (optional) : Filter par type (ex: "pentatonic", "blues")
- `limit` (optional)
- `offset` (optional)

**Response (200) :**
```json
{
  "scales": [
    {
      "id": "cuid789",
      "slug": "pentatonic-minor",
      "name": "Pentatonique Mineure",
      "intervals": ["1", "b3", "4", "5", "b7"],
      "type": "scale"
    },
    ...
  ]
}
```

#### GET /theory/chords

Liste tous les accords disponibles.

**Query Parameters :**
- `root` (optional) : Filtrer par note fondamentale (ex: "C")
- `quality` (optional) : Filtrer par qualité (ex: "maj7", "m7")
- `limit` (optional)
- `offset` (optional)

**Response (200) :**
```json
{
  "chords": [
    {
      "id": "cuid101",
      "name": "Cmaj7",
      "root": "C",
      "quality": "maj7",
      "intervals": ["1", "3", "5", "7"],
      "extensions": [],
      "fingerings": [
        {
          "position": "open",
          "frets": [[0, null], [1, 0], [2, 0], [3, 0], [4, 2], [5, null]]
        },
        {
          "position": 3,
          "frets": [[0, null], [1, 3], [2, 4], [3, 4], [4, 5], [5, null]]
        }
      ]
    },
    ...
  ]
}
```

#### POST /theory/analyze

Analyse une progression d'accords et suggère des gammes.

**Request :**
```json
{
  "key": "C",
  "progression": [
    {"degree": "I", "quality": "maj7"},
    {"degree": "IV", "quality": "maj7"},
    {"degree": "V", "quality": "7"},
    {"degree": "I", "quality": "maj7"}
  ]
}
```

**Response (200) :**
```json
{
  "key": "C",
  "analysis": [
    {
      "chord": "Cmaj7",
      "degree": "I",
      "suggestedModes": ["Ionien", "Lydien"],
      "sensation": "Être content à la maison",
      "advice": "Utilisez l'Ionien pour un son majeur classique."
    },
    {
      "chord": "Fmaj7",
      "degree": "IV",
      "suggestedModes": ["Lydien", "Ionien"],
      "sensation": "Aventure : Vous quittez la maison",
      "advice": "Le Lydien (#4) ajoute une couleur rêveuse."
    },
    {
      "chord": "G7",
      "degree": "V",
      "suggestedModes": ["Mixolydien", "Phrygien Dominant"],
      "sensation": "Tension : Le retour est incertain",
      "advice": "Mixolydien pour le blues, Phrygien Dom pour l'espagnol."
    },
    {
      "chord": "Cmaj7",
      "degree": "I",
      "suggestedModes": ["Ionien"],
      "sensation": "Résolution : Retour à la maison",
      "advice": "Résolution parfaite."
    }
  ],
  "overallFeeling": "Majeur, joyeux, résolu"
}
```

#### GET /theory/circle-of-fifths

Retourne les données du cercle des quintes.

**Query Parameters :**
- `center` (optional) : Note centrale pour la visualisation

**Response (200) :**
```json
{
  "center": "C",
  "circle": [
    {"note": "C", "interval": 0},
    {"note": "G", "interval": 7},
    {"note": "D", "interval": 2},
    {"note": "A", "interval": 9},
    {"note": "E", "interval": 4},
    {"note": "B", "interval": 11},
    {"note": "F#", "interval": 6},
    {"note": "Db", "interval": 1},
    {"note": "Ab", "interval": 8},
    {"note": "Eb", "interval": 3},
    {"note": "Bb", "interval": 10},
    {"note": "F", "interval": 5}
  ],
  "enharmonics": {
    "F#": "Gb",
    "Db": "C#"
  }
}
```

#### GET /theory/axis-theory

Retourne les groupes Axis Theory.

**Response (200) :**
```json
{
  "axisGroups": [
    {
      "name": "Tonique",
      "notes": ["C", "Eb", "Gb", "A"],
      "description": "Accords de résolution, repos",
      "substitutions": ["relative mineure", "relative majeure"]
    },
    {
      "name": "Dominante",
      "notes": ["G", "B", "Db", "E"],
      "description": "Tension, besoin de résolution",
      "substitutions": ["tritonique", "V7 alt"]
    },
    {
      "name": "Sous-dominante",
      "notes": ["F", "Ab", "B", "D"],
      "description": "Départ, mouvement",
      "substitutions": ["ii-V", "IV-"]
    }
  ]
}
```

---

### Utilisateurs

#### GET /users/me

Informations sur l'utilisateur actuel.

**Request :**
```http
Authorization: Bearer <token>
```

**Response (200) :**
```json
{
  "user": {
    "id": "cuid123",
    "email": "user@example.com",
    "name": "John Doe",
    "image": "https://avatar.url",
    "createdAt": "2025-03-02T10:00:00Z",
    "preferences": {
      "theme": "midnight",
      "showIntervals": true,
      "showNotes": true,
      "showDegrees": false,
      "tuning": "EADGBE",
      "fretCount": 24,
      "volume": 0.7,
      "metronomeVolume": 0.5
    }
  }
}
```

#### PATCH /users/me

Met à jour le profil utilisateur.

**Request :**
```http
Authorization: Bearer <token>
```
```json
{
  "name": "John Smith",
  "preferences": {
    "theme": "midnight",
    "showIntervals": true
  }
}
```

**Response (200) :**
```json
{
  "user": {
    "id": "cuid123",
    "email": "user@example.com",
    "name": "John Smith",
    "preferences": { ... }
  }
}
```

#### GET /users/me/progressions

Liste toutes les progressions sauvegardées de l'utilisateur.

**Query Parameters :**
- `limit` (optional)
- `offset` (optional)

**Response (200) :**
```json
{
  "progressions": [
    {
      "id": "prog123",
      "name": "Jazz ii-V-I in C",
      "key": "C",
      "timeSignature": "4/4",
      "chords": [
        {"degree": "ii", "quality": "m7"},
        {"degree": "V", "quality": "7"},
        {"degree": "I", "quality": "maj7"}
      ],
      "isPublic": false,
      "createdAt": "2025-03-01T15:30:00Z",
      "updatedAt": "2025-03-02T10:00:00Z"
    },
    ...
  ],
  "total": 5,
  "limit": 20,
  "offset": 0
}
```

#### POST /users/me/progressions

Crée une nouvelle progression sauvegardée.

**Request :**
```http
Authorization: Bearer <token>
```
```json
{
  "name": "My Blues Progression",
  "key": "E",
  "timeSignature": "4/4",
  "chords": [
    {"degree": "I", "quality": "7"},
    {"degree": "IV", "quality": "7"},
    {"degree": "I", "quality": "7"},
    {"degree": "V", "quality": "7"}
  ],
  "isPublic": false
}
```

**Response (201) :**
```json
{
  "id": "prog456",
  "name": "My Blues Progression",
  "key": "E",
  "timeSignature": "4/4",
  "chords": [...],
  "analysis": { ... },
  "isPublic": false,
  "createdAt": "2025-03-02T12:00:00Z",
  "updatedAt": "2025-03-02T12:00:00Z"
}
```

#### PATCH /users/me/progressions/:id

Met à jour une progression existante.

**DELETE /users/me/progressions/:id**

Supprime une progression.

#### GET /users/me/progress

Retourne la progression d'apprentissage de l'utilisateur.

**Response (200) :**
```json
{
  "progress": [
    {
      "techniqueId": "tech123",
      "techniqueName": "Hammer-on",
      "learned": true,
      "practicedCount": 15,
      "lastPracticed": "2025-03-01T10:00:00Z"
    },
    ...
  ],
  "total": 42,
  "learned": 12,
  "inProgress": 8
}
```

---

### Bibliothèque

#### GET /library/techniques

Liste toutes les techniques disponibles.

**Query Parameters :**
- `category` (optional) : Filtrer par catégorie (ex: "legato", "sweep")
- `difficulty` (optional) : Filtrer par difficulté (ex: "beginner", "intermediate")
- `learned` (optional) : Filtrer par statut d'apprentissage (nécessite auth)

**Response (200) :**
```json
{
  "techniques": [
    {
      "id": "tech123",
      "slug": "hammer-on",
      "name": "Hammer-on",
      "category": "Legato",
      "description": "Produire une note en frappant fort...",
      "difficulty": "beginner",
      "diagramUrl": "https://cdn.adagio.com/...",
      "videoUrl": "https://cdn.adagio.com/...",
      "userProgress": {
        "learned": true,
        "practicedCount": 15,
        "lastPracticed": "2025-03-01T10:00:00Z"
      }
    },
    ...
  ]
}
```

#### GET /library/techniques/:id

Détails d'une technique spécifique.

#### POST /library/techniques/:id/learn

Marque une technique comme apprise.

**Request :**
```http
Authorization: Bearer <token>
```

**Response (200) :**
```json
{
  "techniqueId": "tech123",
  "learned": true,
  "practicedCount": 16
}
```

---

## Codes d'Erreur

| Code | Description |
|------|-------------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity (Validation error) |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

### Format d'Erreur

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

---

## Rate Limiting

```
- Non-authentifiés : 100 requêtes / 15 minutes
- Authentifiés      : 1000 requêtes / 15 minutes
```

Les headers suivants sont inclus dans chaque réponse :

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1677699600
```

---

## Webhooks

### POST /webhooks/stripe

Webhook pour les événements Stripe (paiements, abonnements).

**Headers :**
```http
Stripe-Signature: <signature>
```

---

## WebSocket

### Connection

```
wss://api.adagio.com/ws
```

### Authentification

Envoyer le token JWT en premier message :

```json
{
  "type": "auth",
  "token": "eyJhbGc..."
}
```

### Events

| Event | Description |
|-------|-------------|
| `progression.updated` | Une progression a été mise à jour |
| `progress.achievement` | Un succès débloqué |
| `collaborator.joined` | Un collaborateur a rejoint une session |

---

*Dernière mise à jour : 2025-03-02*
