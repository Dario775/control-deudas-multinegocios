import { Cliente, ClientStatus, Plan, PlanPeriod, Pago, PaymentMethod, PaymentStatus, Factura, InvoiceStatus, Notificacion, NotificationType, Gasto, ExpenseCategory, Negocio, SuscripcionStatus, Servicio, Producto, POSUser, Venta, SaleStatus, ReceiptType } from '../types';

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

export const mockGastos: Gasto[] = [
  { id: 'g1', descripcion: 'Pago de nómina mes de Octubre', monto: 5500, fecha: '31/10/2023', categoria: ExpenseCategory.Sueldos },
  { id: 'g2', descripcion: 'Factura de servicio eléctrico', monto: 150.75, fecha: '28/10/2023', categoria: ExpenseCategory.Servicios },
  { id: 'g3', descripcion: 'Alquiler de oficina mes de Noviembre', monto: 1200, fecha: '01/11/2023', categoria: ExpenseCategory.Alquiler },
  { id: 'g4', descripcion: 'Campaña publicitaria en redes sociales', monto: 450, fecha: '15/10/2023', categoria: ExpenseCategory.Marketing },
  { id: 'g5', descripcion: 'Compra de papelería y tóner', monto: 85.50, fecha: '20/10/2023', categoria: ExpenseCategory.Suministros },
  { id: 'g6', descripcion: 'Reparación de equipo de cómputo', monto: 220, fecha: '18/10/2023', categoria: ExpenseCategory.Eventuales },
  { id: 'g7', descripcion: 'Licencia de software de contabilidad (anual)', monto: 300, fecha: '05/11/2023', categoria: ExpenseCategory.Operativos },
  { id: 'g8', descripcion: 'Compra de mercadería a proveedor A', monto: 1800, fecha: '10/10/2023', categoria: ExpenseCategory.Compras },
  { id: 'g9', descripcion: 'Pago de Internet y telefonía', monto: 120, fecha: '02/11/2023', categoria: ExpenseCategory.Servicios },
  { id: 'g10', descripcion: 'Pago de nómina mes de Septiembre', monto: 5450, fecha: '30/09/2023', categoria: ExpenseCategory.Sueldos },
  { id: 'g11', descripcion: 'Compra de café y snacks para oficina', monto: 75, fecha: '15/10/2023', categoria: ExpenseCategory.Suministros },
  { id: 'g12', descripcion: 'Servicio de limpieza mensual', monto: 250, fecha: '01/11/2023', categoria: ExpenseCategory.Operativos },
];

// --- Mock Data para Super Admin ---
export const mockNegocios: Negocio[] = [
  {
    id: 'negocio-1',
    nombre: 'Supermercado La Familia',
    email: 'contacto@lafamilia.com',
    telefono: '555-0101',
    fechaRegistro: '01/06/2023',
    estadoSuscripcion: SuscripcionStatus.Activa,
    serviciosActivos: ['fidelizacion', 'pos'],
  },
  {
    id: 'negocio-2',
    nombre: 'Tienda de Ropa Urbana',
    email: 'ventas@urbana.style',
    telefono: '555-0102',
    fechaRegistro: '15/07/2023',
    estadoSuscripcion: SuscripcionStatus.Activa,
    serviciosActivos: ['fidelizacion'],
  },
  {
    id: 'negocio-3',
    nombre: 'Cafetería El Grano de Oro',
    email: 'gerencia@granodeoro.cafe',
    telefono: '555-0103',
    fechaRegistro: '22/08/2023',
    estadoSuscripcion: SuscripcionStatus.Inactiva,
    serviciosActivos: ['pos'],
  },
   {
    id: 'negocio-4',
    nombre: 'Farmacia Salud Plus',
    email: 'admin@saludplus.com',
    telefono: '555-0104',
    fechaRegistro: '10/09/2023',
    estadoSuscripcion: SuscripcionStatus.Activa,
    serviciosActivos: ['fidelizacion', 'pos'],
  },
];

