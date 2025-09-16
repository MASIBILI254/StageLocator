import api from './Api';

export const getStageAnalytics = async () => {
  try {
    const response = await api.get('/stages/analytics');
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 