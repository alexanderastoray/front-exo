import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormTextarea } from './FormTextarea';

describe('FormTextarea', () => {
  it('should render with label', () => {
    render(
      <FormTextarea
        label="Description"
        id="description"
        name="description"
        value=""
        onChange={vi.fn()}
      />
    );
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('should render with value', () => {
    render(
      <FormTextarea
        label="Description"
        id="description"
        name="description"
        value="Test description"
        onChange={vi.fn()}
      />
    );
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
  });

  it('should call onChange when value changes', async () => {
    const onChange = vi.fn();
    render(
      <FormTextarea
        label="Description"
        id="description"
        name="description"
        value=""
        onChange={onChange}
      />
    );

    await userEvent.type(screen.getByLabelText('Description'), 'test');
    expect(onChange).toHaveBeenCalled();
  });

  it('should render with placeholder', () => {
    render(
      <FormTextarea
        label="Description"
        id="description"
        name="description"
        value=""
        onChange={vi.fn()}
        placeholder="Enter description"
      />
    );
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
  });

  it('should show optional label when optional is true', () => {
    render(
      <FormTextarea
        label="Notes"
        id="notes"
        name="notes"
        value=""
        onChange={vi.fn()}
        optional
      />
    );
    expect(screen.getByText('(Optional)')).toBeInTheDocument();
  });

  it('should not show optional label by default', () => {
    render(
      <FormTextarea
        label="Description"
        id="description"
        name="description"
        value=""
        onChange={vi.fn()}
      />
    );
    expect(screen.queryByText('(Optional)')).not.toBeInTheDocument();
  });

  it('should have default rows of 3', () => {
    render(
      <FormTextarea
        label="Description"
        id="description"
        name="description"
        value=""
        onChange={vi.fn()}
      />
    );
    expect(screen.getByLabelText('Description')).toHaveAttribute('rows', '3');
  });

  it('should render with custom rows', () => {
    render(
      <FormTextarea
        label="Description"
        id="description"
        name="description"
        value=""
        onChange={vi.fn()}
        rows={5}
      />
    );
    expect(screen.getByLabelText('Description')).toHaveAttribute('rows', '5');
  });

  it('should have correct id and name attributes', () => {
    render(
      <FormTextarea
        label="Comments"
        id="comments"
        name="comments"
        value=""
        onChange={vi.fn()}
      />
    );
    const textarea = screen.getByLabelText('Comments');
    expect(textarea).toHaveAttribute('id', 'comments');
    expect(textarea).toHaveAttribute('name', 'comments');
  });
});
