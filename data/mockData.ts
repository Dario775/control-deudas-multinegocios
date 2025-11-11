import { Cliente, ClientStatus, Plan, PlanPeriod, Pago, PaymentMethod, PaymentStatus, Factura, InvoiceStatus, Notificacion, NotificationType } from '../types';

export const mockPlanes: Plan[] = [
  { 
    id: '1', 
    nombre: 'Básico', 
    precio: 29, 
    periodo: PlanPeriod.Mensual,
    caracteristicas: ['10 Clientes', '1 Usuario', 'Soporte por Email']
  },
  { 
    id: '2', 
    nombre: 'Profesional', 
    precio: 79, 
    periodo: PlanPeriod.Mensual,
    caracteristicas: ['100 Clientes', '5 Usuarios', 'Facturación Automática', 'Soporte Prioritario']
  },
  { 
    id: '3', 
    nombre: 'Empresarial', 
    precio: 199, 
    periodo: PlanPeriod.Mensual,
    caracteristicas: ['Clientes Ilimitados', 'Usuarios Ilimitados', 'API de Integración', 'Soporte Dedicado 24/7']
  },
   { 
    id: '4', 
    nombre: 'Anual Básico', 
    precio: 299, 
    periodo: PlanPeriod.Anual,
    caracteristicas: ['Todo en Básico', '2 meses gratis']
  },
];

const originalMockClientes: Cliente[] = [
  { id: '1', nombre: 'Juan Pérez', email: 'juan.perez@example.com', telefono: '555-1234', fechaRegistro: '15/01/2023', estado: ClientStatus.Activo, plan: mockPlanes[0] },
  { id: '2', nombre: 'Maria García', email: 'maria.garcia@example.com', telefono: '555-5678', fechaRegistro: '20/02/2023', estado: ClientStatus.Activo, plan: mockPlanes[1] },
  { id: '3', nombre: 'Carlos Rodríguez', email: 'carlos.r@example.com', telefono: '555-8765', fechaRegistro: '10/11/2022', estado: ClientStatus.Moroso, plan: mockPlanes[0] },
  { id: '4', nombre: 'Ana López', email: 'ana.lopez@example.com', telefono: '555-4321', fechaRegistro: '05/03/2023', estado: ClientStatus.Inactivo, plan: mockPlanes[3] },
];

const generatedClientes: Cliente[] = [];
const firstNames = ['Pedro', 'Luisa', 'Jorge', 'Sofia', 'Miguel', 'Valentina', 'Andres', 'Camila', 'Ricardo', 'Isabela', 'Mateo', 'Lucia'];
const lastNames = ['Gomez', 'Martinez', 'Sanchez', 'Diaz', 'Hernandez', 'Torres', 'Ramirez', 'Vargas', 'Rojas', 'Castro', 'Soto', 'Mora'];
const statuses = Object.values(ClientStatus);

for (let i = 5; i <= 50; i++) {
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[i % lastNames.length];
  const status = statuses[i % statuses.length];
  const plan = mockPlanes[i % mockPlanes.length];
  const date = new Date(2023, i % 12, (i % 28) + 1);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  generatedClientes.push({
    id: i.toString(),
    nombre: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
    telefono: `555-${String(1000 + i).padStart(4, '0')}`,
    fechaRegistro: formattedDate,
    estado: status,
    plan: plan,
  });
}

export const mockClientes: Cliente[] = [...originalMockClientes, ...generatedClientes];

const originalMockPagos: Pago[] = [
  { id: '1', cliente: {id: '1', nombre: 'Juan Pérez', email: 'juan.perez@example.com'}, monto: 29.00, fechaPago: '15/10/2023', metodo: PaymentMethod.Tarjeta, estado: PaymentStatus.Pagada },
  { id: '2', cliente: {id: '2', nombre: 'Maria García', email: 'maria.garcia@example.com'}, monto: 79.00, fechaPago: '20/10/2023', metodo: PaymentMethod.Transferencia, estado: PaymentStatus.Pagada },
  { id: '3', cliente: {id: '3', nombre: 'Carlos Rodríguez', email: 'carlos.r@example.com'}, monto: 29.00, fechaPago: '10/10/2023', metodo: PaymentMethod.Tarjeta, estado: PaymentStatus.Vencida },
  { id: '4', cliente: {id: '4', nombre: 'Ana López', email: 'ana.lopez@example.com'}, monto: 299.00, fechaPago: '01/11/2023', metodo: PaymentMethod.Transferencia, estado: PaymentStatus.Pendiente },
];

const generatedPagos: Pago[] = [];
const paymentStatuses = Object.values(PaymentStatus);
const paymentMethods = Object.values(PaymentMethod);

for (let i = 5; i <= 50; i++) {
  const cliente = mockClientes[i % mockClientes.length];
  const monto = cliente.plan.precio;
  const date = new Date(2023, 9, (i % 30) + 1); // October 2023
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  
  // Distribute statuses a bit more realistically
  let estado: PaymentStatus;
  const rand = Math.random();
  if (rand < 0.7) estado = PaymentStatus.Pagada; // 70% pagada
  else if (rand < 0.85) estado = PaymentStatus.Pendiente; // 15% pendiente
  else if (rand < 0.95) estado = PaymentStatus.Vencida; // 10% vencida
  else estado = PaymentStatus.Cancelada; // remaining % cancelada

  generatedPagos.push({
    id: i.toString(),
    cliente: { id: cliente.id, nombre: cliente.nombre, email: cliente.email },
    monto: monto,
    fechaPago: formattedDate,
    metodo: paymentMethods[i % paymentMethods.length],
    estado: estado,
  });
}

