# 📘 Manual de Usuario - Antigravity WA-ERP Suite
**Sistema de Gestión WhatsApp Business Cloud API con Integración ERP / CRM**

---

## 📋 Índice
1. [Introducción y Visión General](#1-introducción-y-visión-general)
2. [Bandeja Multiagente (WhatsApp Inbox)](#2-bandeja-multiagente-whatsapp-inbox)
   - [Búsqueda y Filtros de Estado](#búsqueda-y-filtros-de-estado)
   - [Gestión de Conversaciones y Mensajería](#gestión-de-conversaciones-y-mensajería)
   - [Herramientas Rápida de Chat](#herramientas-rápidas-de-chat)
   - [Expediente del Cliente y Contexto Financiero](#expediente-del-cliente-y-contexto-financiero)
3. [Embudo de Ventas (CRM Kanban)](#3-embudo-de-ventas-crm-kanban)
4. [Consola ERP y Gestión de Inventario](#4-consola-erp-y-gestión-de-inventario)
   - [Consulta de Productos y Stock](#consulta-de-productos-y-stock)
   - [Creación de Cotizaciones, Pedidos y Facturas](#creación-de-cotizaciones-pedidos-y-facturas)
5. [Motor de Automatización No-Code (Reglas IA)](#5-motor-de-automatización-no-code-reglas-ia)
6. [Dashboard Ejecutivo y Métricas Analytics](#6-dashboard-ejecutivo-y-métricas-analytics)
7. [Configuración Meta Cloud API y Auditoría](#7-configuración-meta-cloud-api-y-auditoría)

---

## 1. Introducción y Visión General
**Antigravity WA-ERP Suite** es una plataforma empresarial integral que conecta la **API Oficial de Meta WhatsApp Cloud (v19.0)** directamente con tus sistemas de **CRM y ERP**.

Permite a los asesores comerciales y agentes de soporte centralizar todas las conversaciones con clientes, consultar disponibilidad de productos en tiempo real, emitir cotizaciones/facturas electrónicas en formato PDF y enviarlas automáticamente por WhatsApp sin salir de la plataforma.

---

## 2. Bandeja Multiagente (WhatsApp Inbox)
Es el centro de operaciones principal donde interactúas con los clientes en tiempo real.

### Búsqueda y Filtros de Estado
Ubicados en la columna lateral izquierda:
- **Buscador**: Permite filtrar chats escribiendo el nombre del cliente, su número telefónico o categoría/tag.
- **Filtro "Todos"**: Muestra la lista completa de chats.
- **Filtro "En Proceso"**: Muestra las conversaciones que están siendo atendidas activamente por un asesor humano.
- **Filtro "IA Bot"**: Muestra los chats donde el bot interactúa automáticamente respondiendo precios o consultas frecuentes.

### Gestión de Conversaciones y Mensajería
- **Selección de Chat**: Haz clic en cualquier contacto de la lista izquierda para cargar su historial de mensajes.
- **Envío de Mensajes**: Escribe en el cuadro de texto inferior y presiona **Enviar** (o la tecla `Enter`).
- **Transferir Chat**: Haz clic en el botón `Transferir Chat` en el encabezado para reasignar la conversación a otro asesor (ej. Ana Gutiérrez).

### Herramientas Rápida de Chat
Debajo de la ventana de chat encontrarás tres herramientas de acceso directo:
1. **📝 Nota Interna**: Permite agregar notas privadas visibles solo para el equipo (no se envían al cliente).
2. **📦 Catálogo ERP**: Adjunta instantáneamente el resumen de precios y stock actual al chat.
3. **🧾 Factura PDF**: Consulta y adjunta la última factura emitida con su respectivo enlace PDF.

### Expediente del Cliente y Contexto Financiero
En el panel lateral derecho visualizarás:
- **Datos CRM**: Nombre del cliente, cédula jurídica, categoría (VIP/Lead) y asesor asignado.
- **Estado Financiero ERP**: Línea de crédito aprobada, saldo pendiente actual y crédito disponible en tiempo real.
- **Historial Reciente ERP**: Documentos comerciales recientes emitidos para este cliente.

---

## 3. Embudo de Ventas (CRM Kanban)
Accede desde la pestaña **"Embudo de Ventas"** en la barra superior.
- Visualiza el flujo completo de ventas dividido en 11 etapas (Nuevo Lead, Cotización, Facturado, etc.).
- Cada tarjeta muestra el título del trato, el monto proyectado ($) y el nombre de la empresa/cliente.
- Te permite rastrear exactamente en qué etapa se encuentra cada oportunidad comercial originada por WhatsApp.

---

## 4. Consola ERP y Gestión de Inventario

### Consulta de Productos y Stock
Pestaña **"Consola ERP"**:
- Tarjetas interactivas con el catálogo de productos, SKU, categoría, precio unitario y cantidad física disponible en bodega.

### Creación de Cotizaciones, Pedidos y Facturas
1. En la bandeja de chat o en la consola ERP, haz clic en **"Crear Cotización / Pedido"**.
2. Selecciona el tipo de documento:
   - **Cotización Formal (COT)**
   - **Pedido de Venta (PED)**
   - **Factura Electrónica (FAC)**
3. Selecciona el producto del catálogo, define la cantidad y haz clic en **"Agregar Item"**.
4. El sistema calculará automáticamente el Subtotal, el Impuesto de Ventas (IVA 13%) y el Total General.
5. Haz clic en **"Generar y Enviar por WhatsApp"**: Se creará el documento en el ERP y se enviará un mensaje con el enlace al documento PDF directamente al cliente de WhatsApp.

---

## 5. Motor de Automatización No-Code (Reglas IA)
Accede desde la pestaña **"Motor de Reglas"**:
- Configura reglas automáticas basadas en palabras clave detectadas en las conversaciones.
- Ejemplo: Cuando el cliente escribe la palabra `"PRECIO"`, el motor ejecuta automáticamente la consulta de inventario `QUERY_INVENTORY` y responde sin intervención humana.
- Permite liberar la carga de los asesores en consultas repetitivas de inventario o facturas.

---

## 6. Dashboard Ejecutivo y Métricas Analytics
Pestaña **"Dashboard Ejecutivo"**:
- **KPIs clave**:
  - Mensajes procesados totales.
  - Leads automáticos capturados en el CRM.
  - Ventas originadas vía WhatsApp ($).
  - Tiempo de respuesta promedio (SLA).
- **Tabla de Rendimiento de Asesores**: Monitorea el estado online de cada vendedor, chats activos, tiempo medio de respuesta y ventas generadas.

---

## 7. Configuración Meta Cloud API y Auditoría
Pestaña **"Configuración Meta"**:
- **Credenciales WhatsApp Cloud API**: Consulta el App ID, Phone Number ID y URLs de Webhooks configurados con Meta.
- **Bitácora de Auditoría (Audit Logs)**: Registro inalterable de acciones realizadas en el sistema (creación de documentos, asignación de leads, transferencias) con fecha, usuario y detalles.

---
*Manual generado automáticamente por Antigravity WA-ERP Suite.*
