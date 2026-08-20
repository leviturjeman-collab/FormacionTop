---
title: Arquitectura visual y demo funcional
type: documento_visual
updated: 2026-08-18
---

# Arquitectura visual y demo funcional

## Mapa general del producto

```mermaid
flowchart LR
    A["Documentos Markdown"] --> B["Generador de catálogo"]
    C["Workflows n8n JSON"] --> B
    B --> D["Portal React"]
    D --> E["Biblioteca"]
    D --> F["Skills"]
    D --> G["Automatizaciones"]
    D --> H["Laboratorio visual"]
    D --> I["Demo funcional"]
    E --> J["Progreso local"]
    I --> K["Evidencia exportable"]
```

El generador funciona como adaptador entre una bóveda orientada a escritura y una aplicación orientada a uso. De esta forma, la formación puede seguir editándose en Obsidian y el alumno puede consumirla con búsqueda, navegación y seguimiento.

## Secuencia de la demo

```mermaid
sequenceDiagram
    participant U as Usuario
    participant W as Web
    participant V as Validador
    participant C as Clasificador
    participant H as Responsable humano
    participant O as Operaciones
    U->>W: Envía lead
    W->>V: Payload + consentimiento
    alt Datos inválidos
        V-->>U: Bloqueo explicado
    else Datos válidos
        V->>C: Lead normalizado
        C-->>W: Score + prioridad + confianza
        W->>H: Solicita aprobación
        alt Rechazado
            H-->>O: Crear tarea de revisión
        else Aprobado
            H->>O: Alta CRM + email
            O-->>W: Logs y resultado
            W-->>U: Evidencia exportable
        end
    end
```

La puerta humana es una decisión de arquitectura, no una limitación. Los procesos con impacto comercial, económico, legal o reputacional no deberían ejecutar acciones externas únicamente porque un modelo generó una respuesta plausible.

## Contrato de datos propuesto

```json
{
  "lead": {
    "name": "Laura Martín",
    "email": "laura@ejemplo.es",
    "company": "Estudio Norte",
    "budget": 5000,
    "need": "Automatizar seguimiento comercial",
    "consent": true
  },
  "classification": {
    "score": 92,
    "priority": "high",
    "confidence": 0.91,
    "reasons": ["budget_fit", "clear_need", "company_identified"]
  },
  "decision": {
    "status": "approved",
    "reviewer": "sales-owner",
    "timestamp": "2026-08-18T10:00:00Z"
  }
}
```

En producción este contrato debe validarse antes y después del paso LLM. El modelo no decide el formato; el sistema define el formato y rechaza cualquier salida que no lo cumpla.

## Capas de seguridad

```mermaid
flowchart TB
    A["Entrada externa"] --> B["Límite de tamaño y rate limit"]
    B --> C["Validación de esquema"]
    C --> D["Consentimiento y minimización"]
    D --> E["Clasificación con salida estructurada"]
    E --> F["Reglas de coste y confianza"]
    F --> G["Aprobación humana"]
    G --> H["Acción con mínimo privilegio"]
    H --> I["Log sin datos sensibles"]
```

Cada capa responde a un fallo diferente. El rate limit evita abuso; el esquema evita datos inesperados; el consentimiento limita el tratamiento; la salida estructurada reduce ambigüedad; la aprobación controla impacto; el mínimo privilegio limita daños; y el log permite investigar.

## Conversión a n8n

El formulario puede llamar a un Webhook de n8n. El primer nodo Code normaliza el payload y devuelve un error `400` si faltan campos. Un nodo IF separa los casos sin consentimiento. El nodo LLM debe solicitar JSON estricto y validar el resultado. El paso de aprobación puede enviar un mensaje con enlaces firmados; el workflow espera el callback. Tras aprobar, nodos específicos escriben en CRM y preparan el email. La última rama siempre registra resultado, duración, coste, reintentos y causa de error.

La respuesta HTTP inicial no debe quedar esperando indefinidamente. Para procesos largos conviene responder `202 Accepted` con un identificador de ejecución y actualizar el estado de forma asíncrona.

## Métricas de la demo real

- Porcentaje de payloads válidos.
- Porcentaje de leads por prioridad.
- Tasa de aprobación humana.
- Tiempo medio hasta aprobar.
- Tasa de alta correcta en CRM.
- Tasa de entrega de emails.
- Coste LLM por lead.
- Reintentos y errores por integración.
- Falsos positivos detectados por comerciales.
- Conversión final de lead a oportunidad.

Una automatización no se considera buena porque “funciona”. Se considera buena cuando reduce tiempo o errores sin aumentar riesgos, y puede demostrarse con métricas antes y después.
