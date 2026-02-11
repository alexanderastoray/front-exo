import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormDateInput } from './FormDateInput';

describe('FormDateInput', () => {
  it('should render with label', () => {
    render(
      <FormDateInput
        label="Date"
        id="date"
        name="date"
        value=""
        onChange={vi.fn()}
      />
    );
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
  });

  it('should render with value', () => {
    render(
      <FormDateInput
        label="Date"
        id="date"
        name="date"
        value="2026-02-10"
        onChange={vi.fn()}
      />
    );
    expect(screen.getByDisplayValue('2026-02-10')).toBeInTheDocument();
  });

  it('should call onChange when value changes', async () => {
    const onChange = vi.fn();
    render(
      <FormDateInput
        label="Date"
        id="date"
        name="date"
        value=""
        onChange={onChange}
      />
    );

    const input = screen.getByLabelText('Date');
    await userEvent.type(input, '2026-02-10');
    expect(onChange).toHaveBeenCalled();
  });

  it('should have type="date"', () => {
    render(
      <FormDateInput
        label="Date"
        id="date"
        name="date"
        value=""
        onChange={vi.fn()}
      />
    );
    expect(screen.getByLabelText('Date')).toHaveAttribute('type', 'date');
  });

  it('should have correct id and name attributes', () => {
    render(
      <FormDateInput
        label="Expense Date"
        id="expenseDate"
        name="expenseDate"
        value=""
        onChange={vi.fn()}
      />
    );
    const input = screen.getByLabelText('Expense Date');
    expect(input).toHaveAttribute('id', 'expenseDate');
    expect(input).toHaveAttribute('name', 'expenseDate');
  });

  it('should render with empty value', () => {
    render(
      <FormDateInput
        label="Date"
        id="date"
        name="date"
        value=""
        onChange={vi.fn()}
      />
    );
    expect(screen.getByLabelText('Date')).toHaveValue('');
  });
});
