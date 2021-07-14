import React, {useRef, useState} from 'react';

interface IMessage {
    id: string,
    event: string,
    username: string,
    message: string
}

const WebSock = () => {
    const [messages, setMessages] = useState<IMessage[]>([])
    const [value, setValue] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [connected, setConnected] = useState<boolean>(false)
    const socket = useRef()

    const WS_URL = 'ws://localhost:5000'

    const connect = () => {
        // @ts-ignore
        socket.current = new WebSocket(WS_URL)

        // @ts-ignore
        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                id: Date.now(),
                username,
            }
            // @ts-ignore
            socket.current.send(JSON.stringify(message))
        }
        // @ts-ignore
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prevState => [...prevState, message])
        }
        // @ts-ignore
        socket.current.onclose = () => {
            console.log('Socket close')
        }
        // @ts-ignore
        socket.current.onerror = () => {
            console.log('Socket error')
        }
    }

    const sendMessage = async () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        // @ts-ignore
        socket.current.send(JSON.stringify(message))
        setValue('')
    }

    if (!connected) {
        return (
            <div className="center">
                <div className="form">
                    <input className="form__input"
                           value={username}
                           onChange={e => setUsername(e.target.value)}
                           type="text"
                           placeholder="Set username"/>
                    <button className="form__btn" onClick={connect}>Set username</button>
                </div>
            </div>
        )
    }

    return (
        <div className="center">
            <div className="messages">
                {messages.map(mess =>
                    <div key={mess.id}>
                        {mess.event === 'connection'
                            ? <div className="messages__mess">Username {mess.username} connected</div>
                            : <div className="messages__mess">{mess.username}: {mess.message}</div>
                        }
                    </div>
                )}
            </div>
            <div className="form">
                <input className="form__input" value={value} onChange={e => setValue(e.target.value)} type="text"/>
                <button className="form__btn" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default WebSock;
