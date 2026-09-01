import { expect, test, describe } from 'bun:test';
import React from 'react';
import { render } from '@testing-library/react';
import { MetricCard } from '../../../../../app/components/dashboard/MetricCard';

describe('MetricCard', () => {
  test('renders label and value with correct class', () => {
    const { getByText } = render(
      <MetricCard label="Total Projects" value={42} valueClassName="text-green-500" />
    );

    const valueEl = getByText('42');
    expect(valueEl).toBeInTheDocument();
    expect(valueEl).toHaveClass('text-green-500');
    expect(valueEl).toHaveClass('text-3xl');
    expect(valueEl).toHaveClass('font-bold');

    const labelEl = getByText('Total Projects');
    expect(labelEl).toBeInTheDocument();
    expect(labelEl).toHaveClass('text-xs');
  });
});
