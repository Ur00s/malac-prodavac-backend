import { ClassConstructor, plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

const validateConfig = <T>(
  config: Record<string, unknown>,
  configDtoClass: ClassConstructor<any>,
) => {
  const validatedConfig = plainToClass(configDtoClass, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig as T;
};

export const configFactory = <T>(configClass: ClassConstructor<T>) => {
  return validateConfig<T>(process.env, configClass);
};
