
import { User, UserRole, StorageItem, Category, Tag, Booking, BookingStatus } from './types';
import { v4 as uuidv4 } from 'uuid';

// Mock data for development purposes

// Users
export const users: User[] = [
  {
    id: '1',
    email: 'vera@illusia.fi',
    password: '$2b$10$X7GmXzRgEegr0hz/yzq1yOJ3D9X9WFAl.67y0JKdT0Ll.EdttkjIe', // hashed 'password123'
    firstName: 'Vera',
    lastName: 'Admin',
    role: UserRole.SUPER_ADMIN,
    isApproved: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'admin@illusia.fi',
    password: '$2b$10$X7GmXzRgEegr0hz/yzq1yOJ3D9X9WFAl.67y0JKdT0Ll.EdttkjIe',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    isApproved: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    email: 'user@example.com',
    password: '$2b$10$X7GmXzRgEegr0hz/yzq1yOJ3D9X9WFAl.67y0JKdT0Ll.EdttkjIe',
    firstName: 'Regular',
    lastName: 'User',
    role: UserRole.USER,
    isApproved: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    email: 'pending@example.com',
    password: '$2b$10$X7GmXzRgEegr0hz/yzq1yOJ3D9X9WFAl.67y0JKdT0Ll.EdttkjIe',
    firstName: 'Pending',
    lastName: 'Approval',
    role: UserRole.USER,
    isApproved: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// Categories
export const categories: Category[] = [
  {
    id: '1',
    name: 'Props',
    description: 'Stage and LARP props',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Costumes',
    description: 'Costumes and costume parts',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Medical Supplies',
    description: 'First aid and medical roleplaying supplies',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Furniture',
    description: 'Chairs, tables and other furniture for events',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// Tags
export const tags: Tag[] = [
  {
    id: '1',
    name: 'medieval',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'fantasy',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'sci-fi',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'weapon',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'formal',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'outdoor',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// Items
export const items: StorageItem[] = [
  {
    id: '1',
    name: 'Foam Swords',
    description: 'Set of 20 foam swords for LARPs',
    quantity: 20,
    location: 'Storage A, Shelf 3',
    imageUrl: '/images/foam-swords.jpg',
    categoryId: '1',
    tags: ['2', '4'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Medieval Tunics',
    description: 'Cotton tunics in various colors and sizes',
    quantity: 15,
    location: 'Storage B, Wardrobe 1',
    imageUrl: '/images/tunics.jpg',
    categoryId: '2',
    tags: ['1', '2'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'First Aid Kits',
    description: 'Complete kits for event safety',
    quantity: 5,
    location: 'Storage A, Medical Cabinet',
    imageUrl: '/images/first-aid.jpg',
    categoryId: '3',
    tags: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Folding Tables',
    description: 'Lightweight tables for event setups',
    quantity: 10,
    location: 'Storage C',
    imageUrl: '/images/folding-tables.jpg',
    categoryId: '4',
    tags: ['6'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Mattresses',
    description: 'Sleeping mats for overnight events',
    quantity: 20,
    location: 'Storage D',
    imageUrl: '/images/mattresses.jpg',
    categoryId: '4',
    tags: ['6'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// Bookings
export const bookings: Booking[] = [
  {
    id: '1',
    userId: '3',
    items: [
      { itemId: '1', quantity: 10 },
      { itemId: '2', quantity: 5 }
    ],
    startDate: new Date('2025-05-01'),
    endDate: new Date('2025-05-07'),
    status: BookingStatus.APPROVED,
    notes: 'For Fantasy LARP event',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: '3',
    items: [
      { itemId: '3', quantity: 2 },
      { itemId: '4', quantity: 4 }
    ],
    startDate: new Date('2025-06-15'),
    endDate: new Date('2025-06-20'),
    status: BookingStatus.PENDING,
    notes: 'Summer convention setup',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// Helper functions for mock data
export const findUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const findUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const findItemById = (id: string): StorageItem | undefined => {
  return items.find(item => item.id === id);
};

export const findCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const findBookingById = (id: string): Booking | undefined => {
  return bookings.find(booking => booking.id === id);
};

export const findBookingsByUserId = (userId: string): Booking[] => {
  return bookings.filter(booking => booking.userId === userId);
};

export const addUser = (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
  const newUser: User = {
    ...user,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  users.push(newUser);
  return newUser;
};

export const addItem = (item: Omit<StorageItem, 'id' | 'createdAt' | 'updatedAt'>): StorageItem => {
  const newItem: StorageItem = {
    ...item,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  items.push(newItem);
  return newItem;
};

export const addBooking = (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Booking => {
  const newBooking: Booking = {
    ...booking,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  bookings.push(newBooking);
  return newBooking;
};
