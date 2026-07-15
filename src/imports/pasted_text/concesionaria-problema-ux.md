1. IDENTIFICACIÓN DEL PROBLEMA
1.1 Descripción del Problema Real
El problema central no es 'la falta de una aplicación'. El problema real en una concesionaria de autos de lujo es la fragmentación crítica de la información comercial y la ineficiencia operativa en los procesos de ventas, seguimiento de clientes y gestión de inventario de vehículos premium.
De manera cuantitativa, las concesionarías que operan sin un sistema integrado experimentan: un 40% de oportunidades de venta perdidas por falta de seguimiento oportuno al cliente, un tiempo promedio de 45 minutos para preparar una cotización con financiamiento (proceso que debería tomar 5 minutos), errores de inventario en el 28% de los registros por actualización manual en hojas de cálculo desactualizadas, y pérdida de historial de negociaciones por el uso de notas físicas y mensajes de WhatsApp como sistema de CRM.
De manera cualitativa, los asesores comerciales experimentan frustración severa al no poder acceder en tiempo real al estado actualizado del inventario durante una visita con el cliente, generando compromisos de venta sobre vehículos ya reservados. Los clientes de segmento premium, acostumbrados a experiencias de servicio de alto nivel, perciben la desorganización operativa como una señal de bajo profesionalismo, dañando la reputación de la marca.
1.2 Actores Afectados
•	Actores directos: Gerente de Ventas, Asesores Comerciales, Responsable de Inventario, Director Financiero.
•	Actores indirectos: Clientes compradores de vehículos de lujo, Proveedores de financiamiento y seguros, Marcas representadas (distribuidores oficiales).
1.3 Causa Raíz
La causa raíz es la ausencia de un sistema centralizado que integre en tiempo real el catálogo de vehículos, el pipeline de ventas, el historial de clientes y el módulo de simulación financiera, obligando a los equipos a operar con silos de información desconectados.
1.4 Oportunidades de Innovación
•	Automatización del simulador de financiamiento con múltiples entidades bancarias.
•	Digitalización del catálogo con vistas 360° e imágenes de alta resolución.
•	Panel de control en tiempo real para decisiones gerenciales basadas en datos.
•	Historial unificado del cliente para personalizar la experiencia de compra.
•	Alertas automáticas de seguimiento comercial por etapa del embudo de ventas.



2. INVESTIGACIÓN Y COMPRENSIÓN DEL USUARIO (UX RESEARCH)
2.1 Arquetipo de Usuario 1 — Asesor Comercial
CAMPO	DESCRIPCIÓN
Nombre	Carlos Mejía Andrade
Edad	38 años
Rol	Asesor Comercial Senior — Concesionaria LuxAuto S.A.
Educación	Tecnólogo en Ventas y Marketing. 10 años de experiencia en venta de vehículos premium.
Dispositivos	Laptop HP 15" en escritorio, smartphone Samsung Galaxy S22 para campo, tablet iPad Air en sala de exhibición.
Alfabetización digital	Nivel medio-alto. Usa CRM básico, Excel y WhatsApp Business. No conoce sistemas complejos de BI.
Metas principales	Cerrar mínimo 4 ventas mensuales. Llevar seguimiento de 30+ prospectos simultáneamente. Preparar cotizaciones precisas en menos de 5 minutos.
Frustraciones	El inventario en Excel se desactualiza constantemente. No sabe qué prospectos necesitan seguimiento urgente. Calcular financiamiento manualmente con la calculadora del celular es lento y propenso a errores.
Contexto de uso	Usa el sistema en la sala de exhibición con el cliente sentado frente a él, en reuniones presenciales con 20 minutos disponibles. Requiere acceso rápido, sin curvas de aprendizaje complejas.
Expectativa clave	Al abrir el sistema, espera ver su pipeline de ventas actualizado y las alertas de prospectos que requieren contacto ese día.

2.2 Arquetipo de Usuario 2 — Gerente de Ventas
CAMPO	DESCRIPCIÓN
Nombre	Ing. Patricia Vásquez
Edad	45 años
Rol	Gerente de Ventas y Operaciones
Metas principales	Supervisar el rendimiento del equipo comercial. Tomar decisiones de inventario basadas en datos. Proyectar ingresos del mes.
Frustraciones	Debe consolidar datos de múltiples archivos Excel para generar reportes semanales. No tiene visibilidad en tiempo real del estado de las negociaciones.
Expectativa clave	Dashboard ejecutivo con KPIs de ventas, unidades en stock y el ranking de desempeño de asesores al iniciar sesión.



