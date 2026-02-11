import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormInput } from './FormInput';

describe('FormInput', () => {
  it('should render with label', () => {
    render(
      <FormInput
        label="Email"
        id="email"
        name="email"
        value=""
        onChange={vi.fn()}
      />
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('should render with value', () => {
    render(
      <FormInput
        label="Email"
        id="email"
        name="email"
        value="test@example.com"
        onChange={vi.fn()}
      />
    );
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('should call onChange when value changes', async () => {
    const onChange = vi.fn();
    render(
      <FormInput
        label="Email"
        id="email"
        name="email"
        value=""
        onChange={onChange}
      />
    );

    await userEvent.type(screen.getByLabelText('Email'), 'test');
    expect(onChange).toHaveBeenCalled();
  });

  it('should render with placeholder', () => {
    render(
      <FormInput
        label="Email"
        id="email"
        name="email"
        value=""
        onChange={vi.fn()}
        placeholder="Enter your email"
      />
    );
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('should show optional label when optional is true', () => {
    render(
      <FormInput
        label="Phone"
        id="phone"
        name="phone"
        value=""
        onChange={vi.fn()}
        optional
      />
    );
    expect(screen.getByText('(Optional)')).toBeInTheDocument();
  });

  it('should not show optional label by default', () => {
    render(
      <FormInput
        label="Email"
        id="email"
        name="email"
        value=""
        onChange={vi.fn()}
      />
    );
    expect(screen.queryByText('(Optional)')).not.toBeInTheDocument();
  });

  it('should render with prefix', () => {
    render(
      <FormInput
        label="Amount"
        id="amount"
        name="amount"
        value=""
        onChange={vi.fn()}
        prefix="$"
      />
    );
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('should render as text type by default', () => {
    render(
      <FormInput
        label="Name"
        id="name"
        name="name"
        value=""
        onChange={vi.fn()}
      />
    );
    expect(screen.getByLabelText('Name')).toHaveAttribute('type', 'text');
  });

  it('should render as number type', () => {
    render(
      <FormInput
        label="Amount"
        id="amount"
        name="amount"
        type="number"
        value=""
        onChange={vi.fn()}
      />
    );
    expect(screen.getByLabelText('Amount')).toHaveAttribute('type', 'number');
  });

  it('should render as email type', () => {
    render(
      <FormInput
        label="Email"
        id="email"
        name="email"
        type="email"
        value=""
        onChange={vi.fn()}
      />
    );
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
  });

  it('should have correct id and name attributes', () => {
    render(
      <FormInput
        label="Username"
        id="username"
        name="username"
        value=""
        onChange={vi.fn()}
      />
    );
    const input = screen.getByLabelText('Username');
    expect(input).toHaveAttribute('id', 'username');
    expect(input).toHaveAttribute('name', 'username');
  });
});
