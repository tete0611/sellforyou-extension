import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getLocalStorage } from '../../Tools/ChromeAsync';
import { AppInfo } from '../../../type/type';

const httpLink = new HttpLink({
	uri: `${process.env.SELLFORYOU_API_SERVER}/graphql`,
});

const authLink = setContext(async (_, { headers }) => {
	const token = await getLocalStorage<AppInfo>('appInfo');
	return {
		headers: {
			...headers,
			authorization: `Bearer ${token.accessToken}`,
		},
	};
});

export const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});
