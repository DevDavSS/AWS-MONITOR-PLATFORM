# Alert Service API

## Descripción

El microservicio **Alert Service** es el encargado de:

- Consumir periódicamente los Resource Snapshots publicados por el Backend.
- Evaluar las reglas de monitoreo.
- Crear y resolver alertas.
- Persistir reglas y alertas en PostgreSQL.
- Exponer una API REST para que el Frontend consulte alertas y administre reglas.

---

# Arquitectura de Consultas

A diferencia de versiones anteriores, el microservicio expone **un único endpoint para Alertas** y **un único endpoint para Reglas**.

Las consultas se realizan mediante **Query Parameters**, permitiendo que el Frontend navegue desde el nivel de:

- Organización
- Cuenta AWS
- Región
- Servicio
- Recurso específico

sin necesidad de crear múltiples endpoints especializados.

---

# Endpoints

---

# 1. Consultar Alertas

Obtiene las alertas almacenadas en la base de datos aplicando filtros dinámicos.

## Endpoint

```http
GET /api/alerts
```

## Query Parameters

Todos son opcionales.

| Parámetro | Descripción |
|-----------|-------------|
| service | Servicio (ec2, eks, rds) |
| organizationId | Organización |
| accountId | Cuenta AWS |
| region | Región |
| resourceId | Recurso específico |
| state | ACTIVE o RESOLVED |

---

## Ejemplos

Todas las alertas

```http
GET /api/alerts
```

Alertas activas

```http
GET /api/alerts?state=ACTIVE
```

Historial (resueltas)

```http
GET /api/alerts?state=RESOLVED
```

Alertas EC2

```http
GET /api/alerts?service=ec2
```

Alertas de una organización

```http
GET /api/alerts?organizationId=sofom
```

Alertas de una cuenta

```http
GET /api/alerts?accountId=833329618359
```

Alertas de una región

```http
GET /api/alerts?region=us-east-1
```

Alertas de un recurso

```http
GET /api/alerts?resourceId=i-0123456789
```

Combinación de filtros

```http
GET /api/alerts?state=ACTIVE&accountId=833329618359
```

---

# 2. Consultar Reglas

Obtiene las reglas registradas aplicando filtros dinámicos.

## Endpoint

```http
GET /api/rules
```

## Query Parameters

Todos son opcionales.

| Parámetro | Descripción |
|-----------|-------------|
| service | Servicio (ec2, eks, rds) |
| organizationId | Organización |
| accountId | Cuenta AWS |
| region | Región |
| resourceId | Recurso específico |
| enabled | true / false |

---

## Ejemplos

Todas las reglas

```http
GET /api/rules
```

Solo reglas habilitadas

```http
GET /api/rules?enabled=true
```

Solo reglas EC2

```http
GET /api/rules?service=ec2
```

Reglas de una organización

```http
GET /api/rules?organizationId=sofom
```

Reglas de una cuenta

```http
GET /api/rules?accountId=833329618359
```

Reglas de una región

```http
GET /api/rules?region=us-east-1
```

Reglas de un recurso

```http
GET /api/rules?resourceId=i-0123456789
```

Combinación de filtros

```http
GET /api/rules?service=ec2&resourceId=i-0123456789
```

---

# 3. Crear Regla

Crea una nueva regla de monitoreo.

## Endpoint

```http
POST /api/rules
```

## Body

```json
{
    "organizationId": null,
    "accountId": null,
    "region": null,
    "service": "ec2",
    "resourceType": "instance",
    "resourceId": null,
    "metric": "cpu",
    "operator": ">",
    "threshold": 80,
    "enabled": true
}
```

### Nota

Los siguientes campos pueden ser **null** para indicar una regla global:

- organizationId
- accountId
- region
- resourceId

---

# 4. Actualizar Regla

Actualizar o deshabilitar una regla existente.

## Endpoint

```http
PUT /api/rules/:id
```

Permite modificar:

- threshold
- operator
- metric
- enabled
- ámbito de aplicación

---

# Flujo General

```text
                   Backend
                      │
                      │
        GET /api/resourceSnapshots
                      │
                      ▼
              Alert Engine
                      │
        ┌─────────────┴──────────────┐
        │                            │
        ▼                            ▼
Evaluar reglas                 Resolver alertas
        │                            │
        └─────────────┬──────────────┘
                      │
              PostgreSQL
                      │
          ┌───────────┴────────────┐
          │                        │
          ▼                        ▼
     alert_rules               alerts
                      │
                      ▼
                REST API
                      │
                      ▼
                  Frontend
```

---

# Arquitectura de Consultas

Todos los filtros definidos por el Frontend son transportados mediante un único objeto de filtros.

```text
Frontend
      │
      ▼
HTTP Query Parameters
      │
      ▼
Controller
      │
      ▼
AlertFilters / AlertRuleFilters
      │
      ▼
Service
      │
      ▼
Repository
      │
      ▼
SQL dinámico
```

Esto permite que tanto el **Frontend** como el **Alert Engine** reutilicen exactamente los mismos repositorios para consultar alertas y reglas, evitando duplicar lógica de acceso a datos.

---

# Endpoints consumidos por el Frontend

| Endpoint | Propósito |
|----------|-----------|
| GET /api/alerts | Consultar alertas aplicando filtros dinámicos |
| GET /api/rules | Consultar reglas aplicando filtros dinámicos |
| POST /api/rules | Crear nueva regla |
| PUT /api/rules/:id | Modificar regla |
| PATCH /api/rules/:id | Activar o desactivar regla |

---

# Mejoras Futuras

- Autenticación y autorización.
- Paginación.
- Ordenamiento dinámico.
- Búsquedas por texto.
- Filtros por fecha (createdAfter, createdBefore).
- Severidad de alertas.
- Prioridad de reglas.
- API para resolución manual de alertas.
- API para reconocimiento (ACK) de alertas.
- Notificaciones por WhatsApp, correo y Microsoft Teams.
- WebSockets para actualización de alertas en tiempo real.
- Soporte para múltiples canales de notificación por regla.