'use client';
import {useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import {formatDate} from '@/utils';

export default function useInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/company-invoice`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.code === 200) {
        const formattedInvoices = data.data.invoices.datalist.map(
          (invoice) => ({
            ...invoice,
            invoiceDate: invoice.invoiceDate
              ? formatDate(invoice.invoiceDate)
              : null,
          })
        );

        setInvoices(formattedInvoices);
        setCompany(data.data.company);
      } else {
        throw new Error(data.message || 'Failed to fetch invoices');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return {invoices, company, loading, error};
}
