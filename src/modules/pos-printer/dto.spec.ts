import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreatePosPrinterAccountDto } from './dto';

const validateCreate = (input: Record<string, unknown>) =>
  validate(plainToInstance(CreatePosPrinterAccountDto, input));

describe('CreatePosPrinterAccountDto', () => {
  it('accepts username credentials when optional email is omitted', async () => {
    await expect(
      validateCreate({
        username: 'Verona',
        password: 'Password@123',
        firstName: 'Haji',
        lastName: 'Saad',
        branchId: 'branch-1',
      }),
    ).resolves.toEqual([]);
  });

  it.each(['', '   '])(
    'normalizes blank optional email %j to omission',
    async (email) => {
      const dto = plainToInstance(CreatePosPrinterAccountDto, {
        username: 'Verona',
        email,
        password: 'Password@123',
        branchId: 'branch-1',
      });

      await expect(validate(dto)).resolves.toEqual([]);
      expect(dto.email).toBeUndefined();
    },
  );

  it('rejects malformed usernames, present invalid email, and short passwords', async () => {
    const errors = await validateCreate({
      username: 'not valid',
      email: 'not-an-email',
      password: 'short',
      branchId: 'branch-1',
    });

    expect(errors.map(({ property }) => property).sort()).toEqual([
      'email',
      'password',
      'username',
    ]);
  });
});
