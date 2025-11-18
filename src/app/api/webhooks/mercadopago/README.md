# Webhook de MercadoPago para Productos

## 📋 Descripción

Este webhook maneja todas las notificaciones de MercadoPago relacionadas con la compra de productos. **NO incluye suscripciones** según especificación del proyecto.

## 🔐 Configuración Requerida

### 1. Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```env
# Token de acceso de MercadoPago (Producción)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxxx

# Clave secreta para validar webhooks (se genera en el panel de MP)
MERCADOPAGO_WEBHOOK_SECRET=tu_clave_secreta_aqui
```

### 2. Configurar Webhook en MercadoPago

1. Ve a [Tus Integraciones](https://www.mercadopago.com.ar/developers/panel/app) en MercadoPago Developers
2. Selecciona tu aplicación
3. Ve a **Webhooks** → **Configurar notificaciones**
4. **URL de Producción**: `https://tu-dominio.com/api/webhooks/mercadopago`
5. **Eventos a suscribir**:
   - ✅ **Pagos** (`payment`)
   - ✅ **Órdenes comerciales** (`merchant_order`) 
   - ✅ **Contracargos** (`chargebacks`)
   - ✅ **Reclamos** (`topic_claims_integration_wh`)
   - ✅ **Alertas de fraude** (`delivery_cancellation`)
   - ❌ **Planes y suscripciones** (NO activar - fuera de alcance)

6. Guarda y **copia la clave secreta** generada
7. Pega esa clave en `MERCADOPAGO_WEBHOOK_SECRET`

## 🎯 Eventos Manejados

### 1. **PAYMENT** - Pagos con Tarjeta/Efectivo

Estados procesados:

- ✅ `approved` - Pago aprobado → confirmar orden, reducir stock
- ⏳ `pending` - Pago pendiente → esperar confirmación
- ❌ `rejected` - Pago rechazado → liberar stock, notificar cliente
- ↩️ `refunded` - Reembolsado → reponer stock
- ↩️ `cancelled` - Cancelado → liberar reserva
- 🔄 `in_process` - En revisión → no tomar acciones aún
- ⚖️ `in_mediation` - En disputa → retener producto
- ⚠️ `charged_back` - Contracargo → notificar urgente

**Ejemplo de uso:**
```typescript
// En handleApprovedPayment(), implementar:
await prisma.order.update({
  where: { mercadoPagoPaymentId: payment.id },
  data: {
    status: 'paid',
    paidAt: new Date(),
    transactionId: payment.id,
  }
});

await reduceProductStock(order.items);
await sendConfirmationEmail(order.customer.email);
```

### 2. **MERCHANT_ORDER** - Órdenes de Checkout Pro

Se valida si el monto pagado cubre el total de la orden.

**Casos:**
- Orden completa → liberar productos
- Orden con envío (`ready_to_ship`) → preparar despacho
- Orden sin envío → liberar producto digital o pickup

### 3. **CHARGEBACKS** - Contracargos

⚠️ **Crítico**: Dinero fue revertido por el banco del comprador.

**Acciones recomendadas:**
- Notificar urgente al equipo legal/financiero
- Preparar documentación de defensa
- Registrar pérdida en contabilidad
- Evaluar bloqueo del usuario

### 4. **CLAIMS** - Reclamos y Reembolsos

El cliente abrió un reclamo post-compra.

**Tipos comunes:**
- Producto no recibido
- Producto defectuoso
- No coincide con la descripción

**Acciones:**
- Contactar al cliente
- Evaluar devolución/reemplazo
- Gestionar logística inversa

### 5. **FRAUD ALERT** - Alertas de Fraude

🚨 **Acción inmediata requerida**

MercadoPago detectó actividad sospechosa.

**IMPORTANTE:**
- **Bloquear envío INMEDIATAMENTE**
- No entregar el producto
- Notificar equipo de seguridad
- Evaluar reembolso preventivo

## 🔒 Seguridad

### Validación de Firma HMAC

Cada notificación incluye un header `x-signature` con:
- `ts` - Timestamp de la notificación
- `v1` - Hash SHA256 calculado con tu clave secreta

El webhook valida automáticamente que:
1. La firma coincida (autenticidad)
2. El timestamp no sea mayor a 5 minutos (previene replay attacks)

Si la validación falla, se rechaza la notificación (HTTP 403).

## 🧪 Testing

### 1. Verificar que el endpoint está activo

```bash
curl https://tu-dominio.com/api/webhooks/mercadopago
```

