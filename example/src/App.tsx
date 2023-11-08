import * as React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { TariConnection, TariConnectorButton, WalletDaemonParameters, WalletDaemonProvider } from 'tari.js/src/providers/wallet_daemon/index';
import {
	TariPermissions,
	TariPermissionAccountList,
	TariPermissionTransactionSend
} from "tari.js/src/providers/wallet_daemon/tari_permissions";

export default function App() {
	return (
		<Container maxWidth="sm">
			<Box sx={{ my: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Tari-Connector Example
				</Typography>
				<WalletDaemonDefaultButton />
				<WalletDaemonCustomButton />
			</Box>
		</Container>
	);
}

function WalletDaemonDefaultButton() {
	const [_provider, setProvider] = React.useState<WalletDaemonProvider | undefined>();
	const onOpen = (provider: WalletDaemonProvider) => {
		console.log("OnOpen");
		setProvider(provider);
		window.provider = provider;
	};
	const onConnection = () => {
		console.log("Connected to the wallet daemon");
	};
	let address = import.meta.env.VITE_SIGNALING_SERVER_ADDRESS || "http://localhost:9100";
	let permissions = new TariPermissions();
	permissions.addPermission(new TariPermissionAccountList())
	permissions.addPermission(
		new TariPermissionTransactionSend()
	);

	let optionalPermissions = new TariPermissions();

	return (
		<>
			<TariConnectorButton
				signalingServerUrl={address}
				permissions={permissions}
				optionalPermissions={optionalPermissions}
				onOpen={onOpen}
				onConnection={onConnection}
			/>
		</>
	);
}

function WalletDaemonCustomButton() {
	const signalingServerUrl = import.meta.env.VITE_SIGNALING_SERVER_ADDRESS || "http://localhost:9100";
	const permissions = new TariPermissions();
	permissions.addPermission(new TariPermissionAccountList())
	permissions.addPermission(
		new TariPermissionTransactionSend()
	);
	const optionalPermissions = new TariPermissions();

	async function handleClick() {
		const params: WalletDaemonParameters = {
			signalingServerUrl,
			permissions,
			optionalPermissions,
			onConnection: function (): void {
				console.log("Connected to the wallet daemon via custom button");
			}
		};
		const provider = await WalletDaemonProvider.build(params);
		console.log("Token URL: " + provider.tokenUrl);
	}

	return <Button variant='contained' onClick={async () => {await handleClick()}}>Wallet Daemon Custom Buttom</Button>
}
