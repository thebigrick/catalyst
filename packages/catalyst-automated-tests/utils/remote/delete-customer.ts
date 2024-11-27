import adminRestFetch from './admin-rest-fetch';

const deleteCustomer = async (customerId: number) => {
  await adminRestFetch('DELETE', '/v3/customers', {}, { 'id:in': customerId.toString() });
};

export default deleteCustomer;
