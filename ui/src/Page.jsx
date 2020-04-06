import React from 'react';
import { useSocket } from './useSocket';

const accountId = '5c7db4a8039c220dd5eaf350';
const sessionId = 'whatever';

function Page() {
	const { isAuthenticated, isConnected, maps } = useSocket(
		accountId,
		sessionId
	);
	return (
		<div>
			<h1>{isConnected ? 'Connected' : 'Disconnected'}</h1>
			<h1>{isAuthenticated ? 'Authenticated' : 'Denied'}</h1>
			<div>{maps ? JSON.stringify(maps) : 'None'}</div>
		</div>
	);
}
export default Page;
