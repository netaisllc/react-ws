import { useEffect, useState } from 'react';
import { socket } from './socket.js';

const events = {
	AUTHENTICATED  : 'authenticated',
	AUTHENTICATION : 'authentication',
	CONNECT        : 'connected',
	DISCONNECT     : 'disconnect',
	DENIED         : 'denied',
	MAPS           : 'maps',
};

export const useSocket = (accountId, sessionId) => {
	const [
		isConnected,
		setConnected,
	] = useState(false);

	const [
		isAuthenticated,
		setAuthentication,
	] = useState(false);

	const [
		maps,
		setMaps,
	] = useState([]);

	useEffect(
		() => {
			socket.on(events.CONNECT, () => setConnected(true));

			socket.on(events.DISCONNECT, (err) => {
				console.error('Unexpected socket disconnect:', err);
				setConnected(false);
			});
		},
		[
			isConnected,
		]
	);

	useEffect(
		() => {
			if (socket && isConnected && !isAuthenticated) {
				socket.emit(events.AUTHENTICATION, {
					accountId : accountId,
					sessionId : sessionId,
				});
				socket.on(events.AUTHENTICATED, function() {
					setAuthentication(true);
					// Immediately request maps collection
					// TODO Here you will have to specify the map id for the hydration case
					socket.emit(events.MAPS, {
						mapId    : 'all',
						pageNo   : 1,
						oageSize : 25,
					});
				});
				socket.on(events.DENIED, function(err) {
					console.error('Authentication denied', err);
					setAuthentication(false);
				});
			}
		},
		[
			accountId,
			isAuthenticated,
			isConnected,
			sessionId,
		]
	);

	useEffect(
		() => {
			if (socket && isConnected && isAuthenticated) {
				socket.on(events.MAPS, function(data) {
					setMaps(data);
				});
			}
		},
		[
			isAuthenticated,
			isConnected,
			maps,
		]
	);
	return { isAuthenticated, isConnected, maps };
};
