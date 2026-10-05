import { describe, it, expect, beforeEach } from 'bun:test';
import { render, fireEvent, act } from '@testing-library/react';
import Calculator from '@/app/projects/(micro-apps)/body-metrics/components/Calculator';
import Page from '@/app/projects/(micro-apps)/body-metrics/page';
import { useMetricsStore } from '@/app/projects/(micro-apps)/body-metrics/store/useMetricsStore';

describe('Body Metrics Calculator and Page', () => {
  beforeEach(() => {
    useMetricsStore.setState({
      weight: 70,
      height: 175,
      age: 25,
      gender: 'male',
    });
  });

  it('should render default calculations accurately for male', () => {
    // weight 70, height 175, age 25, male
    // bmi = 70 / (1.75 * 1.75) = 22.857 -> 22.9 ('Normal')
    // bmr = (10 * 70) + (6.25 * 175) - (5 * 25) + 5 = 700 + 1093.75 - 125 + 5 = 1673.75 -> 1674
    const { getByText } = render(<Calculator />);

    expect(getByText('22.9')).toBeInTheDocument();
    expect(getByText('Normal')).toBeInTheDocument();
    expect(getByText('1674')).toBeInTheDocument();
    expect(getByText('kcal / day')).toBeInTheDocument();
  });

  it('should calculate BMR correctly when gender is female', () => {
    // weight 70, height 175, age 25, female
    // bmr = 700 + 1093.75 - 125 - 161 = 1507.75 -> 1508
    act(() => {
      useMetricsStore.setState({ gender: 'female' });
    });

    const { getByText } = render(<Calculator />);
    expect(getByText('1508')).toBeInTheDocument();
  });

  it('should classify Underweight when BMI < 18.5', () => {
    // weight 45, height 175 -> bmi = 45 / (1.75 * 1.75) = 14.7
    act(() => {
      useMetricsStore.setState({ weight: 45, height: 175 });
    });

    const { getByText } = render(<Calculator />);
    expect(getByText('14.7')).toBeInTheDocument();
    expect(getByText('Underweight')).toBeInTheDocument();
  });

  it('should classify Overweight when 24.9 <= BMI < 29.9', () => {
    // weight 80, height 175 -> bmi = 80 / (1.75 * 1.75) = 26.1
    act(() => {
      useMetricsStore.setState({ weight: 80, height: 175 });
    });

    const { getByText } = render(<Calculator />);
    expect(getByText('26.1')).toBeInTheDocument();
    expect(getByText('Overweight')).toBeInTheDocument();
  });

  it('should classify Obese when BMI >= 29.9', () => {
    // weight 105, height 175 -> bmi = 105 / (1.75 * 1.75) = 34.3
    act(() => {
      useMetricsStore.setState({ weight: 105, height: 175 });
    });

    const { getByText } = render(<Calculator />);
    expect(getByText('34.3')).toBeInTheDocument();
    expect(getByText('Obese')).toBeInTheDocument();
  });

  it('should update inputs and store on user changes', () => {
    const { getByRole, getAllByRole } = render(<Calculator />);

    const femaleBtn = getByRole('button', { name: 'Female' });
    act(() => {
      fireEvent.click(femaleBtn);
    });
    expect((useMetricsStore.getState() as any).gender).toBe('female');

    const maleBtn = getByRole('button', { name: 'Male' });
    act(() => {
      fireEvent.click(maleBtn);
    });
    expect((useMetricsStore.getState() as any).gender).toBe('male');

    const [ageInput, weightInput, heightInput] = getAllByRole('spinbutton');

    act(() => {
      fireEvent.change(ageInput, { target: { value: '30' } });
    });
    expect((useMetricsStore.getState() as any).age).toBe(30);

    act(() => {
      fireEvent.change(weightInput, { target: { value: '75' } });
    });
    expect((useMetricsStore.getState() as any).weight).toBe(75);

    act(() => {
      fireEvent.change(heightInput, { target: { value: '180' } });
    });
    expect((useMetricsStore.getState() as any).height).toBe(180);
  });

  it('should render the full Page with title, link, and Calculator component', () => {
    const { getByText } = render(<Page />);

    const backLink = getByText('Back', { exact: false });
    expect(backLink).toBeInTheDocument();
    expect(backLink.getAttribute('href')).toBe('/projects');
    expect(getByText('BodyMetrics', { exact: false })).toBeInTheDocument();
    expect(getByText('Your Stats')).toBeInTheDocument();
  });
});