3. OBJETIVOS DEL SISTEMA
3.1 Objetivo General
Desarrollar un sistema web de gestión integral para concesionaria de autos de lujo que centralice, mediante una arquitectura de módulos interconectados, la administración del catálogo de vehículos, el seguimiento del pipeline de ventas, la simulación de financiamiento y la generación de reportes ejecutivos, con el propósito de reducir en un 60% el tiempo de preparación de cotizaciones y eliminar los errores por desactualización de inventario.
3.2 Objetivos Específicos
•	OE-01 (Análisis): Levantar y documentar mínimo 15 requerimientos funcionales y 10 no funcionales del sistema dentro de la primera semana del ciclo de desarrollo, validados con las dos fichas de User Persona definidas.
•	OE-02 (Arquitectura): Diseñar un mapa de navegación jerárquico de máximo 3 niveles de profundidad que estructure los 6 módulos del sistema para el segundo sprint de diseño.
•	OE-03 (UI): Elaborar una guía de estilo visual completa con paleta cromática, escala tipográfica y biblioteca de componentes UI reutilizables para garantizar la consistencia en las 4 vistas principales del prototipo.
•	OE-04 (Validación): Obtener una tasa de aprobación superior al 85% en pruebas de usabilidad con usuarios representativos sobre las pantallas críticas de cotización y catálogo antes del cierre del proyecto.
•	OE-05 (Datos): Definir el diccionario de datos con las 3 entidades principales —Vehículo, Cliente y Transacción— documentando todos los atributos, tipos de dato y relaciones cardinales necesarios para la construcción del modelo relacional de base de datos.



4. LEVANTAMIENTO DE REQUERIMIENTOS (INGENIERÍA DE REQUISITOS)
4.1 Requerimientos Funcionales (RF)
Código	Tipo	Descripción y Regla de Negocio	Criterio de Aceptación UI/UX
RF-001	Funcional	El sistema debe permitir autenticación de usuarios con correo y contraseña, validando credenciales contra base de datos y bloqueando la cuenta tras 5 intentos fallidos.	Mostrar indicador de intentos restantes y mensaje de bloqueo temporal con cuenta regresiva.
RF-002	Funcional	El sistema debe mostrar un catálogo interactivo de vehículos con filtros por marca, modelo, año, precio y disponibilidad. Solo se mostrarán vehículos con estado 'Disponible'.	Los filtros deben actualizarse en tiempo real (sin recarga de página). El total de resultados debe indicarse dinámicamente.
RF-003	Funcional	El sistema debe permitir registrar un nuevo vehículo en el inventario con todos sus atributos (VIN único, marca, modelo, año, color, precio base, estado). El VIN no puede duplicarse.	El campo VIN mostrará validación en tiempo real. Un ícono verde confirmará unicidad antes de guardar.
RF-004	Funcional	El sistema debe permitir comparar simultáneamente hasta 3 vehículos seleccionados del catálogo en una vista comparativa lado a lado con todos sus especificaciones técnicas.	Los atributos distintos entre vehículos se resaltarán en color ámbar para facilitar la comparación visual rápida.
RF-005	Funcional	El simulador de financiamiento debe calcular en tiempo real las cuotas mensuales según: precio del vehículo, porcentaje de entrada (mín. 20%), tasa de interés anual configurable y plazo en meses (12, 24, 36, 48, 60).	Los resultados deben actualizarse instantáneamente al mover cualquier parámetro. Mostrar tabla de amortización completa en modal.
RF-006	Funcional	El sistema debe permitir crear y actualizar fichas de clientes con datos personales, historial de visitas, vehículos de interés y etapa del embudo de ventas (Prospecto, Interesado, Negociación, Cerrado, Perdido).	El cambio de etapa en el embudo debe visualizarse con un pipeline Kanban interactivo de arrastrar y soltar.
RF-007	Funcional	El sistema debe generar y exportar cotizaciones formales en formato PDF con logo de la empresa, datos del vehículo, simulación de financiamiento seleccionada, fecha de validez (30 días) y firma digital del asesor.	El botón 'Exportar PDF' estará deshabilitado hasta que el simulador tenga al menos un escenario calculado.
RF-008	Funcional	El sistema debe registrar el historial de interacciones con cada cliente (llamadas, visitas, correos) con fecha, responsable y notas de seguimiento.	El historial se mostrará en línea de tiempo visual dentro del perfil del cliente, ordenado cronológicamente descendente.
RF-009	Funcional	El Dashboard del Asesor debe mostrar en tiempo real: total de prospectos activos, citas del día, alertas de seguimiento vencidas y el valor acumulado del pipeline de ventas del mes en curso.	Las alertas vencidas deben destacarse con borde rojo. Las métricas se actualizarán sin recarga manual de página.
RF-010	Funcional	El módulo de reportes debe generar estadísticas de ventas filtrables por periodo (semanal, mensual, anual), por asesor y por marca de vehículo.	Los reportes deben mostrarse en gráficas de barras y líneas interactivas. Exportable a Excel (.xlsx) y PDF.
RF-011	Funcional	El sistema debe enviar notificaciones automáticas por correo electrónico al asesor cuando un prospecto tenga más de 72 horas sin actividad registrada.	Las notificaciones también aparecerán como alertas en el ícono de campanilla en el panel superior de la interfaz.
RF-012	Funcional	El sistema debe permitir marcar un vehículo como 'Reservado' para un cliente específico durante un máximo de 5 días hábiles, bloqueando su disponibilidad para otros asesores.	El estado 'Reservado' se mostrará con etiqueta ámbar sobre la imagen del vehículo en el catálogo con contador de tiempo restante.
RF-013	Funcional	El Administrador debe poder gestionar los usuarios del sistema: crear, editar, desactivar cuentas y asignar roles. No se permite eliminar cuentas con historial de transacciones.	Mostrar modal de confirmación con detalle del impacto antes de desactivar una cuenta. Cuentas desactivadas se marcan con badge gris.
RF-014	Funcional	El sistema debe registrar el cierre de venta incluyendo: precio final negociado, descuento aplicado (con validación de límite máximo por rol), forma de pago, financiamiento seleccionado y fecha de entrega proyectada.	El campo de descuento mostrará automáticamente el porcentaje máximo permitido según el rol. Superar el límite bloqueará el botón de guardar.
RF-015	Funcional	El sistema debe permitir subir hasta 10 fotografías de alta resolución por vehículo con previsualización en galería y la opción de designar una imagen como portada del catálogo.	Las imágenes se mostrarán en carrusel con miniaturas. Formatos aceptados: JPG, PNG, WEBP. Peso máximo por imagen: 5 MB.

