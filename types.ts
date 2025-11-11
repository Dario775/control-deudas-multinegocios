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