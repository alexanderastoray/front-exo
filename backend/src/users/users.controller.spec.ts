import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../common/enums';
import { UserResponseDto } from './dto/user-response.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      const expectedResult = new UserResponseDto({
        id: 'uuid-1',
        ...createUserDto,
        role: UserRole.EMPLOYEE,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockUsersService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const expectedResult = {
        data: [
          new UserResponseDto({
            id: 'uuid-1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            role: UserRole.EMPLOYEE,
            managerId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockUsersService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll({ page: 1, limit: 10 });

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const expectedResult = new UserResponseDto({
        id: 'uuid-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: UserRole.EMPLOYEE,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockUsersService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('uuid-1');

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith('uuid-1');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
      };

      const expectedResult = new UserResponseDto({
        id: 'uuid-1',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'john@example.com',
        role: UserRole.EMPLOYEE,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockUsersService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('uuid-1', updateUserDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith('uuid-1', updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      await controller.remove('uuid-1');

      expect(service.remove).toHaveBeenCalledWith('uuid-1');
    });
  });
});
