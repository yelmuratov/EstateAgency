import { z } from 'zod';

export const commercialFormSchema = z.object({
  district: z.string().min(1, 'Это поле обязательно'),
  title: z.string().min(3, 'Минимум 3 символа').max(50, 'Максимум 50 символов'),
  category: z.literal('commercial'),
  action_type: z.enum(['rent', 'sale'], { required_error: 'Выберите тип действия' }),
  description: z.string().max(6000, 'Максимум 6000 символов').default(''),
  comment: z.string().max(6000, 'Максимум 6000 символов').default(''),
  price: z.number().positive('Цена должна быть положительным числом'),
  rooms: z.number().positive('Количество комнат должно быть положительным числом'),
  square_area: z.number().positive('Площадь должна быть положительным числом'),
  floor_number: z.number().positive('Этаж должен быть положительным числом'),
  location: z.enum(
    ['business_center', 'administrative_building', 'residential_building', 'cottage', 'shopping_mall', 'industrial_zone', 'market', 'detached_building'],
    { required_error: 'Выберите расположение' }
  ),
  furnished: z.boolean().default(true),
  house_condition: z.enum(['euro', 'normal', 'repair'], { required_error: 'Выберите состояние' }),
  current_status: z.enum(['free', 'soon', 'busy']).default('free'),
  parking_place: z.boolean({ required_error: 'Выберите наличие парковки' }),
  agent_percent: z.number().min(0, 'Процент агента не может быть отрицательным').max(100, 'Процент агента не может быть больше 100'),
  agent_commission: z.number().optional(),
  crm_id: z.string().max(255, 'Максимум 255 символов').optional(),
  responsible: z.string().min(3, 'Минимум 3 символа').max(100, 'Максимум 100 символов').optional(),
  media: z.array(z.instanceof(File)).optional(), // Handles file uploads
});
