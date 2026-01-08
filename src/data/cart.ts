import { CartItem } from '../types';

// Cart storage per user email
export let carts: Record<string, CartItem[]> = {};
