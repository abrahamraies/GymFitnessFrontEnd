import { useQuery } from 'react-query';
import axios from 'axios';
import { Recommendation } from '../../interfaces/RecommendationInterface'; // Assuming this interface exists

// API function to get recommendations by category
const getRecommendationsByCategory = async (categoryId: string): Promise<Recommendation[]> => {
  const { data } = await axios.get(`/api/recommendations/category/${categoryId}`);
  return data;
};

// Custom hook to use the API function with react-query
export const useGetRecommendations = (categoryId: string | undefined) => {
  return useQuery<Recommendation[], Error>(
    ['recommendations', categoryId], // Query key: an array including 'recommendations' and the categoryId
    () => getRecommendationsByCategory(categoryId!), // Query function, '!' asserts categoryId is defined due to 'enabled' option
    {
      enabled: !!categoryId, // The query will not run until a categoryId is provided
      // Optional: Add other react-query options here, like staleTime, cacheTime, retry, etc.
      // staleTime: 5 * 60 * 1000, // 5 minutes
      // cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};
