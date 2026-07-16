# Propuesta Arquitectónica - Módulo de Alertas

## Objetivo

Diseñar un módulo de alertas desacoplado de AWS, reutilizando la infraestructura existente del sistema de monitoreo, permitiendo detectar condiciones configurables sobre los recursos monitoreados, registrar los eventos y enviar notificaciones sin duplicar lógica ni realizar consultas innecesarias a AWS.

---

# Principios de Diseño

El módulo de alertas debe cumplir los siguientes principios:

- No conocer AWS.
- No realizar llamadas directas a CloudWatch.
- No asumir roles STS.
- Reutilizar la infraestructura existente.
- Tener responsabilidades claramente separadas.
- Ser fácilmente extensible a nuevos proveedores (Meraki, Prometheus, etc.).

---

# Arquitectura General

```text
                AWS

                 │
                 ▼

          Aggregators

                 │
                 ▼

        Resource Snapshot
      (Estado actual de AWS)

         ┌──────────────┐
         │              │
         ▼              ▼

 Dashboard        Alert Engine

                        │
                        ▼

              Alert Repository

                        │
                        ▼

            Notification Service

                        │
                        ▼

                  WhatsApp API
```

---

# Resource Snapshot

## Responsabilidad

Mantener una fotografía actualizada de todos los recursos monitoreados.

Actualmente el sistema ya obtiene:

- EC2
- Aurora RDS
- EKS

Cada recurso contiene:

- Información del recurso
- Métricas actuales
- Información de cuenta
- Organización
- Región

El Snapshot será la única fuente de datos para el Dashboard y para el Alert Engine.

---

## Actualización

El Snapshot se actualizará automáticamente cada **2 minutos**.

No dependerá de que exista un usuario utilizando la aplicación.

Esto permitirá detectar alertas incluso cuando nadie tenga abierto el Dashboard.

---

## Importante

El Alert Engine nunca consultará AWS.

Siempre consumirá el Snapshot.

---

# Alert Engine

## Responsabilidad

Evaluar reglas configuradas por el usuario utilizando únicamente la información disponible en el Resource Snapshot.

No conoce:

- CloudWatch
- STS
- EC2
- AWS

Simplemente recibe recursos con métricas.

Ejemplo:

```text
EC2Instance

CPU = 91%

Memory = 52%

Disk = 44%
```

Y evalúa las reglas correspondientes.

---

# Configuración de Alertas

Cada recurso tendrá su propia configuración.

Ejemplo:

```text
EC2 Instance A

CPU > 80%

Alertas habilitadas
```

Otra instancia podrá tener:

```text
EC2 Instance B

CPU > 95%

Alertas deshabilitadas
```

Las reglas no serán globales.

Serán independientes por recurso.

---

## EC2

Reglas por instancia.

Ejemplo:

```text
CPU > 80%
Memory > 90%
Disk > 95%
```

---

## Aurora RDS

Reglas por instancia.

---

## EKS

Las reglas seguirán la jerarquía natural del servicio.

### Nivel Cluster

Se evaluará el promedio de todos los NodeGroups.

Ejemplo:

```text
Promedio CPU > 90%
```

---

### Nivel NodeGroup

Se evaluará el promedio de los nodos pertenecientes al NodeGroup.

---

### Nivel Nodo

Cada nodo será tratado exactamente igual que una instancia EC2.

No existirán reglas diferentes para nodos.

Simplemente reutilizarán las reglas del módulo EC2.

---

# Runtime de Reglas

El sistema mantendrá en memoria el estado de cada regla evaluada.

Ejemplo:

```text
Rule

↓

triggered = true
```

Mientras una condición permanezca activa no volverá a generar una nueva alerta.

Ejemplo:

```
09:00

CPU = 92%

↓

Se genera alerta

↓

09:02

CPU = 95%

↓

No ocurre nada

↓

09:05

CPU = 97%

↓

No ocurre nada
```

Cuando la condición deje de cumplirse:

```
CPU = 60%
```

La regla volverá a quedar disponible para dispararse nuevamente.

Esto evita el envío repetitivo de notificaciones.

Este estado será únicamente temporal y permanecerá en memoria.

No será persistido en la base de datos.

---

# Historial de Alertas

Cada vez que una regla se dispare se almacenará un registro.

Ejemplo:

```text
09:00

EC2

srv-app-01

CPU = 91%
```

Aunque posteriormente el CPU vuelva a valores normales, el registro permanecerá almacenado.

No se manejarán estados como:

- Activa
- Resuelta
- Cerrada

Las alertas representan únicamente un evento ocurrido.

---

# Notification Service

Será un servicio completamente desacoplado.

No conoce reglas.

No conoce AWS.

Únicamente recibe una alerta ya generada.

Ejemplo:

```text
Nueva alerta

↓

Enviar WhatsApp

↓

Registrar envío
```

En el futuro permitirá integrar otros canales:

- Correo
- Slack
- Microsoft Teams
- Webhooks

---

# Persistencia

Se utilizará una base de datos para almacenar:

## Configuración de Alertas

```text
Resource

Thresholds

Enabled

Fecha de modificación
```

---

## Historial

```text
Fecha

Recurso

Tipo

Métrica

Valor

Mensaje enviado
```

---

# Scheduler

El Alert Engine funcionará mediante un proceso periódico.

Ejemplo:

```
Cada 2 minutos

↓

Actualizar Resource Snapshot

↓

Evaluar reglas

↓

Registrar alertas

↓

Enviar notificaciones
```

El intervalo inicial será de **2 minutos**, alineado con el TTL del Resource Snapshot.

---

# Componentes del Módulo

El módulo estará dividido en componentes con responsabilidades claramente definidas.

## Resource Snapshot

Mantiene el estado actual de la infraestructura.

---

## Alert Engine

Evalúa reglas.

---

## Alert Configuration

Administra la configuración personalizada de cada recurso.

---

## Rule Runtime

Mantiene en memoria qué reglas ya fueron disparadas para evitar notificaciones repetidas.

---

## Alert Repository

Persistencia del historial de alertas.

---

## Notification Service

Encargado del envío de notificaciones.

---

## Alert Controller

Expone los endpoints REST para:

- Consultar historial
- Consultar configuraciones
- Modificar reglas
- Habilitar o deshabilitar alertas por recurso

---

# Beneficios de esta Arquitectura

- Reutiliza completamente la infraestructura existente.
- No duplica llamadas a AWS.
- El motor de alertas es totalmente independiente del proveedor de monitoreo.
- Fácil incorporación de nuevos módulos (Meraki, Azure, Prometheus, etc.).
- Alta cohesión y baja dependencia entre componentes.
- Preparada para crecer sin necesidad de rediseñar la arquitectura.
- Reduce significativamente el tráfico hacia AWS reutilizando el Resource Snapshot.
- Evita notificaciones duplicadas mediante un Runtime en memoria.
- Mantiene un historial persistente de todas las alertas generadas.