// --- Mock Data para el Módulo POS ---
export const mockPOSUsers: POSUser[] = [
    { id: 'user-pos-1', nombre: 'Ana Gómez (Cajera)', email: 'cajero@lafamilia.com', role: 'pos', negocioId: 'negocio-1' },
    { id: 'user-pos-2', nombre: 'Luis Castro (Manager)', email: 'manager@lafamilia.com', role: 'pos-manager', negocioId: 'negocio-1' },
    { id: 'user-pos-3', nombre: 'Carlos Diaz (Cajero)', email: 'cajero@granodeoro.cafe', role: 'pos', negocioId: 'negocio-3' },
];

export const mockProductos: Producto[] = [
    { id: 'prod-1', nombre: 'Leche Entera 1L', sku: '789001', precio: 1.20, stock: 150, categoria: 'Lácteos', imagenUrl: 'https://via.placeholder.com/150/FFFFFF/000000?text=Leche' },
    { id: 'prod-2', nombre: 'Pan de Molde Blanco', sku: '789002', precio: 2.50, stock: 80, categoria: 'Panadería', imagenUrl: 'https://via.placeholder.com/150/FFFFFF/000000?text=Pan' },
    { id: 'prod-3', nombre: 'Huevos Docena', sku: '789003', precio: 3.10, stock: 120, categoria: 'Básicos', imagenUrl: 'https://via.placeholder.com/150/FFFFFF/000000?text=Huevos' },
    { id: 'prod-4', nombre: 'Manzanas (Kg)', sku: '789004', precio: 1.99, stock: 200, categoria: 'Frutas y Verduras', imagenUrl: 'https://via.placeholder.com/150/FFFFFF/000000?text=Manzana' },
    { id: 'prod-5', nombre: 'Pollo Entero (Kg)', sku: '789005', precio: 4.50, stock: 50, categoria: 'Carnes', imagenUrl: 'https://via.placeholder.com/150/FFFFFF/000000?text=Pollo' },
    { id: 'prod-6', nombre: 'Arroz Blanco 1Kg', sku: '789006', precio: 0.95, stock: 300, categoria: 'Básicos', imagenUrl: 'https://via.placeholder.com/150/FFFFFF/000000?text=Arroz' },
    { id: 'prod-7', nombre: 'Gaseosa Cola 2L', sku: '789007', precio: 1.80, stock: 250, categoria: 'Bebidas', imagenUrl: 'https://via.placeholder.com/150/FFFFFF/000000?text=Gaseosa' },
    { id: 'prod-8', nombre: 'Detergente Líquido 3L', sku: '789008', precio: 6.75, stock: 90, categoria: 'Limpieza', imagenUrl: 'https://via.placeholder.com/150/FFFFFF/000000?text=Detergente' },
    { id: 'prod-9', nombre: 'Queso Mozzarella 250g', sku: '789009', precio: 2.80, stock: 100, categoria: 'Lácteos', imagenUrl: 'https://via.placeholder.com/150/FFFFFF/000000?text=Queso' },
    { id: 'prod-10', nombre: 'Café Molido 500g', sku: '789010', precio: 5.20, stock: 110, categoria: 'Básicos', imagenUrl: 'https://via.placeholder.com/150/FFFFFF/000000?text=Caf%C3%A9' },
    { id: 'prod-11', nombre: 'Aceite de Girasol 1L', sku: '789011', precio: 2.10, stock: 180, categoria: 'Básicos', imagenUrl: 'https://via.placeholder.com/150/FFFFFF/000000?text=Aceite' },
    { id: 'prod-12', nombre: 'Yogur Natural 1L', sku: '789012', precio: 1.50, stock: 130, categoria: 'Lácteos', imagenUrl: 'https://via.placeholder.com/150/FFFFFF/000000?text=Yogur' },
    { id: 'prod-13', nombre: 'Papel Higiénico 4 rollos', sku: '789013', precio: 1.90, stock: 400, categoria: 'Limpieza', imagenUrl: 'https://via.placeholder.com/150/FFFFFF/000000?text=Papel' },
    { id: 'prod-14', nombre: 'Tomates (Kg)', sku: '789014', precio: 1.50, stock: 160, categoria: 'Frutas y Verduras', imagenUrl: 'https://via.placeholder.com/150/FFFFFF/000000?text=Tomate' },
    { id: 'prod-15', nombre: 'Pasta (Spaghetti) 500g', sku: '789015', precio: 0.85, stock: 220, categoria: 'Básicos', imagenUrl: 'https://via.placeholder.com/150/FFFFFF/000000?text=Pasta' },
];

