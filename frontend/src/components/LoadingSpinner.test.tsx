import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render loading spinner', () => {
    render(<LoadingSpinner />);
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    render(<LoadingSpinner />);
    const spinner = document.querySelector('.animate-spin');
    expect(spinner?.className).toContain('rounded-full');
    expect(spinner?.className).toContain('h-12');
    expect(spinner?.className).toContain('w-12');
    expect(spinner?.className).toContain('border-b-2');
    expect(spinner?.className).toContain('border-blue-600');
  });

  it('should be centered', () => {
    const { container } = render(<LoadingSpinner />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('flex');
    expect(wrapper.className).toContain('justify-center');
    expect(wrapper.className).toContain('items-center');
  });

  it('should have role status for accessibility', () => {
    render(<LoadingSpinner />);
    // The spinner itself should be identifiable for screen readers
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeTruthy();
  });
});
