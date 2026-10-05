import { describe, it, expect, mock, beforeEach } from 'bun:test';
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

const mockAuth = mock();
mock.module('@/auth', () => ({
  auth: mockAuth,
}));

const mockSignOut = mock();
mock.module('next-auth/react', () => ({
  signOut: mockSignOut,
}));

mock.module('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

const mockRevalidatePath = mock();
mock.module('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}));

import { prisma } from '@/lib/prisma';

const mockFinanceTransaction = {
  findMany: mock(),
  create: mock(),
  delete: mock(),
  groupBy: mock(),
};

(prisma as any).financeTransaction = mockFinanceTransaction;

mock.module('@/app/components/onboarding/OnboardingWrapper', () => ({
  OnboardingWrapper: ({ children, appId, appName }: any) => (
    <div data-testid="onboarding-wrapper" data-app-id={appId} data-app-name={appName}>
      {children}
    </div>
  ),
}));

import Page from '@/app/projects/(micro-apps)/finance-flow/page';
import FinanceCalc from '@/app/projects/(micro-apps)/finance-flow/components/FinanceCalc';

describe('FinanceFlow Page and FinanceCalc Suite', () => {
  const dummyUser = { id: 'user-fin-1', email: 'test@finance.com', name: 'Finance Tester', image: 'https://example.com/pic.png' };

  beforeEach(() => {
    mockAuth.mockReset();
    mockSignOut.mockReset();
    mockRevalidatePath.mockReset();
    mockFinanceTransaction.findMany.mockReset();
    mockFinanceTransaction.create.mockReset();
    mockFinanceTransaction.delete.mockReset();
    mockFinanceTransaction.groupBy.mockReset();
    mockAuth.mockResolvedValue({ user: dummyUser });
  });

  describe('Page Server Component', () => {
    it('should render login card when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null);

      const PageElement = await Page();
      const { getByText, getByRole } = render(PageElement);

      expect(getByText('FinanceFlow', { exact: false })).toBeInTheDocument();
      expect(getByText('Please login to manage your finances.')).toBeInTheDocument();

      const loginLink = getByRole('link', { name: 'Login with Google' });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink.getAttribute('href')).toBe('/api/auth/signin?callbackUrl=/projects/finance-flow');
      expect(mockFinanceTransaction.findMany).not.toHaveBeenCalled();
    });

    it('should render FinanceCalc with transactions and analytics when authenticated', async () => {
      const dummyTxs = [
        { id: 'tx-1', amount: 500, label: 'Freelance', type: 'income', createdAt: new Date() },
        { id: 'tx-2', amount: 50, label: 'Coffee', type: 'expense', createdAt: new Date() },
      ];
      const dummyGroupBy = [
        { label: 'Coffee', _sum: { amount: 50 } },
      ];

      mockFinanceTransaction.findMany.mockResolvedValue(dummyTxs);
      mockFinanceTransaction.groupBy.mockResolvedValue(dummyGroupBy);

      const PageElement = await Page();
      const { getByTestId, getByText, getAllByText } = render(PageElement);

      expect(mockFinanceTransaction.findMany).toHaveBeenCalledTimes(1);
      expect(mockFinanceTransaction.groupBy).toHaveBeenCalledTimes(1);

      expect(getByTestId('onboarding-wrapper')).toBeInTheDocument();
      expect(getByText('Welcome, Finance')).toBeInTheDocument();
      expect(getByText('Freelance')).toBeInTheDocument();
      expect(getByText('+500')).toBeInTheDocument();
      expect(getAllByText('Coffee')).toHaveLength(2);
      expect(getByText('-50')).toBeInTheDocument();
    });
  });

  describe('FinanceCalc Client Component', () => {
    const sampleTransactions = [
      { id: 't-1', amount: 2000, label: 'Salary', type: 'income' },
      { id: 't-2', amount: 300, label: 'Dinner', type: 'expense' },
      { id: 't-3', amount: 100, label: 'Snacks', type: 'expense' },
    ];
    const sampleAnalytics = [
      { label: 'Dinner', total: 300 },
      { label: 'Snacks', total: 100 },
    ];

    it('should render header with user info, avatar, and handle sign out', () => {
      const { getByText, getByAltText } = render(
        <FinanceCalc initialTransactions={[]} user={dummyUser} analytics={[]} />
      );

      expect(getByText('Welcome, Finance')).toBeInTheDocument();
      expect(getByAltText('Avatar')).toBeInTheDocument();

      const signOutBtn = getByText('Sign Out');
      fireEvent.click(signOutBtn);
      expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/projects/finance-flow' });
    });

    it('should handle missing user name and image with fallback', () => {
      const { getByText, queryByAltText } = render(
        <FinanceCalc initialTransactions={[]} user={{}} analytics={[]} />
      );

      expect(getByText('Welcome, User')).toBeInTheDocument();
      expect(queryByAltText('Avatar')).toBeNull();
    });

    it('should correctly calculate and display balance, income, expense, and transactions list', () => {
      const { getByText, getAllByText } = render(
        <FinanceCalc initialTransactions={sampleTransactions} user={dummyUser} analytics={sampleAnalytics} />
      );

      // Income = 2000, Expense = 400, Balance = 1600
      expect(getByText('1,600 ฿')).toBeInTheDocument();
      expect(getByText('2,000')).toBeInTheDocument();
      expect(getByText('400')).toBeInTheDocument();

      expect(getByText('Salary')).toBeInTheDocument();
      expect(getByText('+2,000')).toBeInTheDocument();
      expect(getAllByText('Dinner')).toHaveLength(2);
      expect(getByText('-300')).toBeInTheDocument();
    });

    it('should display "No transactions." when initialTransactions is empty', () => {
      const { getByText } = render(
        <FinanceCalc initialTransactions={[]} user={dummyUser} analytics={[]} />
      );

      expect(getByText('No transactions.')).toBeInTheDocument();
    });

    it('should handle adding expense transaction and resetting input fields', async () => {
      mockFinanceTransaction.create.mockResolvedValue({});

      const { getByPlaceholderText, getByRole } = render(
        <FinanceCalc initialTransactions={[]} user={dummyUser} analytics={[]} />
      );

      const labelInput = getByPlaceholderText('Label');
      const amountInput = getByPlaceholderText('Amt');
      const addBtn = getByRole('button', { name: '+ Add' });

      // Click without inputs should do nothing
      await act(async () => {
        fireEvent.click(addBtn);
      });
      expect(mockFinanceTransaction.create).not.toHaveBeenCalled();

      // Input expense
      act(() => {
        fireEvent.change(labelInput, { target: { value: 'Lunch' } });
        fireEvent.change(amountInput, { target: { value: '150' } });
      });

      await act(async () => {
        fireEvent.click(addBtn);
      });

      expect(mockFinanceTransaction.create).toHaveBeenCalledWith({
        data: {
          amount: 150,
          label: 'Lunch',
          type: 'expense',
          userId: dummyUser.id,
        },
      });
      expect(labelInput).toHaveValue('');
      expect(amountInput).toHaveValue(null);
    });

    it('should handle adding income transaction', async () => {
      mockFinanceTransaction.create.mockResolvedValue({});

      const { getByPlaceholderText, getByRole } = render(
        <FinanceCalc initialTransactions={[]} user={dummyUser} analytics={[]} />
      );

      const typeSelect = getByRole('combobox');
      const labelInput = getByPlaceholderText('Label');
      const amountInput = getByPlaceholderText('Amt');
      const addBtn = getByRole('button', { name: '+ Add' });

      act(() => {
        fireEvent.change(typeSelect, { target: { value: 'income' } });
        fireEvent.change(labelInput, { target: { value: 'Bonus' } });
        fireEvent.change(amountInput, { target: { value: '5000' } });
      });

      await act(async () => {
        fireEvent.click(addBtn);
      });

      expect(mockFinanceTransaction.create).toHaveBeenCalledWith({
        data: {
          amount: 5000,
          label: 'Bonus',
          type: 'income',
          userId: dummyUser.id,
        },
      });
    });

    it('should handle deleting a transaction', async () => {
      mockFinanceTransaction.delete.mockResolvedValue({});

      const { getAllByText } = render(
        <FinanceCalc initialTransactions={sampleTransactions} user={dummyUser} analytics={[]} />
      );

      const delButtons = getAllByText('✕');
      expect(delButtons).toHaveLength(3);

      await act(async () => {
        fireEvent.click(delButtons[0]);
      });

      expect(mockFinanceTransaction.delete).toHaveBeenCalledWith({
        where: {
          id: 't-1',
          userId: dummyUser.id,
        },
      });
    });

    it('should render expense analytics breakdown and handle zero totals properly', () => {
      const { getByText, rerender } = render(
        <FinanceCalc initialTransactions={[]} user={dummyUser} analytics={sampleAnalytics} />
      );

      expect(getByText('Expense Analytics (Group By)')).toBeInTheDocument();
      expect(getByText('Dinner')).toBeInTheDocument();
      expect(getByText('300 ฿')).toBeInTheDocument();
      expect(getByText('Snacks')).toBeInTheDocument();
      expect(getByText('100 ฿')).toBeInTheDocument();

      // Zero total case (coverage for maxTotal > 0 ? ... : 0)
      rerender(
        <FinanceCalc initialTransactions={sampleTransactions} user={dummyUser} analytics={[{ label: 'ZeroCategory', total: 0 }]} />
      );
      expect(getByText('ZeroCategory')).toBeInTheDocument();
    });
  });
});
