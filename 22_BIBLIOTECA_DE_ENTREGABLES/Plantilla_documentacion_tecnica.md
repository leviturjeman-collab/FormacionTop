---
titulo: "Plantilla de documentación técnica"
tipo: "plantilla_entregable"
nivel: "transversal"
fase: "construccion_portfolio"
estado: "vigente"
ultima_revision: "2026-08-25"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "plantilla_entregable", "transversal"]
entregable: "plantilla reutilizable"
---

# Plantilla de documentación técnica

Esta documentación no se escribe para lucirse: se escribe para la persona que
va a tener que arreglar esto un viernes a las seis, y esa persona puede que
seas tú dentro de ocho meses sin acordarte de nada.

Regla de oro: si al leerla no se puede **arrancar, comprobar y deshacer** el
sistema sin preguntar a nadie, no está terminada.

## Qué es esto, en una frase

Qué hace el sistema y para quién, sin tecnicismos. La lee primero alguien que
no sabe qué está mirando.

## Cómo funciona, por encima

El recorrido completo en cinco o seis pasos en lenguaje normal, desde lo que lo
dispara hasta lo que queda hecho. Un dibujo ayuda mucho aquí, aunque sea una
foto de una servilleta.

1. [Disparador]
2. [Paso]
3. [Paso]
4. [Resultado y quién se entera]

## Qué hace falta para que funcione

Lista completa de dependencias. Cada línea con dónde se consigue y qué pasa si
falta, porque «falta una clave» y «el sistema entero está caído» se parecen
mucho desde fuera.

| Necesita | Dónde se consigue | Qué pasa si falta |
|---|---|---|
| | | |

## Variables y claves

Los **nombres** de todas las variables, nunca sus valores. Los valores viven en
el gestor de contraseñas o en el panel del servicio, y este documento se puede
compartir.

| Nombre | Para qué sirve | De dónde se saca | ¿Secreta? |
|---|---|---|---|
| | | | Sí / No |

> Este documento no contiene ninguna clave. Si alguna vez pegas una aquí,
> considérala comprometida y rótala.

## Cómo se arranca

Los pasos exactos, uno por línea, con lo que debería verse después de cada uno.
Escritos para alguien que nunca lo ha arrancado.

```bash
# 1. [qué hace esta orden]
[orden]
# debería salir: [texto concreto]
```

## Cómo se comprueba que está bien

Una prueba de menos de dos minutos que confirme que todo funciona de verdad, no
solo que el proceso está encendido. Idealmente algo que se pueda ejecutar en
frío cualquier lunes.

1. [Acción]
2. Debería ocurrir: [resultado observable]
3. Si no ocurre, ir a «Qué se rompe y cómo se arregla».

## Qué se rompe y cómo se arregla

Los fallos reales que ya han pasado, con el mensaje literal. Este apartado
crece cada vez que algo falla, y es lo que hace que la documentación gane valor
con el tiempo en lugar de envejecer.

| Mensaje o síntoma | Qué significa | Qué se hace |
|---|---|---|
| | | |

## Cómo se deshace

Qué hacer si un cambio empeora las cosas: cómo volver a la versión anterior,
qué se pierde al hacerlo y cuánto tarda. Escríbelo aunque nunca lo hayas
necesitado; el día que haga falta, nadie estará en condiciones de improvisarlo.

## Copias de seguridad

Qué se copia, cada cuánto, dónde acaba la copia y —lo que casi nadie
escribe— **cómo se restaura**. Una copia que nunca se ha probado a restaurar no
es una copia de seguridad.

## Límites conocidos

Qué NO hace este sistema, hasta cuánto volumen aguanta y qué casos se sabe que
no cubre. Escribirlo evita que alguien lo use para algo que no debía y culpe al
sistema.

## Quién lo mantiene

Nombre, cómo se le localiza y qué pasa cuando no esté. Sin este apartado, todo
lo anterior depende de que alguien se acuerde de que existe.

**Última revisión de este documento:** [fecha]. Si han pasado más de seis
meses, comprueba antes de fiarte.
