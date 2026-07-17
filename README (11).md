export interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  año: number;
  precio: number;
  color: string;
  kilometraje: number;
  estado: 'disponible' | 'reservado' | 'vendido';
  imagen: string;
  tipo: string;
  motor: string;
  transmision: string;
  potencia?: string;
  descripcion?: string;
}

export interface Client {
  id: string;
  nombre: string;
  apellido?: string;
  email: string;
  telefono: string;
  direccion: string;
  compras: number;
  totalGastado: number;
  ultimaCompra?: string;
  nacionalidad?: string;
}

export interface Sale {
  id: string;
  vehiculoId: string;
  clienteId: string;
  fecha: string;
  precio: number;
  metodoPago: string;
  vendedor: string;
  comision?: number;
  notas?: string;
}

export interface Reservation {
  id: string;
  vehiculoId: string;
  clienteId: string;
  fechaReserva: string;
  fechaVencimiento: string;
  estado: 'activa' | 'cancelada' | 'completada';
  notas?: string;
}

export const vehicles: Vehicle[] = [
  {
    id: '1',
    marca: 'Ferrari',
    modelo: '488 GTB',
    año: 2024,
    precio: 285000,
    color: 'Rojo Rosso Corsa',
    kilometraje: 0,
    estado: 'disponible',
    imagen: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBmZXJyYXJpJTIwc3VwZXJjYXJ8ZW58MXx8fHwxNzgyNzM5NTE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    tipo: 'Deportivo',
    motor: 'V8 3.9L Twin-Turbo',
    transmision: 'Automática 7 vel.',
    potencia: '660 CV',
    descripcion: 'El 488 GTB es la expresión perfecta de la ingeniería italiana de alta performance. Motor V8 biturbo de 660 CV con manejo preciso y sonido inconfundible.',
  },
  {
    id: '2',
    marca: 'Porsche',
    modelo: '911 Turbo S',
    año: 2024,
    precio: 235000,
    color: 'Negro Jet',
    kilometraje: 1200,
    estado: 'disponible',
    imagen: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHBvcnNjaGUlMjBsdXh1cnl8ZW58MXx8fHwxNzgyNzQxNTk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    tipo: 'Deportivo',
    motor: 'H6 3.8L Twin-Turbo',
    transmision: 'PDK 8 vel.',
    potencia: '650 CV',
    descripcion: 'Icónico 911 en su versión más extrema. Aceleración 0-100 en 2.7 segundos con tracción total inteligente y tecnología de pista.',
  },
  {
    id: '3',
    marca: 'Lamborghini',
    modelo: 'Huracán EVO',
    año: 2023,
    precio: 298000,
    color: 'Blanco Monocerus',
    kilometraje: 3500,
    estado: 'reservado',
    imagen: 'https://images.unsplash.com/photo-1593219535889-7873a100874a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGxhbWJvcmdoaW5pJTIwZXhvdGljfGVufDF8fHx8MTc4Mjc0MTU5OHww&ixlib=rb-4.1.0&q=80&w=1080',
    tipo: 'Deportivo',
    motor: 'V10 5.2L',
    transmision: 'Automática 7 vel.',
    potencia: '640 CV',
    descripcion: 'Huracán EVO con sistema de dinámica de vehículo de Lamborghini (LDVI). Experiencia de conducción total con respuesta instantánea.',
  },
  {
    id: '4',
    marca: 'Mercedes-Benz',
    modelo: 'S-Class S 580',
    año: 2024,
    precio: 135000,
    color: 'Plata Selenita',
    kilometraje: 800,
    estado: 'disponible',
    imagen: 'https://images.unsplash.com/photo-1582828715181-338a8e04ba53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBtZXJjZWRlcyUyMGx1eHVyeSUyMHNlZGFufGVufDF8fHx8MTc4Mjc0MTU5OHww&ixlib=rb-4.1.0&q=80&w=1080',
    tipo: 'Sedán de Lujo',
    motor: 'V8 4.0L Twin-Turbo',
    transmision: '9G-TRONIC',
    potencia: '503 CV',
    descripcion: 'La referencia absoluta del automóvil de lujo. Interior opulento con MBUX Hyperscreen, suspensión activa y asistentes de última generación.',
  },
  {
    id: '5',
    marca: 'Bentley',
    modelo: 'Continental GT',
    año: 2024,
    precio: 245000,
    color: 'Azul Sequin',
    kilometraje: 0,
    estado: 'disponible',
    imagen: 'https://images.unsplash.com/photo-1571348709504-0bd43f75bb50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwYmVudGxleSUyMGNvdXBlfGVufDF8fHx8MTc4Mjc0MTU5OHww&ixlib=rb-4.1.0&q=80&w=1080',
    tipo: 'Gran Turismo',
    motor: 'W12 6.0L Twin-Turbo',
    transmision: 'Automática 8 vel.',
    potencia: '635 CV',
    descripcion: 'El gran turismo definitivo. Artesanía británica de Crewe, materiales nobles y un motor W12 que combina lujo y prestaciones extraordinarias.',
  },
  {
    id: '6',
    marca: 'Aston Martin',
    modelo: 'DB12',
    año: 2024,
    precio: 265000,
    color: 'Verde Racing',
    kilometraje: 500,
    estado: 'disponible',
    imagen: 'https://images.unsplash.com/photo-1692406069831-0bb7ea297645?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcG9ydHMlMjBjYXIlMjBzaG93cm9vbXxlbnwxfHx8fDE3ODI1Nzc4MTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    tipo: 'Gran Turismo',
    motor: 'V12 5.2L Twin-Turbo',
    transmision: 'Automática 8 vel.',
    potencia: '671 CV',
    descripcion: 'El Aston Martin más potente jamás creado. Elegancia británica elevada con tecnología de F1 y un carácter incomparable en cada curva.',
  },
  {
    id: '7',
    marca: 'Rolls-Royce',
    modelo: 'Ghost',
    año: 2023,
    precio: 395000,
    color: 'Silber Arrow',
    kilometraje: 2100,
    estado: 'disponible',
    imagen: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    tipo: 'Berlina Ultra-Lujo',
    motor: 'V12 6.75L Twin-Turbo',
    transmision: 'Automática 8 vel.',
    potencia: '571 CV',
    descripcion: 'El Ghost redefine el lujo post-opulento. Arquitectura de aluminio espaceframe, interior estrellado y el famoso "silencio de Rolls-Royce".',
  },
  {
    id: '8',
    marca: 'McLaren',
    modelo: '720S',
    año: 2023,
    precio: 320000,
    color: 'Naranja Papaya',
    kilometraje: 4200,
    estado: 'vendido',
    imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    tipo: 'Superdeportivo',
    motor: 'V8 4.0L Twin-Turbo',
    transmision: 'SSG 7 vel.',
    potencia: '720 CV',
    descripcion: 'Supercoche de carbono puro. Carrocería monocasco MonoCell II y aerodinámica activa para prestaciones absolutas en pista y carretera.',
  },
];

