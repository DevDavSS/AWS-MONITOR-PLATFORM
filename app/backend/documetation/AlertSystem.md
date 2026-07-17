# Sistema de Alertas
## Especificación Funcional y Arquitectónica

**Proyecto:** AWS Monitoring Dashboard

**Versión:** 1.0



---

# 1. Introducción

## 1.1 Objetivo

El Sistema de Alertas tiene como objetivo supervisar continuamente los recursos monitoreados por la plataforma, evaluar reglas configurables definidas por el usuario y generar alertas cuando dichas condiciones sean satisfechas.

El módulo constituye un subsistema independiente dentro del AWS Monitoring Dashboard y será responsable exclusivamente de la evaluación de reglas, el registro histórico de eventos y el envío de notificaciones.

El sistema estará diseñado para ser desacoplado del proveedor de infraestructura (AWS), permitiendo en el futuro integrar nuevos orígenes de monitoreo sin modificar la lógica del motor de alertas.

---

## 1.2 Alcance

La primera versión del Sistema de Alertas permitirá:

- Configurar reglas de monitoreo por recurso.
- Evaluar periódicamente el estado actual de los recursos monitoreados.
- Generar alertas cuando una regla sea satisfecha.
- Registrar todas las alertas generadas.
- Consultar el historial de alertas desde la aplicación.
- Enviar notificaciones mediante WhatsApp.



---

## 1.3 Objetivos del diseño

El módulo deberá cumplir los siguientes principios:

- Independencia de AWS.
- Arquitectura desacoplada.
- Reutilización del sistema de monitoreo existente.
- Bajo número de consultas hacia AWS.
- Alta escalabilidad.
- Fácil incorporación de nuevos tipos de recursos.
- Configuración personalizada por recurso.
- Historial persistente de alertas.

---

# 2. Contexto del Sistema
## 2.1 Diagrama de arquitectura del funcionamiento del backend, consulta a aws y guardado de datos en memoria.
 ```text
                   Scheduler (cada 2 min)
                           │
                           ▼
              Resource Refresh Service
                           │
        ┌──────────┬────────┴─────────┬──────────┐
        ▼          ▼                  ▼          ▼
   EC2 Aggregator RDS Aggregator EKS Aggregator Meraki Aggregator
        │          │                  │          │
        └──────────┴──────────┬───────┴──────────┘
                              ▼
                      Resource Cache
                     (TTL = 2 minutos)
                     /              \
                    /                \
                   ▼                  ▼
             Frontend          Resource Snapshot
                                      │
                                      ▼
                                Alert Engine
                                      │
                                      ▼
                              Alert / Notification
                                      │
                                      ▼
                               WhatsApp API

 ```
(Aquí posteriormente describiremos cómo interactúa con el Resource Snapshot, Aggregators, Backend, Frontend y WhatsApp.)

---

# 3. Arquitectura General (Simplificada)


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

# 4. Modelo de Dominio

(Aquí definiremos AlertRule, Alert, Notification, RuntimeRule, etc.)
## 4.1 Alert Rule

*Alert rule ubicado en ./app/backend/src/types/alert/AlertRule.ts*
Filosofía:
```text
Las AlertRules son inmutables.

Una regla nunca se edita.

Una regla nunca se elimina.

Cuando el usuario desea modificar una configuración:

La regla actual se deshabilita.
Se crea una nueva regla con un nuevo ID.
Las alertas futuras utilizarán la nueva regla.
Las alertas históricas seguirán apuntando a la regla anterior.

De esta manera se preserva el contexto histórico de todas las alertas generadas.
```

Alert rule es una interfaz dedicada a establecer un formato de estructura para los datos de una Regla de Alertas, en base a estas reglas sera como se decidira monitorear cada recurso y la activacion de alertas. 

Formato generico de ejemplo (Alert Engine no necesita concocer los servicios)

```typescript
interface AlertRule {

    id: string;                           // Id de la regla (para la DB)

    organizationId: string;

    accountId: string;

    service: AlertService;                // Servicio al que pertenece el recurso

    resourceType: ResourceType;           // Tipo de recurso que estara asociado a la regla

    resourceId: string;                   // Id del recurso que esta asociado (ID, Proveido de AWS)

    metric: string;                       // Métrica a monitorear puede ser CPU, RAM, NETWORK, WRITE IOPS

    operator: AlertOperator;              // Operador lógico

    threshold: number;                    // Numero límite

    enabled: boolean;                     // Alertas habilitadas

}

```
#Responsabilidades
Definir cuándo debe dispararse una alerta.
Identificar el recurso monitoreado.
Permanecer inmutable una vez creada.

---
## 4.2  Alert

*Ubicado en ./app/backend/src/types/alert/Alert.ts*
Alert es una interfaz dedicada a establecer el formato en el que se construiran las Alertas en el sistema