export const mockVentas: Venta[] = [
  {
    id: 'v-001',
    receiptNumber: 'T-001-000123',
    client: mockClientes[0],
    date: '25/10/2023 10:15',
    items: [
      { producto: mockProductos[0], cantidad: 2 },
      { producto: mockProductos[2], cantidad: 1 },
    ],
    subtotal: (1.20 * 2) + 3.10,
    tax: ((1.20 * 2) + 3.10) * 0.21,
    total: ((1.20 * 2) + 3.10) * 1.21,
    paymentMethod: PaymentMethod.Efectivo,
    receiptType: ReceiptType.TicketVenta,
    status: SaleStatus.Completada,
  },
  {
    id: 'v-002',
    receiptNumber: 'F-001-000124',
    client: mockClientes[1],
    date: '25/10/2023 11:30',
    items: [
      { producto: mockProductos[4], cantidad: 1.5 }, // kg
      { producto: mockProductos[6], cantidad: 3 },
    ],
    subtotal: (4.50 * 1.5) + (1.80 * 3),
    tax: ((4.50 * 1.5) + (1.80 * 3)) * 0.21,
    total: ((4.50 * 1.5) + (1.80 * 3)) * 1.21,
    paymentMethod: PaymentMethod.Tarjeta,
    receiptType: ReceiptType.FacturaB,
    status: SaleStatus.Completada,
  },
  {
    id: 'v-003',
    receiptNumber: 'T-001-000125',
    client: null, // Generic client
    date: '24/10/2023 18:45',
    items: [
      { producto: mockProductos[1], cantidad: 1 },
    ],
    subtotal: 2.50,
    tax: 2.50 * 0.21,
    total: 2.50 * 1.21,
    paymentMethod: PaymentMethod.Efectivo,
    receiptType: ReceiptType.TicketVenta,
    status: SaleStatus.Cancelada,
  },
  {
    id: 'v-004',
    receiptNumber: 'N-001-000012',
    client: mockClientes[0],
    date: '26/10/2023 09:05',
    items: [
      { producto: mockProductos[0], cantidad: 1 },
    ],
    subtotal: -1.20,
    tax: -1.20 * 0.21,
    total: -1.20 * 1.21,
    paymentMethod: PaymentMethod.Efectivo,
    receiptType: ReceiptType.NotaCredito,
    status: SaleStatus.Devolución,
  },
    {
    id: 'v-005',
    receiptNumber: 'T-001-000126',
    client: mockClientes[3],
    date: '23/10/2023 14:00',
    items: [
      { producto: mockProductos[7], cantidad: 1 },
      { producto: mockProductos[8], cantidad: 2 },
      { producto: mockProductos[12], cantidad: 1 },
    ],
    subtotal: 6.75 + (2.80 * 2) + 1.90,
    tax: (6.75 + (2.80 * 2) + 1.90) * 0.21,
    total: (6.75 + (2.80 * 2) + 1.90) * 1.21,
    paymentMethod: PaymentMethod.Tarjeta,
    receiptType: ReceiptType.TicketVenta,
    status: SaleStatus.Completada,
  },
];