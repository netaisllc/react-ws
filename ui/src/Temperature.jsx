import React, { useEffect, useState } from 'react';
import socket from 'socket.io-client';

// Use socket to fetch request to data
// Socket server's url and topic in which data is sent
const useSocket = (serverUrl, topic) => {
	const [
		temp,
		setTemp,
	] = useState(0);
	const [
		isConnected,
		setConnected,
	] = useState(false);

	useEffect(
		() => {
			const client = socket.connect(serverUrl);
			client.on('connect', () => setConnected(true));
			client.on('disconnect', () => setConnected(false));
			client.on(topic, (data) => {
				setTemp(data);
			});
		},
		[
			serverUrl,
			topic,
			isConnected,
		]
	);

	return { temp, isConnected };
};

// Our component which sends the request through the topic
const Temperature = () => {
	const serverUrl = 'http://localhost:8080',
		topic = 'temperature';
	const { temp, isConnected } = useSocket(serverUrl, topic);

	return (
		<div>
			<h4>Temperature</h4>
			<h1>{temp}</h1>
			<h3>{`CONNECTED: ${isConnected}`}</h3>
		</div>
	);
};
export default Temperature;
