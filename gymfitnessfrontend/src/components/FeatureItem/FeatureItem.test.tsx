import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FeatureItem from './FeatureItem';

// Mock Icon Component
const MockIcon = vi.fn(() => <svg data-testid="mock-icon" aria-hidden="true" />);

describe('FeatureItem', () => {
  it('should render the provided text and icon', () => {
    const testText = 'Test Feature Text';
    render(<FeatureItem Icon={MockIcon} text={testText} />);

    // Check for text
    expect(screen.getByText(testText)).toBeInTheDocument();

    // Check for icon
    const iconElement = screen.getByTestId('mock-icon');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveAttribute('aria-hidden', 'true');

    // Ensure MockIcon was called
    expect(MockIcon).toHaveBeenCalled();
  });
});
