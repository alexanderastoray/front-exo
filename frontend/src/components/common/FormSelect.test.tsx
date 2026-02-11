import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormSelect } from './FormSelect';

describe('FormSelect', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('should render with label', () => {
    render(
      <FormSelect
        label="Category"
        id="category"
        name="category"
        value="option1"
        onChange={vi.fn()}
        options={options}
      />
    );
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
  });

  it('should render all options', () => {
    render(
      <FormSelect
        label="Category"
        id="category"
        name="category"
        value="option1"
        onChange={vi.fn()}
        options={options}
      />
    );
    expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 3' })).toBeInTheDocument();
  });

  it('should have selected value', () => {
    render(
      <FormSelect
        label="Category"
        id="category"
        name="category"
        value="option2"
        onChange={vi.fn()}
        options={options}
      />
    );
    expect(screen.getByRole('combobox')).toHaveValue('option2');
  });

  it('should call onChange when selection changes', async () => {
    const onChange = vi.fn();
    render(
      <FormSelect
        label="Category"
        id="category"
        name="category"
        value="option1"
        onChange={onChange}
        options={options}
      />
    );

    await userEvent.selectOptions(screen.getByRole('combobox'), 'option2');
    expect(onChange).toHaveBeenCalled();
  });

  it('should have correct id and name attributes', () => {
    render(
      <FormSelect
        label="Status"
        id="status"
        name="status"
        value="option1"
        onChange={vi.fn()}
        options={options}
      />
    );
    const select = screen.getByLabelText('Status');
    expect(select).toHaveAttribute('id', 'status');
    expect(select).toHaveAttribute('name', 'status');
  });

  it('should render with empty options array', () => {
    render(
      <FormSelect
        label="Empty"
        id="empty"
        name="empty"
        value=""
        onChange={vi.fn()}
        options={[]}
      />
    );
    expect(screen.getByLabelText('Empty')).toBeInTheDocument();
  });
});
