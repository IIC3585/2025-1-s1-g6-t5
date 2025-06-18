import { defineCollection, z } from 'astro:content';

const instrumentSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  category: z.enum([
    'Guitarras Eléctricas',
    'Guitarras Acústicas', 
    'Guitarras Clásicas',
    'Pianos Digitales',
    'Baterías',
    'Bajos Eléctricos',
    'Sintetizadores',
    'Platillos',
    'Micrófonos'
  ]),
  price: z.number(),
  brand: z.string(),
  image: z.string().url(),
  description: z.string(),
  inStock: z.boolean(),
  rating: z.number().min(0).max(5),
  specifications: z.object({
    body: z.string().optional(),
    neck: z.string().optional(),
    fretboard: z.string().optional(),
    pickups: z.string().optional(),
    keys: z.string().optional(), // Cambiado de number a string para descripción completa
    power: z.string().optional(),
    connectivity: z.string().optional(),
    material: z.string().optional(),
    size: z.string().optional(),
    frequency: z.string().optional(),
    pattern: z.string().optional(),
    impedance: z.string().optional(),
    sensitivity: z.string().optional()
  })
});

const instrumentsCollection = defineCollection({
  type: 'data',
  schema: z.array(instrumentSchema)
});

export const collections = {
  instruments: instrumentsCollection,
};