4.2 Requerimientos No Funcionales (RNF)
Código	Tipo	Descripción y Restricción	Criterio de Aceptación
RNF-001	Rendimiento	El sistema debe responder a cualquier consulta del catálogo con filtros aplicados en menos de 2 segundos bajo condiciones de carga normal (hasta 50 usuarios concurrentes).	Pruebas de carga con JMeter deben confirmar tiempos de respuesta P95 < 2 segundos.
RNF-002	Disponibilidad	El sistema debe garantizar una disponibilidad del 99.5% mensual (uptime), con mantenimientos programados en horarios de baja demanda (madrugada, domingo).	Monitoreo mediante herramienta de uptime con alertas automáticas al equipo de TI cuando la disponibilidad caiga por debajo del umbral.
RNF-003	Seguridad	Todos los datos en tránsito deben protegerse mediante cifrado TLS 1.3. Las contraseñas se almacenarán usando el algoritmo bcrypt con un factor de coste mínimo de 12.	Auditoría de seguridad con OWASP ZAP sin vulnerabilidades críticas o altas antes del despliegue en producción.
RNF-004	Accesibilidad	La interfaz debe cumplir con el estándar WCAG 2.1 nivel AA en todos los componentes, garantizando contraste mínimo de 4.5:1 y navegación completa por teclado.	Validación con herramienta Axe Accessibility o Lighthouse Accessibility Score ≥ 90.
RNF-005	Usabilidad	Un asesor nuevo debe ser capaz de preparar una cotización completa sin asistencia en menos de 10 minutos tras completar la capacitación inicial del sistema.	Prueba de usabilidad con 5 usuarios nuevos en escenario controlado. Tasa de éxito ≥ 80% en la tarea evaluada.
RNF-006	Responsividad	El sistema debe adaptarse correctamente a 3 breakpoints: Mobile (≤768px), Tablet (769px–1024px) y Desktop (≥1025px) sin pérdida funcional.	Pruebas en Chrome DevTools para los 3 breakpoints definidos y en dispositivos físicos representativos de cada categoría.
RNF-007	Mantenibilidad	El código frontend debe desarrollarse bajo el patrón de componentes reutilizables (Atomic Design), con cobertura mínima de pruebas unitarias del 70% en componentes críticos.	Revisión de código en pull requests con SonarQube sin deuda técnica crítica bloqueante.
RNF-008	Privacidad	Los datos personales de los clientes (cédula, teléfono, correo) deben ser accesibles únicamente por el asesor propietario del registro y por el Administrador del sistema.	Prueba de penetración de roles: un asesor no debe poder ver los clientes de otro asesor mediante manipulación de parámetros en la URL.
RNF-009	Recuperación	El sistema debe realizar copias de seguridad automáticas de la base de datos cada 24 horas con retención de 30 días, garantizando un tiempo de recuperación (RTO) menor a 4 horas.	Drill de recuperación trimestral documentado con tiempo de restauración medido y validado por el equipo de TI.
RNF-010	Internacionalización	El sistema debe soportar formatos numéricos y de fechas localizados para Ecuador (DD/MM/AAAA, separador de miles: punto, separador decimal: coma) en todos los campos de ingreso y visualización.	Validar que el simulador de financiamiento muestre correctamente valores como $125.000,00 (ciento veinticinco mil dólares) sin ambigüedad.



