---
titulo: "Plantilla de workflow de n8n"
tipo: "plantilla_entregable"
nivel: "transversal"
fase: "construccion_portfolio"
estado: "vigente"
ultima_revision: "2026-08-25"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "plantilla_entregable", "transversal", "n8n"]
entregable: "plantilla reutilizable"
---

# Plantilla de workflow de n8n

Esta ficha se rellena **antes** de arrastrar la primera caja en n8n y se
guarda junto al flujo. Cinco minutos escribiendo aquí ahorran tardes enteras
después, y es la única explicación que vas a tener dentro de seis meses de por
qué el flujo está hecho así.

Sirve igual para Zapier o Make: lo que cambia son las cajas, no las preguntas.

## Nombre y para qué

Nombre del flujo tal y como aparece en n8n, y una frase de qué resuelve. El
nombre se lee dentro de un año en una lista de treinta: «Gmail → Sheets» no
dice nada, «Leads de la web a hoja de comercial + aviso» sí.

**Nombre:**
**Resuelve:**
**Lo hacía a mano:** [quién] · **Tiempo que se iba:** [minutos × veces al mes]

## 1 · Disparador

Qué tiene que pasar exactamente para que esto arranque. Tan concreto que otra
persona pueda comprobar si se cumple sin preguntarte. «Cuando llegue un
correo» no vale: ¿de quién, con qué en el asunto, a qué buzón?

**Tipo:** [manual / programado / webhook / de aplicación]
**Condición exacta:**
**Cada cuánto comprueba:** [al instante / cada X minutos]
**Aviso:** ¿este disparador ve solo lo que pasa DESPUÉS de activarlo? [sí/no]

## 2 · Filtro: qué NO debe pasar

Va inmediatamente detrás del disparador, antes de cualquier acción. Es lo que
evita mandar mensajes de verdad a personas de verdad por casos que no debían.
El apartado que todo el mundo se salta y el que más caro sale.

- Se corta si: [condición]
- Se corta si: [condición]

## 3 · Acciones, en orden

Una línea por acción, en castellano, como se lo contarías a un compañero
nuevo. Los nombres de los nodos se eligen después.

| # | Qué hace | Sobre qué servicio | ¿Escribe o solo lee? |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 4 · Cómo sabré que ha funcionado

Una comprobación concreta y observable, de las que se hacen en menos de un
minuto sin abrir n8n. Si no puedes escribirla, el proceso no está claro y
montarlo va a salir mal.

> «Hay una fila nueva en la hoja Y un mensaje en el canal, con el mismo correo
> en los dos sitios.»

## 5 · Qué pasa si falla a mitad

El apartado que distingue un flujo que aguanta de uno que hay que apagar a la
semana. Contesta a las tres, sin excepción:

- **Si llega un dato incompleto:** [qué debe hacer el flujo]
- **Si el mismo caso entra dos veces:** [se duplica o no, y cómo se evita]
- **Si el servicio de destino está caído:** [reintenta, avisa, o se pierde]
- **Si revienta en el paso 2 de 3:** qué queda hecho y qué queda sin hacer, y
  si eso deja algo incoherente que alguien tenga que arreglar a mano.

## 6 · Credenciales que usa

Los nombres de las conexiones, nunca sus valores. Y con qué permisos, porque
lo normal es que estén de más.

| Servicio | Nombre de la credencial en n8n | Permisos que necesita de verdad |
|---|---|---|
| | | |

## 7 · Datos personales

Qué datos de personas pasan por aquí y por qué servicios circulan. Si la
respuesta es «ninguno», escríbelo igual: el apartado sirve para haberlo
pensado.

**Datos que circulan:**
**Servicios por los que pasan:**
**Dónde acaban guardados:**

## 8 · Coste

**Ejecuciones al mes estimadas:** [número]
**Coste en n8n:** [según plan]
**Coste en lo que llama:** [APIs de pago, modelos de IA, mensajería]
**Total al mes:**

## 9 · Pruebas hechas antes de activarlo

Marca solo lo que hayas comprobado de verdad, no lo que supongas.

- [ ] Caso normal, de principio a fin
- [ ] Caso que el filtro debe cortar (y se corta)
- [ ] Caso con campos vacíos o incompletos
- [ ] Mismo caso dos veces seguidas
- [ ] Texto con acentos, eñes y emojis
- [ ] Servicio de destino caído o con credencial revocada
- [ ] Zona horaria: comprobada la hora real a la que salta
- [ ] Flujo de error configurado y probado provocando un fallo

## 10 · Mantenimiento

**Quién lo arregla cuando se rompa:**
**Cómo se entera de que se ha roto:** [flujo de error, aviso, nadie]
**Revisar el:** [fecha, dentro de seis meses]
**Última modificación:** [fecha y qué se cambió]
