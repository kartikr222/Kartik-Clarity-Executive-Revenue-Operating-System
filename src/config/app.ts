export const config = {
  name: 'Kartik Clarity',
  description: 'Executive Revenue Operating System',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  version: '0.1.0',
  environment: process.env.NODE_ENV || 'development',
};

export const paginationDefaults = {
  pageSize: 10,
  maxPageSize: 100,
};

export const validationDefaults = {
  passwordMinLength: 8,
  emailMaxLength: 255,
  nameMaxLength: 255,
};
