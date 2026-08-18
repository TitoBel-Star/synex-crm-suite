# 🎭 Guía de Simulacro - Ciclo Comercial Completo (Demo Script)

Esta guía describe el paso a paso detallado para realizar una demostración (simulacro) de ventas de la suite **Synex Cloud CRM**, ideal para mostrar el flujo de trabajo completo a clientes o gerentes.

---

## 🛠️ Requisitos Previos
1. Asegúrate de tener el servidor backend encendido (`http://localhost:3000`).
2. Abre la aplicación en Google Chrome.

---

## 🧭 Flujo del Simulacro (Pasos 1 al 6)

### 💬 Paso 1: Captación del Lead y Conversación (Bandeja Multiagente)
* **Objetivo**: Mostrar la recepción de mensajes de WhatsApp y la interacción humana/IA.
* **Acciones en la pantalla**:
  1. Ve a la pestaña **Bandeja Multiagente** en el menú superior.
  2. A la izquierda verás la lista de chats activos (ej: *Distribuidora Los Laureles*).
  3. Haz clic en el chat para abrir la conversación.
  4. Envía un mensaje manual escribiendo en el cuadro de texto inferior y haciendo clic en **Enviar**.
  5. Señala el switch de **IA Bot** a la izquierda, que muestra cómo la inteligencia artificial responde de forma autónoma a los clientes sobre inventarios y precios.

---

### 📋 Paso 2: Registro del Expediente Comercial (Expediente CRM)
* **Objetivo**: Demostrar cómo se guarda y sincroniza la ficha del cliente con el ERP.
* **Acciones en la pantalla**:
  1. Con el chat del cliente seleccionado, mira el panel derecho.
  2. Haz clic en el botón azul **Registrar / Editar Cliente CRM**.
  3. Cambia o completa los campos:
     * **Identificación (Cédula Jurídica)**: `3-101-778899`
     * **Línea de Crédito Aprobada**: `$50,000.00`
     * **Tipo de Cliente**: Selecciona `CLIENTE VIP` o `NUEVO LEAD`.
  4. Haz clic en **Guardar**.
  5. **Efecto visual**: Observa el chat; se habrá enviado un mensaje automático simulando la confirmación de la ficha de cliente y en el panel derecho verás el crédito disponible calculado en tiempo real.

---

### 🗂️ Paso 3: Gestión Visual de Oportunidades (Embudo de Ventas)
* **Objetivo**: Mostrar el flujo del trato comercial en el tablero Kanban.
* **Acciones en la pantalla**:
  1. Haz clic en la pestaña **Embudo de Ventas** en el menú superior.
  2. Explicar que el embudo consta de 11 etapas que definen el camino desde un lead frío hasta la post-venta.
  3. Toma una de las tarjetas de los tratos (ej: *Lote Bebidas Enero*) y **arrástrala** a otra columna (ej: de *Cotización* a *Negociación*).
  4. Explica que la tarjeta actualiza su etapa en el servidor de forma inmediata.

---

### 🧾 Paso 4: Facturación y Conexión Contable (Consola ERP)
* **Objetivo**: Surtir la orden e impactar la contabilidad financiera del ERP.
* **Acciones en la pantalla**:
  1. Regresa a la **Bandeja Multiagente** y haz clic en el botón **Crear Cotización / Pedido** del panel central.
  2. En la ventana emergente, selecciona productos del catálogo (ej: *Aceite Vegetal 1L* o *Arroz 5kg*), coloca una cantidad y haz clic en el botón de agregar.
  3. Haz clic en **Guardar Documento**.
  4. **Efecto Contable**: El sistema calcula el Subtotal, IVA (13%) e inyecta en la conversación de WhatsApp un mensaje con el **Asiento Contable ERP** generado (Débitos y Créditos automáticos en cuentas contables de ventas e IVA).

---

### 📉 Paso 5: Gestión de Pérdidas y Motivos de Rechazo
* **Objetivo**: Controlar por qué se caen los tratos en el negocio.
* **Acciones en la pantalla**:
  1. Muestra que si un trato es cancelado, se puede cerrar como "Perdido".
  2. El sistema requiere clasificar la pérdida bajo uno de los **6 Motivos de Pérdida Oficiales**:
     1. *Precio muy alto*
     2. *La calidad no le gusta al cliente*
     3. *Sin presupuesto / Proyecto cancelado*
     4. *No tiene crédito con la empresa*
     5. *No tenemos el producto (sin existencias)*
     6. *Percibe mal servicio de parte de la empresa*

---

### 📊 Paso 6: Minería de Procesos e Indicadores de Conformidad
* **Objetivo**: Auditar lo que está pasando en la realidad frente al diseño perfecto del proceso.
* **Acciones en la pantalla**:
  1. Ve a la pestaña **Minería de Procesos**.
  2. Haz clic en **Usar Dataset de Ejemplo CRM** (cargará los datos al instante usando la base de datos local).
  3. Haz clic en el botón azul **Descubrir Proceso**.
  4. **Demostración**:
     * **Montos en los nodos**: Muestra cómo cada círculo del proceso indica cuántos dólares de cotizaciones fluyen por ahí (ej. `Crear Lead (22 - $493,753)`).
     * **Autoajuste**: Destaca que el diagrama se autoajusta verticalmente para que quepa en cualquier pantalla.
     * **Conformance Checking**: Abajo a la izquierda verás las 4 desviaciones críticas del negocio (ej. *Omisión de Demo* o *Contrato Grande sin Legal*). Haz clic sobre cualquiera de las tarjetas de desviación y observa cómo la tabla de la derecha se filtra automáticamente en tiempo real mostrando únicamente los casos infractores.
