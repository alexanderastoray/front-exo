import { ValidationPipe } from './validation.pipe';
import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

// Mock class-validator and class-transformer
jest.mock('class-validator');
jest.mock('class-transformer');

// Test DTO class (without decorators to avoid issues in tests)
class TestDto {
  name: string;
  email: string;
  age: number;
}

describe('ValidationPipe', () => {
  let pipe: ValidationPipe;

  beforeEach(() => {
    pipe = new ValidationPipe();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should return value when metatype is not provided', async () => {
      const value = { name: 'test', email: 'test@example.com', age: 25 };
      const metadata = { type: 'body' as const, metatype: undefined, data: '' };

      const result = await pipe.transform(value, metadata);

      expect(result).toBe(value);
      expect(plainToInstance).not.toHaveBeenCalled();
      expect(validate).not.toHaveBeenCalled();
    });

    it('should return value when metatype is a native type (String)', async () => {
      const value = 'test string';
      const metadata = { type: 'body' as const, metatype: String, data: '' };

      const result = await pipe.transform(value, metadata);

      expect(result).toBe(value);
      expect(plainToInstance).not.toHaveBeenCalled();
      expect(validate).not.toHaveBeenCalled();
    });

    it('should return value when metatype is a native type (Number)', async () => {
      const value = 123;
      const metadata = { type: 'body' as const, metatype: Number, data: '' };

      const result = await pipe.transform(value, metadata);

      expect(result).toBe(value);
      expect(plainToInstance).not.toHaveBeenCalled();
      expect(validate).not.toHaveBeenCalled();
    });

    it('should return value when metatype is a native type (Boolean)', async () => {
      const value = true;
      const metadata = { type: 'body' as const, metatype: Boolean, data: '' };

      const result = await pipe.transform(value, metadata);

      expect(result).toBe(value);
      expect(plainToInstance).not.toHaveBeenCalled();
      expect(validate).not.toHaveBeenCalled();
    });

    it('should return value when metatype is a native type (Array)', async () => {
      const value = [1, 2, 3];
      const metadata = { type: 'body' as const, metatype: Array, data: '' };

      const result = await pipe.transform(value, metadata);

      expect(result).toBe(value);
      expect(plainToInstance).not.toHaveBeenCalled();
      expect(validate).not.toHaveBeenCalled();
    });

    it('should return value when metatype is a native type (Object)', async () => {
      const value = { key: 'value' };
      const metadata = { type: 'body' as const, metatype: Object, data: '' };

      const result = await pipe.transform(value, metadata);

      expect(result).toBe(value);
      expect(plainToInstance).not.toHaveBeenCalled();
      expect(validate).not.toHaveBeenCalled();
    });

    it('should transform and validate DTO when validation passes', async () => {
      const value = { name: 'test', email: 'test@example.com', age: 25 };
      const metadata = { type: 'body' as const, metatype: TestDto, data: '' };
      const transformedObject = new TestDto();

      (plainToInstance as jest.Mock).mockReturnValue(transformedObject);
      (validate as jest.Mock).mockResolvedValue([]);

      const result = await pipe.transform(value, metadata);

      expect(plainToInstance).toHaveBeenCalledWith(TestDto, value);
      expect(validate).toHaveBeenCalledWith(transformedObject);
      expect(result).toBe(transformedObject);
    });

    it('should throw BadRequestException when validation fails with string messages', async () => {
      const value = { name: 'ab', email: 'invalid', age: 'not-a-number' };
      const metadata = { type: 'body' as const, metatype: TestDto, data: '' };
      const transformedObject = new TestDto();

      const validationErrors = [
        {
          property: 'name',
          constraints: {
            minLength: 'name must be longer than or equal to 3 characters',
          },
        },
        {
          property: 'email',
          constraints: {
            isEmail: 'email must be an email',
          },
        },
      ];

      (plainToInstance as jest.Mock).mockReturnValue(transformedObject);
      (validate as jest.Mock).mockResolvedValue(validationErrors);

      await expect(pipe.transform(value, metadata)).rejects.toThrow(BadRequestException);
    });

    it('should handle validation errors without constraints', async () => {
      const value = { name: 'test' };
      const metadata = { type: 'body' as const, metatype: TestDto, data: '' };
      const transformedObject = new TestDto();

      const validationErrors = [
        {
          property: 'email',
          constraints: null,
        },
      ];

      (plainToInstance as jest.Mock).mockReturnValue(transformedObject);
      (validate as jest.Mock).mockResolvedValue(validationErrors);

      await expect(pipe.transform(value, metadata)).rejects.toThrow(BadRequestException);
    });

    it('should handle multiple validation errors for single field', async () => {
      const value = { name: '', email: 'test@example.com', age: 25 };
      const metadata = { type: 'body' as const, metatype: TestDto, data: '' };
      const transformedObject = new TestDto();

      const validationErrors = [
        {
          property: 'name',
          constraints: {
            isString: 'name must be a string',
            minLength: 'name must be longer than or equal to 3 characters',
          },
        },
      ];

      (plainToInstance as jest.Mock).mockReturnValue(transformedObject);
      (validate as jest.Mock).mockResolvedValue(validationErrors);

      await expect(pipe.transform(value, metadata)).rejects.toThrow(BadRequestException);
    });

    it('should handle empty validation errors array', async () => {
      const value = { name: 'test', email: 'test@example.com', age: 25 };
      const metadata = { type: 'body' as const, metatype: TestDto, data: '' };
      const transformedObject = new TestDto();

      (plainToInstance as jest.Mock).mockReturnValue(transformedObject);
      (validate as jest.Mock).mockResolvedValue([]);

      const result = await pipe.transform(value, metadata);

      expect(result).toBe(transformedObject);
    });
  });
});
