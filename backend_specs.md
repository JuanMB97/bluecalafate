# Especificaciones del Backend (NestJS) - BlueCalafate

Este documento define la estructura de datos que el frontend actual necesita consumir desde el futuro backend en NestJS. 
A medida que el proyecto avance, iremos agregando y ajustando entidades.

## 1. Entidad: Destinos / Tours (`Tour`)
Esta entidad maneja la información de las excursiones y traslados (ej: Perito Moreno, El Chaltén, Traslado al aeropuerto).

**Campos:**
- `id` (UUID o String): Identificador único.
- `slug` (String): URL amigable (ej: "perito-moreno").
- `title` (String): Título corto del tour (ej: "Perito Moreno").
- `place` (String): Nombre del lugar o destino.
- `phrase` (String): Descripción corta o frase destacada.
- `image` (String): URL de la imagen principal/portada.
- `departureTime` (String): Horario de salida (ej: "08:00 hs" o "Según vuelo").
- `returnTime` (String): Horario de regreso (ej: "14:00 hs" o "Según vuelo").
- `pricePerPerson` (String): Precio formateado como texto (ej: "ARS 35.000").
- `priceNumber` (Number): Precio numérico exacto para cálculos (ej: 35000).
- `totalExample` (String): Ejemplo del precio total formateado.
- `logoIcon` (String): URL del icono descriptivo.
- `tourCardImg` (String): URL de la imagen para la tarjeta en el listado.
- `serviceType` (String): Modalidad del servicio (ej: "Servicio Compartido").

---

## 2. Entidad: Vehículos / Flota (`Vehicle`)
Representa los vehículos mostrados en la sección de flota (las tarjetas de vehículos).

**Campos:**
- `id` (UUID o String): Identificador único.
- `name` (String): Nombre o modelo del vehículo (ej: "Sprinter", "H1").
- `image` (String): URL de la imagen del vehículo.
- `capacity` (Number): Capacidad máxima de pasajeros.
- `luggageCapacity` (Number): Capacidad máxima de equipaje (actualmente en el frontend coincide con la capacidad de pasajeros, pero es buena idea separarlo en el backend).

---

## 3. Entidad: Reservas (`Reservation`)
Basado en el formulario de reserva actual (`FormularioReserva`), estos son los datos que enviaremos al backend cuando un usuario reserve.

**Campos:**
- `id` (UUID): Identificador único de la reserva.
- `tourId` (UUID o String): Relación con el Tour reservado.
- `passengerName` (String): Nombre y apellido del cliente.
- `passengerPhone` (String): Número de contacto / celular.
- `passengerEmail` (String): Correo electrónico.
- `date` (Date / ISO String): Fecha elegida para la excursión.
- `passengersCount` (Number): Cantidad de pasajeros seleccionada.
- `meetingPoint` (String): Punto de encuentro, hotel o alojamiento.
- `paymentMethod` (String): Método de pago preferido (Efectivo, Transferencia, Tarjeta).
- `status` (String): Estado de la reserva (ej: "PENDING", "CONFIRMED", "CANCELLED") - *Sugerido para el backend*.