export const mockPagos: Pago[] = [...originalMockPagos, ...generatedPagos];


export const latestPaymentsDashboard: Pago[] = [
    { id: 'p1', cliente: mockClientes[0], monto: 150.00, fechaPago: '26/10/2023', metodo: PaymentMethod.Tarjeta, estado: PaymentStatus.Pagada },
    { id: 'p2', cliente: mockClientes[1], monto: 75.50, fechaPago: '25/10/2023', metodo: PaymentMethod.Transferencia, estado: PaymentStatus.Pagada },
    { id: 'p3', cliente: mockClientes[2], monto: 300.00, fechaPago: '25/10/2023', metodo: PaymentMethod.Efectivo, estado: PaymentStatus.Pagada },
];

export const latestPaymentsCustomer: Omit<Pago, 'cliente'>[] = [
    { id: 'cp1', monto: 79.00, fechaPago: '20/10/2023', metodo: PaymentMethod.Tarjeta, estado: PaymentStatus.Pagada },
    { id: 'cp2', monto: 79.00, fechaPago: '20/09/2023', metodo: PaymentMethod.Tarjeta, estado: PaymentStatus.Pagada },
    { id: 'cp3', monto: 79.00, fechaPago: '20/08/2023', metodo: PaymentMethod.Tarjeta, estado: PaymentStatus.Pagada },
];

export const customerPagos: Omit<Pago, 'cliente'>[] = [
  { id: '1', monto: 79.00, fechaPago: '20/10/2023', metodo: PaymentMethod.Tarjeta, estado: PaymentStatus.Pagada },
  { id: '2', monto: 79.00, fechaPago: '20/09/2023', metodo: PaymentMethod.Tarjeta, estado: PaymentStatus.Pagada },
  { id: '3', monto: 79.00, fechaPago: '20/08/2023', metodo: PaymentMethod.Tarjeta, estado: PaymentStatus.Pagada },
  { id: '4', monto: 79.00, fechaPago: '20/07/2023', metodo: PaymentMethod.Tarjeta, estado: PaymentStatus.Pagada },
  { id: '5', monto: 29.00, fechaPago: '15/06/2023', metodo: PaymentMethod.Tarjeta, estado: PaymentStatus.Pagada },
  { id: '6', monto: 29.00, fechaPago: '15/05/2023', metodo: PaymentMethod.Tarjeta, estado: PaymentStatus.Pagada },
];

export const currentCustomerPlan: Plan = mockPlanes[1];
export const otherCustomerPlans: Plan[] = [mockPlanes[0], mockPlanes[2]];


export const mockFacturas: Factura[] = [
    { id: '1', numero: 'FACT-001', cliente: mockClientes[0], fechaEmision: '15/10/2023', fechaVencimiento: '15/11/2023', items: [{ id: 'i1', descripcion: 'Suscripción Plan Básico', cantidad: 1, precioUnitario: 29 }], subtotal: 29, impuestos: 6.09, total: 35.09, estado: InvoiceStatus.Pagada},
    { id: '2', numero: 'FACT-002', cliente: mockClientes[1], fechaEmision: '20/10/2023', fechaVencimiento: '20/11/2023', items: [{ id: 'i2', descripcion: 'Suscripción Plan Profesional', cantidad: 1, precioUnitario: 79 }], subtotal: 79, impuestos: 16.59, total: 95.59, estado: InvoiceStatus.Enviada },
    { id: '3', numero: 'FACT-003', cliente: mockClientes[2], fechaEmision: '10/09/2023', fechaVencimiento: '10/10/2023', items: [{ id: 'i3', descripcion: 'Suscripción Plan Básico', cantidad: 1, precioUnitario: 29 }], subtotal: 29, impuestos: 6.09, total: 35.09, estado: InvoiceStatus.Vencida },
    { id: '4', numero: 'FACT-004', cliente: mockClientes[3], fechaEmision: '25/10/2023', fechaVencimiento: '25/11/2023', items: [{ id: 'i4', descripcion: 'Suscripción Anual Básico', cantidad: 1, precioUnitario: 299 }, {id: 'i5', descripcion: 'Servicio de configuración inicial', cantidad: 1, precioUnitario: 150}], subtotal: 449, impuestos: 94.29, total: 543.29, estado: InvoiceStatus.Borrador, notas: 'Configuración inicial programada para el 01/11/2023.' },
];

export const mockNotificaciones: Notificacion[] = [
    { id: '1', type: NotificationType.VencimientoProximo, message: 'El pago de Juan Pérez vence en 3 días.', customerId: '1', isRead: false, date: '12/11/2023' },
    { id: '2', type: NotificationType.PagoVencido, message: 'El pago de Carlos Rodríguez está vencido.', customerId: '3', isRead: false, date: '11/10/2023' },
    { id: '3', type: NotificationType.VencimientoProximo, message: 'Recordatorio de pago para Maria García.', customerId: '2', isRead: true, date: '18/10/2023' },
];

export const mockPaymentStatusSummary = {
  pagados: 280,
  atrasados: 15,
  porVencer: 25,
};