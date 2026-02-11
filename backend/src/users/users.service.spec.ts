import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../common/enums';

const createMockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let repository: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      const user = {
        id: 'uuid-1',
        ...createUserDto,
        role: UserRole.EMPLOYEE,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(user);
      repository.save.mockResolvedValue(user);

      const result = await service.create(createUserDto);

      expect(result.email).toBe(createUserDto.email);
      expect(result.role).toBe(UserRole.EMPLOYEE);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
      };

      repository.findOne.mockResolvedValue({ email: createUserDto.email });

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = {
        id: 'uuid-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: UserRole.EMPLOYEE,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findOne.mockResolvedValue(user);

      const result = await service.findOne('uuid-1');

      expect(result.id).toBe('uuid-1');
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = {
        id: 'uuid-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: UserRole.EMPLOYEE,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
      };

      repository.findOne.mockResolvedValue(user);
      repository.save.mockResolvedValue({ ...user, ...updateUserDto });

      const result = await service.update('uuid-1', updateUserDto);

      expect(result.firstName).toBe('Jane');
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.update('non-existent', {})).rejects.toThrow(NotFoundException);
    });

    it('should update email when new email is provided and does not exist', async () => {
      const user = {
        id: 'uuid-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: UserRole.EMPLOYEE,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateUserDto: UpdateUserDto = {
        email: 'newemail@example.com',
      };

      repository.findOne
        .mockResolvedValueOnce(user) // First call to find the user
        .mockResolvedValueOnce(null); // Second call to check if new email exists
      repository.save.mockResolvedValue({ ...user, email: 'newemail@example.com' });

      const result = await service.update('uuid-1', updateUserDto);

      expect(result.email).toBe('newemail@example.com');
      expect(repository.findOne).toHaveBeenCalledTimes(2);
      expect(repository.findOne).toHaveBeenNthCalledWith(1, { where: { id: 'uuid-1' } });
      expect(repository.findOne).toHaveBeenNthCalledWith(2, { where: { email: 'newemail@example.com' } });
    });

    it('should throw ConflictException when updating to an existing email', async () => {
      const user = {
        id: 'uuid-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: UserRole.EMPLOYEE,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const existingUser = {
        id: 'uuid-2',
        email: 'existing@example.com',
      };

      const updateUserDto: UpdateUserDto = {
        email: 'existing@example.com',
      };

      repository.findOne
        .mockResolvedValueOnce(user) // First call to find the user
        .mockResolvedValueOnce(existingUser); // Second call finds existing email

      await expect(service.update('uuid-1', updateUserDto)).rejects.toThrow(ConflictException);
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should not check for email conflict when email is not being updated', async () => {
      const user = {
        id: 'uuid-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: UserRole.EMPLOYEE,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      repository.findOne.mockResolvedValueOnce(user);
      repository.save.mockResolvedValue({ ...user, ...updateUserDto });

      await service.update('uuid-1', updateUserDto);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should not check for email conflict when email is same as current', async () => {
      const user = {
        id: 'uuid-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: UserRole.EMPLOYEE,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateUserDto: UpdateUserDto = {
        email: 'john@example.com', // Same email
        firstName: 'Jane',
      };

      repository.findOne.mockResolvedValueOnce(user);
      repository.save.mockResolvedValue({ ...user, ...updateUserDto });

      await service.update('uuid-1', updateUserDto);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user = {
        id: 'uuid-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      repository.findOne.mockResolvedValue(user);
      repository.remove.mockResolvedValue(user);

      await service.remove('uuid-1');

      expect(repository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
