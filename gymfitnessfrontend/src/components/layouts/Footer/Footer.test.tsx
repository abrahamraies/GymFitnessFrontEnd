import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { getAppTheme } from '../../../theme'; // Adjust path

const muiTheme = createTheme(getAppTheme('light'));

const renderFooter = () => {
  return render(
    <MuiThemeProvider theme={muiTheme}>
      <Footer />
    </MuiThemeProvider>
  );
};

describe('Footer', () => {
  it('Test 1 (Content Rendering): should render the copyright text with the current year', () => {
    renderFooter();

    const currentYear = new Date().getFullYear();
    const expectedText = `© ${currentYear} Gym & Fitness Guide. All rights reserved.`;

    // Check for the copyright text (Typography component will render this)
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });
});
