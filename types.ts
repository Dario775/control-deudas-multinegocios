export enum ClientStatus {
  Activo = 'Activo',
  Inactivo = 'Inactivo',
  Moroso = 'Moroso',
}

export enum PaymentStatus {
  Pagada = 'Pagada',
  Pendiente = 'Pendiente',
  Vencida = 'Vencida',
  Cancelada = 'Cancelada',
}

export enum PaymentMethod {
  Efectivo = 'Efectivo',
  Transferencia = 'Transferencia',
  Tarjeta = 'Tarjeta de Crédito/Débito',
}

export enum PlanPeriod {
    Mensual = 'Mensual',
    Trimestral = 'Trimestral',
    Anual = 'Anual',
}

export enum InvoiceStatus {
    Borrador = 'Borrador',
    Enviada = 'Enviada',
    Pagada = 'Pagada',
    Vencida = 'Vencida',
    Anulada = 'Anulada',
}

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  fechaRegistro: string;
  estado: ClientStatus;
  plan: Plan;
}

export interface Plan {
  id: string;
  nombre: string;
  precio: number;
  periodo: PlanPeriod;
  caracteristicas: string[];
}

export interface Pago {
  id: string;
  cliente: Pick<Cliente, 'id' | 'nombre' | 'email'>;
  monto: number;
  fechaPago: string;
  metodo: PaymentMethod;
  estado: PaymentStatus;
  descripcion?: string;
}

export interface InvoiceItem {
    id: string;
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
}

export interface Factura {
    id: string;
    numero: string;
    cliente: Pick<Cliente, 'id' | 'nombre' | 'email'>;
    fechaEmision: string;
    fechaVencimiento: string;
    items: InvoiceItem[];
    subtotal: number;
    impuestos: number;
    total: number;
    estado: InvoiceStatus;
    notas?: string;
}

export enum ExpenseCategory {
  Sueldos = 'Sueldos y Salarios',
  Servicios = 'Servicios Públicos',
  Alquiler = 'Alquiler',
  Suministros = 'Suministros de Oficina',
  Marketing = 'Marketing y Publicidad',
  Operativos = 'Gastos Operativos',
  Eventuales = 'Gastos Eventuales',
  Compras = 'Compras de Mercadería',
}

export interface Gasto {
  id: string;
  descripcion: string;
  monto: number;
  fecha: string; // DD/MM/YYYY
  categoria: ExpenseCategory;
}

export enum NotificationType {
    VencimientoProximo = 'Vencimiento Próximo',
    PagoVencido = 'Pago Vencido',
    NuevoPago = 'Nuevo Pago Registrado',
}

export interface Notificacion {
    id: string;
    type: NotificationType;
    message: string;
    customerId: string;
    isRead: boolean;
    date: string;
}

// --- Tipos para el Super Panel ---

export enum SuscripcionStatus {
    Activa = 'Activa',
    Inactiva = 'Inactiva',
}

export type Servicio = 'fidelizacion' | 'pos';

export interface Negocio {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    fechaRegistro: string;
    estadoSuscripcion: SuscripcionStatus;
    serviciosActivos: Servicio[];
}

// --- Tipos para el Módulo POS ---

export type POSRole = 'pos' | 'pos-manager';

export interface POSUser {
    id: string;
    nombre: string;
    email: string;
    role: POSRole;
    negocioId: string;
}

export interface Producto {
  id: string;
  nombre: string;
  sku: string;
  precio: number;
  stock: number;
  categoria?: string;
  imagenUrl?: string;
}

export interface TicketItem {
  producto: Producto;
  cantidad: number;
}

export interface HeldTicket {
  id: string;
  items: TicketItem[];
  client: Cliente | null;
  date: Date;
  total: number;
}

// --- Tipos para Historial de Ventas POS ---

export enum SaleStatus {
  Completada = 'Completada',
  Cancelada = 'Cancelada',
  Devolución = 'Devolución',
}

export enum ReceiptType {
  TicketVenta = 'Ticket de Venta',
  FacturaA = 'Factura A',
  FacturaB = 'Factura B',
  NotaCredito = 'Nota de Crédito',
}

export interface Venta {
  id: string;
  receiptNumber: string;
  client: Pick<Cliente, 'id' | 'nombre' | 'email'> | null;
  date: string; // "DD/MM/YYYY HH:mm"
  items: TicketItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  receiptType: ReceiptType;
  status: SaleStatus;
}