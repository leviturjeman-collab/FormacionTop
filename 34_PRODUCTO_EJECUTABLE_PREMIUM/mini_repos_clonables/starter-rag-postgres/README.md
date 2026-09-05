# Recuperación documental con citas

`python src/rag_demo.py --demo` ejecuta sin red ni dependencias externas: ingesta dos propietarios y responde con una cita del corpus autorizado. Para Postgres instala requirements.txt, configura DATABASE_URL y ejecuta `python src/rag_demo.py --owner alumno-a --file documento.txt --document-id doc1 --title Manual`; consulta con `--owner alumno-a --question "horario"`.

La recuperación léxica devuelve extractos literales con documento/posición/versión y se abstiene si no hay coincidencias. No usa embeddings ni afirma generar prosa con IA. El CLI recibe owner; una app web debe derivarlo de sesión autenticada. Reingestar mismo documento/versión no lo duplica.
