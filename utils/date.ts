export const getTodayDateInput = (): string => new Date().toISOString().split('T')[0];

// Converts DD/MM/YYYY to YYYY-MM-DD for date inputs
export const displayToInputDate = (date: string): string => {
    if (!date || !date.includes('/')) return getTodayDateInput();
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
};

// Converts YYYY-MM-DD from date inputs to DD/MM/YYYY for display
export const inputToDisplayDate = (date: string): string => {
    if (!date || !date.includes('-')) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
};
