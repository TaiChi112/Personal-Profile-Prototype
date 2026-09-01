import { expect, test, describe } from 'bun:test';
import React from 'react';
import { render } from '@testing-library/react';
import { SectionHeader, SectionBanner, ContentSectionShell } from '../../../../../app/components/section/SectionPrimitives';
import type { SectionTitleStyle } from '../../../../../app/types/section-style';

describe('SectionPrimitives', () => {
  const mockStyle: SectionTitleStyle = {
    getSectionTitleClass: () => 'text-2xl font-bold mock-title-class',
  };

  describe('SectionHeader', () => {
    test('renders title and description', () => {
      const { getByText } = render(
        <SectionHeader title="Test Title" description="Test Description" currentStyle={mockStyle} />
      );

      const titleEl = getByText('Test Title');
      expect(titleEl).toBeInTheDocument();
      expect(titleEl).toHaveClass('mock-title-class');
      expect(getByText('Test Description')).toBeInTheDocument();
    });

    test('renders without description', () => {
      const { getByText, queryByText } = render(
        <SectionHeader title="Only Title" currentStyle={mockStyle} />
      );

      expect(getByText('Only Title')).toBeInTheDocument();
      expect(queryByText('Test Description')).not.toBeInTheDocument();
    });
  });

  describe('SectionBanner', () => {
    test('renders rightSlot when provided', () => {
      const rightSlot = <button data-testid="right-btn">Action</button>;
      const { getByTestId, getByText } = render(
        <SectionBanner title="Banner Title" rightSlot={rightSlot} currentStyle={mockStyle} />
      );

      expect(getByText('Banner Title')).toBeInTheDocument();
      expect(getByTestId('right-btn')).toBeInTheDocument();
    });
  });

  describe('ContentSectionShell', () => {
    test('renders children inside shell', () => {
      const { getByText } = render(
        <ContentSectionShell title="Shell Title" description="Shell Desc" currentStyle={mockStyle}>
          <div data-testid="child-content">Child Content</div>
        </ContentSectionShell>
      );

      expect(getByText('Shell Title')).toBeInTheDocument();
      expect(getByText('Shell Desc')).toBeInTheDocument();
      expect(getByText('Child Content')).toBeInTheDocument();
    });
  });
});