``` typescript
interface Alert {

    id: string;                           //ID de la alerta (para la DB)

    ruleId: string;                       //ID de la regla relacionada (para la DB)

    organizationId: string;

    accountId: string;

    region: string

    service: AlertService;                // Que servicio pertenece el recurso que salto la alerta

    resourceType: ResourceType;           // Tipo de Recurso que activo la alerta

    resourceId: string;                   // ID del recurso (Proveido por AWS)

    resourceName: string;                 // Nombre del recurso

    operator: AlertOperator;              // Operador lógico

    metric: string;                       // Metrica que cumplio condiciones para generar alerta

    currentValue: number;                 // Valor de la métrica en el tiempo dque genero la alerta

    threshold: number;                    // Valor límite establecido

    createdAt: Date;                      // Fecha en la que se creá y registro la alerta

}

```
#Responsabilidades
Registrar que una regla fue satisfecha.
Conservar el contexto completo del evento.
Servir como historial permanente de alertas.

---
## 4.3 AlertService, ResourceType, AlertOperator (Hardcoded Types)
*Ubicado en ./app/backend/src/types/alert/Alert.ts*

Hardcoded Types son interfaces configurables y escalables dependiendo de las nuevas integraciones que se hagan a la plataforma, estas son dependencias de las interfaces previas


``` typescript
type AlertService =       // Servicios integrados en esta primera version V1
    | "ec2"
    | "eks"
    | "rds"
    | "meraki";

type ResourceType =       // Tipos de Recursos a monitorear integrados en la primera version V1
    | "instance"
    | "cluster"
    | "nodegroup"
    | "node"
    | "device";

type AlertOperator =       // Operadors Lógicos para las reglas
    | ">"
    | ">="
    | "<"
    | "<="
    | "="
    | "!=";
```
---
## 4.4 Notification

*Ubicado en ./app/backend/src/types/alert/Notification.ts*

Estructura sobre como será construida la Notificacion

``` typescript
interface Notification {

    id: string;                    // ID de notificacion

    alertId: string;               // ID de la alerta que esta relacionada

    channel: "whatsapp";           // plataforma donde se enviará la notificacion

    sentAt: Date;                  // Fecha en la cual fué enviada

}
```

---

## 4.5 RuntimeRule

**Ubicado en:** `./app/backend/src/types/alert/RuntimeRule.ts`

Estructura temporal utilizada por el **Alert Engine** para mantener el estado de ejecución de las reglas y evitar el envío repetitivo de alertas mientras una condición permanezca activa.

Esta estructura **no se almacena en la base de datos**, únicamente existe en memoria durante la ejecución del servicio.

```ts
interface RuntimeRule {

    ruleId: string;         // Regla monitoreada

    triggered: boolean;     // Indica si la alerta ya fue disparada

}
```



---

# 5. Resource Snapshot

## 5.1 Objetivo

El **Resource Snapshot** representa el estado actual de un recurso monitoreado en un instante determinado.

Su propósito es desacoplar el Alert Engine de los servicios de AWS. El motor de alertas nunca consultará directamente EC2, RDS, EKS o CloudWatch; únicamente evaluará los snapshots construidos a partir del **ResourceCache**.

Cada Snapshot contiene toda la información necesaria para evaluar las reglas configuradas para un recurso.

Flujo
``` text
Scheduler
      │
      ▼
Resource Cache
      │
      ▼
ResourceSnapshotService
      │
      ▼
ResourceSnapshot[]
      │
      ▼
AlertEngine
```
---
## 5.2 Caracteristicas

- Es una representación temporal en memoria.
- No se almacena en la base de datos.
- Se construye a partir del ResourceCache.
- Cada Snapshot representa un único recurso.
- Contiene únicamente el estado actual del recurso.
---
## 5.3 Interfaz

Esta interfaz intenta abarcar todas las interfaces distintas de cada servicio (EC2,RDS,EKS,Meraki)
Su única responsabilidad es construir una coleccion homogénea de ResourceSanpshot.

``` typescript
interface ResourceSnapshot {

    organizationId: string;

    accountId: string;    

    region: string;
    
    service: AlertService

    resourceType: ResourceType

    resourceId: string;

    resourceName: string;

    metricas: Record<string, number>; 
}
```
---
## 5.4 Ejemplos

EC2:
``` typescript
{
    service: "ec2",

    resourceType: "instance",

    resourceId: "i-0abc123",

    resourceName: "srv-app-prod-01",

    metrics: {

        cpu: 84,

        memory: 63,

        disk: 71,

        network: 12,

    }

}
```
RDS:
``` typescript
{
    service: "rds",

    resourceType: "instance",

    resourceId: "database-prod",

    resourceName: "Aurora Production",

    metrics: {

        cpu: 62,

        memory: 47,

        connections: 143,

        "read-iops": 315,

        "write-iops": 121,

    }

}
```  
EKS Cluster:
``` typescript
{
    service: "eks",

    resourceType: "cluster",

    resourceId: "cluster-prod",

    resourceName: "Production Cluster",

    metrics: {   //Metricas Promedio

        cpu: 73,

        memory: 58,

        disk: 71,

        network: 12,

    }

}
```
--- 
## 5.5 Resource Snapshot Service

Este es el servicio que se dedica a construir el snapshot de los recursos utilizando el caché creado por el backend del app.

---

# 6. Runtime Rule Resolver

---

# 7. Alert Evaluator



---

# 8. Alert Engine

---

# 9. Configuración de Reglas

---

# 10. Evaluación de Alertas

---

# 11. Persistencia

---

# 12. Notification Service

---

# 13. API REST

---

# 14. Frontend

---

# 15. Flujo General

---

# 16. Consideraciones de Escalabilidad

---

# 17. Trabajo Futuro