export const clients: Client[] = [
  {
    id: '1',
    nombre: 'Roberto Martínez',
    email: 'roberto.martinez@email.com',
    telefono: '+34 611 222 333',
    direccion: 'Paseo de la Castellana 100, Madrid',
    compras: 3,
    totalGastado: 650000,
    ultimaCompra: '2026-05-15',
    nacionalidad: 'Española',
  },
  {
    id: '2',
    nombre: 'María García',
    email: 'maria.garcia@email.com',
    telefono: '+34 622 333 444',
    direccion: 'Av. Diagonal 450, Barcelona',
    compras: 1,
    totalGastado: 285000,
    ultimaCompra: '2026-03-20',
    nacionalidad: 'Española',
  },
  {
    id: '3',
    nombre: 'Carlos Sánchez',
    email: 'carlos.sanchez@email.com',
    telefono: '+34 633 444 555',
    direccion: 'Gran Vía 25, Madrid',
    compras: 2,
    totalGastado: 563000,
    ultimaCompra: '2026-04-05',
    nacionalidad: 'Española',
  },
  {
    id: '4',
    nombre: 'Isabel Fernández',
    email: 'isabel.fernandez@email.com',
    telefono: '+34 644 555 666',
    direccion: 'Calle Serrano 80, Madrid',
    compras: 1,
    totalGastado: 135000,
    ultimaCompra: '2026-06-01',
    nacionalidad: 'Española',
  },
  {
    id: '5',
    nombre: 'Javier López',
    email: 'javier.lopez@email.com',
    telefono: '+34 655 666 777',
    direccion: 'Rambla Catalunya 120, Barcelona',
    compras: 4,
    totalGastado: 1090000,
    ultimaCompra: '2026-06-20',
    nacionalidad: 'Española',
  },
  {
    id: '6',
    nombre: 'Natalia Romero',
    email: 'natalia.romero@email.com',
    telefono: '+34 666 888 999',
    direccion: 'Avenida del Mediterráneo 88, Valencia',
    compras: 1,
    totalGastado: 245000,
    ultimaCompra: '2026-02-14',
    nacionalidad: 'Española',
  },
  {
    id: '7',
    nombre: 'Alexandre Dubois',
    email: 'alexandre.dubois@email.fr',
    telefono: '+33 6 12 34 56 78',
    direccion: 'Avenue Montaigne 22, París',
    compras: 2,
    totalGastado: 680000,
    ultimaCompra: '2026-06-10',
    nacionalidad: 'Francesa',
  },
];

