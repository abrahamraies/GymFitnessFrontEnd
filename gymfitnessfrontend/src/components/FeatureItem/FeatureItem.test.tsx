import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FeatureItem from './FeatureItem';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getAppTheme } from '../../theme'; // Adjust path as needed

// Mock Icon Component that accepts props
const MockIcon = vi.fn((props) => <svg data-testid="mock-icon" aria-hidden="true" {...props} />);

const theme = createTheme(getAppTheme('light')); // Use a specific mode for testing

describe('FeatureItem', () => {
  it('should render the provided text and icon within an MUI Card structure', () => {
    const testText = 'Test Feature Text';
    render(
      <ThemeProvider theme={theme}>
        <FeatureItem Icon={MockIcon} text={testText} />
      </ThemeProvider>
    );

    // Check for text (Typography component will render this text)
    expect(screen.getByText(testText)).toBeInTheDocument();

    // Check for icon
    const iconElement = screen.getByTestId('mock-icon');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveAttribute('aria-hidden', 'true');

    // Ensure MockIcon was called (it's called with props including size and aria-hidden)
    expect(MockIcon).toHaveBeenCalledWith(expect.objectContaining({
      size: 48, // As passed in FeatureItem.tsx
      'aria-hidden': 'true'
    }));
  });
});
