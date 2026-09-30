# Instrucciones para agentes

Las rutas documentales son relativas a la raíz del repositorio.

1. Leer MASTER_PROMPT.md y la tarea actual.
2. Leer el brief y la especificación de página/función correspondiente.
3. Inspeccionar la implementación antes de crear componentes o capas nuevas.
4. Consultar solo las normas afectadas según la tabla siguiente.
5. Implementar cambios pequeños, coherentes y verificables.
6. Ejecutar pnpm check y las pruebas específicas que requiera el riesgo.
7. Reportar cambios, evidencia y limitaciones; actualizar la documentación afectada.

| Tarea | Consultar |
|---|---|
| Iniciar proyecto | docs/process/WORKFLOW.md y docs/product/BRIEF.md |
| Contenido o página | docs/product/SITEMAP_CONTENT.md y docs/engineering/SEO_CONTENT.md |
| UI | docs/product/DESIGN_BRIEF.md y docs/engineering/DESIGN_SYSTEM.md |
| Función full stack | docs/engineering/ARCHITECTURE.md y docs/engineering/SECURITY_DATA.md |
| Autorización / DB | docs/product/DATA_PERMISSIONS.md y docs/engineering/SECURITY_DATA.md |
| Configuración | docs/engineering/ENVIRONMENTS.md |
| Validación | docs/engineering/QUALITY.md |
| Publicación | docs/operations/DEPLOYMENT.md y docs/operations/LAUNCH_CHECKLIST.md |

Los placeholders no son requisitos aprobados. La página Estudio Base es un ejemplo.
No crear datos de negocio ni cuentas remotas sin una necesidad de la tarea.
No ejecutar borrado masivo, reset, restore o migraciones destructivas sobre datos
reales sin autorización explícita. No publicar producción sin autorización para
esa publicación. Preparar y comprobar el cambio no equivale a publicarlo.
