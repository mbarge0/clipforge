import React from 'react';
export default function App() {
    const [pong, setPong] = React.useState<string>('');

    React.useEffect(() => {
        let cancelled = false;
        window.electron
            ?.invoke('app:ping', 'hello')
            .then((res) => {
                if (!cancelled) setPong(res);
            })
            .catch(() => {
                if (!cancelled) setPong('bridge unavailable');
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
            <h1>🎬 ClipForge Desktop</h1>
            <p>Hello from your Electron + Vite + React environment!</p>
            <p>IPC health: <strong>{pong || '...'}</strong></p>
        </div>
    );
}