5. IDENTIFICACIÓN DE ENTIDADES Y DATOS
5.1 Relaciones Cardinales
•	Un VEHÍCULO puede aparecer en muchas TRANSACCIONES, pero una TRANSACCIÓN pertenece a exactamente un VEHÍCULO.
•	Un CLIENTE puede tener muchas TRANSACCIONES a lo largo del tiempo, pero una TRANSACCIÓN pertenece a un único CLIENTE.
•	Un USUARIO (Asesor) puede tener asignados muchos CLIENTES, pero un CLIENTE tiene un único ASESOR responsable en cada momento.

5.2 Diccionario de Datos — Entidad: VEHÍCULO
Nombre del Campo	Tipo de Dato	Restricción	Obligatorio	Representación UI
vehiculo_id	Integer	PK, Auto-increment	Sí	No visible para el usuario
vin	String (17)	Único, Not Null	Sí	Input texto con validación en tiempo real
marca	String (50)	Not Null	Sí	Select Dropdown
modelo	String (80)	Not Null	Sí	Input texto
año	Integer (4)	Not Null, Rango 2000–2030	Sí	Select Dropdown numérico
color	String (30)	Not Null	Sí	Select con muestra de color
precio_base	Float (10,2)	Not Null, > 0	Sí	Input numérico con formato moneda
estado	Enum	Not Null	Sí	Radio button: Disponible / Reservado / Vendido
descripcion	Text	Nullable	No	Textarea con contador de caracteres (máx. 500)
imagenes	Array de String (URLs)	Nullable, máx 10	No	Componente de carga múltiple de imágenes

5.3 Diccionario de Datos — Entidad: CLIENTE
Nombre del Campo	Tipo de Dato	Restricción	Obligatorio	Representación UI
cliente_id	Integer	PK, Auto-increment	Sí	No visible para el usuario
cedula	String (13)	Único, Not Null	Sí	Input con validación de formato ecuatoriano
nombres	String (100)	Not Null	Sí	Input texto
apellidos	String (100)	Not Null	Sí	Input texto
telefono	String (15)	Not Null	Sí	Input con formato +593XXXXXXXXX
email	String (150)	Único, Not Null	Sí	Input email con validación de formato
etapa_embudo	Enum	Not Null	Sí	Tarjeta Kanban (Pipeline visual)
asesor_id	Integer	FK → Usuario, Not Null	Sí	Asignado automáticamente al usuario en sesión
fecha_registro	DateTime	Not Null, Default: NOW()	Automático	Solo lectura — mostrado en perfil del cliente

5.4 Diccionario de Datos — Entidad: TRANSACCIÓN (Cierre de Venta)
Nombre del Campo	Tipo de Dato	Restricción	Obligatorio	Representación UI
transaccion_id	Integer	PK, Auto-increment	Sí	No visible para el usuario
cliente_id	Integer	FK → Cliente, Not Null	Sí	Selector de búsqueda de cliente
vehiculo_id	Integer	FK → Vehículo, Not Null	Sí	Selector de vehículo disponible
precio_final	Float (10,2)	Not Null, > 0	Sí	Input numérico (moneda). Solo editable con rol Gerente
descuento_pct	Float (5,2)	Not Null, 0–15%	Sí	Slider o input numérico con límite visual
forma_pago	Enum	Not Null	Sí	Radio button: Contado / Financiamiento
plazo_meses	Integer	Nullable (solo si financiamiento)	Condicional	Select: 12, 24, 36, 48, 60 (se activa si forma_pago=Financiamiento)
fecha_venta	Date	Not Null, Default: TODAY()	Automático	Solo lectura
fecha_entrega	Date	Not Null, > fecha_venta	Sí	Date picker con restricción de fechas pasadas
