import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { FilterBar } from '../components/FilterBar';

describe('FilterBar', () => {
  it('toggles category quick filter', () => {
    const onCategory = jest.fn();
    const { getByLabelText } = render(
      <FilterBar
        search=""
        onSearch={jest.fn()}
        category=""
        onCategory={onCategory}
        dietary=""
        onDietary={jest.fn()}
        minPrice={0}
        maxPrice={50}
        onPrice={jest.fn()}
        searchAria="search"
      />
    );
    fireEvent.click(getByLabelText('Filter by Appetizers'));
    expect(onCategory).toHaveBeenCalledWith('Appetizers');
  });
});