export const sales: Sale[] = [
  {
    id: '1',
    vehiculoId: '2',
    clienteId: '1',
    fecha: '2026-05-15',
    precio: 235000,
    metodoPago: 'Transferencia',
    vendedor: 'Ana Torres',
    comision: 7050,
  },
  {
    id: '2',
    vehiculoId: '1',
    clienteId: '2',
    fecha: '2026-03-20',
    precio: 285000,
    metodoPago: 'Financiamiento',
    vendedor: 'Pedro Ruiz',
    comision: 8550,
  },
  {
    id: '3',
    vehiculoId: '4',
    clienteId: '4',
    fecha: '2026-06-01',
    precio: 135000,
    metodoPago: 'Contado',
    vendedor: 'Ana Torres',
    comision: 4050,
  },
  {
    id: '4',
    vehiculoId: '3',
    clienteId: '3',
    fecha: '2026-01-10',
    precio: 298000,
    metodoPago: 'Transferencia',
    vendedor: 'Luis Moreno',
    comision: 8940,
  },
  {
    id: '5',
    vehiculoId: '5',
    clienteId: '6',
    fecha: '2026-02-14',
    precio: 245000,
    metodoPago: 'Financiamiento',
    vendedor: 'Pedro Ruiz',
    comision: 7350,
  },
  {
    id: '6',
    vehiculoId: '6',
    clienteId: '3',
    fecha: '2026-04-05',
    precio: 265000,
    metodoPago: 'Transferencia',
    vendedor: 'Ana Torres',
    comision: 7950,
  },
  {
    id: '7',
    vehiculoId: '7',
    clienteId: '7',
    fecha: '2026-06-10',
    precio: 395000,
    metodoPago: 'Contado',
    vendedor: 'Luis Moreno',
    comision: 11850,
  },
  {
    id: '8',
    vehiculoId: '8',
    clienteId: '5',
    fecha: '2026-06-20',
    precio: 320000,
    metodoPago: 'Financiamiento',
    vendedor: 'Ana Torres',
    comision: 9600,
  },
  {
    id: '9',
    vehiculoId: '1',
    clienteId: '1',
    fecha: '2026-06-25',
    precio: 285000,
    metodoPago: 'Transferencia',
    vendedor: 'Pedro Ruiz',
    comision: 8550,
  },
  {
    id: '10',
    vehiculoId: '2',
    clienteId: '5',
    fecha: '2026-01-22',
    precio: 235000,
    metodoPago: 'Financiamiento',
    vendedor: 'Luis Moreno',
    comision: 7050,
  },
  {
    id: '11',
    vehiculoId: '4',
    clienteId: '7',
    fecha: '2026-03-08',
    precio: 285000,
    metodoPago: 'Transferencia',
    vendedor: 'Ana Torres',
    comision: 8550,
  },
  {
    id: '12',
    vehiculoId: '5',
    clienteId: '5',
    fecha: '2026-05-28',
    precio: 245000,
    metodoPago: 'Contado',
    vendedor: 'Pedro Ruiz',
    comision: 7350,
  },
];

export const reservations: Reservation[] = [];