Respuesta esperada:
```json
{
  "status": "active",
  "webhook": "mercadopago",
  "topics": [
    "payment",
    "merchant_order",
    "chargebacks",
    "topic_claims_integration_wh",
    "delivery_cancellation"
  ]
}
```

### 2. Simular notificación desde el Panel de MP

1. Ve a tu aplicación en [MercadoPago Developers](https://www.mercadopago.com.ar/developers/panel/app)
2. **Webhooks** → **Simular**
3. Selecciona el evento (ej: `payment`)
4. Ingresa un `payment_id` de prueba
5. Verifica logs en tu servidor

### 3. Testing Local con ngrok

```bash
# Instalar ngrok
npm install -g ngrok

# Exponer puerto 3000
ngrok http 3000

# Copiar URL generada (ej: https://abc123.ngrok.io)
# Configurarla en MP como: https://abc123.ngrok.io/api/webhooks/mercadopago
```

## 📝 Implementación Pendiente

Las funciones handler tienen comentarios `// TODO:` con la lógica que debe implementarse:

```typescript
// TODO en handleApprovedPayment:
// - Actualizar orden en Prisma/BD
// - Reducir stock de productos
// - Enviar email de confirmación
// - Generar factura electrónica
// - Notificar al vendedor

// TODO en handleFraudAlertNotification:
// - BLOQUEAR envío inmediatamente
// - Notificar equipo de seguridad
// - Marcar usuario como sospechoso
```

## ⚡ Consideraciones de Performance

1. **Timeout de 22 segundos**: MP espera respuesta HTTP 200 en máximo 22 segundos
2. **Operaciones pesadas**: Ejecutar en background (ej: email, facturación)
3. **Idempotencia**: MP puede enviar la misma notificación múltiples veces
4. **Reintentos**: Si no respondes 200, MP reintenta cada 15 minutos

## 📊 Logs y Monitoreo

Todos los eventos se loggean con prefijos identificables:

```
✅ [Payment] Pago aprobado: 123456789
⏳ [Payment] Pago pendiente: 987654321
⚠️ [Chargeback] ID: 111222333 - Status: open
🚨 [Fraud Alert] Alerta detectada para: 444555666
```

Puedes integrar con servicios de monitoreo como:
- Sentry
- Datadog
- LogRocket
- New Relic

## 🔧 Troubleshooting

### Webhook no recibe notificaciones

1. Verificar que la URL sea HTTPS en producción
2. Confirmar que el servidor responde 200 en < 22 segundos
3. Revisar firewall/CORS
4. Validar que `MERCADOPAGO_WEBHOOK_SECRET` sea correcta

### Firma inválida

1. Verificar que copiaste bien la clave secreta
2. Confirmar que no tiene espacios al inicio/final
3. Asegurarse de usar la clave de la aplicación correcta

### Notificaciones duplicadas

Esto es normal. MP reintenta si no recibe confirmación.

**Solución**: Implementar cache de IDs procesados:

```typescript
const processedIds = new Set<string>();

if (processedIds.has(notification.data.id)) {
  console.log('Notificación duplicada, ignorando');
  return NextResponse.json({ received: true }, { status: 200 });
}

processedIds.add(notification.data.id);
// Procesar normalmente...
```

## 📚 Referencias

- [Documentación Oficial Webhooks MP](https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks)
- [API Reference - Payments](https://www.mercadopago.com.ar/developers/es/reference/payments/_payments_id/get)
- [Panel de Desarrolladores](https://www.mercadopago.com.ar/developers/panel/app)
- [Estados de Pago](https://www.mercadopago.com.ar/developers/es/docs/checkout-api/response-handling)

## ✅ Checklist de Producción

Antes de ir a producción, verifica:

- [ ] Variables de entorno configuradas
- [ ] Clave secreta copiada desde el panel de MP
- [ ] Webhook configurado con HTTPS
- [ ] Eventos correctos seleccionados (sin suscripciones)
- [ ] Lógica de negocio implementada en handlers
- [ ] Emails configurados
- [ ] Sistema de logs activo
- [ ] Testeo con pagos reales en ambiente de pruebas
- [ ] Manejo de idempotencia implementado
- [ ] Operaciones pesadas en background

## 🤝 Soporte

Para dudas sobre MercadoPago:
- [Centro de Ayuda](https://www.mercadopago.com.ar/developers/es/support)
- [Foro de Desarrolladores](https://www.mercadopago.com.ar/developers/es/community)
